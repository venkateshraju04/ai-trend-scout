"use client";
import { useEffect, useState } from "react";
import PostList from "./components/PostList"; // You’ll create this

export default function Home() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch(
      "https://givtazogkvaoooxtpkfm.supabase.co/storage/v1/object/public/trend-scout//latestContent.json",
      {
        headers: { "Cache-Control": "no-cache" },
      }
    )
      .then((res) => res.json())
      .then((data) => setContent(data[0]))
      .catch((err) => console.error("Fetch failed:", err));
  }, []);

  const sources = [
    "github",
    "reddit",
    "hackernews",
    "medium",
    "devto",
    "youtube",
  ];

  return (
    <main className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">🔥 AI TrendScout</h1>
      {!content ? (
        <p>Loading trending content...</p>
      ) : (
        sources.map((source) =>
          content[source]?.length ? (
            <PostList key={source} source={source} items={content[source]} />
          ) : null
        )
      )}
    </main>
  );
}
