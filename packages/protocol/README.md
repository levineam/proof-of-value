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

## Will expose

- Versioned protobuf message definitions for fact-attestation and evaluation
  commands/events (mirrored from `spec/protocol/koinos/pov.proto`).
- Generated/validated TypeScript types and runtime validators for content
  references, observations, application views, provenance, and proof
  manifests.
- Golden vectors (`spec/vectors/`) that every other package's tests conform to.

## Dependency direction

Everything else depends inward on `@pov/protocol` — it has no dependency on
any other `@pov/*` package, the AT SDK, or Koinos client libraries. Per the
plan's package topology, dependencies point inward toward shared protocol
definitions; the reward path (Koinos contracts) never imports AT or app code,
and this package is the only thing all of them share.

## Status

Status: scaffold — not yet implemented.
