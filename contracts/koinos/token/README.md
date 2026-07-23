# Token

The upgradeable SWARM token contract: balances, stake locks committed by
votes, and unlock at settlement.

`token/` is a designed, bounded scaffold for architectural review — it is not
yet built. The only built-and-tested Koinos contract in this repository is
`contracts/koinos/spike/`; everything else here (`identity/`, `pov/`,
`token/`) is a compiling-scaffold or fully-designed target.

## Single responsibility

> "Build token and identity workspaces as compiling scaffolds with versioned
> public interfaces, storage and event specifications, and authorization
> tests."
> — plan U5 approach, `docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`

Per WHITEPAPER §4-5, a standard evaluation locks a configurable fraction `q`
of a voter's eligible SWARM balance for the reward period; the lock cannot be
transferred or reused before settlement, and settlement unlocks it. This
workspace compiles with that versioned interface and storage/event shape and
passes authorization tests, without claiming implemented issuance policy or a
deployed settlement path in this stage.

## Built by

**U5** (Upgradeable Koinos contract foundations).

## Upgradeable development authority

Per KTD7, the upgrade authority is distinct from the attestor and evaluator
roles and held outside the client, repository, and CI. This token contract's
upgrade path follows the same disclosed founder-controlled development
authority as `pov/` and `identity/`: upgrades during this stage are
authorized, inspectable via event/state versioning, and never a silent
rollback of chain history.

## Status

Status: scaffold — not yet implemented.
