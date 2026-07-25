// Mock dataset + mechanism constants for the PoV UI prototype.
// Mechanics mirror WHITEPAPER.md v0.1: q = 1/24 vote budget, convergent-linear
// allocation curve F(n) = n²/(n+1), fixed per-period token budget, author-only payouts.

export const MECH = {
  periodBudget: 10000, // B_t — SWARM issued this reward period (per marketplace)
  votesPerPeriod: 24, // 1/q
  balance: 6418, // your eligible SWARM balance snapshot
};

// Plural marketplaces (§12): each community runs its own token and budget.
// The mockup simplifies to one balance across both.
export const MARKETPLACES = {
  build: { key: "build", name: "PoV Build", token: "SWARM", budget: MECH.periodBudget },
  social: { key: "social", name: "Open Social", token: "SWARM", budget: MECH.periodBudget },
};

export const voteStrength = MECH.balance / MECH.votesPerPeriod; // weight committed per vote

export const fCurve = (n) => (n <= 0 ? 0 : (n * n) / (n + 1));

export const POSTS = [
  {
    id: "p1",
    handle: "maya.bsky.social",
    name: "Maya Okafor",
    time: "26m",
    text: "Shipped the attestation bridge spec today. The rule that keeps me sane: the bridge carries facts to the chain, it never computes rewards. Every time we blur that line the trust model falls apart.",
    upWeight: 8340,
    downWeight: 410,
    upCount: 41,
    downCount: 3,
  },
  {
    id: "p2",
    handle: "fieldnotes.bsky.social",
    name: "Field Notes",
    time: "1h",
    text: "Sunrise over the salt flats this morning. No filter, no edit — some places just render themselves.",
    embed: {
      kind: "photo",
      label: "IMG_4402 · Bonneville, UT",
    },
    upWeight: 6110,
    downWeight: 0,
    upCount: 58,
    downCount: 0,
  },
  {
    id: "p3",
    handle: "priya.dev",
    name: "Priya Raman",
    time: "2h",
    text: "Hot take: most \"decentralized\" curation is just admin keys with extra steps. Show me the mechanism that survives its own founders losing interest.",
    upWeight: 4980,
    downWeight: 1220,
    upCount: 37,
    downCount: 9,
  },
  {
    id: "p4",
    handle: "arxiv-daily.bsky.social",
    name: "arXiv Daily",
    time: "3h",
    text: "New paper: \"Sybil-resistant reward allocation under adversarial stake concentration.\" The n²/(n+1) family gets a full section — convergent-linear curves resist vote-splitting without superlinear whale amplification.",
    embed: {
      kind: "link",
      label: "arxiv.org · cs.GT · 14 pages",
    },
    upWeight: 3870,
    downWeight: 150,
    upCount: 22,
    downCount: 1,
  },
  {
    id: "p5",
    handle: "tomasz.bsky.social",
    name: "Tomasz Wieczorek",
    time: "5h",
    text: "Week 6 of learning timber framing. Cut my first through-tenon joint by hand today. The chisel does the work if you let it.",
    upWeight: 2410,
    downWeight: 0,
    upCount: 19,
    downCount: 0,
  },
  {
    id: "p6",
    handle: "signalcraft.bsky.social",
    name: "Signalcraft",
    time: "7h",
    text: "Reminder that \"free\" social platforms price your attention at whatever the ad market will pay, and the ad market has never once asked what the information was worth to you.",
    upWeight: 1980,
    downWeight: 760,
    upCount: 24,
    downCount: 6,
  },
  {
    id: "p7",
    handle: "lena.bsky.social",
    name: "Lena Vasquez",
    time: "9h",
    text: "My grandmother's mole recipe, transcribed at last. 34 ingredients, three days, zero shortcuts. Thread below for anyone who wants to attempt it. 🧵",
    upWeight: 1540,
    downWeight: 0,
    upCount: 31,
    downCount: 0,
  },
  {
    id: "p8",
    handle: "chainwatch.bsky.social",
    name: "Chainwatch",
    time: "11h",
    text: "Unpopular but true: sponsored transactions are the only reason normal people will ever vote on-chain. Nobody buys gas to click an arrow.",
    upWeight: 890,
    downWeight: 1130,
    upCount: 11,
    downCount: 12,
  },
  {
    id: "p9",
    handle: "quietobserver.bsky.social",
    name: "Quiet Observer",
    time: "14h",
    text: "Posting less, noticing more. This month I wrote four things instead of forty and every one of them still feels true.",
    upWeight: 620,
    downWeight: 40,
    upCount: 9,
    downCount: 1,
  },
];

