"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const path = usePathname();
  const onFeed = path === "/" || path.startsWith("/post");
  return (
    <nav className="tabbar">
      <Link href="/" className={`tab ${onFeed ? "active" : ""}`}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <rect x="3.5" y="4" width="15" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
          <rect x="3.5" y="12" width="15" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        </svg>
        <span>Feed</span>
      </Link>
      <Link href="/wallet" className={`tab ${path.startsWith("/wallet") ? "active" : ""}`}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M11 2.8l6.9 4v8.4l-6.9 4-6.9-4V6.8l6.9-4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
        <span>Wallet</span>
      </Link>
    </nav>
  );
}
