# @pov/at-adapter

Middleware that retrieves and normalizes real AT Protocol / Bluesky content
for the feed while preserving exact version provenance.

## Single responsibility

> "Add an unauthenticated public-AppView adapter for a narrow selected-author
> or explicit-URI feed. Parse bounded DID-based identifiers, query configured
> provider origins only, enforce response and field limits, and normalize safe
> plain-text and embed shapes. Distinguish current, changed, deleted,
> malformed, stale, rate-limited, and unavailable observations."
> — plan U3 approach, `docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`

Every record it returns carries an explicit state — `live / stale /
unavailable / invalid` — and it **never** silently substitutes fixture content
after a live read fails. Reply and OAuth write paths stay explicit but
unimplemented in this stage.

## Built by

**U3** (Real public AT read adapter), depending on U2's shared contracts.

## Will expose

- A narrow public-AppView read path (selected-author or explicit-URI).
- Normalized content references (author DID, DID-based AT URI, observed CID,
  text, embed metadata) with source provenance.
- Explicit non-`null` result states for deleted, malformed, rate-limited, and
  unavailable records.

## Dependency direction

Depends inward on `@pov/protocol` only. It owns normalization and is consumed
by `@pov/application` and the attestation bridge (U7 scripts); it does not
depend on `@pov/app-index`, `@pov/application`, or any Koinos contract code.

## Status

Status: scaffold — not yet implemented.
