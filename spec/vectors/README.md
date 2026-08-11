# spec/vectors

The golden vectors home: the shared positive and negative test vectors that
`@pov/protocol`, the Koinos contracts (`contracts/koinos/pov/`,
`contracts/koinos/test-vectors/`), and `@pov/app-index` all conform to.

## Single responsibility

> "Add positive and negative vectors that compare one normalized protobuf
> re-encoding with the semantic JSON mapping; exact wire-byte equality is
> required only for signed or hashed messages using the pinned deterministic
> encoder."
> — plan U2 approach, `docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`

These vectors are what lets `npm run verify:foundation` prove that normalized
contract protobuf encodings and mapped JSON views agree on every shared case
— without requiring the Koinos generator at ordinary test time. They will
cover: valid content-reference round-tripping, missing-CID/mismatched-network/
malformed-DID rejection, observation-freshness boundaries, attestation/
evaluation reference validity, and historical-event decodability after a
schema-version bump.

## Built by

**U2** (Versioned protocol and application contracts) establishes the format
and initial vectors; **U5** extends them with contract-specific cases as the
PoV contract is implemented.

## Status

Status: partially implemented — `swarm-feed/` contains executable positive and
negative vectors for publication, admission, lifecycle, tombstones, and safe
application views. Protobuf wire-vector coverage remains proposed.
