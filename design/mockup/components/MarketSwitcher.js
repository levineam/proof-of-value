"use client";

import { useVotes } from "@/lib/store";
import { MARKETPLACES } from "@/lib/data";

export default function MarketSwitcher() {
  const { marketplace, setMarketplace } = useVotes();
  return (
    <div className="market-switcher" role="tablist" aria-label="Marketplace">
      {Object.values(MARKETPLACES).map((m) => (
        <button
          key={m.key}
          role="tab"
          aria-selected={marketplace === m.key}
          className={`market-tab ${marketplace === m.key ? "active" : ""}`}
          onClick={() => setMarketplace(m.key)}
        >
          {m.name}
        </button>
      ))}
    </div>
  );
}
