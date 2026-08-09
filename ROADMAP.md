# Roadmap

The active roadmap is the [Swarm Market Entry Foundation plan](docs/plans/2026-08-04-001-feat-swarm-market-entry-foundation-plan.md).
It supersedes the July parallel-prototype plan for product sequencing while
preserving that plan as protocol-history evidence.

## Current sequence

1. **U1 — durable product story:** make one self-referential Swarm feed the
   repository front door and label older artifacts as history. **Implemented
   foundation story:** the repository narrative, product brief, architecture,
   roadmap, and durable context now describe the Swarm market-entry boundary;
   it does not make a feed runnable.
2. **U2 — contracts and fixtures:** define account, ordinary-post, feed
   admission, lifecycle, and provenance boundaries. **Proposed.**
3. **U3 — authorized AT client boundary:** specify safe future member actions
   and the account-hosting production gate. **Proposed.**
4. **U4 — single-feed shell:** replace the web placeholder with a
   fixture-backed, truthfully inert Swarm feed. **Proposed.**
5. **U5 — middle-layer alignment:** reconcile observation, admission, index,
   and application responsibilities. **Proposed.**
6. **U6 — collaborator workstreams:** publish bounded tasks and verification
   surfaces. **Proposed.**
7. **U7 — foundation verification:** add repository-wide truth, link, and
   boundary checks. **Proposed.**

## Current maturity

| Area | State | Evidence and limit |
| --- | --- | --- |
| Single Swarm product | **Proposed** | Product brief and architecture exist; no active single-feed implementation yet. |
| Web application | **Implemented placeholder** | `apps/web` can build, but it is not the Swarm feed. |
| Dual-marketplace mockup | **Simulated historical vision** | Browser-local data and hard-coded calculations in `design/mockup`; no AT or chain connection. |
| AT identity, account, and publishing | **Proposed** | No PDS, OAuth flow, account creation, or live writes. |
| Feed admission and application index | **Proposed** | Existing packages are scaffolds. |
| PoV evaluation and allocation | **Proposed** | Mockup interactions are simulated, not settlement. |
| Koinos spike | **Implemented local feasibility evidence** | Builds and passes its local event test. |
| Live Koinos proof | **Blocked** | No successful testnet deploy, invoke, and event-retrieval round trip. |
| Token economics, moderation operations, and public launch | **Deferred** | Require product and operational decisions not settled here. |

## What success means for this foundation

A collaborator should be able to clone the repository, understand why the first
market is PoV itself, run one coherent fixture-backed feed once U4 lands, trace
the proposed authority boundaries, and select a bounded task. Until those units
are complete, this repository is a documented foundation rather than a working
end-to-end product.

## Preserved history

The [July plan](docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md)
and [design mockup](design/mockup/README.md) remain useful historical artifacts.
They do not authorize a two-marketplace MVP, live AT integration, or a live
Koinos proof.

## Contribution terms

The outbound license is [MIT](LICENSE). Inbound contribution terms remain
unsettled before external contributions are accepted.
