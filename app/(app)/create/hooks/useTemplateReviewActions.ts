"use client";

import { useCallback, useMemo, useState } from "react";
import { buildTemplateCustomizePrefill } from "../../../../lib/create/applyTemplatePrefill";
import { loadTemplateReviewBySlug } from "../../../../lib/create/loadTemplateReviewBySlug";
import { methodSectionsPinsForHydratedSelections } from "../../../../lib/create/publishedDocumentToCreateFlowState";
import { stripCustomRuleSelectionFields } from "../../../../lib/create/stripCustomRuleSelectionFields";
import messages from "../../../../messages/en/index";
import type {
  CreateFlowContextValue,
  CreateFlowState,
} from "../types";

type AppRouterLike = { push: (_href: string) => void };
type UpdateState = CreateFlowContextValue["updateState"];
type ReplaceStateFn = CreateFlowContextValue["replaceState"];

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
   * Use without changes: scrub any prior customize picks, seed core values +
   * method-card selections from the template body (same id mapping as
   * Customize) so drilling from final-review via + shows selected cards, drop
   * the Values row from `state.sections`, and route to
   * `/create/confirm-stakeholders` (or `/create/informational` with a pin to
   * skip past `/create/review` to `/create/confirm-stakeholders` later).
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
 * } = useTemplateReviewActions({ pathname, state, updateState, replaceState, router });
 */
export function useTemplateReviewActions({
  pathname,
  state,
  updateState,
  replaceState,
  router,
}: {
  pathname: string | null | undefined;
  state: CreateFlowState;
  updateState: UpdateState;
  replaceState: ReplaceStateFn;
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
    const pinPatch = methodSectionsPinsForHydratedSelections(prefill);
    const hasCommunityName =
      typeof state.title === "string" && state.title.trim().length > 0;
    updateState({
      ...prefill,
      methodSectionsPinCommitted: {
        ...state.methodSectionsPinCommitted,
        ...pinPatch,
      },
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
  }, [
    router,
    state.methodSectionsPinCommitted,
    state.title,
    templateReviewSlug,
    updateState,
  ]);

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

    const hasCommunityName =
      typeof state.title === "string" && state.title.trim().length > 0;

    // Atomic read-modify-write: strip prior custom-rule picks and merge template
    // body in one replaceState so method ids are never lost across React batching
    // (reset + update separately could leave selections undefined in Strict Mode).
    replaceState((prev) => {
      const base = stripCustomRuleSelectionFields(prev);
      const customizePrefill = buildTemplateCustomizePrefill(doc);
      const hasValuesSeed =
        customizePrefill.selectedCoreValueIds !== undefined;

      const sectionsWithoutValues = hasValuesSeed
        ? sections.filter((s) => {
            const name = (s as { categoryName?: unknown }).categoryName;
            if (typeof name !== "string") return true;
            const key = name.toLowerCase().replace(/[^a-z]+/g, "");
            return key !== "values" && key !== "corevalues";
          })
        : sections;

      const hasCommunityName =
        typeof prev.title === "string" && prev.title.trim().length > 0;

      const pinPatch =
        methodSectionsPinsForHydratedSelections(customizePrefill);

      return {
        ...base,
        ...(hasValuesSeed
          ? {
              selectedCoreValueIds: customizePrefill.selectedCoreValueIds,
              coreValuesChipsSnapshot:
                customizePrefill.coreValuesChipsSnapshot,
            }
          : {}),
        ...(customizePrefill.selectedCommunicationMethodIds !== undefined
          ? {
              selectedCommunicationMethodIds:
                customizePrefill.selectedCommunicationMethodIds,
            }
          : {}),
        ...(customizePrefill.selectedMembershipMethodIds !== undefined
          ? {
              selectedMembershipMethodIds:
                customizePrefill.selectedMembershipMethodIds,
            }
          : {}),
        ...(customizePrefill.selectedDecisionApproachIds !== undefined
          ? {
              selectedDecisionApproachIds:
                customizePrefill.selectedDecisionApproachIds,
            }
          : {}),
        ...(customizePrefill.selectedConflictManagementIds !== undefined
          ? {
              selectedConflictManagementIds:
                customizePrefill.selectedConflictManagementIds,
            }
          : {}),
        sections: sectionsWithoutValues,
        methodSectionsPinCommitted: pinPatch,
        templateReviewBackSlug: templateReviewSlug,
        ...(hasCommunityName
          ? { pendingTemplateAction: undefined }
          : {
              pendingTemplateAction: {
                slug: templateReviewSlug,
                mode: "useWithoutChanges",
              },
            }),
      };
    });
    router.push(
      hasCommunityName
        ? "/create/confirm-stakeholders"
        : "/create/informational",
    );
  }, [replaceState, router, state.title, templateReviewSlug]);

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
