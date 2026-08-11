# Proof of Value source audit

**Audit date:** 2026-08-09
**Scope:** factual support for the first white paper; this is not a mechanism specification. Sources below are primary protocol documentation, maintained protocol code, or the original Vandeberg posts. A claim marked **proposal** must never be worded as an existing capability of AT Protocol, Koinos, Steem, or Hive.

For the current Swarm foundation, an ordinary `app.bsky.feed.post` and its AT
identity are the canonical content facts. Swarm owns admission, ranking,
moderation, PoV evaluation, and allocation as application facts; Koinos remains
a deferred reference settlement path. Koinos Nicknames may be evaluated later
as a display alias beside a verified settlement address, never as an AT link,
Swarm identity, record key, or authorization mechanism.

## Writer rules

1. Say **“free to the sponsored user”** or **“no per-transaction token fee”**, not unqualified “fee-less.” Koinos transactions consume regenerative Mana tied to KOIN; a sponsor bears that finite resource cost.
2. Say **“informed by Vandeberg’s convergent-linear proposal and the later protected-downvote design”**, not “Hive currently uses convergent-linear.” Hive HF25 source changes both author and curation curves to `linear`.
3. Present `q`, the 24-hour period, stake locks, DID accrual, author-only rewards, and the reward formula as **SWARM design choices**. They are not inherited, verified defaults.
4. Distinguish an AT record locator from an immutable content reference: a DID-based AT URI identifies a record but is not content-addressed; pair it with the observed record CID and preserve verification evidence.

## Claim-to-source map

