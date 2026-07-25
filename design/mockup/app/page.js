"use client";

import TopBar from "@/components/TopBar";
import MarketSwitcher from "@/components/MarketSwitcher";
import PostCard from "@/components/PostCard";
import { useVotes } from "@/lib/store";

export default function Feed() {
  const { feedPosts, marketplace } = useVotes();
  const ranked = [...feedPosts].sort((a, b) => b.net - a.net);
  return (
    <main className="page">
      <TopBar />
      <MarketSwitcher />
      <div className="feed" key={marketplace}>
        {ranked.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
        <p className="feed-foot">
          {marketplace === "build"
            ? "The PoV Build marketplace evaluates contributions to this project itself (§10)"
            : "Ranked by net stake weight · mock data, nothing on-chain"}
          {" "}· each marketplace has its own budget (§12)
        </p>
      </div>
    </main>
  );
}
