# @pov/protocol

The shared domain schemas and golden test vectors every other PoV component
agrees on: fact-attestation and evaluation protobuf commands/events, plus JSON
schemas for normalized content references, observations, provenance, and the
proof manifest.

## Single responsibility

> "Define the stable protobuf, JSON, manifest, and application-view seams that
> let all four implementation tracks work independently."
> — plan U2 goal, `docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`

This package is the gate: owning one stable schema-and-vector set here is what
lets the web, AT-adapter, bridge/index, and Koinos-contract tracks build and
test in parallel instead of inventing their own shared boundary independently.

## Built by

**U2** (Versioned protocol and application contracts), depending on U1's proven
Koinos protobuf/codec path.

## Exposes now

- Dependency-free TypeScript types and runtime validators for ordinary-post
  publication outcomes, URI-plus-CID admission facts, lifecycle observations,
  tombstones, provenance, and observation precedence. The selector requires a
  validated DID-to-PDS resolution and refuses observations from another DID or
  stale PDS before comparing ordering evidence.
- Golden JSON vectors under `spec/vectors/swarm-feed/`; positive and negative
  vectors run through the same exported validators.

Protobuf/Koinos fact-attestation remains separate and proposed for this package.

## Dependency direction

Everything else depends inward on `@pov/protocol` — it has no dependency on
any other `@pov/*` package, the AT SDK, or Koinos client libraries. Per the
plan's package topology, dependencies point inward toward shared protocol
definitions; the reward path (Koinos contracts) never imports AT or app code,
and this package is the only thing all of them share.

## Status

Status: partially implemented — the Swarm feed contract subset is runnable;
Koinos/protobuf contracts remain proposed.
