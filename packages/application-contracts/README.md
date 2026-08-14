# @pov/application-contracts

The framework-neutral feed, detail, wallet-preview, and proof-evidence read
interfaces that the web client and application service agree on.

## Single responsibility

The shared application-contract package owns a framework-neutral feed, detail,
and proof-evidence interface. The proposed application service implements it,
while the web shell consumes it through conforming fixtures until integration.

This package defines the application read contract itself — not its
implementation (`@pov/application`) and not its consumer (`apps/web`).
Owning it here early lets the frontend and the application-service tracks
build against the same interface without either one inventing the boundary.

## Role in the foundation

This package is the shared contract foundation for the feed and its future
application service.

## Exposes now

- A runnable single-feed read view with separately authoritative content
  lifecycle, admission, provenance, and optional labeled allocation facts.
- A runtime validator that refuses OAuth/token, DPoP key, PDS-admin, wallet-key,
  and raw-provider-error shaped fields in serializable application views.

Ranked feed, detail, wallet preview, and proof-evidence interfaces remain
proposed beyond this minimum safe view.

## Dependency direction

Depends inward on `@pov/protocol` only. `apps/web` and the proposed
`@pov/application` depend on this package, not the reverse. It does not depend
on `@pov/at-adapter`, `@pov/app-index`, `@pov/at-client`, an account host, or
Koinos code, and it must not duplicate any of their implementation details.

## Status

Status: partially implemented — the safe Swarm feed view is runnable, while the
broader application read surface remains proposed.
