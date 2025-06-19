"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NextImage from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Mail,
  Sun,
  Moon,
  Github,
  Youtube,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [content, setContent] = useState(null);
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [frequency, setFrequency] = useState("weekly");

  useEffect(() => {
    setIsVisible(true);
    setLoading(true);
    fetch(
      "https://givtazogkvaoooxtpkfm.supabase.co/storage/v1/object/public/trend-scout/latestContent.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setContent(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch content:", err);
        setLoading(false);
      });
  }, []);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      setSubscribeStatus("error");
      setTimeout(() => setSubscribeStatus(null), 3000);
      return;
    }

    const { error } = await supabase
      .from("subscribers")
      .insert([{ email, preference: frequency }]);

    if (error) {
      console.error("Subscription error:", error.message);
      setSubscribeStatus("error");
    } else {
      setSubscribeStatus("success");
      setEmail("");
    }
    setTimeout(() => setSubscribeStatus(null), 3000);
  };

  const sourceLogos = {
    devto: "/logos/devto.svg",
    reddit: "/logos/reddit.svg",
    hackernews: "/logos/hackernews.svg",
  };

  const getSourceIcon = (source) => {
    const customLogo = sourceLogos[source];
    if (customLogo) {
      return (
        <NextImage
          src={customLogo}
          alt={`${source} logo`}
          width={20}
          height={20}
        />
      );
    }
    const icons = {
      youtube: <Youtube className="h-4 w-4" />,
      github: <Github className="h-4 w-4" />,
    };
    return icons[source] || <TrendingUp className="h-4 w-4" />;
  };

  const getSourceColor = (source) => {
    const colors = {
      devto: "from-purple-500 to-pink-500",
      youtube: "from-red-500 to-red-600",

      github: "from-gray-700 to-gray-900",
      reddit: "from-orange-500 to-red-500",
      hackernews: "from-orange-600 to-yellow-500",
    };
    return colors[source] || "from-blue-500 to-purple-500";
  };

  const renderCards = (source) => {
    const posts = content?.[source]?.slice(0, 5);
    if (!posts) return null;

    return (
      <div
        className={`mb-12 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`p-2 rounded-lg bg-gradient-to-r ${getSourceColor(
              source
            )} text-white`}
          >
            {getSourceIcon(source)}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {source.charAt(0).toUpperCase() + source.slice(1)}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          {source === "devto" && "Top articles from the developer community"}
          {source === "youtube" && "Trending tech videos and tutorials"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
              <Card
                key={idx}
                className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden"
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <CardContent className="p-0 h-full flex flex-col">
                    {thumbnail && (
                      <div className="relative overflow-hidden">
                        <img
                          src={thumbnail || "/placeholder.svg"}
                          alt={title}
                          className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <ExternalLink className="absolute top-2 right-2 h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {title}
                      </h3>
                      <div className="mt-auto">
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          {getSourceIcon(source)}
                          {author}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </a>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderList = (source) => {
    const posts = content?.[source]?.slice(0, 10); // Get up to 10 posts
    if (!posts) return null;

    // For GitHub, split into two columns
    if (source === "github") {
      const leftPosts = posts.slice(0, 5);
      const rightPosts = posts.slice(5, 10);

      return (
        <div
          className={`mb-12 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-2 rounded-lg bg-gradient-to-r ${getSourceColor(
                source
              )} text-white`}
            >
              {getSourceIcon(source)}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {source.charAt(0).toUpperCase() + source.slice(1)}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            {source === "github" &&
              "Trending repositories and open source projects"}
            {source === "reddit" && "Popular discussions from tech communities"}
            {source === "hackernews" && "Top stories from Hacker News"}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-6">
                <div className="space-y-2">
                  {leftPosts.map((item, idx) => {
                    const p = item.json || item;
                    const url = p.url || p.link || p.repoUrl;
                    const title = p.title;
                    const stars = p.stars || p.stargazers_count || null;
                    const username = p.owner?.login || p.author || null;

                    return (
                      <div
                        key={idx}
                        className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                      >
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                          <span className="text-sm font-medium text-black dark:text-white">
                            {idx + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group-hover:underline"
                            >
                              {title}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {stars && (
                            <div className="flex items-center gap-1 text-sm text-black dark:text-white">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {typeof stars === "number"
                                ? stars.toLocaleString()
                                : stars}
                            </div>
                          )}
                          <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Right Column */}
            {rightPosts.length > 0 && (
              <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    {rightPosts.map((item, idx) => {
                      const p = item.json || item;
                      const url = p.url || p.link || p.repoUrl;
                      const title = p.title;
                      const stars = p.stars || p.stargazers_count || null;
                      const username = p.owner?.login || p.author || null;

                      return (
                        <div
                          key={idx}
                          className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                            <span className="text-sm font-medium text-black dark:text-white">
                              {idx + 6}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group-hover:underline"
                              >
                                {title}
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {stars && (
                              <div className="flex items-center gap-1 text-sm text-black dark:text-white">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {typeof stars === "number"
                                  ? stars.toLocaleString()
                                  : stars}
                              </div>
                            )}
                            <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      );
    }

    // For Reddit and Hacker News, keep single column but with black text and plain numbering
    return (
      <div
        className={`mb-12 transition-all duration-700 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`p-2 rounded-lg bg-gradient-to-r ${getSourceColor(
              source
            )} text-white`}
          >
            {getSourceIcon(source)}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {source.charAt(0).toUpperCase() + source.slice(1)}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          {source === "github" &&
            "Trending repositories and open source projects"}
          {source === "reddit" && "Popular discussions from tech communities"}
          {source === "hackernews" && "Top stories from Hacker News"}
        </p>

        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-6">
            <div className="space-y-2">
              {posts.slice(0, 5).map((item, idx) => {
                const p = item.json || item;
                const url = p.url || p.link || p.repoUrl;
                const title = p.title;
                const author = p.creator || p.author || p.channel || "Unknown";

                return (
                  <div
                    key={idx}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                      <span className="text-sm font-medium text-black dark:text-white">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors group-hover:underline"
                        >
                          {title}
                        </a>
                      </div>
                      <p className="text-sm text-black dark:text-white mt-1">
                        by {author}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-500">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-3 transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Trend Scout
                </h1>
              </div>

              <Button
                onClick={() => setDarkMode(!darkMode)}
                variant="outline"
                size="sm"
                className={`transition-all duration-300 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }`}
              >
                {darkMode ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Hero Section */}
          <div
            className={`text-center mb-12 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Stay Ahead of the Curve
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the latest trends in AI, development, and technology from
              top sources across the web.
            </p>

            {/* Subscription Form */}
            <Card className="max-w-lg mx-auto border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-0 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs ${
                            frequency === "daily"
                              ? "text-blue-600 font-medium"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          Daily
                        </span>
                        <button
                          onClick={() =>
                            setFrequency(
                              frequency === "daily" ? "weekly" : "daily"
                            )
                          }
                          className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            frequency === "daily"
                              ? "bg-blue-500 focus:ring-blue-500"
                              : "bg-green-500 focus:ring-green-500"
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              frequency === "weekly"
                                ? "translate-x-4"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-xs ${
                            frequency === "weekly"
                              ? "text-green-600 font-medium"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          Weekly
                        </span>
                      </div>
                      <Button
                        onClick={handleSubscribe}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6"
                      >
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>

                {subscribeStatus && (
                  <div
                    className={`mt-3 flex items-center gap-2 text-sm ${
                      subscribeStatus === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {subscribeStatus === "success" ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Successfully subscribed for {frequency} updates!
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        Please enter a valid email address.
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center max-w-md mx-auto">
              Subscribe to our newsletter for daily/weekly updates and insights.
              <br />
              No spam, just the good stuff!
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                Loading latest trends...
              </p>
            </div>
          )}

          {/* Content Sections */}
          {!loading && content && (
            <div className="space-y-12">
              {renderCards("devto")}
              {renderCards("youtube")}
              {renderList("github")}
              {renderList("reddit")}
              {renderList("hackernews")}
            </div>
          )}

          {/* Footer */}
          <footer
            className={`mt-20 py-8 border-t border-gray-200 dark:border-gray-700 transition-all duration-700 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-center text-gray-500 dark:text-gray-400 space-y-4">
              <p className="text-sm">
                Data sourced from Dev.to, YouTube, GitHub, Reddit, and Hacker
                News
              </p>
              <div className="flex justify-center items-center gap-6">
                <a
                  href="mailto:nrvenkateshraju@gmail.com"
                  className="flex items-center gap-2 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Contact Us
                </a>
                <a
                  href="https://github.com/venkateshraju04/ai-trend-scout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
