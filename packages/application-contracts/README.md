# @pov/application-contracts

The framework-neutral feed, detail, wallet-preview, and proof-evidence read
interfaces that the web client and application service agree on.

## Single responsibility

> "U2 owns a framework-neutral feed, detail, and proof-evidence interface; U6
> implements it and U4 consumes it through conforming fixtures until
> integration."
> — plan KTD12, `docs/plans/2026-07-20-001-feat-parallel-prototype-foundation-plan.md`

This package defines the application read contract itself — not its
implementation (`@pov/application`, U6) and not its consumer (`apps/web`, U4).
Owning it here early lets the frontend and the application-service tracks
build against the same interface without either one inventing the boundary.

## Built by

**U2** (Versioned protocol and application contracts).

## Exposes now

- A single-feed read view with separately authoritative content lifecycle,
  admission, provenance, and optional labeled allocation facts.
- A runtime validator that refuses OAuth/token, DPoP key, PDS-admin, wallet-key,
  and raw-provider-error shaped fields in serializable application views.

Ranked feed, detail, wallet preview, and proof-evidence interfaces remain
proposed beyond this minimum safe view.

## Dependency direction

Depends inward on `@pov/protocol` only. `apps/web` and `@pov/application`
depend on this package, not the reverse; it must not redefine or duplicate
either consumer's implementation details.

## Status

Status: partially implemented — the safe Swarm feed view is runnable, while the
broader application read surface remains proposed.