// The PoV Build marketplace: contributions to building Proof of Value itself.
// Ground-truth adjacency (merged / CI / shipped) is part of the point — see §10.
export const CONTRIBUTIONS = [
  {
    id: "c1",
    feed: "build",
    kind: "pr",
    refLabel: "PR #921",
    status: "in review",
    handle: "charlie.pov.dev",
    name: "Charlie",
    time: "3h",
    text: "Make the note/journal contract discoverable and add a link-existing mode — --help output, journal backlinks for touched notes, 13 new tests.",
    meta: "6 files · +415 −16 · CI green",
    upWeight: 4620,
    downWeight: 380,
    upCount: 12,
    downCount: 1,
  },
  {
    id: "c2",
    feed: "build",
    kind: "doc",
    refLabel: "WHITEPAPER.md",
    status: "merged",
    handle: "andrew.pov.dev",
    name: "Andrew",
    time: "6h",
    text: "v0.4: reframe around the social consensus algorithm — technical consensus secures ledgers; nothing yet establishes what information is worth.",
    meta: "docs · +204 −41 · merged to main",
    upWeight: 7940,
    downWeight: 0,
    upCount: 18,
    downCount: 0,
  },
  {
    id: "c3",
    feed: "build",
    kind: "pr",
    refLabel: "PR #1",
    status: "merged",
    handle: "charlie.pov.dev",
    name: "Charlie",
    time: "1d",
    text: "Component baseline: monorepo scaffold for every designed layer, architecture map, contributor docs. Honest-scaffold principle throughout.",
    meta: "43 files · +1,102 −6 · merged",
    upWeight: 5210,
    downWeight: 140,
    upCount: 14,
    downCount: 1,
  },
  {
    id: "c4",
    feed: "build",
    kind: "issue",
    refLabel: "SUP-3677",
    status: "open",
    handle: "andrew.pov.dev",
    name: "Andrew",
    time: "1d",
    text: "UPSTREAM_PLAN is write-only: 168 recorded promises, 148 files of mirror drift, zero reconciliation. Proposal: a reconcile script and a durable ledger.",
    meta: "issue · reconciliation · high priority",
    upWeight: 3380,
    downWeight: 0,
    upCount: 9,
    downCount: 0,
  },
  {
    id: "c5",
    feed: "build",
    kind: "review",
    refLabel: "review: PR #921",
    status: "changes requested",
    handle: "gate.pov.dev",
    name: "Review Gate",
    time: "5h",
    text: "Found two P1s before merge: a regex widening that silently deletes annotated journal bullets, and a sanitized/raw title mismatch producing dangling wiki-links.",
    meta: "review · 2 P1, 4 P2 · GATE: FAIL",
    upWeight: 6100,
    downWeight: 90,
    upCount: 16,
    downCount: 1,
  },
  {
    id: "c6",
    feed: "build",
    kind: "doc",
    refLabel: "ARCHITECTURE.md",
    status: "merged",
    handle: "priya.dev",
    name: "Priya Raman",
    time: "2d",
    text: "Six-layer component map with a rendered diagram: protocol gate, AT adapter, attestation bridge, reward ledger, app-index, web client.",
    meta: "docs · +140 −0 · merged",
    upWeight: 2240,
    downWeight: 60,
    upCount: 7,
    downCount: 1,
  },
];

// Mock top supporters shown on the post detail view.
export const SUPPORTERS = {
  default: [
    { handle: "keiko.bsky.social", weight: 1890 },
    { handle: "0xbramble.bsky.social", weight: 1245 },
    { handle: "sailfast.bsky.social", weight: 980 },
    { handle: "juniper.dev", weight: 610 },
  ],
};

export const fmt = (n) =>
  n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : Math.round(n).toString();

export const fmtFull = (n) => Math.round(n).toLocaleString("en-US");
