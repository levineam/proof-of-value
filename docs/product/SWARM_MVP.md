# Swarm MVP — Market Entry Brief

## The first product

Swarm is the first Proof of Value marketplace: one small feed for people
building, testing, documenting, and critiquing Proof of Value.

The feed is deliberately self-referential. We do not need to wait for a large
body of Bluesky discussion before there is something useful to try. The first
community can use the product to discuss the product, propose changes, test the
mechanism, and leave evidence for the next contributor.

The experience should feel like an ordinary social feed. A newcomer should be
able to read and understand it without an AT Protocol or Bluesky account. The
intended future account is a Swarm account backed by an AT Protocol identity;
account provisioning and hosting remain proposed until the operational gate is
proven.

An ordinary post is intended to be an `app.bsky.feed.post` in the author's AT
repository. AT Protocol supplies identity and public content infrastructure.
Swarm still has to decide which posts belong in this project feed, how they are
ranked, how moderation works, and how PoV evaluation and allocation are shown.

## What a first visit should communicate

1. **This is a place to help build Proof of Value.** The feed contains
   proposals, critiques, implementation notes, experiments, and requests for
   evidence.
2. **Posting is ordinary and public.** A future post is public AT Protocol
   data, not a private Swarm note.
3. **Evaluation is layered on top.** Upvotes, downvotes, and allocation views
   are PoV product state. They are not silently presented as AT records or
   settled Koinos state.
4. **The repository is honest about maturity.** Fixtures, simulations,
   proposals, blocked network work, and deferred operations are labeled where
   they appear.

## First-cohort assumptions

The first cohort can be invite-only while account hosting, admission, and
moderation are immature. Initial content admission should remain curated through
an author allowlist and explicit submitted AT URIs. Hashtag discovery and a
native AT custom feed are later experiments, not onboarding requirements for the
foundation.

The first contribution set may include research, critiques, rebuttals, code,
design proposals, documentation, experiments, and evidence. The cohort must
publish the actual eligibility and voting rules before treating a result as
meaningful.

## What the foundation demonstrates

- One coherent project-specific feed from explicit fixtures.
- An ordinary AT social-post shape with a DID-based URI and observed CID.
- Separate feed-admission, lifecycle, ranking, evaluation, and allocation
  provenance.
- Visible upvote and downvote states with bounded, valueless or simulated
  allocation context.
- A contributor path from the repository front door to a bounded implementation
  workstream.

This foundation does not demonstrate a live PDS, account provisioning, OAuth,
live post publication, production moderation, or Koinos settlement. The Koinos
spike is local feasibility evidence only.

## Questions for the first experiment

- Which contributions qualify for the first cohort beyond the broad categories
  above?
- May an AT post nominate a GitHub or other off-platform artifact, or must the
  candidate itself be an AT record?
- Who may author, nominate, and vote?
- What does a downvote mean in the published rules?
- What period length and per-voter budget make participation understandable?
- What result would count as success after a fixed evaluation window?
- How should the cohort handle spam, self-dealing, retaliation, and collusion?

## Deferred settlement identity

Koinos remains the reference settlement path, but it is not required for the
first feed. Koinos Nicknames may later provide a human-readable label beside a
verified Koinos settlement address. It must not become the Swarm handle, AT
identity, record key, or authorization input. Adoption requires a separate
contract, resolver, lifecycle, integrity, and operational review.

## Related artifacts

- [Architecture](../../ARCHITECTURE.md)
- [Active implementation plan](../plans/2026-08-04-001-feat-swarm-market-entry-foundation-plan.md)
- [White paper](../../WHITEPAPER.md)
- [Historical dual-marketplace mockup](../../design/mockup/README.md)
