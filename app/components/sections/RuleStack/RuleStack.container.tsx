"use client";

import { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logger } from "../../../../lib/logger";
import { prepareFreshCreateFlowEntry } from "../../../(app)/create/utils/prepareFreshCreateFlowEntry";
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
    // Marketing home “Popular templates”: same fresh start as Top “Create rule”
    // (local + server draft when sync) so stale state cannot break template apply.
    void (async () => {
      await prepareFreshCreateFlowEntry();
      router.push(`/create/review-template/${encodeURIComponent(slug)}`);
    })();
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
