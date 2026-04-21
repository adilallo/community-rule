"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HeaderLockup from "../../components/type/HeaderLockup";
import { GovernanceTemplateGrid } from "../../components/sections/GovernanceTemplateGrid";
import type { TemplateGridCardEntry } from "../../../lib/templates/templateGridPresentation";
import { clearCreateFlowPersistedDrafts } from "../../(app)/create/utils/clearCreateFlowPersistedDrafts";
import { buildTemplateReviewHref } from "../../(app)/create/utils/flowSteps";
import { useTranslation } from "../../contexts/MessagesContext";

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
            fallback={<TemplatesGrid entries={initialGridEntries} fromFlow={false} />}
          >
            <TemplatesGridWithSearchParams entries={initialGridEntries} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

/**
 * Reads `fromFlow=1` off the URL so we can skip the fresh-slate clear when
 * the user arrived from `/create/review`'s "Create from template" button.
 * That button pushes `/templates?fromFlow=1` so their in-progress community
 * stage is preserved when they pick a template here.
 */
function TemplatesGridWithSearchParams({
  entries,
}: {
  entries: TemplateGridCardEntry[];
}) {
  const searchParams = useSearchParams();
  const fromFlow = searchParams.get("fromFlow") === "1";
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
          // Direct entry to `/templates`: treat template click as a fresh
          // create-flow start and wipe any stale anonymous draft before
          // navigating. In-flow entry (`?fromFlow=1`) skips the clear so
          // the user's community stage survives the detour through here.
          clearCreateFlowPersistedDrafts();
        }
        router.push(
          buildTemplateReviewHref(slug, { fromCreateWizard: fromFlow }),
        );
      }}
    />
  );
}
