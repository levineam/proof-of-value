# SWARM: A Stake-Weighted Reward Mechanism for Subjective Information Value

## Proof of Value using AT Protocol and Koinos

**Version 0.3 — private working draft — 20 July 2026**

> This document is a design paper, not an offer, a promise of token value, or an implementation specification. The SWARM mechanism is a proposal; parameters and integration details marked open require design, implementation, and prototype validation.

## Abstract

Markets are powerful because a price aggregates the judgments of many people who have skin in the game, but a market can only price what can be directly bought and sold. The internet produces enormous quantities of information—posts, reviews, art, explanations, and the countless smaller social contributions that make a network worth participating in—whose value is real without being captured by any transaction. Social platforms currently monetize that uncaptured value indirectly, through attention and advertising, rather than rewarding it directly. This paper proposes Proof of Value, a token-distribution mechanism that extends economically committed collective judgment to information that markets cannot price directly, informed by the mature Subjective Proof of Work design developed for Steem. Its aim is not an objectively correct valuation but provable fairness: the rules by which judgments are aggregated into rewards are published in advance, applied identically to everyone, settled deterministically, and open to independent inspection, so that what can be demonstrated is the fairness of the process rather than the correctness of the result. Its reference implementation, SWARM—the Stake-Weighted Autonomous Reward Mechanism—defines a predetermined token budget for each reward period and allocates it deterministically at settlement according to stake-weighted upvotes and downvotes.

The paper's principal focus is how a proposed mechanism could combine AT Protocol and Koinos using contemporary social-protocol and smart-contract design. AT Protocol supplies portable identity, signed repositories containing content-addressed records, social context, extensible schemas, and open distribution surfaces. Koinos can support programmable authority and sponsored actions that are free to the sponsored user, while a sponsor bears finite regenerative Mana costs. In the proposal, the information being evaluated remains on AT Protocol: a DID-based AT URI locates a record and an observed CID binds the evaluated content version. An explicit off-chain attestation layer supplies those observed facts and verification evidence to Koinos. It does not calculate payouts, although its selection, omission, timing, or mis-attestation of evidence can influence which outcomes the contract produces. Proof of Value is presented not as a blockchain consensus mechanism or a new theory of token economics, but as a practical architecture informed by historical social-reward lessons and adapted to the open social web.

Casting a standard vote commits a configurable fraction `q` of the voter's eligible SWARM balance for that reward period. The committed stake remains locked until rewards are distributed, preventing the same tokens from being transferred and reused while their vote is still pending. Protected but bounded downvote capacity allows stakeholders to contest self-dealing and other allocations that violate the community's social contract. At settlement, when positive eligible weight exists, the protocol deterministically allocates the predetermined period budget to eligible authors and unlocks the stake committed by that period's votes; empty-period budget treatment remains a policy parameter. Recipients can use earned SWARM to evaluate future contributions, creating a recursive path through which recognized contributors can help recognize others. Token ownership remains an economic source of influence rather than a universal measure of reputation.

## 1. The problem: subjective value, public allocation

Markets are powerful precisely because a price aggregates the judgments of a large number of people who have skin in the game; that is why a price set by a large, liquid market commands more confidence than any single opinion. Each participant judges from a vantage no one else occupies, so aggregating many independent judgments produces a signal that no individual—however wealthy or well-informed—possesses alone. But a market can only price what can be directly bought and sold. Much of what the internet produces—posts, reviews, art, explanations, and the countless smaller social contributions that make a network worth participating in—has value that is real without being reducible to a market transaction. One person might pay a large sum for a piece of art; a million other people might derive genuine value simply from its existence, even though none of them would or could buy it. That value is captured by no transaction, so it tends to be monetized indirectly instead: through advertising, engagement ranking, subscriptions, patronage, or opaque platform policy, rather than through a direct reward to the people who created it.

