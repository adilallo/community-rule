"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CommunityRule from "../../../../components/type/CommunityRule";
import type { CommunityRuleSection } from "../../../../components/type/CommunityRule/CommunityRule.types";
import Alert from "../../../../components/modals/Alert";
import { useMessages } from "../../../../contexts/MessagesContext";
import { fetchPublishedRuleDetail } from "../../../../../lib/create/api";
import { parsePublishedDocumentForCommunityRuleDisplay } from "../../../../../lib/create/publishedDocumentToDisplaySections";
import {
  readLastPublishedRule,
  writeLastPublishedRule,
} from "../../../../../lib/create/lastPublishedRule";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import {
  CREATE_FLOW_MD_UP_GRID_CELL_CLASS,
  CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS,
} from "../../components/createFlowLayoutTokens";

function initialCompletedUi(
  ruleIdFromUrl: string | null,
): {
  headerTitle: string;
  headerDescription: string | undefined;
  documentSections: CommunityRuleSection[];
} {
  if (ruleIdFromUrl) {
    return {
      headerTitle: "",
      headerDescription: undefined,
      documentSections: [],
    };
  }
  if (typeof sessionStorage === "undefined") {
    return {
      headerTitle: "",
      headerDescription: undefined,
      documentSections: [],
    };
  }
  const stored = readLastPublishedRule();
  if (!stored) {
    return {
      headerTitle: "",
      headerDescription: undefined,
      documentSections: [],
    };
  }
  const parsed = parsePublishedDocumentForCommunityRuleDisplay(stored.document);
  if (parsed.length === 0) {
    return {
      headerTitle: "",
      headerDescription: undefined,
      documentSections: [],
    };
  }
  const sum =
    typeof stored.summary === "string" ? stored.summary.trim() : "";
  return {
    headerTitle: stored.title,
    headerDescription: sum.length > 0 ? sum : undefined,
    documentSections: parsed,
  };
}

export function CompletedScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ruleIdParam = searchParams.get("ruleId");
  const mdUp = useCreateFlowMdUp();
  const m = useMessages();
  const completed = m.create.reviewAndComplete.completed;

  const initial = initialCompletedUi(ruleIdParam);
  const [toastDismissed, setToastDismissed] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(initial.headerTitle);
  const [headerDescription, setHeaderDescription] = useState<
    string | undefined
  >(initial.headerDescription);
  const [documentSections, setDocumentSections] =
    useState<CommunityRuleSection[]>(initial.documentSections);

  useEffect(() => {
    if (!ruleIdParam) return;
    let cancelled = false;
    void (async () => {
      const detail = await fetchPublishedRuleDetail(ruleIdParam);
      if (cancelled) return;
      if (
        !detail ||
        !detail.viewerIsOwner ||
        detail.rule.document === null ||
        typeof detail.rule.document !== "object" ||
        Array.isArray(detail.rule.document)
      ) {
        router.replace(`/rules/${encodeURIComponent(ruleIdParam)}`);
        return;
      }
      const doc = detail.rule.document as Record<string, unknown>;
      writeLastPublishedRule({
        id: detail.rule.id,
        title: detail.rule.title,
        summary: detail.rule.summary,
        document: doc,
      });
      const parsed = parsePublishedDocumentForCommunityRuleDisplay(doc);
      if (parsed.length === 0) {
        router.replace(`/rules/${encodeURIComponent(ruleIdParam)}`);
        return;
      }
      queueMicrotask(() => {
        setDocumentSections(parsed);
        setHeaderTitle(detail.rule.title);
        const sum =
          typeof detail.rule.summary === "string"
            ? detail.rule.summary.trim()
            : "";
        setHeaderDescription(sum.length > 0 ? sum : undefined);
      });
      router.replace("/create/completed");
    })();
    return () => {
      cancelled = true;
    };
  }, [ruleIdParam, router]);

  const toast = !toastDismissed ? (
    <div
      className="fixed bottom-0 left-0 right-0 z-10 w-full"
      role="status"
      aria-live="polite"
    >
      <Alert
        type="toast"
        status="default"
        title={completed.toastTitle}
        description={completed.toastDescription}
        hasLeadingIcon
        hasBodyText
        onClose={() => setToastDismissed(true)}
        className="w-full"
      />
    </div>
  ) : null;

  return (
    <>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[var(--color-teal-teal50,#c9fef9)] md:h-full">
        <div
          className={`mx-auto grid min-h-0 w-full grid-cols-1 gap-4 px-5 max-md:max-w-[639px] max-md:pt-[var(--space-800)] max-md:pb-8 md:h-full md:grid-cols-2 md:justify-items-center md:gap-[var(--measures-spacing-1200,48px)] md:overflow-hidden md:px-12 md:py-0 ${CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS}`}
        >
          <div
            className={`flex flex-col justify-start overflow-hidden md:justify-center md:pb-8 ${CREATE_FLOW_MD_UP_GRID_CELL_CLASS}`}
          >
            <CreateFlowHeaderLockup
              title={headerTitle}
              description={headerDescription}
              justification="left"
              size="L"
              palette="inverse"
            />
          </div>
          <div
            className={`scrollbar-hide relative flex min-h-0 flex-col overflow-x-hidden md:overflow-y-auto ${CREATE_FLOW_MD_UP_GRID_CELL_CLASS}`}
          >
            <div
              className="pointer-events-none sticky top-0 z-10 hidden h-5 shrink-0 bg-gradient-to-b from-[var(--color-teal-teal50,#c9fef9)]/55 from-0% via-[var(--color-teal-teal50,#c9fef9)]/20 via-50% to-transparent md:block"
              aria-hidden
            />
            <div className="w-full min-w-0 py-0 md:pb-8">
              <CommunityRule
                sections={documentSections}
                useCardStyle={!mdUp}
                className={mdUp ? "min-w-0" : "w-full min-w-0 p-4"}
              />
            </div>
          </div>
        </div>
      </div>
      {toast}
    </>
  );
}
