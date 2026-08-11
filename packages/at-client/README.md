# @pov/at-client

Dependency-free, framework-neutral **server-side port** for future member-authorized AT Protocol actions. It is a contract scaffold, not a network client.

## Boundary

- `@pov/at-adapter` observes public records; this package represents authorized member actions.
- A separate account-host operator represents provisioning outcomes. This package never carries provisioning authority.
- The only modeled permission is `create` for `app.bsky.feed.post`.
- `recordKey` and `idempotencyKey` are required for publication and reconciliation. The record key is allocated before `createRecord`, so reconciliation can derive the expected DID-based URI and look it up before any retry.

## Explicit non-goals

No OAuth callbacks, network SDK, token/credential persistence, browser session serialization, PDS administration, account provisioning secret, or live post publishing exists here. A success requires both an AT URI and CID owned by the requested DID. An unknown write outcome blocks blind retry until reconciliation looks up the preallocated record identity and returns `record-found`, `pending`, or `not-found`.

## Safe outcomes

Authorization failures are safe diagnostic categories only: one-time state, PKCE, PAR, DPoP nonce, issuer, returned DID, scopes, expiry, revocation, denial, and PDS availability. They never include upstream bodies or authorization material.

See [the account-hosting gate](../../docs/operations/AT_ACCOUNT_HOSTING.md) before any live account work.
