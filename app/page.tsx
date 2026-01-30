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
    title: t("heroBanner.title"),
    subtitle: t("heroBanner.subtitle"),
    description: t("heroBanner.description"),
    ctaText: t("heroBanner.ctaText"),
    ctaHref: t("heroBanner.ctaHref"),
  };

  const numberedCardsData = {
    title: t("numberedCards.title"),
    subtitle: t("numberedCards.subtitle"),
    cards: [
      {
        text: t("numberedCards.cards.card1.text"),
        iconShape: "blob",
        iconColor: "green",
      },
      {
        text: t("numberedCards.cards.card2.text"),
        iconShape: "gear",
        iconColor: "purple",
      },
      {
        text: t("numberedCards.cards.card3.text"),
        iconShape: "star",
        iconColor: "orange",
      },
    ],
  };

  const featureGridData = {
    title: t("featureGrid.title"),
    subtitle: t("featureGrid.subtitle"),
  };

  const askOrganizerData = {
    title: t("askOrganizer.title"),
    subtitle: t("askOrganizer.subtitle"),
    buttonText: t("askOrganizer.buttonText"),
    buttonHref: t("askOrganizer.buttonHref"),
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
