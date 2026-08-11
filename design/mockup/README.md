# Feed mockup (historical design reference)

> **Status:** Implemented historical vision and simulated browser-local
> interaction. This is not the Swarm MVP, and it has no AT Protocol, Koinos, or
> live application connection.

A standalone Next.js mockup of the primary feed experience: ranked posts with
stake-weighted upvote/downvote controls, per-item pending-reward display, a
per-period vote budget, a post detail view showing the allocation math, and a
wallet view distinguishing available from vote-locked balance. A marketplace
switcher toggles between two feeds sharing the same mechanism — **PoV Build**
(contributions to this project itself, per §10, with merge/CI status shown) and
**Open Social** (a Bluesky-style content feed) — each with its own period
budget, demonstrating the plural-marketplaces claim of §12. All state is
browser-local and the reward calculation is hard-coded — nothing here talks to
AT Protocol or a chain.

This is a visual and interaction reference for the older plural-marketplace
vision (see `docs/plans/`, unit U4). The active U4 target is one Swarm feed in
`apps/web` backed by shared fixtures and explicit provenance labels, not a
reconstruction of this two-marketplace screen.
Until then it runs on its own:

```bash
cd design/mockup
npm install
npm run dev
```

Historical note: the original mockup predating this repository was not
recoverable as source. This implementation was rebuilt from the surviving
description (same components: `PostCard`, `VoteBar`, `TopBar`, `TabBar`,
`Avatar`, browser-local `lib/store.js` / `lib/data.js`) and extended with the
mechanics-aware UI described above. It is a design reference, not a claim that
any protocol integration exists.
