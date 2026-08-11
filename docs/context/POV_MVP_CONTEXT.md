# Proof of Value — MVP Snapshot

> This is the short MVP view. For authoritative project-wide context, current
> implementation status, collaboration guardrails, and source hierarchy, read
> `POV_PROJECT_CONTEXT.md`. For chronology and superseded directions, read
> `POV_DECISION_LOG.md`.

## Purpose

Proof of Value (PoV) is a focused experiment in collectively recognizing and
allocating value to contributions within a project community.

The first MVP should demonstrate the mechanism on its own subject: a feed for
people exploring, building, critiquing, and documenting Proof of Value.

## Product thesis

An invite-only community can use a transparent, bounded allocation mechanism
to signal which project contributions create value. The product is not
initially a general-purpose social network or token market.

## Current working MVP

- Present the project through one self-referential **Swarm** feed. Reading must
  not depend on a newcomer already having an AT Protocol or Bluesky account;
  the intended Swarm account is AT-backed, while provisioning and hosting stay
  proposed until the operational gate is complete.
- Display a small, curated feed of project-relevant AT Protocol / Bluesky posts.
- Admit content through an allowlist of participating authors and manually
  submitted post URLs.
- Let participants upvote or downvote using a visible, bounded per-period
  allocation budget.
- Show provisional allocation during the period and transparent settled
  results afterward.
- Reward authors with a valueless test token. A points-only interaction
  prototype is acceptable if it is clearly labeled as simulated.

## AT Protocol boundary

AT Protocol supplies identity and content:

- Authors publish normal Bluesky/AT Protocol posts.
- An ordinary post is canonical in the author's AT repository; Swarm adds
  admission, ranking, moderation, voting, allocation, and provenance as
  application-owned or derived facts.
- The PoV application selects eligible posts and presents them as a focused
  feed.
- PoV owns voting, allocation budgets, settlement, rewards, and token logic.
- A custom AT Protocol feed is a later distribution option; it can return
  eligible post URIs for compatible clients to display.

## Why curated admission comes first

Do not begin with hashtags as the admission mechanism. An allowlist plus
explicit post URLs is easier to explain, less gameable, and makes the initial
experiment measurable. Broader discovery and hashtag-based intake can be
tested later.

## Eligible contribution types (initial hypotheses)

- Research and synthesis
- Critiques and rebuttals
- Code and technical experiments
- Design proposals
- Product experiments and evidence

The published rules must define what qualifies and how voters should assess it,
so the feed tests contribution value rather than raw popularity.

## Explicit non-goals for the first proof

- A general-purpose social network
- Open, permissionless content admission
- Exchangeable or speculative tokens
- Complex wallet, trading, or governance infrastructure
- Automatic determination of truth or quality
- The earlier dual-marketplace design as the first implementation

## Decisions still needed

1. Who is invited to author and vote in the first cohort?
2. What exact contribution criteria and voting guidance will be public?
3. How long is an allocation period, and how many points can each participant
   allocate?
4. What does a downvote mean, and how does it affect settlement?
5. Are rewards author-only, or can curators/voters receive recognition too?
6. What transparent anti-abuse and moderation rules apply?
7. What result would count as a successful proof of value?
8. How should AT posts nominate eligible GitHub or other off-platform work?

## Useful references

- [AT Protocol custom feeds guide](https://atproto.com/guides/feeds)
- [AT Protocol custom-feed tutorial](https://atproto.com/guides/custom-feed-tutorial)

## Next durable artifacts

Before implementation, add:

1. A one-page rules and settlement specification.
2. A short cohort/recruitment brief.
3. A wireframe or interaction outline for feed, voting, and settlement states.
4. A success-metrics note with a fixed evaluation window.
