# Feed mockup (design reference)

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

This is the U4 starting point (see `docs/plans/`, unit U4): the plan calls for
reconstructing this experience inside `apps/web` against
`@pov/application-contracts`, with real provenance labels replacing mock state.
Until then it runs on its own:

```bash
cd design/mockup
npm install
npm run dev
```

Historical note: the original mockup predating this repository was not
recoverable as source; this implementation was rebuilt from the surviving
description (same components: `PostCard`, `VoteBar`, `TopBar`, `TabBar`,
`Avatar`, browser-local `lib/store.js` / `lib/data.js`) and then extended with
the mechanics-aware UI described above. It is a design reference, not a claim
that any protocol integration exists.
