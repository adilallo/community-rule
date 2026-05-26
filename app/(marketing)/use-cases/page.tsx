import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import messages from "../../../messages/en/index";
import { getAllBlogPosts } from "../../../lib/content";
import PageHeader from "../../components/type/PageHeader";
import CaseStudy from "../../components/cards/CaseStudy";
import UseCasesOrgs from "../../components/sections/UseCasesOrgs";
import QuoteBlock from "../../components/sections/QuoteBlock";
import Groups from "../../components/sections/Groups";
import type { GroupsItem } from "../../components/sections/Groups";
import TripleStep from "../../components/type/TripleStep";
import TripleTextBlock from "../../components/type/TripleTextBlock";
import type { TripleTextBlockColumn } from "../../components/type/TripleTextBlock";
import AskOrganizer from "../../components/sections/AskOrganizer";
import { MarketingRuleStackSection } from "../_components/MarketingRuleStackSection";
import WorkerCoopMark from "../../../public/assets/vector/worker-coop.svg";
import MutualAidMark from "../../../public/assets/vector/mutual-aid.svg";
import OpenSourceMark from "../../../public/assets/vector/open-source.svg";
import DaoMark from "../../../public/assets/vector/dao.svg";

const RelatedArticles = dynamic(
  () => import("../../components/sections/RelatedArticles"),
  {
    loading: () => (
      <section className="min-h-[400px] bg-black py-[var(--spacing-scale-032)]" />
    ),
    ssr: true,
  },
);

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

const CASE_STUDY_TILE_RADIUS_CLASS = "rounded-[23.093px]";

const CASE_STUDY_LINK_CLASS = [
  CASE_STUDY_TILE_RADIUS_CLASS,
  "block shrink-0 cursor-pointer outline-none transition-transform duration-200",
  "hover:scale-[1.02] hover:opacity-95",
  "focus-visible:ring-2 focus-visible:ring-[var(--color-border-default-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-default-primary)]",
  "active:scale-[0.98]",
].join(" ");

/** Matches `pages.useCases.groups.items` order ↔ inlined vector mark components. */
const USE_CASES_GROUP_MARKS = [
  WorkerCoopMark,
  MutualAidMark,
  OpenSourceMark,
  DaoMark,
] as const;

const USE_CASES_RELATED_SENTINEL_SLUG = "__use-cases-page__";

export async function generateMetadata(): Promise<Metadata> {
  const title = messages.metadata.useCases.title;
  const description = messages.metadata.useCases.description;
  const keywords = messages.metadata.useCases.keywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "CommunityRule",
    },
  };
}

export default function UseCasesPage() {
  const page = messages.pages.useCases;

  const tripleColumns = asArray<TripleTextBlockColumn>(page.tripleTextBlock.columns);
  const groupItemsRaw = asArray<{ title: string; description: string }>(
    page.groups.items,
  );

  const groupItems: GroupsItem[] = groupItemsRaw.map((item, index) => {
    const Mark = USE_CASES_GROUP_MARKS[index] ?? USE_CASES_GROUP_MARKS[0];
    return {
      ...item,
      icon: (
        <Mark
          aria-hidden
          className="block size-9 shrink-0"
          width={36}
          height={36}
        />
      ),
    };
  });

  const askOrganizerData = {
    title: page.askOrganizer.title,
    subtitle: page.askOrganizer.subtitle,
    buttonText: page.askOrganizer.buttonText,
  };

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts.slice(0, 8);
  const slugOrder = allPosts.map((p) => p.slug);

  const tripleStepSteps = asArray<{ title: string; body: string }>(
    page.tripleStep.steps,
  );

  const caseStudyLinks = asArray<{ href: string; ariaLabel: string }>(
    page.caseStudyTiles.links,
  );
  const caseStudySurfaces = ["lavender", "neutral", "rose"] as const;
  const caseStudyAlts = [
    page.caseStudyTiles.mutualAidColoradoAlt,
    page.caseStudyTiles.foodNotBombsAlt,
    page.caseStudyTiles.boulderCountyStreetMedicsAlt,
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <PageHeader
        title={page.pageHeader.title}
        headingAlign="center"
        sectionMinimal
        singleLineTitleFromLg
      />

      <UseCasesOrgs>
        {caseStudySurfaces.map((surface, index) => {
          const link = caseStudyLinks[index];
          const card = (
            <CaseStudy surface={surface} imageAlt={caseStudyAlts[index]} />
          );

          if (!link?.href) {
            return <div key={surface}>{card}</div>;
          }

          return (
            <Link
              key={surface}
              href={link.href}
              aria-label={link.ariaLabel}
              className={CASE_STUDY_LINK_CLASS}
            >
              {card}
            </Link>
          );
        })}
      </UseCasesOrgs>

      <QuoteBlock
        variant="statement"
        id="use-cases-statement-quote"
        quote={page.quote.paragraph1}
        quoteSecondary={page.quote.paragraph2}
      />

      <Groups title={page.groups.title} items={groupItems} />

      <TripleStep
        heading={page.tripleStep.heading}
        steps={tripleStepSteps}
        ctaText={page.tripleStep.ctaText}
        ctaHref={page.tripleStep.ctaHref}
      />

      <div className="bg-[var(--color-surface-default-primary)]">
        <Suspense
          fallback={
            <section className="min-h-[400px] py-[var(--spacing-scale-032)]" />
          }
        >
          <MarketingRuleStackSection
            translationNamespace="pages.useCases.ruleStack"
            twoColumnsFromMd
          />
        </Suspense>
      </div>

      <TripleTextBlock
        layoutPreset="useCases"
        title={page.tripleTextBlock.title}
        ctaText={page.tripleTextBlock.ctaText}
        ctaHref={page.tripleTextBlock.ctaHref}
        columns={tripleColumns}
      />

      <div className="bg-black">
        <RelatedArticles
          relatedPosts={relatedPosts}
          currentPostSlug={USE_CASES_RELATED_SENTINEL_SLUG}
          slugOrder={slugOrder}
          variant="useCases"
        />
      </div>

      <section className="bg-[var(--color-surface-default-primary)]">
        <AskOrganizer {...askOrganizerData} />
      </section>
    </div>
  );
}
