import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { Contract, Provider, Signer } from "koilib";

import { normalizeAbi, ProbeBlockedError, runProbe } from "./harbinger-probe.mjs";

const rpcUrl = "https://harbinger.example/jsonrpc?apikey=test";
const privateKey = "1".repeat(64);

function fakeDependencies({
  chainId = "harbinger-chain",
  eventSource = "contract-address",
  expectedCid = "test-cid",
} = {}) {
  class FakeProvider {
    async getChainId() {
      return chainId;
    }

    async getBlocksById() {
      return {
        block_items: [{
          block_id: "invoke-block",
          receipt: {
            transaction_receipts: [{
              id: "invoke-transaction",
              events: [{
                sequence: 0,
                source: eventSource,
                name: "pov.spike.content_recorded",
                data: "encoded-event",
                impacted: [],
              }],
            }],
          },
        }],
      };
    }
  }

  class FakeSigner {
    constructor() {
      this.provider = undefined;
    }
  }

  class FakeContract {
    constructor({ abi }) {
      assert.equal(abi.events["pov.spike.content_recorded"].type, "spike.content_recorded_event");
      assert.equal(abi.methods.record_content.entry_point, 1024977249);
      this.functions = {
        record_content: async ({ content }) => {
          assert.equal(content.version, 1);
          assert.equal(Buffer.from(content.cid, "base64url").toString("utf8"), expectedCid);
          assert.equal(typeof content.at_uri, "string");
          return {
            transaction: { wait: async () => ({ blockId: "invoke-block", blockNumber: 12 }) },
            receipt: { id: "invoke-transaction", reverted: false },
          };
        },
      };
    }

    getId() {
      return "contract-address";
    }

    async deploy() {
      return {
        transaction: { wait: async () => ({ blockId: "deploy-block", blockNumber: 11 }) },
        receipt: { id: "deploy-transaction", reverted: false },
      };
    }

    async decodeEvent() {
      return {
        name: "pov.spike.content_recorded",
        args: {
          content: {
            did: "did:plc:test",
            cid: Buffer.from(expectedCid, "utf8").toString("base64"),
            at_uri: "at://did:plc:test/app.bsky.feed.post/test",
            version: 1,
          },
          event_version: 1,
        },
      };
    }
  }

  return {
    Provider: FakeProvider,
    Signer: FakeSigner,
    Contract: FakeContract,
    readFile: async (filePath) => filePath.endsWith(".abi")
      ? Buffer.from(JSON.stringify({
        methods: {
          record_content: {
            argument: "spike.record_content_arguments",
            return: "spike.record_content_result",
            "entry-point": "0x3d17e961",
            "read-only": false,
          },
        },
        types: "descriptor",
      }))
      : Buffer.from([0, 97, 115, 109]),
  };
}

test("normalizes the generated ABI for lossless Koilib command encoding", async () => {
  const baseDir = path.dirname(fileURLToPath(import.meta.url));
  const generatedAbi = JSON.parse(await readFile(path.resolve(baseDir, "../abi/spike.abi"), "utf8"));
  const abi = normalizeAbi(generatedAbi);
  const provider = new Provider(["https://example.invalid"]);
  const signer = new Signer({ privateKey, provider });
  const contract = new Contract({ abi, provider, signer });

  const operation = await contract.encodeOperation({
    name: "record_content",
    args: {
      content: {
        did: "did:plc:test",
        cid: Buffer.from("test-cid", "utf8").toString("base64url"),
        at_uri: "at://did:plc:test/app.bsky.feed.post/test",
        version: 1,
      },
    },
  });
  const decoded = await contract.decodeOperation(operation);

  assert.equal(operation.call_contract.entry_point, 1024977249);
  assert.deepEqual(decoded.args.content, {
    did: "did:plc:test",
    cid: Buffer.from("test-cid", "utf8").toString("base64"),
    at_uri: "at://did:plc:test/app.bsky.feed.post/test",
    version: 1,
  });
});

test("fails closed before network access when operator credentials are missing", async () => {
  await assert.rejects(
    runProbe({ env: {}, dependencies: fakeDependencies() }),
    (error) => error instanceof ProbeBlockedError
      && error.step === "credentials"
      && error.details.missing.includes("KOINOS_HARBINGER_PRIVATE_KEY"),
  );
});

test("rejects an unexpected chain identity", async () => {
  await assert.rejects(
    runProbe({
      env: {
        KOINOS_HARBINGER_RPC_URL: rpcUrl,
        KOINOS_HARBINGER_PRIVATE_KEY: privateKey,
        KOINOS_HARBINGER_CHAIN_ID: "approved-chain",
      },
      dependencies: fakeDependencies(),
    }),
    (error) => error instanceof ProbeBlockedError && error.step === "chain-identity",
  );
});

test("reports independently retrieved event evidence without exposing the signing key", async () => {
  const result = await runProbe({
    env: {
      KOINOS_HARBINGER_RPC_URL: rpcUrl,
      KOINOS_HARBINGER_PRIVATE_KEY: privateKey,
      KOINOS_HARBINGER_CHAIN_ID: "harbinger-chain",
      POV_SPIKE_DID: "did:plc:test",
      POV_SPIKE_CID: "test-cid",
      POV_SPIKE_AT_URI: "at://did:plc:test/app.bsky.feed.post/test",
    },
    dependencies: fakeDependencies(),
  });

  assert.equal(result.status, "verified");
  assert.equal(result.invocation.eventOrdinal, 0);
  assert.equal(result.invocation.eventName, "pov.spike.content_recorded");
  assert.equal(result.content.cid, "test-cid");
  assert.equal(JSON.stringify(result).includes(privateKey), false);
});

test("rejects a correctly named event emitted by another contract", async () => {
  await assert.rejects(
    runProbe({
      env: {
        KOINOS_HARBINGER_RPC_URL: rpcUrl,
        KOINOS_HARBINGER_PRIVATE_KEY: privateKey,
      },
      dependencies: fakeDependencies({
        eventSource: "forged-source",
        expectedCid: "bafyreipovtoolchainspike",
      }),
    }),
    (error) => error instanceof ProbeBlockedError && error.step === "retrieve",
  );
});
