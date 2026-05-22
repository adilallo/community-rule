/**
 * Figma: Completed CR — use case community rule demos
 * (21995:39476, 21995:40092, 22015:42413)
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import messages from "../../../../../messages/en/index";
import { resolveUseCaseCompletedRule } from "../../../../../lib/useCaseCompletedRule";
import {
  USE_CASE_DETAIL_SLUGS,
  useCaseContentKeyForSlug,
} from "../../../../../lib/useCaseSyntheticPost";
import { UseCaseCompletedRule } from "./_components/UseCaseCompletedRule.container";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return USE_CASE_DETAIL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveUseCaseCompletedRule(
    slug,
    messages.pages.useCasesCompletedRules,
  );
  if (!resolved) {
    return {};
  }

  const contentKey = useCaseContentKeyForSlug(resolved.slug);
  const meta = messages.metadata.useCasesCompletedRule[contentKey];

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

export default async function UseCaseCompletedRulePage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = resolveUseCaseCompletedRule(
    slug,
    messages.pages.useCasesCompletedRules,
  );
  if (!resolved) {
    notFound();
  }

  return (
    <UseCaseCompletedRule
      slug={resolved.slug}
      fixture={resolved.fixture}
      sections={resolved.sections}
    />
  );
}
