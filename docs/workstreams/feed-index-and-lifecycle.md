# Feed index and lifecycle

**Maturity: proposed.** Current feed data is fixture-backed; no live AT ingestion, admission authority, or production index is operating.

## Goal and boundary

Build a rebuildable projection without inventing a second canonical content store. The author’s AT repository is canonical for an ordinary `app.bsky.feed.post`; its DID-based URI identifies the logical record and its observed CID identifies the evaluated version. Swarm owns separate, versioned admission/revocation facts and derives feed visibility, lifecycle, ranking, and joined PoV views from those facts and observations.

## Prerequisites and owned areas

- Depend on shared contracts/fixtures, read-only `@pov/at-adapter`, and the application/index seams. Own proposed work in `packages/app-index/`, `packages/application/`, reconciliation vectors, and related docs.
- Do not add write-client imports to the read adapter or claim the index owns AT records or settled balances.
- Upstream contracts: **R7-R11, R14, R17-R19; F2-F4; AE2-AE5; KTD2, KTD5-KTD6, KTD10-KTD11.**

## Non-goals and open questions

No firehose/Tap deployment, production persistence, ranking policy, or choice of whether a changed CID inherits admission or eligibility. Retention after deletion and the first admission policy remain open; record those dependencies instead of encoding them as defaults.

## Acceptance examples

- Replaying the same admission facts gives the same current projection and retains policy version, reason category, actor class, timestamp, and idempotency evidence.
- A URI resolving to a new CID leaves the earlier evaluation intact; the new version has separate observed, admission, visibility, and eligibility state.
- A deletion, unavailable PDS, or inactive account yields an auditable tombstone (DID, URI, evaluated CID, lifecycle provenance, PoV evidence), not stale retained text rendered as current.

## Verification and coordination

Run reconciliation/vector tests and `npm run typecheck`; expected result: the same facts rebuild the same derived projection without a canonical-content claim. Record the exact result. Coordinate publication outcome and correlation semantics with AT account; admission/revocation and report inputs with Moderation; independent PoV provenance with Settlement. Any contract change needs review from all three tracks.