| Paper claim | Status and required wording | Primary source |
| --- | --- | --- |
| AT Protocol has persistent DIDs; handles are mutable display names; a DID resolves keys and a PDS location. | **Verified.** Use the DID as the contractual identity; resolve and re-check handles. | [AT Protocol overview](https://atproto.com/specs/atp), [DID spec](https://atproto.com/specs/did) |
| AT repositories are public, self-certifying, content-addressed Merkle trees; commits are signed with rotatable keys; records have CID links. | **Verified, with deletion caveat.** Repositories support deletion without tombstones. Do not claim permanent availability or an irrevocable public history. | [Repository spec](https://atproto.com/specs/repository) |
| “AT URI + CID identifies an exact content version.” | **Qualified.** A DID-based AT URI locates a record; it is *not* content-addressed and the record can change or disappear. The observed CID is the content-version binding. Do not use handle-based AT URIs for durable accounting. | [AT URI spec](https://atproto.com/specs/at-uri-scheme), [Repository spec](https://atproto.com/specs/repository) |
| OAuth establishes control of an AT DID. | **Verified, but security-sensitive.** OAuth is the primary authorized-client mechanism and returns the DID in `sub`; the client must resolve identity and verify the authoritative server and expected `sub`. OAuth alone does not prove a Koinos-account link. | [AT OAuth spec](https://atproto.com/specs/oauth) |
| AT offers extensible Lexicons, AppViews/custom aggregation, and event streams/firehose-style indexing. | **Verified.** AT leaves social conventions to applications; AppViews and clients must implement the experience. Describe a SWARM feed as an application/AppView output, not a protocol-native ranking guarantee. Streams have bounded backfill and can be best-effort; indexers need recovery/reconciliation. | [AT Protocol overview](https://atproto.com/specs/atp), [Event Stream spec](https://atproto.com/specs/event-stream), [Sync spec](https://atproto.com/specs/sync) |
| Koinos is “fee-less.” | **Overstated.** Koinos documents Mana as regenerative and tied to KOIN; contracts consume it. A sponsor can make an approved action free to the user, but pays Mana and needs rate/resource limits. | [Koinos Mana](https://docs.koinos.io/overview/mana/), [resource management](https://docs.koinos.io/developers/resource-management/) |
| Koinos payer/payee sponsorship removes a single-payer nonce bottleneck. | **Verified.** With both fields, payer covers Mana, payee nonce is used, and *both* authorize. The sponsor must inspect/restrict the action because its assets/resources are exposed. | [Payer semantics](https://docs.koinos.io/developers/payer-payee/) |
| Koinos supports programmable authority and upgradeable contracts. | **Verified with boundary.** An address can delegate authority checks to a contract; system functionality is contract-implemented and upgradeable without a hardfork. This does not make a PoV contract automatically upgradeable: its code/address and upgrade controller must be specified and disclosed. | [Authority](https://docs.koinos.io/developers/authority/), [smart contracts](https://docs.koinos.io/overview/smart-contracts/) |
| Koinos contracts can deterministically settle SWARM issuance/accounting. | **Supported as a proposal.** Koinos documents deterministic KVM execution and contract deployment. The exact issuance schedule, token authority, locks, incremental accounting, and settlement algorithm are SWARM code to build and audit—not a Koinos feature claim. | [Koinos smart contracts](https://docs.koinos.io/overview/smart-contracts/), [deploying a contract](https://docs.koinos.io/developers/deploy-contract/) |
| A Koinos testnet is available for the prototype. | **Verified, contingent.** Koinos Group provides Harbinger; retrieve its fresh chain ID because it may restart. Do not hard-code a testnet ID or imply permanence. | [Koinos testnet](https://docs.koinos.io/developers/testnet/) |
| Steem/Vandeberg supplies the economic lessons: voting Mana, a delayed reward allocation, curve design, and a separate protected downvote pool. | **Verified as historical design/proposal material.** Cite the original posts directly; describe their stated model, not a timeless or current-chain fact. | [Reward Curve Deep Dive — Vandeberg](https://steemit.com/steem/@vandeberg/reward-curve-deep-dive), [Downvote Pool Deep Dive — Vandeberg](https://steemit.com/steem/@vandeberg/downvote-pool-deep-dive) |
| Convergent-linear is `n²/(n+1)`. | **Historical proposal, not exact current Hive implementation.** Vandeberg’s post uses that explanatory form. Hive’s on-chain `convergent_linear` implementation was parameterized by a content constant, and HF25 later set author and curation curves to linear. Avoid equating the post’s normalized formula with current chain code. | [Vandeberg post](https://steemit.com/steem/@vandeberg/reward-curve-deep-dive), [Hive HF21/HF25 source](https://github.com/openhive-network/hive/blob/master/libraries/chain/database_hardfork.cpp), [Hive curve implementation](https://github.com/openhive-network/hive/blob/master/libraries/chain/util/reward.cpp) |
| Hive currently has a bounded protected downvote capacity. | **Verified from maintained source, subject to live chain configuration.** HF21 set the configured pool to 25%; votes use downvote Mana first and then regular voting Mana. Say “the maintained protocol source sets the HF21 default to 25%,” not “all Hive deployments always have 25%.” | [Hive configuration](https://github.com/openhive-network/hive/blob/master/libraries/protocol/include/hive/protocol/config.hpp), [Hive HF21 logic](https://github.com/openhive-network/hive/blob/master/libraries/chain/database_hardfork.cpp), [Hive vote evaluation](https://github.com/openhive-network/hive/blob/master/libraries/chain/hive_evaluator_social.cpp) |
| Downvotes reduce pending rewards rather than confiscating prior balances. | **Safe only as a SWARM rule.** It follows from a non-negative SWARM allocation floor; it is not proven merely by borrowing Steem/Hive terminology. State it as the proposed contract invariant and test it. | SWARM proposal; historical context: [Steem repository](https://github.com/steemit/steem) |

## AT-to-Koinos proof boundary

The paper should be explicit that the following are different classes of fact:

| Koinos contract can verify once submitted | Requires an off-chain verifier/attestor (or a future on-chain proof verifier) |
| --- | --- |
| Koinos signatures/authority, transaction ordering, contract state, stored AT URI/CID/DID bytes, vote amount and lock state, period close, arithmetic, mint/credit/claim rules, and emitted events. | DID resolution at a chosen time; handle-to-DID resolution; PDS location; repository commit signature and Merkle proof; that a URI resolved to the submitted CID; record lifecycle/deletion; OAuth session/DID control; and completeness/timeliness of the firehose/index. |

Therefore write: **“The bridge attests an observed DID, record URI, CID, and verification evidence to the contract; the contract deterministically applies the published SWARM rules to accepted attestations.”** Do **not** write “the contract verifies AT Protocol authorship/content” unless the implementation includes and documents an on-chain verifier for the necessary DID, repository, and inclusion proofs. A bridge can censor, delay, omit, or mis-attest facts; deterministic on-chain reward math limits that authority but does not remove it.

## Required citations and disclosure notes

- Cite the AT specifications in the architecture section; do not cite a Bluesky product page as if it were the protocol specification.
- Cite the Koinos docs for Mana, payer/payee, authority, and testnet; disclose sponsor operator, permitted calls, Mana budget/rate limits, and upgrade controller.
- Cite Vandeberg for the historical argument and OpenHive source for current Hive behavior. Steem, Hive, and the SWARM prototype have different parameters and should never be described as the same mechanism.
- Label the following as open implementation questions, not facts: minimum on-chain encoding; registration-plus-vote atomicity; independent attestors; correction/appeal path; DID-to-Koinos account recovery; exact claim authorization; and event schema needed for independent reconstruction.
