import dynamic from "next/dynamic";
import { Suspense } from "react";
import messages from "../../messages/en/index";
import { getTranslation } from "../../lib/i18n/getTranslation";
import HeroBanner from "../components/sections/HeroBanner";
import AskOrganizer from "../components/sections/AskOrganizer";
import { MarketingRuleStackSection } from "./_components/MarketingRuleStackSection";

// Code split below-the-fold components to reduce initial bundle size
const LogoWall = dynamic(() => import("../components/sections/LogoWall"), {
  loading: () => (
    <section className="py-[var(--spacing-scale-032)] min-h-[200px]" />
  ),
  ssr: true,
});

const CardSteps = dynamic(() => import("../components/sections/CardSteps"), {
  loading: () => (
    <section className="py-[var(--spacing-scale-032)] min-h-[300px]" />
  ),
  ssr: true,
});

const FeatureGrid = dynamic(
  () => import("../components/sections/FeatureGrid"),
  {
    loading: () => (
      <section className="py-[var(--spacing-scale-032)] min-h-[500px]" />
    ),
    ssr: true,
  },
);

const QuoteBlock = dynamic(() => import("../components/sections/QuoteBlock"), {
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

  const cardStepsData = {
    title: t("pages.home.cardSteps.title"),
    subtitle: t("pages.home.cardSteps.subtitle"),
    headingDesktopLines: [
      t("pages.home.cardSteps.headingDesktopLine1"),
      t("pages.home.cardSteps.headingDesktopLine2"),
      t("pages.home.cardSteps.headingDesktopLine3"),
    ] as const,
    steps: [
      {
        text: t("pages.home.cardSteps.cards.card1.text"),
        iconShape: "blob",
        iconColor: "green",
      },
      {
        text: t("pages.home.cardSteps.cards.card2.text"),
        iconShape: "gear",
        iconColor: "purple",
      },
      {
        text: t("pages.home.cardSteps.cards.card3.text"),
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
      <CardSteps {...cardStepsData} />
      <Suspense
        fallback={
          <section className="py-[var(--spacing-scale-032)] min-h-[400px]" />
        }
      >
        <MarketingRuleStackSection />
      </Suspense>
      <FeatureGrid {...featureGridData} />
      <QuoteBlock />
      <AskOrganizer {...askOrganizerData} />
    </div>
  );
}
