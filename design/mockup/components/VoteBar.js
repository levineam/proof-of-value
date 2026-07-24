"use client";

import { useVotes } from "@/lib/store";
import { fmt } from "@/lib/data";

export default function VoteBar({ post, detailed = false }) {
  const { toggleVote, votesLeft } = useVotes();
  const mine = post.mine;
  const upDisabled = !mine && votesLeft <= 0;

  const onVote = (e, dir) => {
    e.preventDefault();
    e.stopPropagation();
    toggleVote(post.id, dir);
  };

  return (
    <div className="votebar">
      <div className="votebar-buttons">
        <button
          className={`vote-btn up ${mine === "up" ? "active" : ""}`}
          onClick={(e) => onVote(e, "up")}
          disabled={upDisabled}
          aria-label="Upvote"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 2.5l5.5 6.5H10v4.5H6V9H2.5L8 2.5z" fill="currentColor" />
          </svg>
          <span>{fmt(post.up)}</span>
        </button>
        <button
          className={`vote-btn down ${mine === "down" ? "active" : ""}`}
          onClick={(e) => onVote(e, "down")}
          disabled={upDisabled}
          aria-label="Downvote"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 13.5L2.5 7H6V2.5h4V7h3.5L8 13.5z" fill="currentColor" />
          </svg>
          {post.down > 0 && <span>{fmt(post.down)}</span>}
        </button>
      </div>
      <div className={`pending-chip ${post.pending > 0 ? "" : "zero"}`}>
        <span className="hex" aria-hidden="true">⬡</span>
        <span key={Math.round(post.pending)} className="pending-num">
          {fmt(post.pending)}
        </span>
        <span className="pending-label">{detailed ? "SWARM pending" : "pending"}</span>
      </div>
    </div>
  );
}
