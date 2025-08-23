import { Inter, Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import "./globals.css";
import HomeHeader from "./components/HomeHeader";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-bricolage-grotesque",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-sans">
      <body
        className={`${inter.variable} ${bricolageGrotesque.variable} ${spaceGrotesk.variable}`}
      >
        <div className="min-h-screen flex flex-col">
          <HomeHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
