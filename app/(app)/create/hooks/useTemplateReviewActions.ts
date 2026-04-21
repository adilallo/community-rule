"use client";

import { useCallback, useMemo, useState } from "react";
import {
  buildCoreValuesPrefillFromTemplateBody,
  buildTemplateCustomizePrefill,
} from "../../../../lib/create/applyTemplatePrefill";
import { loadTemplateReviewBySlug } from "../../../../lib/create/loadTemplateReviewBySlug";
import messages from "../../../../messages/en/index";
import type { CreateFlowState } from "../types";

type AppRouterLike = { push: (_href: string) => void };
type UpdateState = (_patch: Partial<CreateFlowState>) => void;

export type UseTemplateReviewActionsResult = {
  /** True iff the current pathname is a template-review route (locale/basePath tolerant). */
  isTemplateReviewRoute: boolean;
  /** Decoded slug parsed out of the template-review pathname, or null. */
  templateReviewSlug: string | null;
  /** True between the fetch start and resolution for either action. */
  isApplyingTemplate: boolean;
  /** Set when the template fetch failed or the body was malformed. Cleared at the start of each action. */
  templateReviewApplyError: string | null;
  setTemplateReviewApplyError: (_message: string | null) => void;
  /**
   * Customize: apply the template's selections onto state and route to
   * `/create/core-values` (if community name is set) or `/create/informational`
   * with a `pendingTemplateAction` pin so `/create/review` can later replace
   * itself with `/create/core-values`.
   */
  handleCustomize: () => Promise<void>;
  /**
   * Use without changes: scrub any prior customize picks, seed the core-values
   * snapshot from the template's Values section, drop that section from
   * `state.sections`, and route to `/create/confirm-stakeholders` (or
   * `/create/informational` with a pin to skip past `/create/review` to
   * `/create/confirm-stakeholders` later).
   */
  handleUseWithoutChanges: () => Promise<void>;
};

/**
 * Encapsulates the two template-review footer actions (Customize / Use
 * without changes) plus the small amount of state they share (in-flight
 * flag, error banner, parsed slug). Called from `CreateFlowLayoutClient`
 * once; extracting it here keeps the layout shell focused on rendering
 * rather than orchestrating template fetch + state seeding.
 *
 * @example
 * const {
 *   isTemplateReviewRoute,
 *   templateReviewSlug,
 *   isApplyingTemplate,
 *   templateReviewApplyError,
 *   setTemplateReviewApplyError,
 *   handleCustomize,
 *   handleUseWithoutChanges,
 * } = useTemplateReviewActions({ pathname, state, updateState, resetCustomRuleSelections, router });
 */
export function useTemplateReviewActions({
  pathname,
  state,
  updateState,
  resetCustomRuleSelections,
  router,
}: {
  pathname: string | null | undefined;
  state: CreateFlowState;
  updateState: UpdateState;
  resetCustomRuleSelections: () => void;
  router: AppRouterLike;
}): UseTemplateReviewActionsResult {
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [templateReviewApplyError, setTemplateReviewApplyError] = useState<
    string | null
  >(null);

  const templateReviewSlug = useMemo(() => {
    const m = pathname?.match(/\/create\/review-template\/([^/?#]+)/);
    return m?.[1] ? decodeURIComponent(m[1]) : null;
  }, [pathname]);

  const isTemplateReviewRoute = Boolean(
    pathname?.includes("/create/review-template/"),
  );

  const handleCustomize = useCallback(async () => {
    if (!templateReviewSlug) return;
    setTemplateReviewApplyError(null);
    setIsApplyingTemplate(true);
    const loaded = await loadTemplateReviewBySlug(templateReviewSlug);
    setIsApplyingTemplate(false);
    if (loaded.ok === false) {
      setTemplateReviewApplyError(loaded.message);
      return;
    }
    const prefill = buildTemplateCustomizePrefill(loaded.template.body);
    const hasCommunityName =
      typeof state.title === "string" && state.title.trim().length > 0;
    updateState({
      ...prefill,
      templateReviewBackSlug: undefined,
      ...(hasCommunityName
        ? { pendingTemplateAction: undefined }
        : {
            pendingTemplateAction: {
              slug: templateReviewSlug,
              mode: "customize",
            },
          }),
    });
    router.push(
      hasCommunityName ? "/create/core-values" : "/create/informational",
    );
  }, [router, state.title, templateReviewSlug, updateState]);

  const handleUseWithoutChanges = useCallback(async () => {
    if (!templateReviewSlug) return;
    setTemplateReviewApplyError(null);
    setIsApplyingTemplate(true);
    const loaded = await loadTemplateReviewBySlug(templateReviewSlug);
    setIsApplyingTemplate(false);
    if (loaded.ok === false) {
      setTemplateReviewApplyError(loaded.message);
      return;
    }
    const { template } = loaded;
    const doc = template.body;
    if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
      setTemplateReviewApplyError(
        messages.create.templateReview.errors.applyFailed,
      );
      return;
    }
    const sectionsRaw = (doc as { sections?: unknown }).sections;
    const sections = Array.isArray(sectionsRaw)
      ? (sectionsRaw as Record<string, unknown>[])
      : [];
    if (sections.length === 0) {
      setTemplateReviewApplyError(
        messages.create.templateReview.errors.applyFailed,
      );
      return;
    }

    // Using the template verbatim: scrub any prior customize picks so they
    // don't bleed into `document.coreValues` at publish time.
    resetCustomRuleSelections();

    // Seed the core-values snapshot from the Values section so the
    // final-review chip modal can edit them (it keys edits by chip id).
    // The Values entries themselves are then dropped from `sections` to
    // avoid publishing `document.coreValues` and `document.sections.Values`
    // for the same data — matches the "Customize" path's data shape.
    const coreValuesPrefill = buildCoreValuesPrefillFromTemplateBody(doc);
    const sectionsWithoutValues =
      Object.keys(coreValuesPrefill).length > 0
        ? sections.filter((s) => {
            const name = (s as { categoryName?: unknown }).categoryName;
            if (typeof name !== "string") return true;
            const key = name.toLowerCase().replace(/[^a-z]+/g, "");
            return key !== "values" && key !== "corevalues";
          })
        : sections;

    const summaryRaw =
      typeof template.description === "string"
        ? template.description.trim()
        : "";
    const hasCommunityName =
      typeof state.title === "string" && state.title.trim().length > 0;
    updateState({
      ...coreValuesPrefill,
      sections: sectionsWithoutValues,
      ...(summaryRaw.length > 0 ? { summary: summaryRaw } : {}),
      templateReviewBackSlug: templateReviewSlug,
      ...(hasCommunityName
        ? { pendingTemplateAction: undefined }
        : {
            pendingTemplateAction: {
              slug: templateReviewSlug,
              mode: "useWithoutChanges",
            },
          }),
    });
    router.push(
      hasCommunityName
        ? "/create/confirm-stakeholders"
        : "/create/informational",
    );
  }, [
    resetCustomRuleSelections,
    router,
    state.title,
    templateReviewSlug,
    updateState,
  ]);

  return {
    isTemplateReviewRoute,
    templateReviewSlug,
    isApplyingTemplate,
    templateReviewApplyError,
    setTemplateReviewApplyError,
    handleCustomize,
    handleUseWithoutChanges,
  };
}
