import NumberedCards from "./components/NumberedCards";
import HeroBanner from "./components/HeroBanner";
import LogoWall from "./components/LogoWall";
import RuleStack from "./components/RuleStack";
import QuoteBlock from "./components/QuoteBlock";

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

  return (
    <div>
      <HeroBanner {...heroBannerData} />
      <LogoWall />
      <NumberedCards {...numberedCardsData} />
      <RuleStack />
      <QuoteBlock />
    </div>
  );
}
