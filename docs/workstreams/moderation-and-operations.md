# Moderation and operations

**Maturity: proposed.** There is no live invite cohort, PDS operation, moderation queue, rate limiter, or production incident response.

## Goal and boundary

Prepare the minimum operating contract and tabletop evidence for a small invited cohort. Separate PDS/account authority from Swarm feed authority: Swarm may admit, exclude, or label a record in its derived feed, but it cannot delete, retract, or make private a public AT record in a member repository.

## Prerequisites and owned areas

- Depend on [the account-hosting gate](../operations/AT_ACCOUNT_HOSTING.md), lifecycle/admission contracts, and a named maintainer role. Own proposed operations runbooks, report/appeal templates, tabletop scenarios, and moderation-facing fixture or contract changes.
- Upstream contracts: **R9-R14, R17-R19; F1-F4; AE2, AE5, AE8; KTD1-KTD2, KTD4, KTD6, KTD10-KTD11.**

## Non-goals and open questions

Do not launch a public beta, operate a PDS, issue live invites, decide the community's downvote or anti-collusion policy, or promise content removal from AT Protocol. Cohort membership, retention duration, moderator powers, and appeal outcomes remain open until accepted policy exists.

## Acceptance examples

- An invite has an issuer, eligibility rationale, expiry, revocation path, per-invite/account/post rate limits, and audit evidence; denial creates no account.
- A report reaches a named response channel with evidence preservation, acknowledgement, decision/notice, appeal route, and audit trail.
- A tabletop covers spam or credential compromise, harmful public post, exclusion/revocation, member notice, appeal, recovery, and retrospective; it explicitly records that feed exclusion leaves the public AT record intact.

## Verification and coordination

Before live users, complete the hosting gate's OAuth, backup/restore, recovery, migration, rate-limit, and abuse-response evidence, then conduct the tabletop and a limited-cohort readiness review with owners and dates. Coordinate account and session revocation with AT account; exclusion/revocation fact semantics with Feed index; evaluation disputes with Settlement; contribution/research rules with Product research. Expected result: the tabletop leaves a dated, owned action list and confirms exclusion does not delete the public record.
