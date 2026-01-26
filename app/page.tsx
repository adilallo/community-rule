import dynamic from "next/dynamic";
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
  const heroBannerData = {
    title: "Collaborate",
    subtitle: "with clarity",
    description:
      "Help your community make important decisions in a way that reflects its unique values.",
    ctaText: "Learn how CommunityRule works",
    ctaHref: "#",
  };

  const numberedCardsData = {
    title: "How CommunityRule works",
    subtitle: "Here's a quick overview of the process, from start to finish.",
    cards: [
      {
        text: "Document how your community makes decisions",
        iconShape: "blob",
        iconColor: "green",
      },
      {
        text: "Build an operating manual for a successful community",
        iconShape: "gear",
        iconColor: "purple",
      },
      {
        text: "Get a link to your manual for your group to review and evolve",
        iconShape: "star",
        iconColor: "orange",
      },
    ],
  };

  const featureGridData = {
    title: "We've got your back, every step of the way",
    subtitle:
      "Use our toolkit to improve, document, and evolve your organization.",
  };

  const askOrganizerData = {
    title: "Still have questions?",
    subtitle: "Get answers from an experienced organizer",
    buttonText: "Ask an organizer",
    buttonHref: "#contact",
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
