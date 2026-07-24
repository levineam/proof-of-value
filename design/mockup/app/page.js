"use client";

import TopBar from "@/components/TopBar";
import PostCard from "@/components/PostCard";
import { useVotes } from "@/lib/store";

export default function Feed() {
  const { posts } = useVotes();
  const ranked = [...posts].sort((a, b) => b.net - a.net);
  return (
    <main className="page">
      <TopBar />
      <div className="feed">
        {ranked.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
        <p className="feed-foot">
          Ranked by net stake weight · mock data, nothing on-chain
        </p>
      </div>
    </main>
  );
}
