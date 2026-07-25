"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CONTRIBUTIONS, MARKETPLACES, MECH, POSTS, fCurve, voteStrength } from "./data";

const ALL_ITEMS = [
  ...POSTS.map((p) => ({ ...p, feed: p.feed || "social" })),
  ...CONTRIBUTIONS,
];

const VoteContext = createContext(null);

const STORAGE_KEY = "pov-mock-votes";

export function VoteProvider({ children }) {
  const [votes, setVotes] = useState({}); // postId -> "up" | "down"
  const [marketplace, setMarketplace] = useState("build"); // plural marketplaces (§12)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setVotes(JSON.parse(saved));
      const mkt = localStorage.getItem(STORAGE_KEY + "-mkt");
      if (mkt && MARKETPLACES[mkt]) setMarketplace(mkt);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + "-mkt", marketplace);
    } catch {}
  }, [marketplace]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    } catch {}
  }, [votes]);

  const votesUsed = Object.values(votes).filter(Boolean).length;

  const toggleVote = (postId, dir) => {
    setVotes((prev) => {
      const current = prev[postId];
      const next = { ...prev };
      if (current === dir) {
        delete next[postId]; // retract
      } else {
        if (!current && votesUsed >= MECH.votesPerPeriod) return prev; // budget spent
        next[postId] = dir;
      }
      return next;
    });
  };

  const value = useMemo(() => {
    // Effective weights with your committed votes applied. Each marketplace has
    // its own budget, so pending rewards are computed per feed (§12).
    const enriched = ALL_ITEMS.map((p) => {
      const mine = votes[p.id] || null;
      const up = p.upWeight + (mine === "up" ? voteStrength : 0);
      const down = p.downWeight + (mine === "down" ? voteStrength : 0);
      const net = Math.max(0, up - down);
      return { ...p, mine, up, down, net, f: fCurve(net) };
    });
    const sumFByFeed = {};
    for (const p of enriched) sumFByFeed[p.feed] = (sumFByFeed[p.feed] || 0) + p.f;
    const posts = enriched.map((p) => {
      const budget = MARKETPLACES[p.feed]?.budget ?? MECH.periodBudget;
      const sumF = sumFByFeed[p.feed] || 0;
      return {
        ...p,
        pending: sumF > 0 ? (budget * p.f) / sumF : 0,
        share: sumF > 0 ? p.f / sumF : 0,
      };
    });
    const locked = votesUsed * voteStrength;
    return {
      posts,
      feedPosts: posts.filter((p) => p.feed === marketplace),
      marketplace,
      setMarketplace,
      votes,
      toggleVote,
      votesUsed,
      votesLeft: MECH.votesPerPeriod - votesUsed,
      locked,
      available: MECH.balance - locked,
    };
  }, [votes, votesUsed, marketplace]);

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
}

export function useVotes() {
  const ctx = useContext(VoteContext);
  if (!ctx) throw new Error("useVotes outside VoteProvider");
  return ctx;
}

// Live countdown to next settlement (next top-of-hour boundary of the 24h mock period → next midnight UTC).
export function useSettlementCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const d = new Date(now);
  const next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1);
  const ms = next - now;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { h, m, s, label: `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s` };
}
