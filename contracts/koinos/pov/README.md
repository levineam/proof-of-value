# PoV contract

The core PoV contract: fact-attestation acceptance, separately authorized
evaluations, reward-period settlement, pending allocation, and author-DID
reward accrual.

`pov/` is the one contract this plan takes to a fully implemented
attestation/evaluation proof; it is designed but **not yet built**. The only
built-and-tested Koinos contract in this repository today is
`contracts/koinos/spike/`, a feasibility scaffold predating this contract.

## Single responsibility

> "Build the PoV contract's versioned configuration, distinct upgrade,
> attestor, and evaluator authorities, accepted-attestation storage,
> evaluation-by-attestation reference, canonical events, replay protection,
> role rotation and revocation, and compatible upgrade behavior. The attestor
> submits facts and evidence but no evaluation direction; the evaluator
> references accepted facts but cannot alter them."
> — plan U5 approach, `docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`

**The attestation bridge attests facts; this contract applies deterministic
rules — it never trusts the bridge to compute rewards.** The bridge (built
outside this directory) can only submit an observed DID, AT URI, CID, and
verification evidence; it is explicitly forbidden from computing evaluations,
applying the reward allocation curve, minting, or choosing recipients (see
WHITEPAPER.md §5, "The bridge is an explicit trust boundary"). Those
consequences belong to this contract's deterministic logic alone.

Stake-lock, downvote, allocation, empty-set, settlement-unlock, DID-accrual,
and claim behavior are implemented here as **pure deterministic invariant
vector functions** in this stage, not deployed public settlement operations
(plan U5) — the deployed surface is bounded to attestation acceptance and
evaluation reference.

## Built by

**U5** (Upgradeable Koinos contract foundations).

## Upgradeable development authority

Per KTD7 and WHITEPAPER.md §8, a disclosed founder-controlled development
authority may upgrade this contract during this stage; contract configuration
can rotate or revoke the attestor and evaluator roles under that upgrade
authority, and each contract change requires a compatibility manifest.
Recovery means a compatible upgrade or a clearly identified replacement
deployment — never a rollback of chain history.

## Status

Status: scaffold — not yet implemented.
