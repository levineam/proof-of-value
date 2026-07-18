# Proof of Value architecture diagram specification

This specification is authoritative for the white paper's generated architecture infographic. The prose in `WHITEPAPER.md` remains authoritative if an image-generation result conflicts with this document.

## Canvas and visual system

- Landscape 16:9 composition on a clean warm-white background.
- Three clearly separated vertical zones, left to right: `AT PROTOCOL`, `PROOF OF VALUE APPLICATION`, and `KOINOS`.
- Use blue for AT Protocol, amber for the PoV application layer, and violet for Koinos.
- Place `INDEXER + ATTESTOR` on a dashed boundary between AT Protocol and the PoV application layer to show that it is an explicit trust boundary.
- Use solid arrows for authoritative operations and dashed arrows for read models or distribution outputs.
- Keep typography large, sparse, and exact. Do not add explanatory paragraphs inside the image.

## Components and verbatim labels

### AT PROTOCOL

1. `DID + OAUTH`
2. `SIGNED REPOSITORIES`
3. `AT URI + OBSERVED CID`
4. `EVENT STREAMS + APPVIEWS`

Add a small zone note: `IDENTITY, CONTENT, SOCIAL CONTEXT`.

### PROOF OF VALUE APPLICATION

1. `WEB CLIENT`
2. `INDEXER + ATTESTOR`
3. `APP INDEX + FEED SERVICE`

Add two small notes:

- `CONTENT STAYS ON AT`
- `ATTESTS FACTS, NOT VALUE`

### KOINOS

1. `TRANSACTION SPONSOR`
2. `FINITE MANA`
3. `SWARM TOKEN + REWARD CONTRACT`
4. `AUTHOR DID ACCRUAL + CLAIMS`

Add a small zone note: `LOCKS, ISSUANCE, SETTLEMENT`.

## Required arrows

1. `DID + OAUTH` → `WEB CLIENT`, labeled `LOGIN`.
2. `SIGNED REPOSITORIES` → `WEB CLIENT`, labeled `CONTENT`.
3. `AT URI + OBSERVED CID` → `INDEXER + ATTESTOR`, labeled `OBSERVED RECORD`.
4. `EVENT STREAMS + APPVIEWS` → `INDEXER + ATTESTOR`, labeled `DISCOVERY`.
5. `INDEXER + ATTESTOR` → `SWARM TOKEN + REWARD CONTRACT`, labeled `FACT ATTESTATION`.
6. `WEB CLIENT` → `TRANSACTION SPONSOR`, labeled `APPROVED VOTE`.
7. `FINITE MANA` → `TRANSACTION SPONSOR`, labeled `RESOURCE`.
8. `TRANSACTION SPONSOR` → `SWARM TOKEN + REWARD CONTRACT`, labeled `SPONSORED TRANSACTION`.
9. `SWARM TOKEN + REWARD CONTRACT` → `AUTHOR DID ACCRUAL + CLAIMS`, labeled `AUTHOR REWARD`.
10. `SWARM TOKEN + REWARD CONTRACT` → `APP INDEX + FEED SERVICE`, dashed, labeled `CANONICAL EVENTS`.
11. `APP INDEX + FEED SERVICE` → `WEB CLIENT`, dashed, labeled `PENDING STATE + RANKING`.
12. `APP INDEX + FEED SERVICE` → `EVENT STREAMS + APPVIEWS`, dashed, labeled `RANKED FEED`.

## Prohibited or misleading connections

- No arrow from AT Protocol directly to a Koinos contract.
- No arrow implying that the Koinos contract resolves DIDs, verifies OAuth sessions, retrieves AT records, or checks repository proofs directly.
- No arrow from the attestor to author rewards; the attestor cannot select recipients or determine amounts.
- No content or media stored inside Koinos.
- No reward calculation inside the app index, feed service, sponsor, or client.
- No curator-reward component in version one.
- No claim that sponsorship is costless; the sponsor consumes finite Mana.

## Image-generation prompt

Use case: infographic-diagram
Asset type: white-paper architecture infographic
Primary request: Create a polished, technically precise landscape architecture infographic for Proof of Value using the exact three-zone structure, components, labels, and arrows below.
Scene/backdrop: clean warm-white technical-paper background
Style/medium: restrained vector-like systems infographic; crisp geometric cards; subtle depth; professional academic white-paper design
Composition/framing: landscape 16:9; three left-to-right vertical zones; generous whitespace; large readable typography
Color palette: AT Protocol blue; PoV application amber; Koinos violet; charcoal text; pale zone backgrounds
Text (verbatim): `AT PROTOCOL`; `DID + OAUTH`; `SIGNED REPOSITORIES`; `AT URI + OBSERVED CID`; `EVENT STREAMS + APPVIEWS`; `IDENTITY, CONTENT, SOCIAL CONTEXT`; `PROOF OF VALUE APPLICATION`; `WEB CLIENT`; `INDEXER + ATTESTOR`; `APP INDEX + FEED SERVICE`; `CONTENT STAYS ON AT`; `ATTESTS FACTS, NOT VALUE`; `KOINOS`; `TRANSACTION SPONSOR`; `FINITE MANA`; `SWARM TOKEN + REWARD CONTRACT`; `AUTHOR DID ACCRUAL + CLAIMS`; `LOCKS, ISSUANCE, SETTLEMENT`; `LOGIN`; `CONTENT`; `OBSERVED RECORD`; `DISCOVERY`; `FACT ATTESTATION`; `APPROVED VOTE`; `RESOURCE`; `SPONSORED TRANSACTION`; `AUTHOR REWARD`; `CANONICAL EVENTS`; `PENDING STATE + RANKING`; `RANKED FEED`
Constraints: Follow the required arrows exactly; place `INDEXER + ATTESTOR` on a visible dashed trust boundary; use dashed arrows only for canonical-events/read-model/feed outputs; keep every label verbatim and readable; no extra components; no logos; no blockchain coins; no cryptocurrency imagery; no decorative people; no watermark.
Avoid: tiny text, crossed arrows, unlabeled arrows, gradients that reduce contrast, extra protocol layers, implied direct AT-to-Koinos verification, curator rewards, or content stored on Koinos.

## Audit checklist

- [ ] All three zones and every component appear exactly once.
- [ ] Every required arrow has the correct direction and label.
- [ ] The attestor is visibly an off-chain trust boundary.
- [ ] The contract receives facts from the attestor but determines rewards itself.
- [ ] Sponsored voting visibly consumes finite Mana.
- [ ] Content stays on AT Protocol.
- [ ] Rewards go to author DIDs only.
- [ ] Canonical Koinos events feed the non-canonical app index.
- [ ] Ranking can flow back into an AT feed.
- [ ] No prohibited connection or unsupported claim appears.
- [ ] Every label is spelled correctly and remains legible at white-paper width.
