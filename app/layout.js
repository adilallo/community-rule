import { Inter, Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import HomeHeader from "./components/HomeHeader";
import Footer from "./components/Footer";
import ConditionalHeader from "./components/ConditionalHeader";

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

export const metadata = {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-sans">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="/favicon.ico"
          type="image/x-icon"
          sizes="16x16"
        />
      </head>
      <body
        className={`${inter.variable} ${bricolageGrotesque.variable} ${spaceGrotesk.variable}`}
      >
        <div className="min-h-screen flex flex-col">
          <ConditionalHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
