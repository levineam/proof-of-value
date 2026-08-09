# PoV evaluation and settlement

**Maturity: proposed; local Koinos spike implemented; live Koinos proof blocked.** The spike builds and passes a local event test, but no testnet deploy/invoke/event-retrieval round trip or product settlement exists.

## Goal and boundary

Make evaluation and allocation provenance replaceable without confusing four distinct evidence levels: **fixtures** (design examples), **local Koinos spike** (feasibility evidence), **Harbinger proof** (separate cross-protocol attestation and evaluation proof), and **live settlement** (blocked product gate). PoV state is separate from the AT content record and must identify its source.

## Prerequisites and owned areas

- Depend on URI-plus-CID content views, provenance contracts, and the existing Koinos spike. Own proposed evaluation/settlement interfaces, fixtures, vectors, and bounded contract-proof documentation in `packages/`, `contracts/koinos/`, and `tests/` as applicable.
- Upstream contracts: **R5, R8, R10-R11, R14, R16-R19; F3-F4; AE3-AE5; KTD5, KTD7, KTD9-KTD11.**

## Non-goals and open questions

Do not choose token economics, period, curve, budget, downvote semantics, sponsorship, wallet custody, or live settlement. Do not present points, fixtures, projected allocations, local tests, or Harbinger evidence as a live reward. Harbinger's live proof remains a separate blocked dependency, not a prerequisite for the other four tracks.

## Koinos Nicknames deferred gate

Nicknames are only an optional display alias beside a verified Koinos address. They are never a Swarm handle, AT identity, record key, ownership proof, or authorization input. Before adoption, document and approve: source/license; expected network, contract address, code hash, and upgrade authority; resolver availability/freshness and alias-to-address binding; normalization, collisions, and ownership/transfer behavior; network cost and SDK support. If any check fails or cannot be verified, safely suppress the alias and show no substitute identity claim; a future UI that does show one must show the underlying verified address beside it.

## Acceptance examples

- A fixture-backed evaluation labels content, index, and PoV sources independently and never calls pending allocation live settlement.
- A changed/deleted CID keeps historical evaluation provenance without making its old body current.
- A nickname-only value is rejected for authorization or DID linkage.

## Verification and coordination

Run the relevant vector/package tests plus `npm run contracts:build` and `npm run contracts:test` when changing the spike; expected result: local proof passes without presenting any settlement as live. Record exact results. Coordinate CID/lifecycle semantics with Feed index, member identity with AT account, and cohort rules/metrics with Product research.
