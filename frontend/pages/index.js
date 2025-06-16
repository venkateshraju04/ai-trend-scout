"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch(
      "https://givtazogkvaoooxtpkfm.supabase.co/storage/v1/object/public/trend-scout//latestContent.json",
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // Our JSON is an array with one object
        setContent(data[0]);
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
      });
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">🔥 AI TrendScout</h1>

      {!content ? (
        <p>Loading trending content...</p>
      ) : (
        ["github", "reddit", "hackernews", "medium", "devto", "youtube"].map(
          (source) =>
            content[source]?.length ? (
              <section key={source} className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 capitalize">
                  {source}
                </h2>
                <ul className="list-disc list-inside space-y-1">
                  {content[source].slice(0, 5).map((item, idx) => {
                    const data = item.json || item; // sometimes it's wrapped
                    return (
                      <li key={idx}>
                        <a
                          href={data.url || data.link || data.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {data.title}
                        </a>{" "}
                        <span className="text-gray-500 text-sm">
                          {data.creator || data.author || data.channel
                            ? `— ${data.creator || data.author || data.channel}`
                            : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null
        )
      )}
    </main>
  );
}
