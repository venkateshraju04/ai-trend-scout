import { useEffect, useState } from "react";

export default function Home() {
  const [content, setContent] = useState(null);
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch(
      "https://givtazogkvaoooxtpkfm.supabase.co/storage/v1/object/public/trend-scout/latestContent.json"
    )
      .then((res) => res.json())
      .then((data) => setContent(data[0]))
      .catch((err) => console.error("Failed to fetch content:", err));
  }, []);

  const handleSubscribe = () => {
    if (!email) return alert("Please enter a valid email.");
    alert(`Subscribed: ${email}`);
    setEmail("");
  };

  const renderCards = (source) => {
    const posts = content?.[source]?.slice(0, 5);
    if (!posts) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {source.charAt(0).toUpperCase() + source.slice(1)}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {posts.map((item, idx) => {
            const p = item.json || item;
            const url = p.url || p.link || p.repoUrl;
            const title = p.title;
            const author = p.creator || p.author || p.channel || "Unknown";
            const thumbnail =
              p.thumbnail ||
              (source === "youtube" && url?.match(/v=([^&]+)/)?.[1]
                ? `https://img.youtube.com/vi/${
                    url.match(/v=([^&]+)/)[1]
                  }/hqdefault.jpg`
                : source === "devto" && p.image
                ? p.image
                : null);

            return (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-md shadow p-2 hover:shadow-md transition block text-center bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt={title}
                    className="mb-2 w-full h-28 object-cover rounded"
                  />
                )}
                <p className="text-sm font-medium mb-1 text-gray-800 dark:text-gray-100">
                  {title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {author}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  const renderList = (source) => {
    const posts = content?.[source]?.slice(0, 5);
    if (!posts) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {source.charAt(0).toUpperCase() + source.slice(1)}
        </h2>
        <ul className="list-disc list-inside space-y-1">
          {posts.map((item, idx) => {
            const p = item.json || item;
            const url = p.url || p.link || p.repoUrl;
            const title = p.title;
            const author = p.creator || p.author || p.channel || "Unknown";
            return (
              <li key={idx} className="text-gray-700 dark:text-gray-300">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-400 hover:underline"
                >
                  {title}
                </a>{" "}
                — <span className="text-sm">{author}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="p-6 max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
              AI Trend Scout
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="border px-3 py-1 rounded-md text-sm text-gray-700 dark:text-gray-300 dark:border-gray-600"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"} Mode
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-4 py-2 rounded-md w-full sm:w-80 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <button
              onClick={handleSubscribe}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Subscribe
            </button>
          </div>

          {renderCards("devto")}
          {renderCards("youtube")}
          {renderList("github")}
          {renderList("reddit")}
          {renderList("hackernews")}
        </div>
      </main>
    </div>
  );
}
