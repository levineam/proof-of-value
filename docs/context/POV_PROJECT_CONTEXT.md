# Proof of Value — Project Context

**Status:** Authoritative working context for Proof of Value work

**Updated:** 2026-08-09

**Canonical implementation repository:** `/Users/andrew/proof-of-value`

## How to use this file

Read this before doing substantive PoV work. When sources disagree, use this
order:

1. Andrew's newest explicit direction.
2. This context packet as the operative summary.
3. The newest explicitly accepted, dated entry in `POV_DECISION_LOG.md` when it
   postdates this packet. Update this packet in the same change.
4. The current canonical repository on `main`.
5. Older plans, mockups, notes, and chat conclusions as historical evidence.

Do not silently turn a recommendation from an earlier assistant into a settled
decision. Mark unresolved choices as unresolved.

## Mission

Proof of Value explores a simple question:

> Can a community use collective judgment to recognize the work that makes the
> community better, then distribute stake accordingly?

The larger ambition is to enable new kinds of organizations to reward valuable
contributions that existing organizational and incentive structures do not
recognize well.

The enduring product thesis is **turnkey marketplaces for information**. A
community defines what it values, people use familiar positive and negative
evaluations, and a transparent mechanism allocates a bounded reward budget.
**The product is the marketplace, not the token.**

This is not primarily a social-media project. Social content can be an input,
but Andrew's interest is decentralized organizations and accessible stake
distribution.

## Current MVP direction

The current working direction is one narrow, self-referential marketplace:

- A simple **Swarm** feed dedicated to people exploring, building, testing,
  documenting, and critiquing Proof of Value.
- A newcomer should be able to read and understand the feed without an
  existing AT Protocol or Bluesky account. The intended future account is
  backed by an AT Protocol identity, but account provisioning and hosting are
  still proposed rather than operational.
- Feed items are real AT Protocol / Bluesky records. Whether an AT record can
  nominate eligible off-platform work remains open.
- The PoV client adds upvotes, downvotes, allocation budgets, pending results,
  settlement, and rewards.
- Begin with a small invited cohort.
- Admit content through an allowlist of authors plus explicit submitted AT URIs.
  Hashtag discovery can be tested later.
- Use a valueless test token. A points-only simulation is acceptable as a
  clearly labeled design prototype, but it is not evidence that the Koinos loop
  works.
- Show provisional allocation and settled results transparently.

The first contribution set may include research, critiques, rebuttals, code,
design proposals, issues, review comments, documentation, and experiments.
Exactly how non-AT artifacts are nominated through AT records is still open.

The active market-entry path is documented in
`docs/product/SWARM_MVP.md` and the August 2026 implementation plan. The older
dual-marketplace mockup and July protocol-first plan remain historical evidence;
they do not imply that a Swarm account, live post publication, live moderation,
or Koinos settlement currently exists.

This first marketplace is meant to prove that the loop can complete and that
people will participate. A small founder-led cohort cannot prove that
stake-weighted collective judgment works at scale.

## System boundary

### AT Protocol

AT Protocol supplies:

- portable identity through DIDs;
- existing public content and social distribution;
- stable logical record references through AT URIs;
- exact evaluated versions through CIDs;
- a possible later custom-feed distribution surface.

The initial PoV web client is necessary because a standard Bluesky custom feed
cannot add PoV voting and allocation controls.

### Proof of Value / SWARM

PoV owns:

- eligibility and content admission;
- upvotes and downvotes;
- bounded per-period voting influence;
- stake commitments or vote budgets;
- scoring, settlement, and reward allocation;
- claims, provenance, and result display.

**Proof of Value** is the broader token-distribution model.

**SWARM** means **Stake-Weighted Autonomous Reward Mechanism** and is the
version-one reference mechanism. It is not a blockchain consensus algorithm and
does not prove that any subjective judgment is correct.

### Koinos

Koinos is the reference settlement implementation because its Mana and
payer/payee model may allow participation to feel free, and its contracts are
upgradeable while the mechanism is experimental.

Koinos is not the product and not the only possible host. The structural
requirements are effectively free participation, bounded sponsorship,
inspectability, and upgradeability during the beta.

