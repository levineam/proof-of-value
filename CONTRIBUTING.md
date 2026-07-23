# Contributing to Proof of Value

Thank you for taking a look. This is a private, collaboration-oriented
repository: the goal right now is not a finished product but a
**collaboration-ready developer preview** — a repo where another engineer can
understand the vision, run what exists, inspect the protocol boundaries, and
find a concrete place to help.

If you're reading this, you likely already have repository access. This
document explains how the work is organized so you can find your track
quickly.

## The parallel-workstream model

The plan behind this repository (`docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`)
deliberately sequences two narrow gates before opening parallel tracks:

1. **Feasibility gate (U1).** Prove the Koinos toolchain can compile, deploy,
   and retrieve an event from Harbinger before anything else depends on it.
   This is done — see `contracts/koinos/spike/`.
2. **Shared contracts gate (U2).** Freeze the protobuf/JSON protocol seam and
   the application read contract so the tracks below don't have to invent
   their own shared boundary independently. This is designed, not yet built —
   see `spec/protocol/` and `packages/protocol/`.

Once both gates land, four tracks advance **in parallel**, all depending
inward on the same shared contracts:

| Track | Lives in | Owns |
|---|---|---|
| Web experience | `apps/web/` | rendering + provenance labels |
| AT integration | `packages/at-adapter/` | normalization of live AT reads |
| Bridge & index | `packages/app-index/`, `packages/application/` | event decoding, product-view assembly |
| Koinos foundations | `contracts/koinos/pov/`, `contracts/koinos/token/`, `contracts/koinos/identity/` | attestation/evaluation acceptance, event conformance |

They converge in **U7**, a reproducible AT-to-Harbinger cross-protocol proof
(`tests/protocol-proof/`, `scripts/protocol-proof/`), then ship as a
**U9 read-only hosted preview** with no signer or operator route.

See `ROADMAP.md` for the full unit sequence and current status of each.

## Two decisions worth knowing before you start

- **Collaboration-ready foundation before user beta.** This preview does not
  need every product flow to operate end to end; it needs to demonstrate the
  vision, the engineering boundaries, and real protocol feasibility well
  enough to recruit collaborators.
- **Protocol-grounded evidence over simulation.** Test fixtures prove
  deterministic behavior, but product credibility here comes from code that
  actually reads or writes AT Protocol and Koinos — not from a fixture-backed
  demo dressed up as a working product. Anything not yet protocol-grounded is
  labeled design-only or deferred, never presented as live.

## Running what exists today

Two things in this repository are actually built and tested; everything else
described above is a scaffold or design surface, not yet built.

**The Koinos feasibility spike** (built, passing test):
```sh
cd contracts/koinos/spike
COREPACK_ENABLE_PROJECT_SPEC=0 yarn install
COREPACK_ENABLE_PROJECT_SPEC=0 yarn build:release
COREPACK_ENABLE_PROJECT_SPEC=0 yarn test
```
See `contracts/koinos/README.md` for the optional credentialed Harbinger
probe.

**The mockup** (built, browser-local state — visual direction only, not
protocol authority):
```sh
cd mockup
npm install
npm run dev
```

Every other directory (`packages/*`, `contracts/koinos/pov`,
`contracts/koinos/token`, `contracts/koinos/identity`, `spec/`, `tests/`,
`scripts/`) contains a README describing what will live there and which unit
builds it — read those before proposing an implementation so your work lands
on the intended seam.

## Before your first change

Please open an issue or discussion describing which track and unit you're
picking up before writing code — the shared contracts (U2) are the one piece
everything else depends on, so changes there need coordination. Outbound
license and inbound contribution terms will be declared before any external
contribution is accepted (plan R23); until then, treat this as an invite to
discuss and prototype, not to open unsolicited pull requests.