Today, information falls into two buckets: information valuable enough that people consciously decide to pay for it, and everything else, which can only be monetized through advertising. But advertising does not really monetize the information at all—it monetizes the creator's ability to attract attention. That mismatch, pricing attention while the thing actually produced is information, creates the unstable dynamic familiar to every ad-funded network: a creator must produce genuinely valuable information to attract an audience, then dilute that value by churning out low-quality, repetitive, repackaged content to monetize as much of that attention as possible, then produce real value again—a wave-like cycle. This paper proposes a marketplace for information that is not based on advertising. It does not exclude the other reward channels (payment, subscription, patronage); it adds direct valuation of information as the foundational one within this application.

Charging directly for that second bucket does not work, and readers should not have to make a separate payment decision at all. Asking someone to weigh the cognitive, financial, and opportunity cost of a micropayment against every piece of information they encounter does not scale, and the abundance of free alternatives means a paywall simply drives readers elsewhere. What does scale is a familiar, low-friction evaluative action people already perform without thinking about it—an upvote or a downvote—aggregated across many people into an economically meaningful reward. Proof of Value asks a narrower question than what something is objectively worth: can a community direct a fixed, shared issuance budget toward the contributions its members judge valuable, using nothing more than that familiar evaluative gesture, while making the basis and consequences of those judgments inspectable?

Subjective judgments cannot be objectively correct. One person may believe a given poem is the most beautiful ever written; another may consider it worthless; neither is wrong. But a valuation can still be arrived at in a way that is provably fair, by aggregating the valuations of many people—the wisdom of the crowd. If we cannot have provable objectivity, then what we settle for is **provable fairness**. We cannot prove that a reward is the correct valuation of a contribution, because no such valuation exists. What we can prove is that the rules producing that reward are fair: published in advance, applied identically to everyone, executed deterministically, and open to inspection and reconstruction by anyone who cares to check. Fairness is a property of the process, not a claim about the result. The answer proposed here is therefore not an objective measure of truth and not a replacement for editorial judgment. It is a mechanism for making subjective evaluation economically consequential—a way to convert low-friction subjective judgments into economically meaningful signals.

Money itself is a kind of information-compression technology, compressing unimaginable quantities of information into a single number; Proof of Value is not a way to discover some objective, Platonic value, but another such information-processing layer, one that helps a community express, aggregate, and transmit its judgments about value. A finite budget creates the need to choose; stake-weighted evaluation gives choices economic cost, the same skin in the game that gives market prices their credibility; negative evaluation permits contest; and deterministic settlement makes the resulting distribution reproducible.

Proof of Value is therefore a **token-distribution mechanism**, not a blockchain consensus protocol. Koinos consensus orders and validates transactions. SWARM describes how an application-level budget is allocated after those transactions are accepted.

## 2. What Proof of Value and SWARM mean

**Proof of Value (PoV)** is the project umbrella and the general idea of algorithmically creating and distributing tokens according to subjective judgments of information value.

The evaluated object is information in general. The first client focuses on familiar user-generated content because that is legible to the broadest audience, but nothing in the mechanism restricts evaluation to social posts: a code repository, a smart contract, a dataset, or a review is an equally valid object of evaluation. An AT record can reference any of these.

**SWARM** means **Stake-Weighted Autonomous Reward Mechanism**. It is the version-one reference mechanism. It does not assert that a vote proves value; it defines a transparent process through which holders commit scarce economic influence to allocate a bounded reward budget.

**Subjective value** is what an individual believes something is worth. One person's valuation of a poem, a post, or a piece of art is no more objectively correct than another's.

**Collective valuation** is the aggregate signal produced when many individuals' subjective valuations are combined—an analogue to a market price for information that a market cannot price directly.

**Provable fairness** is the standard by which the resulting allocation is judged. It does not assert that an allocation captures the objectively correct value of a contribution; it asserts that the rules producing that allocation are open, deterministic, applied equally to every participant, and independently verifiable from the public record. What is provable is that the published rules—and only those rules—determined the distribution.

This paper uses provable fairness in a broader sense than blockchain gaming, where "provably fair" refers narrowly to a cryptographic commit-reveal scheme letting a player verify that one random outcome was not altered after the fact. The shared idea is that participants need not trust an operator's word. The difference is that SWARM makes no claim about randomness or about any single outcome being correct; its claim is that the allocation rule is public, the inputs are recorded, and the result can be recomputed by anyone from the canonical event history.

