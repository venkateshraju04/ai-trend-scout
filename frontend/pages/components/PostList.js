import { useRef } from "react";
import YoutubeCard from "./YoutubeCard";

export default function PostList({ source, items }) {
  const scrollRef = useRef(null);

  if (source === "youtube") {
    return (
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 capitalize">{source}</h2>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex space-x-3 overflow-x-auto scrollbar-hide px-8"
            style={{ scrollBehavior: "smooth" }}
          >
            {items.slice(0, 5).map((item, idx) => {
              const data = item.json || item;
              return (
                <div
                  key={idx}
                  className="min-w-[380px] max-w-[380px] flex-shrink-0"
                >
                  <YoutubeCard video={data} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Non-YouTube items (unchanged)
  return (
    <section className="mb-6">
      <h2 className="text-2xl font-semibold mb-2 capitalize">{source}</h2>
      <div className="space-y-3">
        {items.slice(0, 5).map((item, idx) => {
          const data = item.json || item;
          const title = data.title || "Untitled";
          const url = data.url || data.link || data.repoUrl || "#";
          const author = data.creator || data.author || data.channel;

          return (
            <div key={idx}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {title}
              </a>{" "}
              {author && (
                <span className="text-gray-500 text-sm">— {author}</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
