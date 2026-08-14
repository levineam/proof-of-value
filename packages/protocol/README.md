# @pov/protocol

The shared domain schemas and golden test vectors every other PoV component
agrees on: fact-attestation and evaluation protobuf commands/events, plus JSON
schemas for normalized content references, observations, provenance, and the
proof manifest.

## Single responsibility

The package defines stable protobuf, JSON, manifest, and application-view seams
so components can share a boundary instead of inventing their own.

This package is the gate: owning one stable schema-and-vector set here is what
lets the web, AT-adapter, bridge/index, and Koinos-contract tracks build and
test in parallel instead of inventing their own shared boundary independently.

## Role in the foundation

This package provides the shared protocol-contract foundation. The Koinos
protobuf/codec path remains a separate, locally proven feasibility spike.

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