Provable fairness so defined applies to the allocation the contract performs on the attestations it accepts. It does not extend to what reaches the contract in the first place: the attestation bridge described in Section 5 can delay, omit, or mis-attest facts, and the sufficiency of emitted events for independent reconstruction remains an open question. Provable fairness is therefore the standard this design is built to meet, not a property already demonstrated by a running system.

The first reference implementation pairs AT Protocol with Koinos. A token name, ticker, market role, monetary policy beyond the prototype, and any claim of exchange value are outside this paper.

## 3. Lessons from prior social-reward systems

Steem showed that newly issued currency can be directed by community evaluation instead of requiring every reader to make a payment. Its later reward work is useful because it treated the system as scarce-resource allocation rather than as a simple popularity counter. The durable lessons are: a predetermined reward budget; influence connected to committed stake; positive and negative evaluations; delayed, deterministic settlement; a configurable allocation curve; and bounded capacity for contesting allocations.

SWARM borrows these functions, not Steem-specific terminology or implementation. In particular, version one does not import a separate regenerating voting resource, persistent staking mode, unstaking cooldown, or curator payout. It proposes an automatic, reward-period lock instead. Its allocation function is informed by Vandeberg's historical convergent-linear proposal and the later protected-downvote design; it is not a claim that current Hive uses that curve. The maintained Hive HF25 source sets author and curation curves to linear.

An allocation curve is not merely a mechanical detail; it expresses a theory of fairness. A linear curve is proportional but vulnerable to stake-splitting; a superlinear curve resists stake-splitting but grows increasingly unfair to large positions; Vandeberg's convergent-linear form (`n²/(n+1)`) is an attempt to hold both properties at once. Most of what is posted attracts little agreement, and scattered, isolated votes are closer to noise than signal. The convergent-linear curve behaves as a noise filter: in its superlinear region, low-consensus contributions receive practically nothing, so the budget is not spread thinly across everything; as independent evaluations accumulate on the same contribution, rewards grow steeply; and the curve's convergence to linear bounds the amplification, so a heavily-voted contribution keeps earning proportionally but its advantage stops compounding. The curve is thus also a claim about how value is distributed—rare, and concentrated where many independent judgments converge—and it is one implementation of fair aggregation, not the reason the mechanism exists. SWARM's exact curve and constants remain proposed parameters requiring simulation and validation.

The lesson from self-voting is broader than “ban self-votes.” Direct prohibitions can be routed around through alternate accounts, reciprocal arrangements, purchased support, or strategies the rule writer did not anticipate. A mechanism needs a way for stakeholders to dispute allocations, while candidly recognizing that the same power can be abused.

## 4. Reference mechanism

Let reward period `t` have a predetermined new-SWARM budget `B_t`. For each voter `i`, let `S_i,t` be that voter's eligible SWARM balance snapshot for the period. A standard evaluation commits:

`w_i,t = q × S_i,t`

where `q` is a proposed configurable standard-vote fraction. The proposed commitment is an automatic lock, not a transfer to the author. It cannot be transferred or used by another vote before settlement. It supplies the weight `w_i,t` for the signed evaluation.

For contribution `c`, the contract records signed positive and negative evaluation totals, conceptually:

`N_c,t = max(0, P_c,t − D_c,t)`

where `P` and `D` are the respective weighted totals. A deterministic, nonnegative allocation function `F` transforms each eligible net evaluation into an allocation weight. At settlement:

`R_c,t = B_t × F(N_c,t) / Σ F(N_j,t)`

for eligible contributions `j` with positive allocation weight. This is a SWARM reference formula, not an inherited or deployed default. If there are no eligible positive contributions, the treatment of `B_t` must be specified by policy rather than assumed here. Under the proposed nonnegative-allocation invariant, negative or zero-scoring contributions receive no newly created SWARM and a downvote never confiscates previously earned balance; this invariant must be implemented and tested.

