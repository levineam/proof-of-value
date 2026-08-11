"use client";

import { useState } from "react";
import { SWARM_FEED_POSTS, SWARM_RECORD_STATES } from "../fixtures/swarm-feed";

function VoteControls({ post }) {
  const [vote, setVote] = useState(null);
  return (
    <div className="vote-controls" aria-label={`Simulated evaluation controls for ${post.kind}`}>
      <button className={vote === "up" ? "selected" : ""} onClick={() => setVote(vote === "up" ? null : "up")} aria-pressed={vote === "up"}>
        Upvote <span>simulated</span>
      </button>
      <button className={vote === "down" ? "selected down" : ""} onClick={() => setVote(vote === "down" ? null : "down")} aria-pressed={vote === "down"}>
        Downvote <span>simulated</span>
      </button>
      <p aria-live="polite">{vote ? `${vote === "up" ? "Upvote" : "Downvote"} selected locally; nothing has been submitted.` : "No vote selected."}</p>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <article className="post-card">
      <header className="post-heading">
        <div className="avatar" aria-hidden="true">{post.author.split(" ").map((name) => name[0]).join("")}</div>
        <div>
          <p className="author">{post.author}</p>
          <p className="handle">@{post.handle}</p>
        </div>
        <span className="kind">{post.kind}</span>
      </header>
      <p className="post-text">{post.text}</p>
      <dl className="status-list">
        <div><dt>Source</dt><dd>{post.source}</dd></div>
        <div><dt>Admission</dt><dd>{post.admission}</dd></div>
        <div><dt>Lifecycle</dt><dd>{post.lifecycle}</dd></div>
        <div><dt>Allocation</dt><dd>{post.allocation}</dd></div>
      </dl>
      <details className="provenance">
        <summary>Record provenance</summary>
        <dl>
          <div><dt>AT URI</dt><dd>{post.uri}</dd></div>
          <div><dt>Author DID</dt><dd>{post.did}</dd></div>
          <div><dt>Evaluated CID</dt><dd>{post.evaluatedCid}</dd></div>
          <div><dt>Current observed CID</dt><dd>{post.observedCid}</dd></div>
          <div><dt>Allocation source</dt><dd>Fixture-only Swarm period simulation; no settlement is connected.</dd></div>
        </dl>
      </details>
      <VoteControls post={post} />
    </article>
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      <a className="skip-link" href="#feed">Skip to feed</a>
      <header className="masthead">
        <p className="eyebrow">Proof of Value · prototype foundation</p>
        <div className="masthead-row">
          <div>
            <h1>Swarm</h1>
            <p className="subtitle">A small feed for the work of building, testing, documenting, and critiquing Proof of Value.</p>
          </div>
          <span className="fixture-label">Fixture data</span>
        </div>
      </header>

      <section className="account-entry" aria-labelledby="account-title">
        <h2 id="account-title">Read first. An account comes later.</h2>
        <p>A future Swarm account is intended to be backed by AT Protocol identity. There is no live account provisioning or OAuth in this prototype.</p>
        <button type="button" disabled aria-describedby="account-note">Account access is not available</button>
        <p id="account-note" className="quiet">You can still inspect the feed and its record references below.</p>
      </section>

      <section className="composer" aria-labelledby="composer-title">
        <div><h2 id="composer-title">Bring an ordinary public post</h2></div>
        <label htmlFor="post-draft">What are you working on?</label>
        <textarea id="post-draft" disabled placeholder="Posting is not connected in this prototype." rows="3" />
        <p>Publication is disabled: this page does not create or publish a post.</p>
        <button type="button" disabled>Publish post</button>
      </section>

      <section id="feed" className="feed" aria-labelledby="feed-title">
        <div className="section-heading"><div><h2 id="feed-title">Current fixtures</h2></div><p>Five records · not live</p></div>
        {SWARM_FEED_POSTS.map((post) => <PostCard key={post.id} post={post} />)}
      </section>

      <section className="state-examples" aria-labelledby="state-title">
        <h2 id="state-title">When a record cannot stay current</h2>
        <p className="quiet">These are explicit UI examples, not claims about a live indexer or moderation service.</p>
        <div className="state-grid">
          {SWARM_RECORD_STATES.map(([name, description]) => <article key={name}><h3>{name}</h3><p>{description}</p></article>)}
        </div>
        <div className="empty-state"><strong>Empty feed example</strong><p>No admitted records match this view yet. Recovery would begin with an explicit AT URI and an observed CID.</p></div>
      </section>

      <footer><p>Proof of Value is a small open-source experiment. Allocations shown here are simulated points, not rewards or settlement results.</p></footer>
    </main>
  );
}
