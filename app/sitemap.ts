import type { MetadataRoute } from "next";

const resolvedSiteUrl = (() => {
  const fallback = "https://ishab.com.np";

  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || fallback);
  } catch {
    return new URL(fallback);
  }
})();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: new URL("/", resolvedSiteUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
