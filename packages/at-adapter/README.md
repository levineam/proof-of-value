# @pov/at-adapter

Read-side boundary for observing public AT Protocol / Bluesky content and
normalizing record and account lifecycle evidence for the feed. It preserves
exact version provenance; it is not a member-action or account-host client.

## Single responsibility

Observe public records and lifecycle facts only. The adapter may resolve a
configured public AppView/PDS source, but it has no OAuth session, member
authorization, publication, provisioning, PDS administration, or admission
authority. `@pov/at-client` owns future member-authorized actions; a separate
account host owns future provisioning and PDS operations; the feed-admission
authority owns versioned admission and revocation decisions.

Every returned observation must carry explicit provenance and lifecycle state.
It never silently substitutes fixture content after a live read fails. A
DID-based AT URI locates the logical record; the observed CID binds the exact
version. Deletion retains only minimal tombstone evidence and never rehydrates
the post body or embeds.

## Built by

**U3** (public AT observation boundary), depending on U2's shared contracts.

## Will expose

- A narrow public read path (selected-author or explicit-URI).
- Normalized DID, DID-based AT URI, observed CID, lifecycle, and source
  provenance facts.
- Explicit states for changed, deleted, inactive, migrated, malformed,
  rate-limited, and unavailable observations.

## Dependency direction

Depends inward on `@pov/protocol` only. It is consumed by the rebuildable
`@pov/app-index` and read-side `@pov/application`; it does not depend on
either, on `@pov/at-client`, on an account host, or on Koinos code.

## Status

Status: proposed — package scaffold only; no live public-read implementation
exists. The U2 lifecycle and provenance contracts it must implement are
already runnable.