Version one pays `R_c,t` only to the contribution's author DID. The curve above concentrates rewards on consensus, but it acts only after votes exist—it pays no one to search out undervalued contributions before that consensus forms. In version one, a voter commits stake and receives nothing for voting; honest evaluation is economically altruistic. Steem's curation rewards addressed exactly this, paying voters in proportion to the eventual reward of what they voted for early and making discovery a paid activity—but they also created one of Steem's worst gaming surfaces: vote-selling bots and automated front-running of prominent authors. Version one therefore defers curator rewards and treats the question as empirical: whether the prototype produces sufficient honest evaluation without paid discovery is one of the things the prototype exists to find out (open question 9 in Section 13). The contract must perform incremental accounting so settlement does not require iterating over all historical votes; the precise data structures remain an implementation-design question.

### Standard votes and the provisional cadence

`q` is measured against the period snapshot, not the balance remaining after earlier votes. Thus, subject to the available snapshot-derived commitment, successive standard votes have equal weight. As an illustration only, `q = 1/24` permits an account fully available at the start of a provisional 24-hour period to make up to 24 equal-strength standard votes. This is not a promise of one vote per hour, a daily load-balancing claim, or a finalized parameter.

The reward period sets the budget, collection interval, settlement event, and lock duration. The prototype assumption is 24 hours because it is legible to users and follows ordinary activity cycles; duration remains configurable.

### Recursive trust—and its limit

At settlement, an author who receives new SWARM can commit it to future evaluations. Recognition can therefore expand the population able to recognize later contributions: **recursive trust allocation**. This does not make SWARM a reputation score. The mechanism does not inherently distinguish earned from purchased tokens once either is eligible to be committed. Purchased capital can buy influence; concentration remains possible. The recursion is a pathway into influence, not a proof that influence is deserved.

## 5. Reference architecture

> **AT Protocol owns identity, content, social context, and distribution. Koinos owns vote-linked token locks, algorithmic token issuance, deterministic reward accounting, and payouts.**

A price is powerful because it compresses an enormous amount of dispersed information into a single number. The chain's role in this design is to carry that compressed layer—commitments, weights, settled allocations—while the information being valued stays on the open social web, where it can be read, copied, revised, and distributed. Earlier social blockchains stored human-readable text on-chain by default; this design treats that as a category error: the ledger is for the compressed signal, not the raw information.

![Reference architecture: AT Protocol, Proof of Value client and attestation bridge, Koinos contracts, sponsor, and application index.](assets/proof-of-value-architecture.png)

*Figure 1. Reference architecture. The infographic was generated from the deterministic specification in `docs/architecture-diagram-spec.md` and audited against the flows and trust boundaries below. The prose remains authoritative if a later visual revision introduces a conflict.*

AT Protocol provides persistent DIDs, OAuth-based authorized-client login, signed repository records, social context, event streams, AppViews, and feed surfaces. Handles are mutable display names and must be resolved and re-checked rather than used as contractual identity. An evaluated item can be a suitable AT record, including long-form content. For durable accounting, the proposal uses a DID-based AT URI as a locator and preserves the observed record CID and verification evidence as the content-version binding. The URI itself is not content-addressed; records can change or disappear, and repositories permit deletion without tombstones. The initial AT graph supports discovery and context, not contractual eligibility; publication and potential earning do not require advance enrollment.

The proposed SWARM contracts would host token/lock state and reward logic: period budgets, eligible balance snapshots, locked balances, signed evaluations, protected downvote capacity, allocation, author-DID accrual, claims, and canonical events. Koinos provides deterministic contract execution; the issuance schedule, locks, incremental accounting, and settlement algorithm are SWARM code to build and audit. Sponsored transactions can make approved actions free to the sponsored user without requiring that user to hold KOIN, but the sponsor pays finite regenerative Mana. Sponsorship must remain narrowly scoped: it is not authorization for arbitrary transfers or unbounded resource consumption.

