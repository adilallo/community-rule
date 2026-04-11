"use client";

import { useState, useEffect, useMemo } from "react";
import CommunityRuleDocument from "../../components/sections/CommunityRuleDocument";
import type { CommunityRuleDocumentSection } from "../../components/sections/CommunityRuleDocument/CommunityRuleDocument.types";
import Alert from "../../components/modals/Alert";
import { useMessages } from "../../contexts/MessagesContext";
import { parseDocumentSectionsForDisplay } from "../../../lib/create/buildPublishPayload";
import { readLastPublishedRule } from "../../../lib/create/lastPublishedRule";
import { useCreateFlowMdUp } from "../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../components/CreateFlowHeaderLockup";

/**
 * Completed create flow page.
 * Figma: 20907-213286 (main), 18002-28017 (toast).
 */
export default function CompletedPage() {
  const mdUp = useCreateFlowMdUp();
  const m = useMessages();
  const completed = m.create.completed;

  const fallbackSections = useMemo(
    () =>
      [...completed.fallbackDocumentSections] as CommunityRuleDocumentSection[],
    [completed.fallbackDocumentSections],
  );

  const [toastDismissed, setToastDismissed] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(
    () => completed.fallbackTitle,
  );
  const [headerDescription, setHeaderDescription] = useState<
    string | undefined
  >(() => completed.fallbackDescription);
  const [documentSections, setDocumentSections] =
    useState<CommunityRuleDocumentSection[]>(fallbackSections);

  useEffect(() => {
    const stored = readLastPublishedRule();
    if (!stored) return;
    const parsed = parseDocumentSectionsForDisplay(stored.document);
    if (parsed.length === 0) return;
    // One-shot hydration from client-only storage after mount.
    queueMicrotask(() => {
      setDocumentSections(parsed);
      setHeaderTitle(stored.title);
      const sum =
        typeof stored.summary === "string" ? stored.summary.trim() : "";
      setHeaderDescription(sum.length > 0 ? sum : undefined);
    });
  }, []);

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
        <div className="mx-auto grid min-h-0 w-full max-w-[1280px] grid-cols-1 gap-4 px-5 max-md:max-w-[639px] max-md:pt-[var(--space-800)] max-md:pb-8 md:h-full md:grid-cols-2 md:gap-[var(--measures-spacing-1200,48px)] md:overflow-hidden md:px-12 md:py-0">
          <div className="flex min-w-0 flex-col justify-start overflow-hidden md:justify-center md:pb-8">
            <CreateFlowHeaderLockup
              title={headerTitle}
              description={headerDescription}
              justification="left"
              size="L"
              palette="inverse"
            />
          </div>
          <div className="scrollbar-hide relative flex min-h-0 min-w-0 flex-col overflow-x-hidden md:overflow-y-auto">
            <div
              className="pointer-events-none sticky top-0 z-10 hidden h-5 shrink-0 bg-gradient-to-b from-[var(--color-teal-teal50,#c9fef9)]/55 from-0% via-[var(--color-teal-teal50,#c9fef9)]/20 via-50% to-transparent md:block"
              aria-hidden
            />
            <div className="min-w-0 py-0 md:pb-8">
              <CommunityRuleDocument
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
