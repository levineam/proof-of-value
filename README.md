This repo is intended as a proof of concept for a blockchain application tentatively titled "Swarm" powered by a social consensus algorithm tentatively titled "proof-of-value." 

## Proof-of-Value

Blockchain consensus algorithms are technical infrastructure: they secure a ledger and meter its resources by charging for transactions. That model suits a financial system well and explains why, more than a decade in, DeFi remains the dominant use case for blockchains. I believe the missing piece may be a **social consensus algorithm**: a decentralized way to leverage the wisdom of the crowd to value an arbitrary piece of information and distribute cryptocurrency according to that valuation. Because it runs on ordinary judgments rather than paid operators, it has to be free to use, require no expertise, and impose no barriers to entry — which is why a chain that charges for every transaction is not ideal.

## SWARM

Proof-of-value is achieved through a stake-weighted autonomous reward mechanism (hence "SWARM"). Accounts are able to influence the distribution of newly created tokens in proportion to their stake in the token and based on their upvotes and downvotes. This is a descendant of the "proof-of-brain" algorithm first released in Steem and still powering Hive. It is my belief that proof-of-brain was both the secret to Steem/Steemit's success, and the seed of its demise. Stake-weighted autonomous reward mechanisms are great for effectively gamifying community growth, however, they are extremely vulnerable to being gamed, amplifying negative emotions, and degenerating into profit-maximizing behaviors. Tie this gamification into the core economics of a blockchain which also contains numerous other components with their own cryptoeconomic imperatives and it's a recipe for disaster.

### Mitigating Gaming

1. Isolation. Unlike with Steem or Hive proof-of-value is just a smart contract running on a general purpose blockchain, hence any issues with this application should be largely irrelevant to the functioning of the blockchain itself. 
2. Upgradeability. When the reward mechanism in Steem or Hive are gamed, any blockchain-level solution must be resolved as a hardfork. By implementing this on a Koinos-based blockchain as a smart contract, we immediately address that issue.
3. Multi-coin. As this will be a smart contract, users are free to launch their own versions with their own rules. This doesn't just act as a check on the developers of the initial implementation, it provides genuine alternatives.

## Prototype App

One of the biggest challenges that Koinos faced was bootstrapping an initial user base. One of the biggest challenges that Steem faced was storing the ever-increasing quantity of text that users contributed to the blockchain which was both low value and costly to store. I propose killing two birds with one stone by simply integrating AT Protocol.

AT Protocol would enable us to tap into an existing community plus existing content management and delivery infrastructure so that we can focus on refining our specific application. Ultimately, this strategy boils down to a hyper-focused implementation of a stake-weighted autonomous reward mechanism made possible by a fee-less general purpose blockchain. 

This repo is more of a thought-experiment than an MVP. It includes a fairly complete set of proposed implementations of the building blocks of this project. The goal is to give people enough insight into the proposal to understand the vision, provide feedback, and ideally begin contributing. 

Read the concise product brief in [docs/product/SWARM_MVP.md](docs/product/SWARM_MVP.md),
then the active market-entry [plan](docs/plans/2026-08-04-001-feat-swarm-market-entry-foundation-plan.md).

## What you can inspect and run

```bash
npm install
npm run verify:foundation
```

This validates the fixture-first foundation without credentials or network
access. It does not connect an AT account, publish a post, or settle a reward.
The commands and their limits are also recorded in [ROADMAP.md](ROADMAP.md).

| Document | What it is |
| --- | --- |
| [docs/product/SWARM_MVP.md](docs/product/SWARM_MVP.md) | Market-entry proposition, first-cohort assumptions, learning goals, and open decisions |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Proposed authority and component map for the single-feed product |
| [ROADMAP.md](ROADMAP.md) | Honest component maturity and the active implementation sequence |
| [WHITEPAPER.md](WHITEPAPER.md) | Mechanism reference: SWARM, its argument, threat model, and unresolved questions |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contributor guidance and review expectations |
| [docs/workstreams/README.md](docs/workstreams/README.md) | Active bounded tracks for AT accounts/publishing, lifecycle/indexing, PoV settlement, operations, and research |

Supporting material: the [primary-source audit](docs/source-audit.md) for
protocol claims, and the [architecture diagram specification](docs/architecture-diagram-spec.md).

## What exists today

- **Implemented:** runnable Swarm feed contracts and vectors, a
  credential-free future member-action boundary, a fixture-backed single-feed
  shell, the standalone historical mockup, and a Koinos spike contract that
  builds and passes a local event test.
- **Simulated:** the shell and mockup's feed state, voting, and allocation
  calculations; they are not AT, Koinos, or live Swarm protocol state.
- **Proposed:** public AT observation, account hosting/provisioning, feed
  admission and indexing, PoV evaluation policy, and settlement architecture.
- **Blocked:** live Koinos testnet deployment, invocation, and event retrieval
  have not yet been proven.
- **Deferred:** production PDS operation, OAuth and account recovery, live
  posting, moderation operations, token economics, and public launch.

The repository gate is **implemented** as `npm run verify:foundation`; it checks
the Swarm schemas/vectors, product-truth surfaces, local Markdown links,
workstream traceability, package boundaries, credential hygiene, and tracked
generated artifacts before running local tests, typechecking, and the web build.

The older [dual-marketplace mockup](design/mockup/README.md) remains a useful
vision and interaction reference. It is not the first product. The July
[parallel-prototype plan](docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md)
remains protocol-history evidence; the August market-entry plan supersedes it
for current sequencing.

To help, choose a packet in the [active workstream guide](docs/workstreams/README.md).
Each packet names its current maturity, owned boundary, dependencies, objective
verification, and the product decisions it may not settle.

## Questions worth helping with

- Which contributions qualify for the first invited cohort?
- How should a project feed admit, exclude, and explain content without
  implying it can remove a public AT record?
- What does a downvote mean, and how should the first cohort handle
  self-dealing, retaliation, and collusion?
- What evidence would show that the loop is useful after a fixed evaluation
  window?

This is not a token launch, fundraise, investment product, or general-purpose
social network. It is an invitation to inspect, challenge, and help build a
small experiment in ordinary participation and stake distribution.

## Current evidence

A Koinos spike contract builds, emits, and decodes an event with a passing
local test. A fixture-backed Swarm feed shell and its supporting contracts run
locally. Public AT observation, account provisioning, live publication, and
settlement remain proposed; see [ROADMAP.md](ROADMAP.md) for the per-unit
breakdown.

## Prior art

Quadratic funding, retroactive public goods funding, reputation-weighted
budgets, peer allocation, contribution-graph scoring, and vote-escrow gauges
all allocate shared budgets by collective judgment. What is unusual here is the
combination of continuous, free-to-participant, open, per-item evaluation in
both directions, which among prior systems only Steem's “Proof of Brain”
achieved. Steem later failed through a mix of chain, governance, and
reward-mechanism failures. This project isolates the mechanism on infrastructure
chosen so it can be evaluated on its own terms. §3 and §11 of the paper make
that case in full.

## License

[MIT](LICENSE). Inbound contribution terms are not yet stated; see
[ROADMAP.md](ROADMAP.md).
