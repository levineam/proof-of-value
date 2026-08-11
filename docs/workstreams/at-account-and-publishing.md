# AT account, provisioning, and publishing

**Maturity: proposed.** No PDS is selected or operated; no Swarm account, OAuth callback, credential, or live `app.bsky.feed.post` write exists.

## Goal and boundary

Define and test the future-safe boundary for an AT-backed Swarm account and an ordinary public post without operating it. **Host authority** is a server-side, invite-bound operator capability to provision an account on an approved PDS. **Member authority** is a separately obtained, least-privilege OAuth capability to create `app.bsky.feed.post` records. The browser holds neither authority nor a PDS administrative credential.

## Prerequisites and owned areas

- Depend on `@pov/at-client`, account/publishing fixtures, and the operational gate in [AT_ACCOUNT_HOSTING.md](../operations/AT_ACCOUNT_HOSTING.md).
- Own proposed changes to `packages/at-client/`, its tests, account/publication contracts and fixtures, and the hosting gate. Coordinate any shared schema edit with the feed-index track.
- Upstream contracts: **R2-R4, R7-R9, R12-R14; F1-F2; AE1-AE2, AE8; KTD1, KTD3-KTD6, KTD10-KTD11.**

## Non-goals and open questions

Do not select or operate a PDS, issue live invites, create accounts, accept a Bluesky password, implement OAuth transport, store tokens, or publish a live post. The PDS host, recovery model, existing-AT-account path, invite cohort, and production retention rules remain open decisions.

## Acceptance examples

- A fixture represents a proposed Swarm account and a public ordinary post, while the UI/contract exposes its proposed or fixture provenance.
- An unknown publish outcome preserves a correlation key and prevents blind resubmission until reconciliation identifies the URI/CID or final failure.
- A boundary test rejects browser-exposed admin credentials, broad shared signing keys, and provisioning capability on member write ports.

## Verification and coordination

Run focused `@pov/at-client` tests and `npm run typecheck`; expected result: the fixture/port boundary passes without network credentials. Document the exact result in the change. Before a live cohort, the hosting gate must produce its separate-domain, OAuth, recovery, migration, backup, rate-limit, and abuse-drill evidence—until then, use fixtures only. Coordinate URI/CID and lifecycle states with Feed index; invite, revocation, and incident posture with Moderation; cohort language with Product research.