An application client displays real AT content and Koinos state, supports AT login, account linking, voting, and claims. A read model called the application index can combine AT metadata with canonical Koinos events to serve a responsive client and a SWARM-ranked feed. It is not the canonical financial record. The prototype ranks content inside a standalone client. A read-only custom feed may later distribute that ranking to AT applications, but AT-side feed distribution is outside the first prototype and a feed alone cannot add voting controls to a standard client.

### The bridge is an explicit trust boundary

A Koinos contract cannot directly resolve or verify AT state. An off-chain attestation bridge observes or retrieves records, verifies the needed AT evidence, and attests an observed DID, record URI, CID, and verification evidence to the contract. The contract then deterministically applies published SWARM rules to accepted attestations. The URI locates the record; the observed CID binds the referenced version. The bridge should expose health, cursor, and attestation history. Streams can have bounded backfill or best-effort delivery, so the bridge needs recovery and reconciliation. The separate application index is only a noncanonical client read model.

The bridge must not calculate evaluations, apply `F`, mint SWARM, select recipients, or determine payout amounts. Those consequences belong to deterministic Koinos contract logic. Even so, the bridge can omit, delay, or mis-attest content unless independently checked. That residual authority must be disclosed, made observable, and designed to be replaceable; it is not erased by calling the system decentralized.

## 6. End-to-end flows

### Register and evaluate

1. The attestation bridge observes or retrieves a candidate AT record, verifies the relevant DID/repository evidence, and preserves the DID-based URI, observed CID, and evidence needed for review.
2. The bridge attests those observed facts to Koinos; the contract accepts an attestation according to its published rules rather than directly verifying AT authorship.
3. The client shows the content, the relevant period state, available SWARM, locked SWARM, and pending allocation.
4. A voter selects an upvote or downvote and authorizes an approved Koinos operation. A sponsor may supply chain-resource Mana within explicit rate and resource limits.
5. The reward contract snapshots or uses the period's eligible balance, commits and locks `q × S_i,t`, records a signed positive or negative evaluation, and emits events.
6. The application index reflects the pending state from the canonical events.

### Settle

1. The issuance schedule makes `B_t` available for the closed period.
2. The reward contract applies its deterministic allocation function to eligible net-positive contributions and normalizes their weights.
3. It credits the resulting allocations to author DIDs only, according to the configured payout policy.
4. It unlocks the SWARM committed by votes in the period. A recipient's newly earned balance may be eligible in a later period.

### Link and claim

An author need not link an account before publication or voting. Rewards accrue to the author DID. To claim, the user authenticates control of the DID, receives a nonce-bound challenge naming the intended Koinos account, signs with that account, and submits an accepted link attestation. Replay protection, expiry, replacement, and recovery require explicit protocol rules before implementation.

### Edits and deletions

The evaluated object is a DID-based AT URI paired with an observed CID and verification evidence. A later edit has a new CID and is a distinct evaluated version unless a future policy says otherwise. An AT deletion can remove the record without a tombstone; it does not retroactively erase already recorded Koinos accounting, but neither the URI nor the repository alone guarantees continued availability of the content.

## 7. Downvotes: contestable, bounded allocation

An upvote says, in effect, “allocate more of this period's shared issuance here.” A downvote says, “this pending allocation is inconsistent with what this community intends to reward.” Downvotes are therefore a general contestability mechanism, not merely an anti-spam switch.

Version one uses protected but bounded downvote capacity. The protected reserve matters because otherwise a rational participant may conserve all ordinary capacity for positive allocation. The bound matters because negative evaluation can become retaliation, factional warfare, incumbent protection, or suppression of unpopular speech. Its configured size, relationship to ordinary voting capacity, and the exact way it is consumed require final mechanism specification. In all cases, negative evaluation affects pending new issuance only; it must not seize earlier balances.

## 8. Threat model and governance limits

SWARM changes incentives but does not solve social coordination or plutocracy. The relevant threats and limits include:

