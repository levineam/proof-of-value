# Spike

## Build
```sh
# build the debug version
yarn build:debug
# or
yarn exec koinos-sdk-as-cli build-all debug 0 spike.proto

# build the release version
yarn build:release
# or
yarn exec koinos-sdk-as-cli build-all release 0 spike.proto
```

## Test
```sh
yarn test
# or
yarn exec koinos-sdk-as-cli run-tests
```

## Harbinger probe

From the repository root, provide a dedicated funded development key and HTTPS Harbinger RPC URL outside source control, then run:

```sh
npm run contracts:probe
```

The command fails closed if credentials are absent or the optional approved `KOINOS_HARBINGER_CHAIN_ID` differs from the RPC. On success it prints secret-free JSON evidence for the deployment, invocation, mined block, event ordinal, and decoded event.
