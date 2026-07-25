# Roadmap

This roadmap tracks the nine implementation units from
`docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`, the
plan governing the collaboration-ready PoV developer preview. Status here
reflects what is actually built versus designed — never product completion.

## Sequencing

1. Reproducible toolchain + Koinos feasibility proof (U1).
2. Shared protocol and application contracts (U2).
3. Web experience, live AT adapter, Koinos foundations, and bridge/index in
   parallel (U3-U6).
4. Cross-protocol proof, then the read-only collaborator preview (U7, U9).
5. Contributor documentation and maturity labeling against the working
   repository (U8).

## Units

### U1. Reproducible repository and toolchain foundation — **done**
Turn the document repository into a cloneable workspace and prove the current
Koinos compile/deploy/event path before shared schemas harden around it.
**Status:** npm workspace and root tooling exist; the mockup source is
tracked (`design/mockup/`); `contracts/koinos/spike/` builds and passes its
test, with a probe script for deploying and decoding one event against a Koinos
test network (the originally documented Harbinger endpoints are no longer
served; the probe targets the current community testnet).

### U2. Versioned protocol and application contracts — designed, not built
Define the stable protobuf, JSON, manifest, and application-view seams that
let all four implementation tracks work independently.
**Status:** `spec/protocol/`, `spec/vectors/`, `packages/protocol/`, and
`packages/application-contracts/` are scaffolded (README + inert
`package.json`, one placeholder JSON Schema stub). No schemas, vectors, or
implementations exist yet.

### U3. Real public AT read adapter — designed, not built
Retrieve and normalize real AT content for the feed while preserving exact
version provenance.
**Status:** `packages/at-adapter/` is scaffolded. No adapter code exists yet.

### U4. Import and refine the feed experience — mockup exists, not yet integrated
Bring the existing mockup into the repository and turn it into a polished
developer-preview surface backed by application interfaces.
**Status:** the standalone mockup (`design/mockup/`) is built and running with
browser-local state and a hard-coded reward calculation; it has not yet been
reconstructed into `apps/web/` against `@pov/application-contracts`. A
skeletal `apps/web/app` directory exists but is not yet the integrated
preview.

### U5. Upgradeable Koinos contract foundations — designed, not built
Fully implement the PoV attestation/evaluation foundation and produce
bounded, compiling token and identity foundations for architectural review.
**Status:** `contracts/koinos/pov/`, `contracts/koinos/token/`,
`contracts/koinos/identity/`, and `contracts/koinos/test-vectors/` are
scaffolded (README only — these are AssemblyScript projects, not npm
workspaces). Only `contracts/koinos/spike/` (a feasibility scaffold, not this
unit's deliverable) is built and tested today.

### U6. Bridge, index, and application-service boundary — designed, not built
Join normalized AT observations and versioned Harbinger events into a
noncanonical product view.
**Status:** `packages/app-index/` and `packages/application/` are scaffolded.
No projection, decoding, or query code exists yet.

### U7. Reproducible AT-to-Harbinger protocol proof — designed, not built
Demonstrate the architectural thesis with one real cross-protocol thread
visible in the web client.
**Status:** `tests/protocol-proof/` and `scripts/protocol-proof/` are
scaffolded. No fact attestation or evaluation has been recorded on Harbinger
beyond U1's unrelated feasibility event; no proof manifest exists yet.

### U8. Contributor-facing project package — in progress
Make the repository understandable, reviewable, and inviting to
prospective collaborators.
**Status:** `ARCHITECTURE.md`, this `ROADMAP.md`, and `CONTRIBUTING.md` exist.
`docs/development/getting-started.md`, `component-map.md`, `open-questions.md`,
`demo-script.md`, `upgrades.md`, and `.github/CODEOWNERS` are not yet written.
The outbound license is **MIT** (`LICENSE`). Inbound contribution terms (plan
R23) still need to be stated before external contributions are accepted.

### U9. Collaborator-facing read-only deployment — designed, not built
Give prospective contributors a low-friction hosted view of the feed and
protocol evidence without widening signing or operational authority.
**Status:** not started. No deployment exists yet, hosted or otherwise.

## What "done" means here

"Done" above means the unit's stated verification passed for what currently
exists — not that the product works end to end. Per the plan's Definition of
Done, unfinished OAuth, comments, wallet, sponsorship, settlement, and claim
capabilities remain identified as design-only or deferred wherever they
appear, and no UI, API, document, or demo represents design-only or
test-fixture state as live protocol state.
