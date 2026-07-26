# Proof of Value

**Public draft for comment.** Not an offer, not investment advice, and not ready for implementation. The mechanism is a proposal; its central questions are open and stated as such.

## Summary

Blockchain consensus algorithms are technical infrastructure: they secure a ledger and meter its resources by charging for transactions. That model suits a financial system well and explains why, more than a decade in, finance is nearly the only thing decentralization has produced. The missing piece may be a **social consensus algorithm**: a decentralized way to leverage the wisdom of the crowd to value an arbitrary piece of information and distribute newly issued tokens according to that valuation. Because it runs on ordinary judgments rather than paid operators, it has to be free to use, require no expertise, and impose no barriers to entry — which is why a chain that charges for every small act of participation cannot host one.

This makes possible **turnkey marketplaces for information**: any group can stand one up to reward the information its own members produce, according to its own idea of what is valuable. The product is the marketplace, not a token.

## Start here

| Document | What it is |
|---|---|
| [WHITEPAPER.md](WHITEPAPER.md) | The design paper: the argument, the mechanism (SWARM), the architecture, the threat model, and the open questions |
| [ARCHITECTURE.md](ARCHITECTURE.md) | The component map — how the protocol, adapter, bridge, ledger, index, and client fit together |
| [ROADMAP.md](ROADMAP.md) | Honest unit-by-unit status: what is built versus what is designed |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How the work is split into parallel tracks, and where to start |

Supporting material: the [primary-source audit](docs/source-audit.md) grounding the paper's protocol claims, and the [diagram specification](docs/architecture-diagram-spec.md) governing the [architecture infographic](assets/proof-of-value-architecture.png).

## What actually exists today

Very little, deliberately, and the repository is labeled accordingly. A Koinos spike contract builds, emits, and decodes an event with a passing test. A feed mockup runs on browser-local state. Every other component — the protocol package, AT adapter, attestation bridge, application index, and the token, identity, and reward contracts — is a scaffold with a README stating its single responsibility. Nothing claims to be finished that is not. See [ROADMAP.md](ROADMAP.md) for the per-unit breakdown.

## Unresolved

If you enjoy attacking a mechanism, [§13 of the white paper](WHITEPAPER.md) is the fastest route in. The questions the project most wants answered:

- **Does unpaid evaluation work?** Version one pays authors only, so honest evaluation is economically altruistic. Steem's curation rewards solved this and created its worst gaming surface.
- **Is a settlement-period lock real skin in the game?** A vote immobilizes stake, but the voter never *loses* for being wrong — nothing resolves, unlike a position in a prediction market.
- **Does it survive machine-generated content and machine-delegated voting?** Nothing here establishes personhood, and automation makes trustworthy judgment scarcer rather than more valuable.
- **Do the revisions actually fix what buried Steem?** Vote-buying, self-dealing, and retaliatory downvoting are properties of stake-weighted continuous voting, not of the chain beneath it. Changing chains does nothing for them.

## Prior art

This is not a new category of mechanism. Quadratic funding, retroactive public goods funding, reputation-weighted budgets, peer allocation, contribution-graph scoring, and vote-escrow gauges all allocate shared budgets by collective judgment, and every one of them — like this design — reintroduces its own locus of judgment somewhere. What is unusual here is the combination of continuous, free-to-participant, open, per-item evaluation in both directions, which among prior systems only Steem's “Proof of Brain” achieved. Steem later failed through a mix of chain, governance, and reward-mechanism failures. This project isolates the mechanism on infrastructure chosen so it can be evaluated on its own terms. §3 and §11 of the paper make that case in full.

## License

[MIT](LICENSE). Inbound contribution terms are not yet stated — see [ROADMAP.md](ROADMAP.md).
