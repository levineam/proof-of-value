# @pov/app-index

The rebuildable derived projection that joins AT observations, versioned
admission/revocation facts, and later PoV/settlement evidence for the Swarm
read view.

## Single responsibility

It will project facts idempotently and deterministically: the same retained
inputs produce the same feed projection, and a rebuild never needs a
republish. It is not canonical content storage, admission authority, account
host, member-action client, or financial record. When Koinos is eventually
used, its canonical settlement events are an input to this projection—not an
authority this package may rewrite or replace.

## Built by

**U6** (index and application-service boundary), alongside
`@pov/application`.

## Will expose

- Idempotent, version-dispatched projection of AT observations and admission
  facts, queryable by `@pov/application`.
- Rebuild from retained source facts, including deletion tombstones without
  body hydration.
- Later read-only ingestion of Koinos settlement evidence, separately labeled
  from pending or simulated PoV data.

## Dependency direction

Depends inward on `@pov/protocol`. It consumes public observations from
`@pov/at-adapter`, admission/revocation facts from the feed-admission
authority, and later read-only Koinos events. `@pov/application` consumes its
output. It never imports Koinos contract implementation details or holds
signing keys.

## Status

Status: proposed — package scaffold only; no index or persistence exists.
