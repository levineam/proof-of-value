"use client";

import Link from "next/link";
import Avatar from "./Avatar";
import VoteBar from "./VoteBar";

export default function PostCard({ post, index = 0 }) {
  return (
    <article className="card post-card" style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}>
      <Link href={`/post/${post.id}`} className="post-link">
        <header className="post-head">
          <Avatar handle={post.handle} />
          <div className="post-id">
            <span className="post-name">{post.name}</span>
            <span className="post-handle">@{post.handle} · {post.time}</span>
          </div>
          {post.kind && (
            <span className={`contrib-chip s-${post.status.replace(/\s+/g, "-")}`}>
              {post.refLabel}
            </span>
          )}
        </header>
        <p className="post-text">{post.text}</p>
        {post.meta && (
          <p className="contrib-meta">
            <span className={`status-dot s-${post.status.replace(/\s+/g, "-")}`} aria-hidden="true" />
            {post.status} · {post.meta}
          </p>
        )}
        {post.embed && (
          <div className={`embed embed-${post.embed.kind}`}>
            {post.embed.kind === "photo" ? (
              <div className="embed-photo" aria-label="Photo placeholder">
                <div className="embed-photo-sky" />
                <div className="embed-photo-ground" />
              </div>
            ) : null}
            <span className="embed-label">{post.embed.label}</span>
          </div>
        )}
      </Link>
      <VoteBar post={post} />
    </article>
  );
}
