"use client";

import { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import NextImage from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Github,
  Youtube,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Toaster, toast } from "sonner";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

type Source = "reddit" | "github" | "hackernews" | "youtube" | "devto";
type Filter = Source;

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "devto", label: "Dev.to" },
  { id: "youtube", label: "YouTube" },
  { id: "github", label: "GitHub" },
  { id: "reddit", label: "Reddit" },
  { id: "hackernews", label: "Hacker News" },
];

const SOURCE_TAG: Record<Source, { bg: string; fg: string; label: string }> = {
  reddit: { bg: "bg-[hsl(var(--tag-orange-bg))]", fg: "text-[hsl(var(--tag-orange-fg))]", label: "Reddit" },
  github: { bg: "bg-[hsl(var(--tag-stone-bg))]", fg: "text-[hsl(var(--tag-stone-fg))]", label: "GitHub" },
  hackernews: { bg: "bg-[hsl(var(--tag-orange-bg))]", fg: "text-[hsl(var(--tag-orange-fg))]", label: "Hacker News" },
  youtube: { bg: "bg-[hsl(var(--tag-red-bg))]", fg: "text-[hsl(var(--tag-red-fg))]", label: "YouTube" },
  devto: { bg: "bg-[hsl(var(--tag-blue-bg))]", fg: "text-[hsl(var(--tag-blue-fg))]", label: "Dev.to" },
};

const sourceLogos: Record<string, string> = {
  devto: "/logos/devto.svg",
  reddit: "/logos/reddit.svg",
  hackernews: "/logos/hackernews.svg",
};

interface TrendItem {
  id: string;
  source: Source;
  sourceLabel: string;
  title: string;
  excerpt?: string;
  metric: string;
  metricLabel: string;
  footerLeft: string;
  footerRight: string;
  url: string;
  thumbnail?: string | null;
}

function transformContent(content: any): TrendItem[] {
  if (!content) return [];
  const items: TrendItem[] = [];

  // Dev.to
  const devto = content.devto?.slice(0, 5) || [];
  devto.forEach((item: any, idx: number) => {
    const p = item.json || item;
    items.push({
      id: `devto-${idx}`,
      source: "devto",
      sourceLabel: "Dev.to / Article",
      title: p.title || "Untitled",
      excerpt: p.description || undefined,
      metric: "Top",
      metricLabel: "weekly",
      footerLeft: p.creator || p.author || "Unknown",
      footerRight: "Read Post →",
      url: p.url || p.link || "#",
      thumbnail: p.image || null,
    });
  });

  // YouTube
  const youtube = content.youtube?.slice(0, 5) || [];
  youtube.forEach((item: any, idx: number) => {
    const p = item.json || item;
    const url = p.url || "#";
    const videoId = url.match?.(/v=([^&]+)/)?.[1];
    items.push({
      id: `youtube-${idx}`,
      source: "youtube",
      sourceLabel: `YouTube / ${p.channel || "Channel"}`,
      title: p.title || "Untitled",
      excerpt: p.description || undefined,
      metric: "Trending",
      metricLabel: "views",
      footerLeft: p.channel || "Unknown",
      footerRight: "Watch →",
      url,
      thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null,
    });
  });

  // GitHub
  const github = content.github?.slice(0, 10) || [];
  github.forEach((item: any, idx: number) => {
    const p = item.json || item;
    const stars = p.stars || p.stargazers_count || 0;
    items.push({
      id: `github-${idx}`,
      source: "github",
      sourceLabel: "GitHub / Trending Repo",
      title: p.title || "Untitled",
      excerpt: p.description || undefined,
      metric: `★ ${typeof stars === "number" ? stars.toLocaleString() : stars}`,
      metricLabel: "stars",
      footerLeft: p.language || p.author || "Unknown",
      footerRight: "View Repo →",
      url: p.url || p.link || p.repoUrl || "#",
    });
  });

  // Reddit
  const reddit = content.reddit?.slice(0, 5) || [];
  reddit.forEach((item: any, idx: number) => {
    const p = item.json || item;
    items.push({
      id: `reddit-${idx}`,
      source: "reddit",
      sourceLabel: p.subreddit ? `Reddit / r/${p.subreddit}` : "Reddit",
      title: p.title || "Untitled",
      metric: p.upvotes ? `+${typeof p.upvotes === "number" ? p.upvotes.toLocaleString() : p.upvotes}` : "Hot",
      metricLabel: "upvotes",
      footerLeft: p.author ? `by ${p.author}` : "Unknown",
      footerRight: "Read Thread →",
      url: p.url || p.link || "#",
    });
  });

  // Hacker News
  const hn = content.hackernews?.slice(0, 5) || [];
  hn.forEach((item: any, idx: number) => {
    const p = item.json || item;
    items.push({
      id: `hn-${idx}`,
      source: "hackernews",
      sourceLabel: "Hacker News",
      title: p.title || "Untitled",
      metric: p.points ? `${p.points} pts` : "Top",
      metricLabel: "points",
      footerLeft: p.author ? `by ${p.author}` : "Unknown",
      footerRight: "Discuss →",
      url: p.url || p.link || "#",
    });
  });

  return items;
}

