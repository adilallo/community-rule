"use client";

import { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logger } from "../../../../lib/logger";
import { clearCreateFlowPersistedDrafts } from "../../../(app)/create/utils/clearCreateFlowPersistedDrafts";
import {
  fetchTemplates,
  isTemplatesFetchAborted,
} from "../../../../lib/create/fetchTemplates";
import { GOVERNANCE_TEMPLATE_HOME_SLUGS } from "../../../../lib/templates/governanceTemplateCatalog";
import { gridEntriesForSlugOrderWithCatalogFallback } from "../../../../lib/templates/templateGridPresentation";
import type { TemplateGridCardEntry } from "../../../../lib/templates/templateGridPresentation";
import { RuleStackView } from "./RuleStack.view";
import type { RuleStackProps } from "./RuleStack.types";

declare global {
  interface Window {
    gtag?: (
      _command: string,
      _eventName: string,
      _params?: Record<string, unknown>,
    ) => void;
    analytics?: {
      track: (_eventName: string, _params?: Record<string, unknown>) => void;
    };
  }
}

const RuleStackContainer = memo<RuleStackProps>(
  ({ className = "", initialGridEntries }) => {
  const router = useRouter();
  const [gridEntries, setGridEntries] = useState<TemplateGridCardEntry[] | null>(
    () => initialGridEntries ?? null,
  );

  useEffect(() => {
    if (initialGridEntries !== undefined) {
      return;
    }
    const ac = new AbortController();
    let cancelled = false;
    void (async () => {
      try {
        const result = await fetchTemplates({ signal: ac.signal });
        if (cancelled) return;
        if ("error" in result) {
          setGridEntries(
            gridEntriesForSlugOrderWithCatalogFallback(
              [],
              GOVERNANCE_TEMPLATE_HOME_SLUGS,
            ),
          );
          return;
        }
        setGridEntries(
          gridEntriesForSlugOrderWithCatalogFallback(
            result,
            GOVERNANCE_TEMPLATE_HOME_SLUGS,
          ),
        );
      } catch (e) {
        if (cancelled || isTemplatesFetchAborted(e)) return;
        setGridEntries(
          gridEntriesForSlugOrderWithCatalogFallback(
            [],
            GOVERNANCE_TEMPLATE_HOME_SLUGS,
          ),
        );
      }
    })();
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [initialGridEntries]);

  const handleTemplateClick = (slug: string) => {
    // Basic analytics tracking
    if (typeof window !== "undefined") {
      if (window.gtag) {
        window.gtag("event", "template_click", {
          template_slug: slug,
        });
      }
      if (window.analytics) {
        window.analytics.track("Template Clicked", {
          templateSlug: slug,
        });
      }
    }
    logger.debug(`${slug} template clicked`);
    // Marketing entry is always a *fresh* create-flow start: wipe any
    // in-progress anonymous draft so a stale community name/structure from
    // an earlier abandoned session can't short-circuit the `state.title`
    // check in `handleCustomizeTemplate` / `handleUseTemplateWithoutChanges`.
    clearCreateFlowPersistedDrafts();
    router.push(`/create/review-template/${encodeURIComponent(slug)}`);
  };

  return (
    <RuleStackView
      className={className}
      onTemplateClick={handleTemplateClick}
      gridEntries={gridEntries}
    />
  );
  },
);

RuleStackContainer.displayName = "RuleStack";

export default RuleStackContainer;
