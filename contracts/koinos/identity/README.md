# Identity

The identity-link contract: verifiable DID-to-Koinos-account linking and the
claim flow.

`identity/` is a designed, bounded scaffold for architectural review — it is
not yet built. The only built-and-tested Koinos contract in this repository is
`contracts/koinos/spike/`; everything else here (`identity/`, `pov/`,
`token/`) is a compiling-scaffold or fully-designed target.

## Single responsibility

> "An author need not link an account before publication or voting. Rewards
> accrue to the author DID. To claim, the user authenticates control of the
> DID, receives a nonce-bound challenge naming the intended Koinos account,
> signs with that account, and submits an accepted link attestation. Replay
> protection, expiry, replacement, and recovery require explicit protocol
> rules before implementation."
> — WHITEPAPER.md §6, "Link and claim"

Per plan U5, this workspace is built as a **compiling scaffold with a
versioned public interface, storage/event specifications, and authorization
tests** — not a deployed, complete linking implementation. Claim requires
proof of the author DID and authorization by the intended Koinos account,
without rewriting historical attribution (R15).

## Built by

**U5** (Upgradeable Koinos contract foundations).

## Upgradeable development authority

Per KTD7, the upgrade authority, bridge attestor, and development evaluator
are distinct, disclosed roles held outside the client, repository, and CI.
This contract's upgrade path follows the same disclosed founder-controlled
development authority as `pov/` and `token/`: upgrades during this stage are
authorized, inspectable via event/state versioning, and never a silent
rollback of chain history.

## Status

Status: scaffold — not yet implemented.
