import { Inter, Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import messages from "../messages/en/index";
import { ASSETS, getAssetPath } from "../lib/assetUtils";
import "./globals.css";

// `force-dynamic` is now scoped to `(app)/layout.tsx` and `(admin)/layout.tsx`
// (the only groups that read the session via `ConditionalNavigation`). Marketing
// renders a client-side `MarketingNavigation` so its HTML can be statically
// optimized — TTFB drops to CDN speed for guests.
//
// MessagesProvider + AuthModalProvider are mounted per route group (Phase 4b):
// `(marketing)` gets a trimmed slice without `create.*` (~41 KB gzipped saved
// per static page); `(app)`/`(admin)`/`(dev)` get the full tree. See
// `messages/en/marketing.ts` and `docs/perf/next16-eval.md`.

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-bricolage-grotesque",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
  // Below-the-fold (subtitle in `ContentLockup` only). Skipping preload keeps
  // the marketing critical-path bytes for Inter + Bricolage.
  preload: false,
  fallback: ["system-ui", "arial"],
});

const homeMeta = messages.metadata.home;

/** Viewport and favicon use the Metadata / Viewport APIs; avoid a manual `<head>` with a second viewport `meta` (duplicates Next's head injection). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: homeMeta.title,
  description: homeMeta.description,
  keywords: [...homeMeta.keywords],
  authors: [{ name: "Media Economies Design Lab" }],
  creator: "Media Economies Design Lab",
  publisher: "Media Economies Design Lab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://communityrule.com"),
  icons: {
    icon: [
      { url: getAssetPath(ASSETS.LOGO), type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeMeta.title,
    description: homeMeta.description,
    url: "https://communityrule.com",
    siteName: "CommunityRule",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homeMeta.title,
    description: homeMeta.description,
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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Load messages for the default locale (single locale setup)

  return (
    <html lang="en" className="font-sans">
      <head>
        <link
          rel="preload"
          as="image"
          href={getAssetPath(ASSETS.AVATAR_1)}
          type="image/svg+xml"
        />
        <link
          rel="preload"
          as="image"
          href={getAssetPath(ASSETS.AVATAR_2)}
          type="image/svg+xml"
        />
        <link
          rel="preload"
          as="image"
          href={getAssetPath(ASSETS.AVATAR_3)}
          type="image/svg+xml"
        />
      </head>
      <body
        className={`${inter.variable} ${bricolageGrotesque.variable} ${spaceGrotesk.variable}`}
      >
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
