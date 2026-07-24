# Test vectors

Golden command/event vectors that the Koinos contracts and the `@pov/app-index`
decoder both conform to.

`test-vectors/` is a designed scaffold, not yet populated. The only
built-and-tested Koinos contract in this repository is
`contracts/koinos/spike/`.

## Single responsibility

> "Add positive and negative vectors that compare one normalized protobuf
> re-encoding with the semantic JSON mapping; exact wire-byte equality is
> required only for signed or hashed messages using the pinned deterministic
> encoder."
> — plan U2 approach, `docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`

These vectors are the shared proof that the PoV contract's protobuf
encodings and the off-chain application index's JSON decoding agree, without
requiring the Koinos generator at test time in ordinary CI (`npm run
vectors:check`). They cover attestation and evaluation acceptance/rejection
cases (duplicate, unknown-attestation-reference, wrong network, closed
period) and reward-invariant cases (equal-weight lock, protected downvote
capacity, nonnegative allocation, zero issuance for an empty eligible set).

## Built by

**U2** (Versioned protocol and application contracts) defines the vector
format and initial cases; **U5** (Upgradeable Koinos contract foundations)
extends them with contract-specific attestation, evaluation, and reward-vector
cases as the PoV contract is implemented.

## Status

Status: scaffold — not yet implemented.
