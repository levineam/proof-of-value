"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Avatar from "@/components/Avatar";
import VoteBar from "@/components/VoteBar";
import { useVotes, useSettlementCountdown } from "@/lib/store";
import { MECH, SUPPORTERS, fmt, fmtFull, voteStrength } from "@/lib/data";

export default function PostDetail() {
  const { id } = useParams();
  const { posts } = useVotes();
  const { label } = useSettlementCountdown();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <main className="page">
        <div className="detail-nav"><Link href="/" className="back-link">← Feed</Link></div>
        <p className="feed-foot">Post not found.</p>
      </main>
    );
  }

  const supporters = post.mine === "up"
    ? [{ handle: "you", weight: voteStrength, you: true }, ...SUPPORTERS.default]
    : SUPPORTERS.default;

  return (
    <main className="page">
      <div className="detail-nav">
        <Link href="/" className="back-link">← Feed</Link>
      </div>

      <article className="card detail-card">
        <header className="post-head">
          <Avatar handle={post.handle} size={48} />
          <div className="post-id">
            <span className="post-name">{post.name}</span>
            <span className="post-handle">@{post.handle} · {post.time}</span>
          </div>
        </header>
        <p className="post-text detail-text">{post.text}</p>
        {post.embed && (
          <div className={`embed embed-${post.embed.kind}`}>
            {post.embed.kind === "photo" && (
              <div className="embed-photo" aria-label="Photo placeholder">
                <div className="embed-photo-sky" />
                <div className="embed-photo-ground" />
              </div>
            )}
            <span className="embed-label">{post.embed.label}</span>
          </div>
        )}
        <VoteBar post={post} detailed />
      </article>

      <section className="card math-card">
        <h2 className="section-title">This period</h2>
        <div className="math-rows">
          <div className="math-row">
            <span>Upvote weight</span>
            <span className="mono up-ink">+{fmtFull(post.up)}</span>
          </div>
          <div className="math-row">
            <span>Downvote weight</span>
            <span className="mono down-ink">−{fmtFull(post.down)}</span>
          </div>
          <div className="math-row net">
            <span>Net weight N</span>
            <span className="mono">{fmtFull(post.net)}</span>
          </div>
          <div className="share-track" role="img" aria-label={`${(post.share * 100).toFixed(1)}% of period budget`}>
            <div className="share-fill" style={{ width: `${Math.max(post.share * 100, 1)}%` }} />
          </div>
          <div className="math-row">
            <span>Share of {fmt(MECH.periodBudget)} SWARM budget</span>
            <span className="mono">{(post.share * 100).toFixed(1)}%</span>
          </div>
          <div className="math-row pending-row">
            <span>Pending to author</span>
            <span className="mono"><span className="hex">⬡</span> {fmtFull(post.pending)}</span>
          </div>
        </div>
        <p className="math-note">
          Allocation F(N) = N²∕(N+1), pro-rata across all posts. Settles in {label}.
          Downvotes only reduce pending rewards — nothing is ever confiscated.
        </p>
      </section>

      <section className="card">
        <h2 className="section-title">Top supporters</h2>
        <ul className="supporter-list">
          {supporters.map((s) => (
            <li key={s.handle} className={`supporter ${s.you ? "you" : ""}`}>
              <Avatar handle={s.handle} size={30} />
              <span className="supporter-handle">{s.you ? "You" : `@${s.handle}`}</span>
              <span className="mono supporter-weight">+{fmtFull(s.weight)}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