## Current mechanism assumptions

These are working assumptions, not final economics:

- Each settlement period has a bounded issuance budget.
- Eligible voters receive bounded influence for that period.
- Upvotes add weight and downvotes subtract weight.
- Votes commit or lock scarce influence until settlement.
- Negative or zero scores receive no new issuance.
- Downvotes do not confiscate previously earned tokens.
- Version one rewards contribution authors, not evaluators.
- The exact curve, standard vote size, period length, stake snapshot, and
  anti-collusion rules remain open.

The core fairness claim is procedural: the rules are published, inputs are
recorded, and settled results can be recomputed. PoV does not claim to discover
an objectively correct value.

## What is current, historical, and deferred

### Current

- One self-referential PoV feed.
- Curated authors and explicit content submission.
- AT content/identity with PoV evaluation and settlement layered on top.
- Valueless test economics.
- A small invited cohort.

### Historical but still useful

- The dual-marketplace mockup demonstrates the long-term idea that many
  independent marketplaces can share one mechanism.
- The existing PoV Build / Open Social design work is a vision artifact and
  interaction reference.

It is not the current MVP scope. Do not let the dual-feed design turn the first
proof back into two products.

### Deferred research

- Buzz as a collaboration/evidence layer is viable for a later invite-only
  pilot, but no Buzz pilot is active.
- A native AT custom feed is a later read-only distribution surface.
- Long-form AT schemas, open admission, sophisticated graph eligibility,
  curator rewards, transferability, liquidity, AMMs, a DAO, and multiple
  community currencies are deferred.

## Honest implementation state

As of 2026-07-29, the canonical repository was clean on `main` at `21dccea`.

Built:

- A standalone browser-local feed mockup with hard-coded state.
- A Koinos spike contract that builds and passes a local event test.

Not built or not proven:

- No successful live Koinos testnet deploy/invoke/event-retrieval proof.
- The protocol schemas, AT adapter, bridge, index, application service, and
  production token/identity/reward contracts remain scaffolds.
- The mockup is not integrated into the real web application.
- No hosted preview or functioning end-to-end PoV loop exists.

The latest single-feed MVP direction has not yet been reconciled into the
repository's older dual-marketplace mockup or implementation plan.

## Product and communication guardrails

- Frame PoV as a small, open-source experiment—not a token launch, fundraise, or
  investment thesis.
- Avoid crypto hype, ideological overreach, and claims that it will change
  everything.
- Center ordinary participation, stake distribution, valuable contribution,
  and decentralized organizations.
- Prefer Andrew's own language and ideas. For public writing, retrieve his
  source phrasing first and perform light copy editing.
- Do not replace Andrew's voice with polished generic marketing copy.
- Distinguish direct first-person sources, later synthesis, and third-party
  mechanism history.
- Attribute Steem's mechanism as **Proof of Brain**. Do not call Steem's term
  “subjective proof of work.”
- Distinguish what is implemented, simulated, proposed, blocked, and deferred.
- Preserve visible provenance in the product: real AT data, fixtures, cached
  data, testnet state, and simulated allocations must never be conflated.

## Open product decisions

1. What exact contribution types qualify for the first cohort?
2. Must every candidate itself be an AT record, or may an AT post nominate a
   GitHub or other artifact?
3. Who may author, nominate, and vote?
4. What does a downvote mean in the first community's published rules?
5. What period length and per-voter budget produce meaningful behavior?
6. Should the first interactive prototype use simulated points before the live
   Koinos gate, or wait for real testnet state?
7. What result would count as success after a fixed evaluation window?
8. How are moderation, spam, self-dealing, retaliation, and collusion handled?

## Durable sources

- Repository front door: `README.md`
- Design paper: `WHITEPAPER.md`
- Honest build state: `ROADMAP.md`
- Component map: `ARCHITECTURE.md`
- Andrew's announcement draft:
  `/Users/andrew/Vaults/Vault v3/Notes/Proof of Value — Announcement Draft.md`
- Verified source language:
  `/Users/andrew/Vaults/Vault v3/Notes/Proof of Value — Andrew’s Steem History and Source Language.md`
- Project history: `docs/context/POV_DECISION_LOG.md`
