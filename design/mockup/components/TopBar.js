"use client";

import { useVotes, useSettlementCountdown } from "@/lib/store";
import { MECH } from "@/lib/data";

export default function TopBar() {
  const { votesLeft } = useVotes();
  const { label } = useSettlementCountdown();
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="logo-hex" aria-hidden="true">⬡</span>
        <span className="wordmark">Proof of Value</span>
      </div>
      <div className="topbar-status">
        <span className="votes-pill" title="Votes remaining this period">
          {votesLeft}<span className="votes-pill-sep">/</span>{MECH.votesPerPeriod}
        </span>
        <span className="settle-countdown" title="Time until settlement" suppressHydrationWarning>
          {label}
        </span>
      </div>
    </header>
  );
}
