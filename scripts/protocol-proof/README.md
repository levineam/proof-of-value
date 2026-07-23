# scripts/protocol-proof

Operator scripts coordinating the two bounded, credentialed Harbinger writes
that produce the cross-protocol proof: the fact attestation and the
separately authorized evaluation.

## Single responsibility

> "Select a real public AT URI, re-observe it through the trusted bridge
> immediately before submission, and submit its DID, URI, CID, signed
> observation time, and verification evidence under the configured attestor
> authority. After the contract accepts that attestation under the configured
> freshness policy, submit a separate development evaluation referencing it.
> Generate the versioned proof manifest from both authorities, commands,
> transactions, blocks, decoded events, immutable deployed-code hash, source
> revision, and reproducible build provenance."
> — plan U7 approach, `docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`

These scripts are maintainer-only operator tooling, not a pull-request CI
gate: credentialed Harbinger attestation and evaluation are operator actions
that ordinary contributors and CI must be able to verify the *public
evidence* of without ever holding the attestor, evaluator, or upgrade
credentials themselves. The browser and every collaborator-facing deployment
never receive these credentials or an arbitrary sponsored-transaction path.

## Will provide

- A script to re-observe a selected AT record and submit the signed fact
  attestation under the configured attestor authority.
- A script to submit the separately authorized evaluation referencing an
  accepted attestation.
- A manifest-generation step recording both authorities' transactions,
  blocks, decoded events, immutable deployed-code hash, source revision, and
  reproducible build provenance into `tests/protocol-proof/manifest.json`.
- A re-proof path for after a Harbinger chain reset, retaining the prior
  manifest as labeled history rather than deleting it.

## Built by

**U7** (Reproducible AT-to-Harbinger protocol proof).

## Status

Status: scaffold — not yet implemented. No proof has been recorded yet.