/* ── Nav ────────────────────────────────────────── */
function Nav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] font-bold tracking-tighter uppercase px-2 py-0.5 bg-foreground text-background">
            AITS
          </span>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest hidden sm:inline">
            AI Trend Scout · Daily Briefing
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-[hsl(15,80%,50%)]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(15,80%,50%)]" />
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              Live · updated daily
            </span>
          </div>
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ───────────────────────────────────────── */
function Hero({
  email,
  setEmail,
  cadence,
  setCadence,
  onSubscribe,
  subscribeStatus,
}: {
  email: string;
  setEmail: (v: string) => void;
  cadence: "daily" | "weekly";
  setCadence: (v: "daily" | "weekly") => void;
  onSubscribe: () => void;
  subscribeStatus: "success" | "error" | null;
}) {
  return (
    <section className="py-20 sm:py-24 border-b border-border stagger-reveal">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-balance leading-[0.9] mb-10">
        Cut through the noise.
        <br />
        <span className="text-[hsl(15,80%,50%)]">Scout what matters.</span>
      </h1>

      <div className="max-w-xl">
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
          Daily-curated extraction of high-gravity AI developments across Reddit,
          GitHub, Hacker News, YouTube and Dev.to.
        </p>

        <div className="p-1 bg-card ring-1 ring-border rounded-xl flex flex-wrap sm:flex-nowrap items-center gap-1 shadow-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="briefing@yourdomain.ai"
            className="flex-1 min-w-[180px] px-4 py-3 outline-none text-sm bg-transparent"
          />
          <div className="flex items-center gap-1 bg-secondary px-1 rounded-lg ring-1 ring-border">
            {(["daily", "weekly"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCadence(c)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors font-mono ${
                  cadence === c
                    ? "bg-card shadow-sm ring-1 ring-border text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={onSubscribe}
            className="bg-foreground text-background px-6 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Subscribe
          </button>
        </div>

        {subscribeStatus && (
          <div className={`mt-3 flex items-center gap-2 text-sm ${
            subscribeStatus === "success" ? "text-green-600" : "text-red-500"
          }`}>
            {subscribeStatus === "success" ? (
              <><CheckCircle className="h-4 w-4" /> Subscribed to the {cadence} briefing!</>
            ) : (
              <><AlertCircle className="h-4 w-4" /> Please enter a valid email address.</>
            )}
          </div>
        )}

        <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Free · No spam · Unsubscribe in one click
        </p>
      </div>
    </section>
  );
}

/* ── Source Tabs ─────────────────────────────────── */
function SourceTabs({
  value,
  onChange,
  counts,
}: {
  value: Filter;
  onChange: (v: Filter) => void;
  counts: Record<Filter, number>;
}) {
  return (
    <div className="flex gap-6 sm:gap-8 border-b border-border overflow-x-auto no-scrollbar">
      {FILTERS.map((f) => {
        const active = value === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`py-4 border-b-2 text-xs font-mono font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
              active
                ? "border-[hsl(15,80%,50%)] text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
            <span className="ml-2 text-[10px] text-muted-foreground font-normal">
              {counts[f.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Trend Card ─────────────────────────────────── */
function TrendCard({ item }: { item: TrendItem }) {
  const tag = SOURCE_TAG[item.source];
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="border-r border-b border-border p-8 group hover:bg-secondary transition-colors flex flex-col"
    >
      <div className="flex justify-between items-start gap-3 mb-6">
        <span className={`px-2 py-0.5 ${tag.bg} ${tag.fg} text-[10px] font-mono font-bold uppercase tracking-tighter`}>
          {item.sourceLabel}
        </span>
        <span className="text-xs font-mono font-bold text-[hsl(15,80%,50%)] whitespace-nowrap">
          {item.metric}
        </span>
      </div>

      {item.thumbnail && (
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <h3 className="text-xl font-bold tracking-tight mb-4 group-hover:underline decoration-[hsl(15,80%,50%)] decoration-2 underline-offset-4">
        {item.title}
      </h3>
      {item.excerpt && (
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{item.excerpt}</p>
      )}
      <div className="mt-auto flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        <span>{item.footerLeft}</span>
        <span className="text-foreground font-bold">{item.footerRight}</span>
      </div>
    </a>
  );
}

/* ── Weekly CTA Card ────────────────────────────── */
function WeeklyCta() {
  return (
    <div className="border-r border-b border-border p-8 bg-foreground text-background flex flex-col justify-center items-center text-center">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4 opacity-60">
        The Weekly Brief
      </span>
      <h3 className="text-2xl font-extrabold tracking-tighter mb-6">
        Get the Sunday Deep-Dive.
      </h3>
      <a
        href="#top"
        className="w-full py-4 bg-background text-foreground text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-opacity text-center inline-block"
      >
        Join the Scouts
      </a>
    </div>
  );
}

/* ── Sticky CTA ─────────────────────────────────── */
function StickyCta() {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email");
      return;
    }
    const sb = getSupabase();
    if (!sb) { toast.error("Service unavailable"); return; }
    const { error } = await sb
      .from("subscribers")
      .insert([{ email: email.trim(), preference: "daily" }]);
    if (error) {
      toast.error("Subscription failed. Try again.");
    } else {
      toast.success("Subscribed to the daily briefing");
      setEmail("");
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl pointer-events-none">
      <form
        onSubmit={handleSubmit}
        className="bg-background/95 border border-border shadow-2xl rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 pointer-events-auto backdrop-blur-xl"
      >
        <div className="hidden sm:flex flex-col">
          <span className="text-[10px] font-mono font-bold uppercase text-[hsl(15,80%,50%)] tracking-tighter">
            AI Trend Scout
          </span>
          <span className="text-xs font-medium">Don&apos;t miss today&apos;s trends.</span>
        </div>
        <div className="flex flex-1 sm:flex-none gap-2">
          <input
            type="email"
            required
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email..."
            className="bg-secondary px-4 py-2 rounded-lg text-xs flex-1 sm:w-48 focus:outline-none ring-1 ring-border"
          />
          <button
            type="submit"
            className="bg-foreground text-background px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Join
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Loading Skeleton ───────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-border">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border-r border-b border-border p-8 flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="h-5 w-32 skeleton-shimmer rounded" />
            <div className="h-5 w-16 skeleton-shimmer rounded" />
          </div>
          <div className="h-6 w-full skeleton-shimmer rounded" />
          <div className="h-4 w-3/4 skeleton-shimmer rounded" />
          <div className="mt-auto flex justify-between">
            <div className="h-3 w-24 skeleton-shimmer rounded" />
            <div className="h-3 w-20 skeleton-shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ──────────────────────────────────── */
export default function Home() {
  const [content, setContent] = useState<any>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [subscribeStatus, setSubscribeStatus] = useState<"success" | "error" | null>(null);
  const [cadence, setCadence] = useState<"daily" | "weekly">("daily");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("devto");

  useEffect(() => {
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

    fetch(
      "https://givtazogkvaoooxtpkfm.supabase.co/storage/v1/object/public/trend-scout/summary"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data[0]?.output) setSummary(data[0].output);
      })
      .catch((err) => console.error("Failed to fetch summary:", err));
  }, []);

  const items = useMemo(() => transformContent(content), [content]);

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      reddit: 0, github: 0, youtube: 0, hackernews: 0, devto: 0,
    };
    for (const it of items) base[it.source] += 1;
    return base;
  }, [items]);

  const visible = useMemo(
    () => items.filter((i) => i.source === filter),
    [filter, items]
  );

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      setSubscribeStatus("error");
      setTimeout(() => setSubscribeStatus(null), 3000);
      return;
    }
    const sb = getSupabase();
    if (!sb) { setSubscribeStatus("error"); return; }
    const { error } = await sb
      .from("subscribers")
      .insert([{ email, preference: cadence }]);
    if (error) {
      setSubscribeStatus("error");
    } else {
      setSubscribeStatus("success");
      setEmail("");
    }
    setTimeout(() => setSubscribeStatus(null), 3000);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Trend Scout",
    url: "https://ai-trend-scout.venkateshraju.me",
    description: "Discover the latest trends in AI, development, and technology from top sources across the web.",
    author: { "@type": "Person", name: "Venkatesh Raju", url: "https://venkateshraju.me" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[hsl(15,80%,50%)] selection:text-white">
        <Nav />
        <main id="top" className="max-w-7xl mx-auto px-6">
          <Hero
            email={email}
            setEmail={setEmail}
            cadence={cadence}
            setCadence={setCadence}
            onSubscribe={handleSubscribe}
            subscribeStatus={subscribeStatus}
          />

          <SourceTabs value={filter} onChange={setFilter} counts={counts} />

          {loading && <LoadingSkeleton />}

          {!loading && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-border">
              {visible.map((item) => (
                <TrendCard key={item.id} item={item} />
              ))}
              <WeeklyCta />
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                No intelligence available. Check back soon.
              </p>
            </div>
          )}

          <footer className="py-12 mt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start gap-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <span>© AI Trend Scout · Curated by algorithms, verified by humans</span>
            <div className="flex gap-4">
              <a href="mailto:me@venkateshraju.in" className="hover:text-foreground transition-colors">Contact</a>
              <a href="https://github.com/venkateshraju04/ai-trend-scout" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            </div>
          </footer>
        </main>

        <div className="h-28" />
        <StickyCta />

        {/* Floating AI Summary Button */}
        {summary && (
          <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
            <DialogTrigger asChild>
              <button className="fixed bottom-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-foreground text-background shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                <Sparkles className="h-5 w-5 group-hover:animate-spin-slow" />
                <span className="text-sm font-semibold hidden sm:inline font-mono uppercase text-[10px] tracking-wider">
                  AI Summary
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-card border border-border rounded-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-foreground text-background">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold">AI-Powered Summary</span>
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <div className="rounded-xl bg-secondary p-6">
                  <p
                    className="text-foreground leading-relaxed text-[15px]"
                    dangerouslySetInnerHTML={{
                      __html: summary.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1 font-mono uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" />
                  Generated by Gemini from today&apos;s trending content
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Toaster position="bottom-right" />
      </div>
    </>
  );
}
