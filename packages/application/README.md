# @pov/application

The application service that assembles a single combined product view — feed,
detail, wallet preview, and protocol-proof evidence — from the AT adapter and
the app-index, for the web client to render.

## Single responsibility

Implements the `@pov/application-contracts` read interfaces by joining
normalized live-AT observations (`@pov/at-adapter`) with the noncanonical
Koinos read model (`@pov/app-index`). It **reads**; it never holds signing
keys, never submits attestations or evaluations, and never returns an indexed
projection as canonical token balance. Per the plan's package topology, the
web client consumes this application read contract rather than importing AT
SDK types, Koinos client types, fixture stores, or contract implementation
details directly.

## Built by

**U6** (Bridge, index, and application-service boundary), alongside
`@pov/app-index`.

## Will expose

- Feed, detail, wallet-preview, and proof-evidence queries conforming to
  `@pov/application-contracts`.
- Source- and verification-status metadata (live / stale / unavailable /
  invalid; current / pending / unverified / quarantined / stale-chain-epoch /
  missing / invalid) on every returned field group.

## Dependency direction

Depends inward on `@pov/protocol` and `@pov/application-contracts`, and reads
from `@pov/at-adapter` and `@pov/app-index`. `apps/web` depends on this
package. This package never imports AT or Koinos write/signing paths — it is
strictly a read-side assembler.

## Status

Status: scaffold — not yet implemented.
