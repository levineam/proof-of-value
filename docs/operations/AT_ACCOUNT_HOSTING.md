# AT account-hosting gate

**Status: proposed operational gate.** Swarm accounts, PDS operation, provisioning, OAuth callbacks, and live publishing are not implemented or authorized by this repository. This document is the minimum evidence required before any limited invite cohort is considered.

## Non-negotiable topology

The application/OAuth-client origin and PDS origin must use separate registrable domains (for example `app.swarm.example` and `pds.swarm-host.example`), HTTPS, a fixed allowlist of exact app origins, and fixed HTTPS callback URIs. The PDS must not host app login/session pages or blobs on the app origin. Production review must validate this with the Public Suffix List; the package's two-label static check is only a scaffold.

## Custody and recovery threat matrix

| Asset / failure | Authority | Required control and evidence |
| --- | --- | --- |
| Member write capability | Member OAuth session | Least-privilege `app.bsky.feed.post:create`; server-side opaque storage; short expiry, revocation, audit event; no shared credential. |
| Account provisioning | Separate account-host operator | Invite-bound, rate-limited workflow; no browser-held admin secret; approval and creation audit. |
| DID / PLC recovery | User plus documented recovery trustee | Protected recovery material, recovery handoff receipt, key rotation process, and annual recovery drill. |
| PDS data / availability | PDS operator | Encrypted backups, restore test, least-privilege operator roles, monitoring, incident runbook. |
| Operator break-glass | Named emergency role | Time-bound, dual approval where feasible, immutable audit log, member notice, post-incident review. |
| Compromise or abuse | Incident commander and moderation roles | Revoke sessions/keys, preserve evidence, communicate impact, restore from tested backups, tabletop drill. |

## Required operating decisions and proof

- **Invites:** named issuer, eligibility, expiry, revocation, per-invite quota, and a no-account-created denial path.
- **Recovery handoff:** distinguish identity-created/session-unavailable from recovery established; document who can initiate recovery, who confirms it, and the user-visible receipt.
- **Migration and exit:** user-initiated PDS migration with DID confirmation, stale-session revocation, index reconciliation, export/exit instructions, and no loss of DID-keyed history.
- **Audit and backup:** append-only audit evidence for provisioning, session lifecycle, break-glass, moderation, and deletion; encrypted backup inventory; restore and PLC-key drills with dates and owners.
- **Moderation and abuse:** named feed-level moderation and appeal roles; PDS authority is not feed-admission authority. Include reports, spam throttles, invite and post rate limits, anti-automation controls, metrics, alerts, and an abuse-response tabletop exercise. Feed exclusion cannot delete a public AT record.
- **Deletion, retention, and exit:** publish user-visible deletion and retention rules; retain only the minimum DID, URI, CID, lifecycle, and settlement evidence needed for the declared period. Verify deletion requests, export, account migration, and service exit.

## Go/no-go evidence

Before a live cohort: select an accountable host; record separate-domain and allowed-origin/callback review; complete OAuth conformance for state, PKCE, PAR, DPoP nonce, issuer, returned DID, scope, expiry, and revocation; demonstrate recovery, migration, backup restore, PLC-key protection, compromise response, and abuse drills; and obtain owner sign-off on retention, moderation, observability, and rate limits. Until then, all account and publication outcomes are fixtures only.
