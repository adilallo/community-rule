/**
 * Figma: use case detail (22015:42619)
 * https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22015-42619
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import messages from "../../../../messages/en/index";
import {
  buildUseCaseSyntheticPost,
  getUseCaseDetailEntry,
  isUseCaseDetailSlug,
  USE_CASE_DETAIL_SLUGS,
  useCaseContentKeyForSlug,
} from "../../../../lib/useCaseSyntheticPost";
import ContentBanner from "../../../components/sections/ContentBanner";
import AskOrganizer from "../../../components/sections/AskOrganizer";
import type { AskOrganizerVariant } from "../../../components/sections/AskOrganizer/AskOrganizer.types";
import "../use-cases.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return USE_CASE_DETAIL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isUseCaseDetailSlug(slug)) {
    return {};
  }

  const contentKey = useCaseContentKeyForSlug(slug);
  const meta = messages.metadata.useCasesDetail[contentKey];

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      siteName: "CommunityRule",
    },
  };
}

export default async function UseCaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isUseCaseDetailSlug(slug)) {
    notFound();
  }

  const detail = messages.pages.useCasesDetail;
  const entry = getUseCaseDetailEntry(slug, detail);
  const syntheticPost = buildUseCaseSyntheticPost(slug, detail);
  const { ruleCard, askOrganizer } = entry;

  const askVariant = (askOrganizer.variant ?? "use-case-detail") as AskOrganizerVariant;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: entry.banner.title,
    description: entry.banner.description,
    url: `https://communityrule.com/use-cases/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "CommunityRule",
      url: "https://communityrule.com",
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://communityrule.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Use cases",
        item: "https://communityrule.com/use-cases",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entry.banner.title,
        item: `https://communityrule.com/use-cases/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

      <div
        className="min-h-screen"
        style={{ background: entry.pageBackground }}
      >
        <ContentBanner
          post={syntheticPost}
          variant="useCase"
          rulePreview={{
            title: ruleCard.title,
            description: ruleCard.description,
            backgroundColor: ruleCard.backgroundColor,
            iconPath: ruleCard.iconPath,
          }}
        />
        <article
          data-figma-node="22015:42622"
          className="flex w-full items-center justify-center self-stretch px-[var(--spacing-scale-024)] py-[var(--spacing-scale-032)] sm:px-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-048)] lg:px-[var(--spacing-scale-064)] xl:px-[256px]"
        >
          <div
            className="use-case-body"
            dangerouslySetInnerHTML={{ __html: syntheticPost.htmlContent }}
          />
        </article>

        <AskOrganizer
          title={askOrganizer.title}
          subtitle={askOrganizer.subtitle}
          buttonText={askOrganizer.buttonText}
          variant={askVariant}
        />
      </div>
    </>
  );
}
