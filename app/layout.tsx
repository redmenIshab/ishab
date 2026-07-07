import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import resumeData from "../resumeData";

const resolvedSiteUrl = (() => {
  const fallback = resumeData.website?.startsWith("http")
    ? resumeData.website
    : `https://${resumeData.website || "example.com"}`;

  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || fallback);
  } catch {
    return new URL("https://example.com");
  }
})();

const displayFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: resolvedSiteUrl,
  title: {
    default: `${resumeData.name} | ${resumeData.role}`,
    template: `%s | ${resumeData.name}`,
  },
  description: resumeData.aboutme.substring(0, 160),
  alternates: {
    canonical: "/",
  },
  authors: [{ name: resumeData.name }],
  creator: resumeData.name,
  publisher: resumeData.name,
  category: "technology",
  keywords: [
    "Redmen Ishab",
    "Full Stack Engineer",
    "Lead Engineer",
    "Portfolio",
    "Next.js",
    "Software Engineer Nepal",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: `${resumeData.name} Portfolio`,
    title: `${resumeData.name} | ${resumeData.role}`,
    description: resumeData.aboutme.substring(0, 160),
  },
  twitter: {
    card: "summary_large_image",
    title: `${resumeData.name} | ${resumeData.role}`,
    description: resumeData.aboutme.substring(0, 160),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
