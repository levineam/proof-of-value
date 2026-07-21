# Koinos contract workspaces

`spike/` is an isolated feasibility gate, not the PoV protocol contract. It uses the maintained Koinos AssemblyScript CLI at upstream commit `6c0a7cb18533a02e442998de0d4575e263077b34` (reported version `1.0.3`) and pins `@koinos/sdk-as` to `1.4.0`.

The root project uses npm workspaces only for `apps/*` and `packages/*`. Koinos remains separate because the maintained scaffold invokes Yarn v1 internally.

## Local prerequisites

- Node.js 22+ and Yarn Classic (v1)
- No global `protoc` requirement: the isolated scaffold pins `protoc`, exposing its compiler through `node_modules/.bin/protoc` for the Koinos generators.
- For the opt-in Harbinger write: a dedicated, funded development wallet and an API-key RPC URL. Never put either in `.env.example`, source, CI, or a hosted preview.

```sh
cd contracts/koinos/spike
COREPACK_ENABLE_PROJECT_SPEC=0 yarn install
COREPACK_ENABLE_PROJECT_SPEC=0 yarn build:release
COREPACK_ENABLE_PROJECT_SPEC=0 yarn test
```

The release build generates `abi/spike.abi`, `abi/spike-abi.json`, generated AssemblyScript types, and `build/release/contract.wasm`; all are ignored because they are reproducible outputs.

## Harbinger boundary

`npm run contracts:probe` builds first and then exits with a structured block until an operator-only deploy/retrieval script is reviewed. It must retrieve the current Harbinger chain ID, upload the WASM, register the ABI, invoke `record_content`, then independently fetch and decode `pov.spike.content_recorded`. A chain ID, transaction ID, or decoded event must never be invented or copied from a prior Harbinger epoch.

See [toolchain evidence](../../docs/development/toolchain-evidence.md) for the current result.
