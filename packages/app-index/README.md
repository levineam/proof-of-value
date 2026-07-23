# @pov/app-index

The indexer that reconstructs pending state (locks, evaluations, allocations)
from canonical Koinos events to serve the client and a SWARM-ranked feed.

## Single responsibility

> "A noncanonical read model that reconstructs pending state from canonical
> Koinos events to serve the client and a SWARM-ranked feed. It is **not** the
> financial record — the chain is."
> — ARCHITECTURE.md, app-index component

Implements ordered protobuf event decoding, idempotent projection, and joins
against AT content observations through the attestation identifier. Applies
the `@pov/protocol` proof-verification policy to classify evidence as current,
pending, unverified, quarantined, stale-chain-epoch, missing, or invalid. It
never calculates authoritative rewards, mints tokens, or rewrites chain
history.

## Built by

**U6** (Bridge, index, and application-service boundary), alongside
`@pov/application`. (U2/U5 own the golden vectors this package's decoders must
conform to.)

## Will expose

- Version-dispatched decoders for PoV contract events (accepted-attestation,
  evaluation-recorded).
- An idempotent projection store queryable by `@pov/application`.
- Rehydration from a checked-in proof manifest plus canonical read-only chain
  queries after restart.

## Dependency direction

Depends inward on `@pov/protocol`. Reads Koinos events and AT observations
(via `@pov/at-adapter` output) but never imports contract implementation
details from `contracts/koinos/`, and never holds signing keys — it is a pure
read/reconstruction layer, not the reward path.

## Status

Status: scaffold — not yet implemented.
