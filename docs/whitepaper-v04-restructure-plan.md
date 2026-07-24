# Whitepaper v0.4 — restructure plan

**Status:** plan for review. Nothing in WHITEPAPER.md changed yet.
**Date:** 2026-07-22

This plan reshapes the paper around the decentralized-organizations thesis while
answering the four objections an independent adversarial read raised. The goal is
a paper mechanism designers and public-goods-funding people respect and argue
with — not a manifesto they bounce off. The paper's existing candor about trust
boundaries, plutocracy, and open questions is its best quality and is preserved.

---

## The one thing that changed the argument

The prior-art research corrected a claim we were about to lean on. "Continuous +
free-to-user + open-participation + per-item up/down allocation" is **not** novel
to SWARM — **Steem/Hive proof-of-brain already had all four, for years.** Steem is
SWARM's direct ancestor.

This is not a problem. It is the spine:

- Steem is the **existence proof** that the four-property combination works at
  social scale. It exploded on exactly this.
- Steem **imploded on its architecture, not its core mechanism** — but only
  partly. Its failures split cleanly in two (see table §New-B). Koinos removes the
  architecture column by construction. It does **not** remove the
  reward-mechanism column.
- So the paper's real experimental claim: *isolate the mechanism that worked from
  the architecture that killed it, revise the parts of the mechanism that got
  gamed, and test whether the revision holds.* Falsifiable. Publishable.

The honest headline delta: **among systems outside the Steem/Hive lineage, none
combine all four properties.** SWARM is not a new atom of political economy; it is
the controlled re-run of the one experiment that worked.

---

## Goal hierarchy (what the paper must now do)

1. **Motivate with the organization thesis — as hypothesis, not proven law.**
   Shares align centralized-private orgs; currencies align centralized-public
   orgs; both require a center to issue and enforce. Decentralized coordination of
   *subjective* contribution lacks a comparably clean primitive. State this as the
   question the paper explores, explicitly flagged as hypothesis. Do NOT claim it
   explains why DAOs are rare (Steem/Hive HAD the primitive and still didn't
   produce workable general DAOs; legal/Coasean explanations are stronger).

2. **Locate SWARM honestly in a populated field.** New related-work section with
   the sourced comparison table. State the real delta on the friction/continuity
   axis (narrowed to non-Steem lineage) and concede the inherited pieces (Mana ≈
   Resource Credits; convergent curve ≈ HF21 family).

3. **Frame Steem as the confounded experiment this de-confounds** — with the
   two-column failure split, and the honest admission that the left column
   (reward-mechanism gaming) is NOT escaped by moving chains and is exactly what
   the prototype must test.

4. **Move AI into the threat model, not the tailwind.** Zone-flooding (cheap
   synthetic content) and automated voting (agents casting all q-budget votes to
   harvest issuance) make trustworthy evaluation *harder*. AT DIDs are not
   proof-of-personhood. This is a risk section, argued straight.

5. **Make the prototype self-referential (dogfooding).** The first feed evaluates
   contributions to PoV itself (GitHub PRs/issues/design). Adjacent ground truth
   (compiles / CI / merges) is one of the few structural defenses against
   bid-bot-style gaming — sludge is filterable before it reaches a vote. Frame as
   *the loop completing at n=1*, not *the mechanism validated* (a handful of
   contributors is the worst case for the many-vantages premise).

6. **Promote plural currencies (current §12) toward the front half.** Under the
   org thesis, per-community tokens each with their own idea of value ARE the
   payoff — the point where the organizational framing cashes out. Right now the
   paper buries its strongest implication.

