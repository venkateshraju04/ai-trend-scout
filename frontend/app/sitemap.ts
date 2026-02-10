import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ai-trend-scout.venkateshraju.me",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
