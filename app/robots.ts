import type { MetadataRoute } from "next";

const resolvedSiteUrl = (() => {
  const fallback = "https://ishab.com.np";

  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || fallback);
  } catch {
    return new URL(fallback);
  }
})();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", resolvedSiteUrl).toString(),
    host: resolvedSiteUrl.origin,
  };
}
