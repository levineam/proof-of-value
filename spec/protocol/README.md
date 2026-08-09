# spec/protocol

The versioned protobuf/JSON protocol seam: the authoritative location for
Koinos command/event `.proto` definitions and the off-chain JSON schemas that
describe normalized content references, observations, application views,
provenance, and the proof manifest.

## Single responsibility

> "Use protobuf for Koinos commands and events, with JSON Schema for
> off-chain contracts. Versioned `.proto` definitions are authoritative for
> fact-attestation, evaluation, and canonical-event messages at the Koinos ABI
> boundary; JSON schemas define normalized AT records, application views,
> provenance, and proof manifests."
> — plan KTD3, `docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`

This directory is the schema *source*; `@pov/protocol` (`packages/protocol/`)
is the TypeScript package that consumes and re-exports validated types and
codecs generated or derived from these schemas. `spec/vectors/` holds the
golden vectors that check both sides agree.

## Contents

- `koinos/pov.proto` — fact-attestation and evaluation commands/events.
- `content-reference.schema.json`, `attestation.schema.json`,
  `evaluation-view.schema.json`, `provenance.schema.json` — normalized
  off-chain views.
- `proof-manifest.schema.json` — the proof-manifest schema (present as an
  initial scaffold stub in this directory; see that file).
- `swarm-account.schema.json`, `post-publication.schema.json`,
  `feed-entry.schema.json`, and `content-lifecycle.schema.json` — implemented
  JSON Schemas for the narrow Swarm feed foundation.

## Built by

**U2** (Versioned protocol and application contracts).

## Status

Status: partially implemented — the Swarm feed schemas are present and tested
through equivalent dependency-free runtime contracts. The proof-manifest and
Koinos schema seams remain scaffold/proposed.