7. **Add the honest open questions we now know about**: thin skin (a vote locks
   stake but the voter never pays for being wrong — no resolution, no P&L, unlike
   a prediction market); stake-weight = capital, not demos ("what committed
   capital values under published rules," never "what people value"); whether the
   revised curve/lock/bounded-downvote actually suppress the left-column gaming.

---

## Section-by-section map

| # | Current section | Action |
|---|---|---|
| — | (new) Opening | REWRITE — see draft prose below. Thesis as hypothesis + Steem-as-existence-proof. |
| 1 | The problem: subjective value, public allocation | KEEP, trim. Still strong. Fold the "markets price attention not information" point up. |
| 2 | What PoV and SWARM mean | KEEP. Promote the "a repo, contract, dataset, or review is an equally valid object" sentence — it now licenses dogfooding. |
| 3 | Lessons from prior social-reward systems | EXPAND into the de-confound framing + the two-column Steem split. This becomes a load-bearing section. |
| NEW-A | Related work (currently §11, thin) | NEW, front-half. The comparison table + honest delta. Absorbs and replaces §11. |
| NEW-B | Steem as confounded experiment | NEW. Two-column failure table; what Koinos escapes by construction vs. what it doesn't. |
| 4 | Reference mechanism | KEEP. Add the thin-skin admission to the curator-reward paragraph. |
| 5 | Reference architecture | KEEP. Strong, honest. |
| 6 | End-to-end flows | KEEP. |
| 7 | Downvotes | KEEP. |
| 8 | Threat model | EXPAND — this is where AI (zone-flood + automated voting + personhood) goes. |
| 9 | Bootstrap and distribution | KEEP. Update testnet reference (community testnet endpoints, not Harbinger). |
| 10 | Prototype boundary | REWRITE — make self-referential (dogfood the PoV repo). |
| 11 | Related work | CUT — absorbed into NEW-A. |
| 12 | Plural currencies | MOVE toward front half; expand as the org-thesis payoff. |
| 13 | Open questions | EXPAND — add thin-skin, capital-not-demos, left-column-gaming-untested. |
| 14 | Conclusion | REWRITE to match: controlled re-run of a proven mechanism on a clean substrate, honest about what's untested. |

---

## The new opening (draft prose — the one place the reframe lives)

> Every durable organization needs a way to align the people inside it with the
> whole. Companies use shares: a transferable claim on residual value that makes
> owners care about the enterprise. States use currencies: a unit the issuer
> compels and everyone must ultimately settle in. Both are powerful, and both
> depend on a center — a registry that records shares and courts that enforce
> them, a treasury that issues currency and an authority that backs it. Take the
> center away and neither primitive survives in the same form.
>
> Decentralized coordination therefore inherits a gap, and it is sharpest for
> *subjective* contribution. Where a job is objectively measurable, a protocol can
> pay for it directly, as proof-of-work pays for hashes and proof-of-stake pays
> for security. But most of what people actually do inside an organization —
> judgment, taste, explanation, creative work — cannot be scored by a machine
> without becoming a target to game. This is not a hypothetical concern in the age
> of AI: as measurable, repeatable work is increasingly automated, the human
> residual shifts toward exactly the subjective contribution that existing
> mechanisms reward least well.
>
> This paper proposes Proof of Value, and its reference mechanism SWARM, as a
> candidate for that gap: a way to direct a fixed, shared issuance budget toward
> the contributions a community judges valuable, using nothing more than a
> low-friction up or down vote made economically consequential by committed stake.
> We do not claim this is the first mechanism in its family — it is not, and
> Section [NEW-A] places it honestly among quadratic funding, retroactive public
> goods funding, and reputation-weighted allocation. We claim something narrower
> and more testable. One system, Steem's proof-of-brain, already showed that
> continuous, feeless, open, stake-weighted evaluation can allocate real issuance
> at social scale — and then collapsed, for reasons that had far more to do with
> how much it did at the blockchain layer than with the reward mechanism itself.
> SWARM isolates that mechanism on a minimal, upgradeable, feeless substrate,
> revises the specific parts that were gamed, and asks whether what worked can be
> made to last. What follows is a design paper and an experiment, not a finished
> claim.

---

## New section: differentiation from social-token speculation (friend.tech et al.)

The paper must answer "how is this not another friend.tech / BitClout / creator
coin," because reviewers will ask. (Focused prior-art research on this cluster is
running; findings land in a follow-up. One claim to VERIFY before use: "Coinbase
is abandoning its Base social strategy" — heard on a podcast, not yet confirmed.)

The differentiation, stated honestly:

- **They made the token/speculation THE product.** Bonding curves, "price rises as
  more buy," creator-coin trading — the speculation *was* the mechanism. Once
  speculation stopped, the product had no reason to exist.
- **SWARM has no bonding curve, no value promise, and a fixed issuance budget.**
  Structurally different from bonding-curve speculation. Confirmed by design.
- **The honest limit:** SWARM tokens are transferable, so a secondary market /
  speculation surface CAN form even though the design doesn't build or encourage
  it. The claim is therefore NOT "structurally impossible" — it is *we don't build
  the speculation mechanics, don't promise value, and nothing in the design
  depends on or encourages a rising price.* friend.tech's price was the product;
  SWARM's is a side effect it neither needs nor courts.

### Research findings (social-token cluster, 2026-07-22) — confirmed + the hard part

- **Base claim CONFIRMED, and quotable.** Jesse Pollak (Base creator), X post
  2026-07-15: the bets on Farcaster/Zora/miniapps/creator-coins "disintegrated
  completely" in Q1 2026, "a punch in the face," "unequivocally mistaken"; stepped
  back from consumer-app leadership. Brian Armstrong: content coins "didn't work."
  Zora token −95% from high, volume −99.8%. Base killed the Farcaster feed Feb
  2026. Freshest possible evidence the incumbent conceded this approach.
- **Common failure pattern confirmed:** token/speculation WAS the product in 4 of
  5 cases (friend.tech, BitClout, Rally, Base). Removing it is a real structural
  differentiator for SWARM (fixed budget, no bonding curve, no early-buyer-profits
  mechanic) — confirmable, not marketing.
- **THE HARD FINDING — removing speculation is necessary but NOT sufficient.**
  Farcaster did exactly the "no token, no speculation" instinct and STILL lost 40%
  DAU / 85% revenue YoY and needed acquisition (Neynar, Jan 2026) to survive. It
  failed because it tried to be a GENERAL social network, which needs viral growth
  it couldn't manufacture without a speculation hook.
- **Rally solved friction (gasless + fiat on-ramp) and failed anyway** (2023). So
  feeless is necessary for invisible crypto but NOT sufficient on its own. "They
  all had gas, we don't" is not the whole edge.
- **Steem bid-bot farming is independent of bonding curves** — "vote to allocate a
  pool" gets gamed regardless. Left-column reward-mechanism risk again; the
  prototype must show the revised curve/lock/bounded-downvote suppress it.
- **Invisible-crypto UX is UNPROVEN at scale.** No crypto-social precedent tested
  hidden-crypto long enough; Reddit Community Points (closest, partially hidden)
  shut down for unrelated reasons. Present it as a strong hypothesis, not solved.

**Implication for the paper:** the bounded-community / dogfooding target is no
longer optional framing — it is the RETENTION ENGINE that replaces speculation.
Farcaster proves a general social network without speculation still dies; a
bounded community with intrinsic purpose (contributors building the thing) does
not need viral growth. Removing speculation + gas exits the failure modes; the
bounded-purpose community carries retention in their place. State this explicitly.

## New framing: the invisible incentive layer (product thesis)

This reframes what the product IS, and it is the strongest differentiator:

- The platform is **not** "earn crypto for posting." It is an incentive mechanism
  that happens to be crypto-powered. Users needn't know it's blockchain — like
  loyalty points, or not knowing what database a site runs.
- **Invisible crypto requires the feeless model.** You cannot hide the chain if
  users buy gas, sign every tx, manage a wallet. Koinos feeless + sponsored tx is
  the precondition for the crypto to disappear; disappearing crypto is the
  precondition for normal-person use. The free-UX argument and the loyalty-points
  argument are the same argument.
- **This is why the prior failures don't bound us:** friend.tech, BitClout, Base
  social all put the crypto (wallet, token price, speculation) front-and-center.
  Treating the incentive as invisible infrastructure has not been the focus.
- **Network-effects answer:** "small effort, no VC" makes social cold-start
  brutal UNLESS the target is not a social network but an incentive layer for one
  bounded community with a real coordination need (dogfood PoV contributors
  first). Bounded community needs no Facebook-scale — org thesis made concrete.

## Koinos flexibility vs Steem/Hive (add to related-work / de-confound sections)

- **Upgradeable contracts.** Steem needed contentious, chain-splitting hard forks
  (HF19, HF21, HF25) just to change its reward curve. Koinos changes it as a
  contract upgrade. (Caveat: the upgrade key is a trust surface — disclose.)
- **Native multi-token / plural SWARM.** Steem/Hive cannot launch other tokens;
  the plural-currencies vision is impossible there and native on Koinos. Launch
  your own token + airdrop = the exit-as-a-check mechanism from §8/§12.

## THE CRUX DECISION v0.4 must take a position on: token transferability

Two clusters in the author's vision pull against each other on the axis that
decides whether SWARM repeats friend.tech:
- **Cluster A (invisible/loyalty):** points to non-transferable/restricted reward
  units — makes the anti-speculation claim *structural*.
- **Cluster B (plural tokens/exit):** requires transferable, tradeable tokens =
  the speculation surface, but also the capture-check (exit alongside voice).

Proposed synthesis (not yet decided): **layer them.** Normal users get the
invisible loyalty-points experience (front door); the launch-your-own-token / exit
capability exists as systemic infrastructure that keeps the system honest, not as
the product. Exit-as-a-check, not exit-as-the-pitch. The paper needs an explicit
stance on how freely reward tokens transfer — this is the single most
consequential open design decision.

**RESOLUTION (Andrew, 2026-07-22) — the base-token model.** Not no-token
(Farcaster) and not buy-to-speculate (friend.tech). Start with ONE base SWARM
token earned ONLY by contributing, among a small group. That base token then
becomes the reserve/base token that all later community tokens launch against.
Earned-not-bought at the root; plural ecosystem on top. This resolves how the
first tokens reach honest hands (contribution, not sale).
- Honest tension to state in the paper (not a blocker): making the base token the
  reserve for all others gives it VALUE-ACCRUAL — ecosystem growth drives base-layer
  demand, which is where speculation pressure concentrates. So the invisible
  loyalty-points experience and the valuable base reserve are likely DIFFERENT
  layers: community tokens on top = invisible/loyalty surface; base token =
  economic/exit layer with real weight. Paper should say this plainly.

**MECHANISM CORRECTION (Andrew, 2026-07-22): "fixed budget" = fixed INFLATION
RATE, not a fixed absolute B_t.** §4 math must change: per-period budget =
inflation_rate × supply, not a constant. Note the mildly pro-thesis property:
constant dilution discourages idle holding/hoarding and rewards USING the token to
vote — a small anti-speculation force.

## SETTLED (Andrew, 2026-07-24) — the spine and the token decisions

**THE PRODUCT: "turnkey marketplaces for information."** What PoV offers any
decentralized organization is a marketplace-in-a-box for pricing the information
its members produce. Not a token. Not a social app. This becomes the paper's
spine, and it promotes §12 (plural currencies) from deferred vision to *the
product*. It also sharpens the related-work rebuttal: QF / RetroPGF / Coordinape
are bespoke deployments run by a center; turnkey and self-serve is a different
product category even where the mechanism family overlaps.

**Token decisions, all to be stated plainly in the paper:**
- **NO transfer lockup (reversed 2026-07-24).** An initial "1 month" instinct was
  withdrawn as a premature optimization: on a valueless test token held by a few
  contributors it guards against speculation that cannot happen yet, and it
  contradicts the beta posture by fixing a parameter with no supporting evidence.
  If a maintainer community emerges, the call is theirs. Now stated as open
  question 10 in the paper, not as a design decision. The vote-commitment lock
  (`q x S` held until period settlement) is a separate mechanism and remains.
- **Everything is pretend/testing first.** A valueless test token, said outright.
- **The token is not about appreciating in value** — and nobody should
  participate hoping that it will. State it in the abstract, not a footnote.
- **Retained authority to change the token economics entirely** via Koinos
  upgradeability, at any time. Beta/startup posture; rapid iteration is the goal.

**Interaction to resolve in the text — upgrade authority vs. provable fairness.**
The paper's core claim is that rules are published in advance and applied
identically. Retained authority to change economics means that claim holds only
*within* a period. Fix by scoping, not retreat: provable fairness applies to each
settled period under the rules in force at settlement; a disclosed development
authority may change rules between periods; every change is announced and
versioned; the authority is sunset on a stated trigger. This reinforces the
no-appreciation stance — rules that can change at will are not an investment.

## What NOT to change

- The candor. Section 5's trust-boundary honesty, Section 8's plutocracy
  admission, the whole open-questions section. This is the paper's credibility.
  Every new claim gets the same treatment.
- The AT/Koinos separation-of-concerns architecture. Solid and defensible.
- The "provable fairness, not provable correctness" standard. Keep exactly.
- Do NOT claim breakthrough. No running prototype has answered open question 9
  (honest evaluation without curator rewards). The paper stays a proposal.

## Top risks of this reframe

1. **Overclaiming for an unbuilt mechanism.** Mitigated by hypothesis-framing,
   the "experiment not finished claim" language, and keeping every objection
   visible. If in doubt, weaken the claim.
2. **The org thesis still over-reaching.** It motivates ("why care") but must not
   assert ("this is proven"). If a reviewer can quote a sentence as an
   unsupported law of political economy, that sentence is wrong.
3. **Steem baggage.** Associating with Steem invites "isn't this just Steemit
   again." The two-column split is the answer, but it must be crisp and honest
   about the left column, or it reads as spin.

---

## Research follow-ups still open (flagged by the prior-art sweep)

- Exact current Colony deployment chain/gas model (unverified).
- A single citable source for "Steem hyperinflation" as a discrete event vs. an
  ongoing tokenomics debate (not found; may need to soften that wording).
- Whether any real SourceCred deployment used on-chain distribution vs. off-ledger
  accounting (unconfirmed).
