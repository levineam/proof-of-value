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

`COREPACK_ENABLE_PROJECT_SPEC=0 yarn test` passed one AS-pect test and five operator-probe tests. The contract test invokes `record_content`, reads the one MockVM event, decodes it as `content_recorded_event`, and asserts the name, DID, CID bytes, AT URI, enum, and event version. The operator tests cover lossless Koilib ABI/command encoding, absent credentials, chain-ID mismatch, a successful independently retrieved event, signer-key redaction, and rejection of an event from the wrong contract. The Koilib check exposed and now pins the required normalization from the generator's `entry-point`/`read-only` keys and protobuf `at_uri` field to the operator representation. This is local execution evidence, not Harbinger evidence.

## Application dependency audit

The application pins the current Next.js 15.5 backport (`15.5.20`) and its matching lint plugin. `npm audit` reports the transitive `postcss` `8.4.31` advisory [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) as moderate. The 15.5 backport has no patched dependency release at this time, and npm proposes an invalid major downgrade rather than a compatible fix. The current shell does not accept or stringify user-supplied CSS. This residual must be reconsidered before any feature introduces untrusted CSS or before a public preview ships; no forced or breaking audit rewrite was applied.

## Exact unresolved dependencies

The dedicated testnet-only operator wallet has been generated:

- Public address: `1KceQLhUV99WrGk6ojwwFg2c1MvmEpLH8w`
- Secret storage: macOS login Keychain
- Keychain service: `com.andrew.proof-of-value.harbinger.operator`
- Verification: the stored WIF was retrieved in-process and matched before the generating process discarded its copy
- Repository exposure: public address and Keychain locator only; no private key, seed, or wallet file

Remaining dependencies:

1. Fund `1KceQLhUV99WrGk6ojwwFg2c1MvmEpLH8w` with Harbinger tKOIN.
2. Supply an API-key Harbinger HTTPS RPC URL outside the repository.
3. Retrieve and operator-approve the fresh chain ID, then run `npm run contracts:probe` to deploy, invoke, independently fetch, and decode the event.

The live step cannot be simulated. The reviewed probe fails closed on missing credentials or a mismatched expected chain ID, never prints the private key, deploys the compiled contract with its ABI, invokes `record_content`, and verifies the named event by fetching the mined block receipt through a read-only query. The signer now exists but is not yet funded, and this environment still has no `KOINOS_HARBINGER_RPC_URL`. It therefore cannot deploy, invoke, or retrieve a real event. The `contracts:probe` command preserves that explicit block rather than reporting a simulated success.
