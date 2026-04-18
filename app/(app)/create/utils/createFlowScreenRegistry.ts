import type { CreateFlowStep } from "../types";

/**
 * Figma layout families for the create flow (not encoded in the URL).
 * `app/(app)/create/screens/<kind>/` mirrors these names: e.g. `layoutKind: "select"` → `screens/select/`,
 * `"card"` → `screens/card/` (compact card-stack frames, distinct from two-column chip selects).
 */
type CreateFlowLayoutKind =
  | "informational"
  | "text"
  | "select"
  | "upload"
  | "review"
  | "card"
  | "right-rail"
  | "completed";

interface CreateFlowScreenDefinition {
  layoutKind: CreateFlowLayoutKind;
  /** Figma node id (file Community-Rule-System), dev mode. */
  figmaNodeId: string;
  /**
   * Namespace for `useTranslation`, e.g. `create.communityName`.
   * Not all screens use i18n the same way (e.g. card step uses `useMessages` elsewhere).
   */
  messageNamespace: string;
  /** Match legacy `text` step: main area vertically centered below `md`. */
  centeredBodyBelowMd: boolean;
}

/**
 * Registry: **distinct URL (`CreateFlowStep`) → Figma + layout**.
 * Source of truth for product order remains `FLOW_STEP_ORDER` in `flowSteps.ts`.
 */
export const CREATE_FLOW_SCREEN_REGISTRY: Record<
  CreateFlowStep,
  CreateFlowScreenDefinition
> = {
  /** Figma: Flow — Informational (node 20094-16005). */
  informational: {
    layoutKind: "informational",
    figmaNodeId: "20094-16005",
    messageNamespace: "create.informational",
    centeredBodyBelowMd: false,
  },
  "community-name": {
    layoutKind: "text",
    figmaNodeId: "20094-18187",
    messageNamespace: "create.communityName",
    centeredBodyBelowMd: true,
  },
  "community-size": {
    layoutKind: "select",
    figmaNodeId: "20094-41317",
    messageNamespace: "create.communitySize",
    centeredBodyBelowMd: false,
  },
  "community-context": {
    layoutKind: "text",
    figmaNodeId: "20094-41243",
    messageNamespace: "create.communityContext",
    centeredBodyBelowMd: true,
  },
  "community-structure": {
    layoutKind: "select",
    figmaNodeId: "20094-18244",
    messageNamespace: "create.communityStructure",
    centeredBodyBelowMd: false,
  },
  "community-upload": {
    layoutKind: "upload",
    figmaNodeId: "20094-41524",
    messageNamespace: "create.communityUpload",
    centeredBodyBelowMd: false,
  },
  "community-save": {
    layoutKind: "text",
    figmaNodeId: "20097-14948",
    messageNamespace: "create.communitySave",
    centeredBodyBelowMd: true,
  },
  review: {
    layoutKind: "review",
    figmaNodeId: "19706-12135",
    messageNamespace: "create.review",
    centeredBodyBelowMd: false,
  },
  "core-values": {
    layoutKind: "select",
    figmaNodeId: "20264-68378",
    messageNamespace: "create.coreValues",
    centeredBodyBelowMd: false,
  },
  "communication-methods": {
    layoutKind: "card",
    figmaNodeId: "20246-15828",
    messageNamespace: "create.communication",
    centeredBodyBelowMd: false,
  },
  "membership-methods": {
    layoutKind: "card",
    figmaNodeId: "20858-13947",
    messageNamespace: "create.membership",
    centeredBodyBelowMd: false,
  },
  "decision-approaches": {
    layoutKind: "right-rail",
    figmaNodeId: "20523-23509",
    messageNamespace: "create.rightRail",
    centeredBodyBelowMd: false,
  },
  "conflict-management": {
    layoutKind: "card",
    figmaNodeId: "20879-15979",
    messageNamespace: "create.conflictManagement",
    centeredBodyBelowMd: false,
  },
  "confirm-stakeholders": {
    layoutKind: "select",
    figmaNodeId: "21104-46594",
    messageNamespace: "create.confirmStakeholders",
    centeredBodyBelowMd: false,
  },
  "final-review": {
    layoutKind: "review",
    figmaNodeId: "20907-212767",
    messageNamespace: "create.finalReview",
    centeredBodyBelowMd: false,
  },
  completed: {
    layoutKind: "completed",
    figmaNodeId: "20907-213286",
    messageNamespace: "create.completed",
    centeredBodyBelowMd: false,
  },
};

export function createFlowStepUsesCenteredTextLayout(
  step: CreateFlowStep | null,
): boolean {
  if (!step) return false;
  return CREATE_FLOW_SCREEN_REGISTRY[step].centeredBodyBelowMd;
}

/** Steps whose main area uses the CardStack-style layout (`layoutKind: "card"`). */
export function createFlowStepUsesCardLayout(
  step: CreateFlowStep | null,
): boolean {
  if (!step) return false;
  return CREATE_FLOW_SCREEN_REGISTRY[step].layoutKind === "card";
}
