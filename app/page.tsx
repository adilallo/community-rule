import dynamic from "next/dynamic";
import messages from "../messages/en/index";
import { getTranslation } from "../lib/i18n/getTranslation";
import HeroBanner from "./components/HeroBanner";
import AskOrganizer from "./components/AskOrganizer";

// Code split below-the-fold components to reduce initial bundle size
const LogoWall = dynamic(() => import("./components/LogoWall"), {
  loading: () => (
    <section className="py-[var(--spacing-scale-032)] min-h-[200px]" />
  ),
  ssr: true,
});

const NumberedCards = dynamic(() => import("./components/NumberedCards"), {
  loading: () => (
    <section className="py-[var(--spacing-scale-032)] min-h-[300px]" />
  ),
  ssr: true,
});

const RuleStack = dynamic(() => import("./components/RuleStack"), {
  loading: () => (
    <section className="py-[var(--spacing-scale-032)] min-h-[400px]" />
  ),
  ssr: true,
});

const FeatureGrid = dynamic(() => import("./components/FeatureGrid"), {
  loading: () => (
    <section className="py-[var(--spacing-scale-032)] min-h-[500px]" />
  ),
  ssr: true,
});

const QuoteBlock = dynamic(() => import("./components/QuoteBlock"), {
  loading: () => (
    <section className="py-[var(--spacing-scale-032)] min-h-[300px]" />
  ),
  ssr: true,
});

export default function Page() {
  // Use direct message access for server components
  // This maintains type safety without requiring external i18n libraries
  const t = (key: string) => getTranslation(messages, key);

  const heroBannerData = {
    title: t("pages.home.heroBanner.title"),
    subtitle: t("pages.home.heroBanner.subtitle"),
    description: t("pages.home.heroBanner.description"),
    ctaText: t("pages.home.heroBanner.ctaText"),
    ctaHref: t("pages.home.heroBanner.ctaHref"),
  };

  const numberedCardsData = {
    title: t("pages.home.numberedCards.title"),
    subtitle: t("pages.home.numberedCards.subtitle"),
    cards: [
      {
        text: t("pages.home.numberedCards.cards.card1.text"),
        iconShape: "blob",
        iconColor: "green",
      },
      {
        text: t("pages.home.numberedCards.cards.card2.text"),
        iconShape: "gear",
        iconColor: "purple",
      },
      {
        text: t("pages.home.numberedCards.cards.card3.text"),
        iconShape: "star",
        iconColor: "orange",
      },
    ],
  };

  const featureGridData = {
    title: t("pages.home.featureGrid.title"),
    subtitle: t("pages.home.featureGrid.subtitle"),
  };

  const askOrganizerData = {
    title: t("pages.home.askOrganizer.title"),
    subtitle: t("pages.home.askOrganizer.subtitle"),
    buttonText: t("pages.home.askOrganizer.buttonText"),
    buttonHref: t("pages.home.askOrganizer.buttonHref"),
  };

  return (
    <div>
      <HeroBanner {...heroBannerData} />
      <LogoWall />
      <NumberedCards {...numberedCardsData} />
      <RuleStack />
      <FeatureGrid {...featureGridData} />
      <QuoteBlock />
      <AskOrganizer {...askOrganizerData} />
    </div>
  );
}
