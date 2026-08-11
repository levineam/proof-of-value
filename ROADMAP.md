# Roadmap

The active roadmap is the [Swarm Market Entry Foundation plan](docs/plans/2026-08-04-001-feat-swarm-market-entry-foundation-plan.md).
It supersedes the July parallel-prototype plan for product sequencing while
preserving that plan as protocol-history evidence.

## Current sequence

1. **U1 — durable product story:** make one self-referential Swarm feed the
   repository front door and label older artifacts as history. **Implemented
   foundation story:** the repository narrative, product brief, architecture,
   roadmap, and durable context now describe the Swarm market-entry boundary;
   the runnable shell is delivered by U4.
2. **U2 — contracts and fixtures:** define account, ordinary-post, feed
   admission, lifecycle, and provenance boundaries. **Implemented feed subset:**
   runtime validators, vectors, and a safe application view are runnable;
   broader Koinos/protobuf contracts remain proposed.
3. **U3 — authorized AT client boundary:** specify safe future member actions
   and the account-hosting production gate. **Implemented contract boundary:**
   deterministic fakes and safe outcomes exist; live OAuth/PDS operations are
   proposed.
4. **U4 — single-feed shell:** replace the web placeholder with a
   fixture-backed, truthfully inert Swarm feed. **Implemented fixture shell:**
   the app builds and serves one feed; live account, publication, moderation,
   and settlement actions remain inert.
5. **U5 — middle-layer alignment:** reconcile observation, admission, index,
   and application responsibilities. **Implemented boundary documentation:**
   reconciliation rules are explicit; middle-layer runtime services remain
   proposed.
6. **U6 — collaborator workstreams:** five bounded tracks now provide the
   active contributor path, contracts, maturity, prerequisites, non-goals,
   acceptance examples, verification, and coordination points. **Implemented
   documentation foundation:** no underlying live service is implied.
7. **U7 — foundation verification:** repository-wide truth, link, boundary,
   credential-hygiene, and generated-artifact checks run through
   `npm run verify:foundation`. **Implemented credential-free gate:** it runs
   deterministic local package tests, typechecking, and the web build without
   an AT/Koinos network probe.

## Current maturity

| Area | State | Evidence and limit |
| --- | --- | --- |
| Single Swarm product | **Implemented foundation** | Product brief, contracts, fixtures, and one truthfully inert feed shell exist; no live service. |
| Web application | **Implemented fixture shell** | `apps/web` builds and renders one feed; controls are simulated or disabled. |
| Dual-marketplace mockup | **Simulated historical vision** | Browser-local data and hard-coded calculations in `design/mockup`; no AT or chain connection. |
| AT identity, account, and publishing | **Proposed** | No PDS, OAuth flow, account creation, or live writes. |
| Feed admission and application index | **Proposed** | Existing packages are scaffolds. |
| PoV evaluation and allocation | **Simulated / proposed** | The shell and mockup show labeled local values; live policy and settlement are not implemented. |
| Koinos spike | **Implemented local feasibility evidence** | Builds and passes its local event test. |
| Live Koinos proof | **Blocked** | No successful testnet deploy, invoke, and event-retrieval round trip. |
| Contributor workstreams | **Implemented documentation foundation** | Five packets describe bounded proposed work; they do not authorize live operations. |
| Token economics, moderation operations, and public launch | **Deferred** | Require product and operational decisions not settled here; no token launch, investment product, or public beta. |

## What success means for this foundation

A collaborator should be able to clone the repository, understand why the first
market is PoV itself, inspect the documented foundation, trace the proposed
authority boundaries, and select a bounded task from
[docs/workstreams](docs/workstreams/README.md). A coherent fixture-backed feed
still depends on U2-U4; this repository is not a working end-to-end product.

## Preserved history

The [July plan](docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md)
and [design mockup](design/mockup/README.md) remain useful historical artifacts.
They do not authorize a two-marketplace MVP, live AT integration, or a live
Koinos proof.

## Contribution terms

The outbound license is [MIT](LICENSE). Inbound contribution terms remain
unsettled before external contributions are accepted.
