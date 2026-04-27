import { Inter, Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AuthModalProvider } from "./contexts/AuthModalContext";
import { MessagesProvider } from "./contexts/MessagesContext";
import messages from "../messages/en/index";
import "./globals.css";
import ConditionalNavigation from "./components/navigation/ConditionalNavigation";

/** Header reads `cr_session` via Server Components; must not use prerendered guest HTML. */
export const dynamic = "force-dynamic";

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
  preload: true,
  fallback: ["system-ui", "arial"],
});

/** Viewport and favicon use the Metadata / Viewport APIs; avoid a manual `<head>` with a second viewport `meta` (duplicates Next’s head injection). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "CommunityRule - Build operating manuals for successful communities",
  description:
    "Help your community make important decisions in a way that reflects its unique values.",
  keywords: ["community", "governance", "decision-making", "operating manual"],
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
    icon: [{ url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CommunityRule - Build operating manuals for successful communities",
    description:
      "Help your community make important decisions in a way that reflects its unique values.",
    url: "https://communityrule.com",
    siteName: "CommunityRule",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CommunityRule - Build operating manuals for successful communities",
    description:
      "Help your community make important decisions in a way that reflects its unique values.",
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
      <body
        className={`${inter.variable} ${bricolageGrotesque.variable} ${spaceGrotesk.variable}`}
      >
        <MessagesProvider messages={messages}>
          <AuthModalProvider>
            <div className="min-h-screen flex flex-col">
              <ConditionalNavigation />
              {children}
            </div>
          </AuthModalProvider>
        </MessagesProvider>
      </body>
    </html>
  );
}