- **Capital concentration and purchase:** larger holders, including purchasers, can commit more weight, and within a single token concentration remains possible; locking prevents immediate reuse but does not equalize ownership. The design's answers are contest and exit: bounded downvote capacity lets stakeholders contest allocations from within, and because the mechanism is not a monopoly, a community that regards a token's allocation as captured can launch a parallel token under the same mechanism (Section 12) rather than petition the incumbent. Concentration can capture a token; it cannot capture the mechanism. The deeper cost of concentration is that the value of collective valuation comes from aggregating many independent vantages; a mechanism dominated by a few holders is measuring fewer perspectives, which degrades the very signal the mechanism exists to produce.
- **Collusion and self-dealing:** reciprocal voting, alternate accounts, and paid support can redirect issuance. Downvotes permit contest but cannot guarantee a correct outcome.
- **Bridge error or censorship:** an attestor can delay, omit, or mis-map facts. Attestation transparency, correction rules, and independent verification are required.
- **Sponsor abuse:** free-to-user actions can be spammed or used to reach arbitrary contract paths unless authorization, resource, and rate limits are narrow.
- **Contract upgrades:** Koinos platform functionality is contract-implemented and upgradeable without a hard fork, but that does not automatically make a PoV contract upgradeable. A PoV contract's upgrade design, code/address, controller identity, process, parameter changes, and event history must be explicit.
- **Identity and recovery failures:** DID resolution, account-link replacement, replay, and compromised credentials can produce incorrect claims without carefully defined recovery rules.
- **Indexing and interface capture:** a feed or client can hide content even if it cannot alter canonical payouts. Independent read models and event reconstruction reduce, but do not remove, this risk.

No claim of “decentralized purity” follows from this architecture. The design makes authority boundaries legible so they can be constrained, audited, and improved.

## 9. Bootstrap and initial distribution

The prototype should use one valueless SWARM test token on Koinos's Harbinger testnet. Harbinger is restartable, so the implementation must retrieve and disclose its fresh chain ID rather than hard-code one or imply permanence. Initial distribution is an open design decision and must be disclosed before any live evaluation period. A credible bootstrap plan should specify who receives initial voting influence, under what limits, what disclosures apply to operators and early recipients, and how any privileged balances or upgrade rights are sunset or reviewed.

The bootstrap objective is to test the complete loop—not to establish price, liquidity, or a reserve asset. An initial allocation should therefore be small, inspectable, and sufficient to exercise both positive and negative evaluation. It should not imply a public sale, investment return, or monetary value.

## 10. Prototype boundary

The first prototype proposes to demonstrate real information hosted on AT Protocol, AT login, Koinos account linking, sponsored upvotes and downvotes, vote-linked locks, deterministic reward accounting, author-DID accrual, claims, and ranking inside the standalone PoV client. Returning that ranking to AT distribution surfaces is deferred. The intended boundary is Harbinger testnet, using its then-current chain ID, and one valueless token.

It does not host social information, build a general social network, launch mainnet economics, create multiple currencies, add an AMM, establish a DAO, raise funds, create a separate reputation score, or claim that collusion has been solved. Exact wallet, authorization, attestation, contract, and recovery choices remain genuine implementation-design questions.

## 11. Related work

The closest lineage is Steem's Subjective Proof of Work and its subsequent reward-curve and downvote design work. SWARM retains the insight that a community can allocate bounded issuance through judgments while separating that mechanism from a vertically integrated social chain.

AT Protocol contributes portable identity and an open social-data architecture. Koinos contributes a programmable-chain setting with Mana resource accounting, payer/payee sponsorship, programmable authority, and contract-based platform upgradeability. These systems are inputs to the reference design, not endorsements or guarantees that every proposed SWARM integration is already available in the required form.

## 12. Plural currencies: a deferred vision

People form higher-level bodies—communities, companies, cooperatives, nations—by sharing information, and each such body can have its own idea of what information is valuable. A long-term PoV ecosystem could let each operate its own token and reward mechanism around that idea, making social valuation more local and legible than one universal ranking system. Plural tokens are also the systemic check on capture described in Section 8: exit, alongside the downvote's voice. Plurality also introduces fragmentation, governance complexity, liquidity questions, and opportunities for confusion or extraction.

Version one deliberately defers token factories, user-configurable mechanisms, AMMs, reserve-asset roles, and cross-currency routing. The first task is to make one complete mechanism intelligible and testable.

