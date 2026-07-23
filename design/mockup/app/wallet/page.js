"use client";

import { useVotes, useSettlementCountdown } from "@/lib/store";
import { MECH, fmt, fmtFull, voteStrength } from "@/lib/data";

export default function Wallet() {
  const { locked, available, votesUsed, votesLeft, posts } = useVotes();
  const { label } = useSettlementCountdown();
  const lockedPct = (locked / MECH.balance) * 100;
  const myVoted = posts.filter((p) => p.mine);

  return (
    <main className="page">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="logo-hex" aria-hidden="true">⬡</span>
          <span className="wordmark">Wallet</span>
        </div>
      </header>

      <section className="card balance-card">
        <span className="balance-label">Eligible SWARM balance</span>
        <div className="balance-figure">
          <span className="hex big" aria-hidden="true">⬡</span>
          <span className="balance-num">{fmtFull(MECH.balance)}</span>
        </div>
        <div className="lock-track" role="img" aria-label={`${fmtFull(locked)} SWARM locked`}>
          <div className="lock-fill" style={{ width: `${lockedPct}%` }} />
        </div>
        <div className="balance-split">
          <div>
            <span className="split-num">{fmtFull(available)}</span>
            <span className="split-label">available</span>
          </div>
          <div className="split-right">
            <span className="split-num locked-ink">{fmtFull(locked)}</span>
            <span className="split-label">locked in votes</span>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Reward period</h2>
        <div className="math-rows">
          <div className="math-row">
            <span>Settles in</span>
            <span className="mono" suppressHydrationWarning>{label}</span>
          </div>
          <div className="math-row">
            <span>Period budget B</span>
            <span className="mono"><span className="hex">⬡</span> {fmtFull(MECH.periodBudget)}</span>
          </div>
          <div className="math-row">
            <span>Votes used</span>
            <span className="mono">{votesUsed} / {MECH.votesPerPeriod}</span>
          </div>
          <div className="math-row">
            <span>Strength per vote</span>
            <span className="mono">{fmt(voteStrength)} <span className="dim">(balance ÷ 24)</span></span>
          </div>
        </div>
        <p className="math-note">
          Each vote locks 1∕24 of your balance until settlement, then unlocks
          automatically. Votes cost nothing — transactions are sponsored.
        </p>
      </section>

      <section className="card">
        <h2 className="section-title">Your votes this period</h2>
        {myVoted.length === 0 ? (
          <p className="empty-note">No votes yet. You have {votesLeft} full-strength votes to spend.</p>
        ) : (
          <ul className="vote-history">
            {myVoted.map((p) => (
              <li key={p.id} className="vote-history-row">
                <span className={`dir-dot ${p.mine}`} aria-hidden="true">
                  {p.mine === "up" ? "▲" : "▼"}
                </span>
                <span className="vh-text">{p.text.slice(0, 64)}…</span>
                <span className="mono vh-weight">{fmt(voteStrength)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
