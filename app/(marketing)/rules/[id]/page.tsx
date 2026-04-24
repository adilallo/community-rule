import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicPublishedRuleById } from "../../../../lib/server/publishedRules";
import { parseDocumentSectionsForDisplay } from "../../../../lib/create/buildPublishPayload";
import CommunityRuleDocument from "../../../components/sections/CommunityRuleDocument";
import HeaderLockup from "../../../components/type/HeaderLockup";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const rule = await getPublicPublishedRuleById(id);
  if (!rule) {
    return {
      title: "Rule Not Found",
      description: "The requested CommunityRule could not be found.",
    };
  }
  const description =
    typeof rule.summary === "string" && rule.summary.trim().length > 0
      ? rule.summary
      : undefined;
  return {
    title: rule.title,
    description,
    openGraph: {
      title: rule.title,
      description,
      type: "article",
      url: `https://communityrule.com/rules/${rule.id}`,
      siteName: "CommunityRule",
    },
    twitter: {
      card: "summary_large_image",
      title: rule.title,
      description,
    },
  };
}

export default async function PublicRuleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const rule = await getPublicPublishedRuleById(id);
  if (!rule) {
    notFound();
  }

  const sections = parseDocumentSectionsForDisplay(rule.document);
  const description =
    typeof rule.summary === "string" && rule.summary.trim().length > 0
      ? rule.summary
      : undefined;

  return (
    <div className="min-h-screen bg-[var(--color-teal-teal50,#c9fef9)]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[var(--measures-spacing-1200,48px)] px-5 py-[var(--spacing-scale-048,48px)] md:px-12 md:py-[var(--spacing-scale-064,64px)]">
        <HeaderLockup
          title={rule.title}
          description={description}
          justification="left"
          size="L"
          palette="inverse"
        />
        <CommunityRuleDocument sections={sections} />
      </div>
    </div>
  );
}
