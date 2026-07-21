import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { Contract, Provider, Signer } from "koilib";

const EVENT_NAME = "pov.spike.content_recorded";
const DEFAULT_CONTENT = Object.freeze({
  did: "did:plc:povtoolchainspike",
  cid: "bafyreipovtoolchainspike",
  atUri: "at://did:plc:povtoolchainspike/app.bsky.feed.post/toolchain",
});

export class ProbeBlockedError extends Error {
  constructor(step, reason, details = {}) {
    super(reason);
    this.name = "ProbeBlockedError";
    this.step = step;
    this.details = details;
  }
}

function requiredEnvironment(env) {
  const required = ["KOINOS_HARBINGER_RPC_URL", "KOINOS_HARBINGER_PRIVATE_KEY"];
  const missing = required.filter((name) => !env[name]);

  if (missing.length > 0) {
    throw new ProbeBlockedError(
      "credentials",
      "Harbinger operator credentials are not available in this environment.",
      { missing },
    );
  }

  let rpcUrl;
  try {
    rpcUrl = new URL(env.KOINOS_HARBINGER_RPC_URL);
  } catch {
    throw new ProbeBlockedError(
      "credentials",
      "The Harbinger RPC endpoint is not a valid URL.",
    );
  }
  if (rpcUrl.protocol !== "https:") {
    throw new ProbeBlockedError(
      "credentials",
      "The Harbinger RPC endpoint must use HTTPS.",
      { protocol: rpcUrl.protocol },
    );
  }

  return {
    rpcUrl: rpcUrl.toString(),
    privateKey: env.KOINOS_HARBINGER_PRIVATE_KEY,
    expectedChainId: env.KOINOS_HARBINGER_CHAIN_ID,
  };
}

function signerFromPrivateKey(privateKey, provider, SignerClass) {
  const signer = /^[0-9a-f]{64}$/i.test(privateKey)
    ? new SignerClass({ privateKey, provider })
    : SignerClass.fromWif(privateKey);
  signer.provider = provider;
  return signer;
}

function transactionEvent(blockItem, transactionId) {
  const receipts = blockItem.receipt?.transaction_receipts ?? [];
  const receipt = receipts.find((candidate) => candidate.id === transactionId);
  if (!receipt) {
    throw new ProbeBlockedError(
      "retrieve",
      "The mined block did not contain the expected transaction receipt.",
      { transactionId, blockId: blockItem.block_id },
    );
  }

  const eventOrdinal = receipt.events.findIndex((event) => event.name === EVENT_NAME);
  if (eventOrdinal < 0) {
    throw new ProbeBlockedError(
      "retrieve",
      "The mined transaction did not contain the expected spike event.",
      { transactionId, blockId: blockItem.block_id, eventName: EVENT_NAME },
    );
  }

  return { event: receipt.events[eventOrdinal], eventOrdinal };
}

function contentInput(env) {
  const content = {
    did: env.POV_SPIKE_DID ?? DEFAULT_CONTENT.did,
    cid: env.POV_SPIKE_CID ?? DEFAULT_CONTENT.cid,
    atUri: env.POV_SPIKE_AT_URI ?? DEFAULT_CONTENT.atUri,
  };

  return {
    semantic: content,
    encoded: {
      did: content.did,
      cid: Buffer.from(content.cid, "utf8").toString("base64url"),
      at_uri: content.atUri,
      version: 1,
    },
  };
}

function verifyDecodedEvent(decodedEvent, expected) {
  const content = decodedEvent.args?.content;
  const decodedCid = typeof content?.cid === "string"
    ? Buffer.from(content.cid, "base64").toString("utf8")
    : undefined;
  const matches = content?.did === expected.did
    && decodedCid === expected.cid
    && content?.at_uri === expected.atUri
    && content?.version === 1
    && decodedEvent.args?.event_version === 1;

  if (!matches) {
    throw new ProbeBlockedError(
      "retrieve",
      "The decoded event payload does not match the submitted content reference.",
      { eventName: decodedEvent.name },
    );
  }
}

export function normalizeAbi(generatedAbi) {
  const methods = Object.fromEntries(Object.entries(generatedAbi.methods).map(([name, method]) => [
    name,
    {
      entry_point: Number.parseInt(method["entry-point"], 16),
      argument: method.argument,
      return: method.return,
      read_only: method["read-only"],
      description: method.description,
    },
  ]));

  return {
    methods,
    types: generatedAbi.types,
    events: {
      [EVENT_NAME]: { type: "spike.content_recorded_event" },
    },
  };
}

