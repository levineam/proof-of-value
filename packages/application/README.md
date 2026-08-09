# @pov/application

The read-side assembler that produces the Swarm product view from AT
observations, admission facts, and the rebuildable app index for the web client
to render.

## Single responsibility

Will implement `@pov/application-contracts` by joining normalized AT
observations (`@pov/at-adapter`) with the noncanonical Swarm projection
(`@pov/app-index`). It **reads**: it has no member authorization, provisioning,
admission/revocation authority, signing keys, or settlement authority. It
never presents an index projection as canonical content or token balance. The
web client depends on this read boundary rather than AT/Koinos SDK types or
write-path details.

## Built by

**U6** (index and application-service boundary), alongside
`@pov/app-index`.

## Will expose

- A Swarm feed and detail read view conforming to `@pov/application-contracts`.
- Separately labeled content lifecycle, admission, provenance, and PoV/
  settlement facts, including an index-delay/pending state that does not block
  direct public reads.

## Dependency direction

Depends inward on `@pov/protocol` and `@pov/application-contracts`, and reads
from `@pov/at-adapter` and `@pov/app-index`. `apps/web` may depend on this
package. It never imports AT write/signing paths or Koinos settlement code.

## Status

Status: proposed — package scaffold only. The U2 read contract and U4
fixture-backed shell demonstrate the intended consumer boundary, not a running
application service.
