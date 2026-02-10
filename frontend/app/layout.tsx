import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "AI Trend Scout — Discover Trending AI, Dev & Tech Content",
    template: "%s | AI Trend Scout",
  },
  description:
    "Stay ahead of the curve with AI Trend Scout. Discover the latest trending content in AI, software development, and technology from Dev.to, YouTube, GitHub, Reddit, and Hacker News — all in one place.",
  keywords: [
    "AI trends",
    "tech trends",
    "developer news",
    "trending repositories",
    "GitHub trending",
    "Dev.to articles",
    "Hacker News",
    "Reddit programming",
    "AI news aggregator",
    "software development trends",
    "machine learning news",
    "LLM updates",
    "open source trending",
  ],
  authors: [{ name: "Venkatesh Raju", url: "https://venkateshraju.me" }],
  creator: "Venkatesh Raju",
  publisher: "AI Trend Scout",
  metadataBase: new URL("https://ai-trend-scout.venkateshraju.me"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "AI Trend Scout",
    title: "AI Trend Scout — Discover Trending AI, Dev & Tech Content",
    description:
      "Discover the latest trends in AI, development, and technology from top sources across the web. Updated daily.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Trend Scout — Trending AI & Tech Content",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Trend Scout — Discover Trending AI, Dev & Tech Content",
    description:
      "Stay ahead of the curve. Trending AI, dev & tech content from Dev.to, YouTube, GitHub, Reddit & Hacker News.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
