# Contributing to Proof of Value

This is a collaboration-oriented repository: the goal right now is not a
finished product but a **collaboration-ready developer preview** — a repo where
another engineer can
understand the vision, run what exists, inspect the protocol boundaries, and
find a concrete place to help.

This document explains how the work is organized and where to start.

## Active contributor path

Start with [the bounded Swarm workstreams](docs/workstreams/README.md). They
are the active August 2026 contributor entry point and map each track to the
current plan's R/F/AE/KTD contracts, maturity, objective proof, dependencies,
and unresolved decisions. Choose a packet before proposing a code change.

The repository foundation is fixture-first: fixtures, simulations, proposals,
blocked network proof, and deferred operations must be labeled at their
boundary. No packet authorizes live account provisioning, OAuth, PDS operation,
public post publishing, moderation operation, Koinos settlement, a token
launch, investment product, or public beta.

The [July parallel-workstream map](docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md)
remains protocol-history evidence, including its local Koinos spike and
cross-protocol proof ambition. It is not active product sequencing.

## Running what exists today

The repository now contains a runnable contract foundation and fixture-backed
single-feed shell. Live AT account operations, public reads, admission/index
services, and settlement remain proposed or blocked; read each workstream's
maturity label before treating a boundary as operational.

**Swarm contracts and vectors** (implemented, credential-free):
```sh
npm test --workspace=@pov/protocol
npm test --workspace=@pov/application-contracts
npm test --workspace=@pov/at-client
```

**The Swarm web shell** (implemented fixture, no live writes):
```sh
npm run build --workspace=@pov/web
npm test --workspace=@pov/web
```

**The Koinos feasibility spike** (built, passing test):
```sh
cd contracts/koinos/spike
COREPACK_ENABLE_PROJECT_SPEC=0 yarn install
COREPACK_ENABLE_PROJECT_SPEC=0 yarn build:release
COREPACK_ENABLE_PROJECT_SPEC=0 yarn test
```
See `contracts/koinos/README.md` for the optional credentialed Harbinger
probe.

**The mockup** (implemented browser-local state — historical visual direction,
not protocol authority):
```sh
cd design/mockup
npm install
npm run dev
```

The remaining package directories (`packages/at-adapter`,
`packages/app-index`, `packages/application`, `contracts/koinos/pov`,
`contracts/koinos/token`, `contracts/koinos/identity`, `spec/`, `tests/`,
`scripts/`) contains a README describing what will live there and which unit
builds it — read those before proposing an implementation so your work lands
on the intended seam.

## Before your first change

Please open an issue or discussion naming the workstream packet and bounded
slice before writing code. Shared contracts and policy boundaries require the
coordination points named in that packet. The outbound license is MIT; inbound
contribution terms remain unsettled, so this is an invitation to discuss and
prototype—not to submit unsolicited pull requests. See [ROADMAP.md](ROADMAP.md)
for maturity and [the active plan](docs/plans/2026-08-04-001-feat-swarm-market-entry-foundation-plan.md)
for the governing contracts.