## 13. Open questions

The following require explicit resolution before a production implementation or publication as a final specification:

1. What exact issuance rate, curve constants, downvote-reserve percentage, payout policy, period duration, and `q` are justified by evidence and simulation?
2. What is the smallest on-chain representation of an AT URI, CID, and author DID, and can registration be safely combined with a first vote?
3. Which evidence does an attestor submit, can independent attestors provide equivalent evidence, and how are incorrect or censored attestations corrected without rewriting history?
4. Which Koinos authorization and wallet flows safely support narrowly scoped sponsorship, account linking, and recovery?
5. Which events are sufficient for an independent indexer to reconstruct issuance, locks, evaluations, allocations, and claims?
6. How should an empty eligible set, insufficient snapshot-derived balance, vote changes, duplicate content references, and conflicting DIDs be handled?
7. What bootstrap distribution and upgrade-controller policy are legitimate for a test and how are they sunset, reviewed, or replaced?
8. What adversarial simulation and user research are necessary before economic parameters are promoted beyond a prototype?
9. Does the version-one mechanism produce sufficient honest evaluation without paid discovery, or do curator rewards need to be reintroduced—and can that be established from prototype behavior before economic parameters are promoted?

## 14. Conclusion

SWARM proposes a modest but consequential separation of concerns: open social identity and information on AT Protocol; deterministic, stake-linked accounting and settlement on Koinos; and an explicit bridge that carries facts rather than deciding value. A fixed period budget, locked vote-linked stake, signed positive and negative evaluations, nonnegative author-only allocations, and settlement-time unlock together create a concrete way to make subjective judgments distribute shared issuance.

The mechanism is not neutral, objective, or immune to capital and social power, but at root it prices information that markets cannot. Its value lies in making its allocation rule and its authorities visible, contestable, and testable. The next standard is not rhetoric about decentralization; it is a prototype that completes one cross-protocol reward cycle with inspectable events and clearly bounded trust.

## References

1. Vandeberg. [Reward Curve Deep Dive](https://steemit.com/steem/@vandeberg/reward-curve-deep-dive).
2. Vandeberg. [Downvote Pool Deep Dive](https://steemit.com/steem/@vandeberg/downvote-pool-deep-dive).
3. OpenHive Network. [Hardfork logic (HF21 and HF25)](https://github.com/openhive-network/hive/blob/master/libraries/chain/database_hardfork.cpp).
4. OpenHive Network. [Reward-curve implementation](https://github.com/openhive-network/hive/blob/master/libraries/chain/util/reward.cpp).
5. OpenHive Network. [Protocol configuration](https://github.com/openhive-network/hive/blob/master/libraries/protocol/include/hive/protocol/config.hpp).
6. AT Protocol. [Protocol overview](https://atproto.com/specs/atp).
7. AT Protocol. [DID specification](https://atproto.com/specs/did).
8. AT Protocol. [Repository specification](https://atproto.com/specs/repository).
9. AT Protocol. [AT URI scheme](https://atproto.com/specs/at-uri-scheme).
10. AT Protocol. [OAuth specification](https://atproto.com/specs/oauth).
11. AT Protocol. [Event Stream specification](https://atproto.com/specs/event-stream).
12. AT Protocol. [Sync specification](https://atproto.com/specs/sync).
13. Koinos Documentation. [Mana overview](https://docs.koinos.io/overview/mana/).
14. Koinos Documentation. [Resource management](https://docs.koinos.io/developers/resource-management/).
15. Koinos Documentation. [Payer/payee semantics](https://docs.koinos.io/developers/payer-payee/).
16. Koinos Documentation. [Authority](https://docs.koinos.io/developers/authority/).
17. Koinos Documentation. [Smart contracts overview](https://docs.koinos.io/overview/smart-contracts/).
18. Koinos Documentation. [Deploying a contract](https://docs.koinos.io/developers/deploy-contract/).
19. Koinos Documentation. [Testnet](https://docs.koinos.io/developers/testnet/).
