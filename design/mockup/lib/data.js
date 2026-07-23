// Mock dataset + mechanism constants for the PoV UI prototype.
// Mechanics mirror WHITEPAPER.md v0.1: q = 1/24 vote budget, convergent-linear
// allocation curve F(n) = n²/(n+1), fixed per-period token budget, author-only payouts.

export const MECH = {
  periodBudget: 10000, // B_t — SWARM issued this reward period
  votesPerPeriod: 24, // 1/q
  balance: 6418, // your eligible SWARM balance snapshot
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
