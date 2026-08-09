# Proof of Value — Decision Log

**Updated:** 2026-08-09

This log records how the current direction emerged. Newer decisions supersede
older ones only where they conflict; enduring principles remain in force.

## 2026-07-29 — Narrow the MVP to one PoV-focused AT feed

**Source:** “So I think I made a mistake…” and “Define Proof of Value MVP”

Current working direction:

- Start with one simple feed about Proof of Value itself.
- Use AT Protocol content and identity as the content layer.
- Add PoV upvotes, downvotes, allocation budgets, settlement, and token rewards
  in the PoV client.
- Begin with an invited author allowlist and explicit post submissions rather
  than hashtags.
- Use testnet tokens or clearly labeled points; avoid speculative economics.

This supersedes the dual-marketplace design as the MVP scope. It does not erase
the long-term plural-marketplace thesis.

## 2026-08-09 — Make the Swarm account and ordinary post the market-entry surface

**Source:** Andrew's follow-up on newcomer onboarding, ordinary social posts,
and the Koinos Nicknames question.

Accepted direction for the foundation:

- Start with one self-referential Swarm feed about building, testing,
  documenting, and critiquing Proof of Value.
- Let a newcomer encounter the Swarm account and feed without requiring an
  existing AT Protocol or Bluesky account. The intended account is AT-backed;
  provisioning and hosting remain proposed until their operational gate is
  proven.
- Use ordinary `app.bsky.feed.post` records as the content shape. Swarm layers
  feed admission, ranking, moderation, voting, allocation, and provenance on
  top of the AT record rather than pretending those facts are AT content.
- The foundation may use fixtures and simulations, but does not claim live
  PDS operation, OAuth, account creation, post publication, moderation, or
  settlement.
- Koinos Nicknames may later provide an optional label beside a verified
  Koinos settlement address. It is not the Swarm handle, AT identity, record
  key, or authorization input.

This does not settle eligibility, economics, moderation, or success metrics.

## 2026-07-28 — Use the dual-marketplace mockup as a vision artifact

**Source:** “Review Front-End Prototype Readiness”

The PoV Build / Open Social mockup was judged useful for explaining “one
mechanism, many marketplaces.” It was explicitly separated from integrated
protocol implementation.

The design work established a preferred visual direction:

- warm editorial minimalism;
- thoughtful and civic rather than crypto-financial;
- compact contribution cards;
- honest design-demo labeling;
- clear marketplace identity and provenance.

Current interpretation: retain this work as visual and long-term product
research. Do not build two marketplaces into the first proof.

## 2026-07-27 — Clarify Andrew's motivation and writing voice

**Sources:** “New Realtime Voice Chat” sessions, announcement draft, and Steem
source-language research

Durable motivation:

- Bitcoin mattered as a path toward democratized finance and currency
  competition.
- Steem's important innovation was not “social media on a blockchain.” It gave
  ordinary people influence over the printing press: a way to distribute new
  digital money through subjective judgments about contribution.
- The important concept is **stake distribution**, not generic incentivization.
- The goal is new kinds of decentralized organizations capable of recognizing
  work that existing organizations do not reward.
- PoV should remain pragmatic, small, open source, non-ideological, and
  non-investment-oriented.

Collaboration decision:

- Public writing should begin from Andrew's words and verified source material.
- Use light copy editing.
- Do not manufacture a generic founder narrative or add arguments Andrew did
  not make.

## 2026-07-26 — Buzz is viable but deferred

**Source:** “Find Buzz Idea in Today’s Journal”

An invite-only Buzz community could later serve as a signed collaboration and
contribution-evidence layer while Koinos handles settlement.

No pilot was authorized. This was saved as research only. It is an alternative
or future contribution source, not the current product direction.

## 2026-07-25 — Consolidate the public thesis and honest repository state

**Source:** “POV Consolidation” and canonical repository commits

Stable decisions:

- Proof of Value is a token-distribution mechanism, not blockchain consensus.
- SWARM is the version-one reference algorithm.
- The product is a marketplace for information, not a token.
- AT Protocol owns content and identity.
- Koinos is the reference settlement layer.
- An explicit attestation bridge carries facts but must not decide value.
- The beta token is valueless and economics may change.
- Version one rewards authors only.
- The first marketplace evaluates work on PoV itself.
- Steem called its mechanism **Proof of Brain**.

Honest technical state:

- The local Koinos spike works.
- A live Koinos network round trip has not been proven.
- The feed mockup is browser-local.
- Most system components remain scaffolds.

## Supersession summary

| Earlier idea | Current treatment |
|---|---|
| General social network | Out of scope |
| Two live marketplaces in the MVP | Vision artifact only |
| Open hashtag-driven intake | Later experiment |
| Buzz as the initial workspace | Deferred research |
| Full Koinos architecture before product learning | Keep as technical path, but lead the user-facing MVP with the narrow feed |
| Native Bluesky custom feed as the product | Later read-only distribution surface |
| Token launch or liquid economics | Explicitly out of scope |

## Decisions that remain open

No chat has yet settled:

- the precise eligible contribution rules;
- how AT posts nominate non-AT work;
- first-cohort membership;
- voting period and budget;
- exact downvote semantics;
- whether an initial points prototype should precede the live Koinos proof;
- success metrics and evaluation window;
- moderation and anti-collusion policy.
