# tests/protocol-proof

The reproducible AT-to-Harbinger cross-protocol proof test harness: the
checked-in test suite that verifies one real AT content version traces
through a fact attestation, a referenced evaluation, the application index,
and the post-detail screen.

## Single responsibility

> "Demonstrate the architectural thesis with one real cross-protocol thread
> visible in the web client... Re-running read-only verification against the
> same transaction produces the same evidence view."
> — plan U7 goal and test scenario, `docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`

This harness exercises the read-only half of the proof (the part any
contributor or CI can run without credentials): validating the checked-in
proof manifest (`tests/protocol-proof/manifest.json`, planned) against the
`@pov/protocol` schema, replaying it through `@pov/app-index`'s
proof-verification policy, and asserting the current/pending/unverified/
quarantined/stale-chain-epoch/missing/invalid classification is exactly what
the versioned verifier policy requires. It does not itself perform the
credentialed Harbinger writes — those are operator actions coordinated by
`scripts/protocol-proof/`.

## Built by

**U7** (Reproducible AT-to-Harbinger protocol proof), depending on U3-U6.

## Status

Status: scaffold — not yet implemented. No proof has been recorded yet; the
only built-and-tested on-chain artifact today is the U1 feasibility spike in
`contracts/koinos/spike/`.
