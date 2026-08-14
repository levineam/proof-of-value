# scripts/protocol-proof

Operator scripts coordinating the two bounded, credentialed Harbinger writes
that produce the cross-protocol proof: the fact attestation and the
separately authorized evaluation.

## Single responsibility

The intended workflow selects a real public AT URI, re-observes it before
submission, records the associated DID, URI, CID, observation time, and
verification evidence under an attestor authority, then records a separately
authorized evaluation. It produces a versioned proof manifest that includes
the transactions, decoded events, deployed-code hash, source revision, and
build provenance.

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

## Role in the foundation

This is the proposed reproducible AT-to-Harbinger protocol-proof workflow.

## Status

Status: scaffold — not yet implemented. No proof has been recorded yet.