export async function runProbe({
  env = process.env,
  dependencies = { Contract, Provider, Signer, readFile },
} = {}) {
  const { rpcUrl, privateKey, expectedChainId } = requiredEnvironment(env);
  const provider = new dependencies.Provider([rpcUrl]);
  const chainId = await provider.getChainId();

  if (expectedChainId && chainId !== expectedChainId) {
    throw new ProbeBlockedError(
      "chain-identity",
      "The retrieved Harbinger chain ID does not match the operator-approved value.",
      { expectedChainId, actualChainId: chainId },
    );
  }

  const signer = signerFromPrivateKey(privateKey, provider, dependencies.Signer);
  const baseDir = path.dirname(fileURLToPath(import.meta.url));
  const [bytecode, abiBytes] = await Promise.all([
    dependencies.readFile(path.resolve(baseDir, "../build/release/contract.wasm")),
    dependencies.readFile(path.resolve(baseDir, "../abi/spike.abi")),
  ]);
  const abi = normalizeAbi(JSON.parse(abiBytes.toString("utf8")));

  const contract = new dependencies.Contract({
    abi,
    bytecode: new Uint8Array(bytecode),
    provider,
    signer,
  });
  const contractId = contract.getId();

  const deployment = await contract.deploy({
    abi: JSON.stringify(abi),
    chainId,
  });
  if (!deployment.transaction || !deployment.receipt) {
    throw new ProbeBlockedError("deploy", "Harbinger did not return a deployment transaction and receipt.");
  }
  if (deployment.receipt.reverted) {
    throw new ProbeBlockedError("deploy", "The Harbinger deployment reverted.", {
      transactionId: deployment.receipt.id,
      logs: deployment.receipt.logs,
    });
  }
  const deployed = await deployment.transaction.wait("byTransactionId", 120_000);

  const input = contentInput(env);
  const invocation = await contract.functions.record_content({ content: input.encoded }, { chainId });
  if (!invocation.transaction || !invocation.receipt) {
    throw new ProbeBlockedError("invoke", "Harbinger did not return an invocation transaction and receipt.");
  }
  if (invocation.receipt.reverted) {
    throw new ProbeBlockedError("invoke", "The Harbinger spike invocation reverted.", {
      transactionId: invocation.receipt.id,
      logs: invocation.receipt.logs,
    });
  }
  const invoked = await invocation.transaction.wait("byTransactionId", 120_000);

  const blocks = await provider.getBlocksById([invoked.blockId], {
    returnBlock: false,
    returnReceipt: true,
  });
  const blockItem = blocks.block_items?.[0];
  if (!blockItem) {
    throw new ProbeBlockedError("retrieve", "The read-only block query returned no mined block.", {
      blockId: invoked.blockId,
    });
  }

  const { event, eventOrdinal } = transactionEvent(blockItem, invocation.receipt.id);
  if (event.source !== contractId) {
    throw new ProbeBlockedError("retrieve", "The event source does not match the deployed contract.", {
      expectedSource: contractId,
      actualSource: event.source,
    });
  }
  const decodedEvent = await contract.decodeEvent(event);
  verifyDecodedEvent(decodedEvent, input.semantic);

  return {
    status: "verified",
    network: "Koinos Harbinger",
    chainId,
    contractId,
    deployment: {
      transactionId: deployment.receipt.id,
      blockId: deployed.blockId,
      blockNumber: deployed.blockNumber,
    },
    invocation: {
      transactionId: invocation.receipt.id,
      blockId: invoked.blockId,
      blockNumber: invoked.blockNumber,
      eventOrdinal,
      eventName: event.name,
    },
    content: input.semantic,
    decodedEvent: decodedEvent.args,
  };
}

function blockedOutput(error) {
  return {
    status: "blocked",
    step: error.step,
    reason: error.message,
    ...error.details,
    next: error.step === "credentials"
      ? "Set a dedicated funded development wallet and API-key Harbinger RPC URL outside CI, then rerun the probe."
      : "Review the preserved failure evidence before retrying or advancing to U2.",
  };
}

function sanitizedUnexpected(error, env) {
  let reason = error instanceof Error ? error.message : String(error);
  for (const secret of [env.KOINOS_HARBINGER_PRIVATE_KEY, env.KOINOS_HARBINGER_RPC_URL]) {
    if (secret) reason = reason.replaceAll(secret, "[redacted]");
  }

  return {
    status: "failed",
    step: "unexpected",
    reason,
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    console.log(JSON.stringify(await runProbe(), null, 2));
  } catch (error) {
    if (error instanceof ProbeBlockedError) {
      console.error(JSON.stringify(blockedOutput(error), null, 2));
      process.exitCode = 2;
    } else {
      console.error(JSON.stringify(sanitizedUnexpected(error, process.env), null, 2));
      process.exitCode = 1;
    }
  }
}
