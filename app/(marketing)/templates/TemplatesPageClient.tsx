"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HeaderLockup from "../../components/type/HeaderLockup";
import { GovernanceTemplateGrid } from "../../components/sections/GovernanceTemplateGrid";
import type { TemplateGridCardEntry } from "../../../lib/templates/templateGridPresentation";
import { prepareFreshCreateFlowEntry } from "../../(app)/create/utils/prepareFreshCreateFlowEntry";
import {
  buildTemplateReviewHref,
  TEMPLATES_FACET_RECOMMEND_QUERY,
  TEMPLATES_FACET_RECOMMEND_VALUE,
} from "../../(app)/create/utils/flowSteps";
import { useTranslation } from "../../contexts/MessagesContext";
import { useTemplatesFacetGridEntries } from "./useTemplatesFacetGridEntries";

export interface TemplatesPageClientProps {
  initialGridEntries: TemplateGridCardEntry[];
}

/**
 * Full templates index — Figma 22142-898446 (title, intro, 2-col card grid).
 * `initialGridEntries` is computed on the server to avoid a client-side loading flash.
 */
export default function TemplatesPageClient({
  initialGridEntries,
}: TemplatesPageClientProps) {
  const t = useTranslation("pages.templates");

  return (
    <div className="w-full bg-black text-[var(--color-content-default-primary,white)]">
      <div
        className="
        mx-auto w-full max-w-[1280px]
        px-[20px] py-[32px]
        min-[640px]:px-[32px] min-[640px]:py-[40px]
        min-[1024px]:px-[64px] min-[1024px]:py-[48px]
      "
      >
        <div className="flex w-full flex-col gap-2 py-3">
          <HeaderLockup
            title={t("title")}
            description={t("subtitle")}
            justification="left"
            size="L"
          />
        </div>
        <div className="mt-6 min-[1024px]:mt-8">
          {/* Suspense boundary required by `useSearchParams` below
              (Next.js 15+ static-generation contract). */}
          <Suspense
            fallback={
              <TemplatesGrid
                entries={initialGridEntries}
                fromFlow={false}
              />
            }
          >
            <TemplatesGridWithSearchParams
              initialGridEntries={initialGridEntries}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

/**
 * - `fromFlow=1` — skip `prepareFreshCreateFlowEntry` on template click
 *   (draft preserved). Used by review “Create from template” and profile.
 * - `recommendTemplates=1` (with review only) — rank templates + “RECOMMENDED”
 *   from `GET /api/templates?facet.*` using the persisted community draft.
 */
function TemplatesGridWithSearchParams({
  initialGridEntries,
}: {
  initialGridEntries: TemplateGridCardEntry[];
}) {
  const searchParams = useSearchParams();
  const fromFlow = searchParams.get("fromFlow") === "1";
  const enableFacetRecommendations =
    searchParams.get(TEMPLATES_FACET_RECOMMEND_QUERY) ===
    TEMPLATES_FACET_RECOMMEND_VALUE;
  const entries = useTemplatesFacetGridEntries({
    initialGridEntries,
    enableFacetRecommendations,
  });
  return <TemplatesGrid entries={entries} fromFlow={fromFlow} />;
}

function TemplatesGrid({
  entries,
  fromFlow,
}: {
  entries: TemplateGridCardEntry[];
  fromFlow: boolean;
}) {
  const router = useRouter();
  return (
    <GovernanceTemplateGrid
      entries={entries}
      onTemplateClick={(slug) => {
        if (!fromFlow) {
          void (async () => {
            await prepareFreshCreateFlowEntry();
            router.push(
              buildTemplateReviewHref(slug, { fromCreateWizard: fromFlow }),
            );
          })();
          return;
        }
        router.push(
          buildTemplateReviewHref(slug, { fromCreateWizard: fromFlow }),
        );
      }}
    />
  );
}
