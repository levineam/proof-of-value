# Koinos toolchain evidence

Status: **local generator, ABI, WASM, and event test proven; live Harbinger round trip blocked**.

Date: 2026-07-20
Workspace: `contracts/koinos/spike`
CLI source: [`koinos-sdk-as-cli` commit `6c0a7cb18533a02e442998de0d4575e263077b34`](https://github.com/koinos/koinos-sdk-as-cli/tree/6c0a7cb18533a02e442998de0d4575e263077b34) (reports `1.0.3`)
AssemblyScript SDK: `@koinos/sdk-as` `1.4.0`

## What was exercised

`COREPACK_ENABLE_PROJECT_SPEC=0 yarn install` completed in the isolated scaffold. The representative `spike.proto` contains a DID string, CID bytes, nested content reference, and version enum. `Spike.record_content` emits a protobuf-encoded `pov.spike.content_recorded` event, and its AssemblyScript test decodes that event from `MockVM`.

## Smallest observed failure

Command:

```sh
COREPACK_ENABLE_PROJECT_SPEC=0 yarn build:release
```

Observed output:

```text
Generating ABI file...
error Command "protoc" not found.
```

The maintained CLI invokes `yarn protoc` before ABI generation. The global `/usr/local/bin/protoc` is on `PATH` but cannot launch because Homebrew's `libabsl_die_if_null.2508.0.0.dylib` is missing. The scaffold pins `protoc` `35.1.0`, which successfully reports `libprotoc 35.1`, without mutating Homebrew. The first generator run correctly rejected the missing required `@read-only` annotation on `record_content_arguments`. The CLI template used its older `binaryFile` output key, while AssemblyScript `0.27.37` requires `outFile`; after that minimal compatibility correction, `@read-only false` produced ABI files, generated AssemblyScript, and `build/release/contract.wasm` successfully.

`COREPACK_ENABLE_PROJECT_SPEC=0 yarn test` passed one AS-pect test. It invokes `record_content`, reads the one MockVM event, decodes it as `content_recorded_event`, and asserts the name, DID, CID bytes, AT URI, enum, and event version. This is local execution evidence, not Harbinger evidence.

## Application dependency audit

The application pins the current Next.js 15.5 backport (`15.5.20`) and its matching lint plugin. `npm audit` reports the transitive `postcss` `8.4.31` advisory [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) as moderate. The 15.5 backport has no patched dependency release at this time, and npm proposes an invalid major downgrade rather than a compatible fix. The current shell does not accept or stringify user-supplied CSS. This residual must be reconsidered before any feature introduces untrusted CSS or before a public preview ships; no forced or breaking audit rewrite was applied.

## Exact unresolved dependencies

1. Add a reviewed operator-only deployment/retrieval script.
2. Supply a dedicated funded Harbinger wallet and API-key RPC outside the repository, retrieve the fresh chain ID, then deploy, invoke, fetch, and decode the event.

The live step cannot be simulated. This environment exposes neither `KOINOS_HARBINGER_RPC_URL` nor `KOINOS_HARBINGER_PRIVATE_KEY`, and it has no funded operator wallet. It therefore cannot deploy, invoke, or retrieve a real event. The `contracts:probe` command preserves that explicit block rather than reporting a simulated success.
