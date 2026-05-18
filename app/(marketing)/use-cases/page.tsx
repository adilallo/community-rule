import type { Metadata } from "next";
import dynamic from "next/dynamic";
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
import { getAssetPath, vectorMarkPath } from "../../../lib/assetUtils";

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

/** Matches `pages.useCases.groups.items` order ↔ `public/assets/vector/*.svg`. */
const USE_CASES_GROUP_VECTOR_SLUGS = [
  "worker-coop",
  "mutual-aid",
  "open-source",
  "dao",
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

  const groupItems: GroupsItem[] = groupItemsRaw.map((item, index) => ({
    ...item,
    icon: (
      /* eslint-disable-next-line @next/next/no-img-element -- small vector marks from `public/assets/vector` */
      <img
        alt=""
        aria-hidden
        className="block size-9 shrink-0 object-contain"
        height={36}
        src={getAssetPath(
          vectorMarkPath(
            USE_CASES_GROUP_VECTOR_SLUGS[index] ?? USE_CASES_GROUP_VECTOR_SLUGS[0],
          ),
        )}
        width={36}
      />
    ),
  }));

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

  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <PageHeader
        title={page.pageHeader.title}
        headingAlign="center"
        sectionMinimal
        singleLineTitleFromLg
      />

      <UseCasesOrgs>
        <CaseStudy
          surface="lavender"
          imageAlt={page.caseStudyTiles.mutualAidColoradoAlt}
        />
        <CaseStudy
          surface="neutral"
          imageAlt={page.caseStudyTiles.foodNotBombsAlt}
        />
        <CaseStudy
          surface="rose"
          imageAlt={page.caseStudyTiles.boulderCountyStreetMedicsAlt}
        />
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
