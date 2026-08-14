# tests/protocol-proof

The reproducible AT-to-Harbinger cross-protocol proof test harness: the
checked-in test suite that verifies one real AT content version traces
through a fact attestation, a referenced evaluation, the application index,
and the post-detail screen.

## Single responsibility

The intended test demonstrates one real cross-protocol thread visible in the
web client and confirms that read-only verification of the same transaction
produces the same evidence view.

This harness exercises the read-only half of the proof (the part any
contributor or CI can run without credentials): validating the checked-in
proof manifest (`tests/protocol-proof/manifest.json`, planned) against the
`@pov/protocol` schema, replaying it through `@pov/app-index`'s
proof-verification policy, and asserting the current/pending/unverified/
quarantined/stale-chain-epoch/missing/invalid classification is exactly what
the versioned verifier policy requires. It does not itself perform the
credentialed Harbinger writes — those are operator actions coordinated by
`scripts/protocol-proof/`.

## Role in the foundation

This is the proposed read-only verification half of the AT-to-Harbinger
protocol proof. It depends on the future public-observation, feed-shell,
index, and application-service boundaries.

## Status

Status: scaffold — not yet implemented. No proof has been recorded yet; the
only built-and-tested on-chain artifact today is the local feasibility spike in
`contracts/koinos/spike/`.
