/**
 * Figma: "How Community Rule works" (22078:806964)
 * https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22078-806964
 */
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import messages from "../../../messages/en/index";
import { getAllBlogPosts } from "../../../lib/content";
import {
  buildHowItWorksSyntheticPost,
  HOW_IT_WORKS_SENTINEL_SLUG,
} from "../../../lib/howItWorksSyntheticPost";
import ContentBanner from "../../components/sections/ContentBanner";
import HowItWorksDecorativeShapes from "./_components/HowItWorksDecorativeShapes";
import AskOrganizer from "../../components/sections/AskOrganizer";
import "../blog/blog.css";

const RelatedArticles = dynamic(
  () => import("../../components/sections/RelatedArticles"),
  {
    loading: () => (
      <section className="py-[var(--spacing-scale-032)] min-h-[400px]" />
    ),
    ssr: true,
  },
);

export async function generateMetadata(): Promise<Metadata> {
  const meta = messages.metadata.howItWorks;
  const page = messages.pages.howItWorks;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: page.banner.title,
      description: page.banner.description,
      type: "website",
      siteName: "CommunityRule",
    },
  };
}

export default function HowItWorksPage() {
  const page = messages.pages.howItWorks;
  const syntheticPost = buildHowItWorksSyntheticPost(page);

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts.slice(0, 8);
  const slugOrder = allPosts.map((post) => post.slug);

  const askOrganizerData = {
    title: messages.pages.home.askOrganizer.title,
    subtitle: messages.pages.home.askOrganizer.subtitle,
    buttonText: messages.pages.home.askOrganizer.buttonText,
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.banner.title,
    description: page.banner.description,
    url: "https://communityrule.com/how-it-works",
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
        name: page.banner.title,
        item: "https://communityrule.com/how-it-works",
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

      <div className="relative min-h-screen overflow-x-hidden bg-transparent">
        <ContentBanner post={syntheticPost} variant="guide" />

        <div className="relative w-full">
          <HowItWorksDecorativeShapes />

          <article className="relative z-10 p-[var(--spacing-scale-024)] sm:py-[var(--spacing-scale-032)]">
            <div
              className="post-body -mt-[var(--spacing-scale-048)] text-[var(--color-content-default-primary)] text-[16px] leading-[24px] sm:text-[18px] sm:leading-[130%] lg:text-[24px] lg:leading-[32px] xl:text-[32px] xl:leading-[40px] sm:mx-auto sm:max-w-[390px] md:max-w-[472px] lg:max-w-[700px] xl:max-w-[904px]"
              dangerouslySetInnerHTML={{ __html: syntheticPost.htmlContent }}
            />
          </article>
        </div>

        <RelatedArticles
          relatedPosts={relatedPosts}
          currentPostSlug={HOW_IT_WORKS_SENTINEL_SLUG}
          slugOrder={slugOrder}
          headingSurface="onLight"
          heading={page.relatedArticles.title}
        />

        <AskOrganizer {...askOrganizerData} />
      </div>
    </>
  );
}
