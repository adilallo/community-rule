/**
 * Type definitions for the Create Rule Flow
 *
 * These types define the structure for the full-screen create rule flow,
 * including step types, state management, and context interfaces.
 */

/**
 * Valid step IDs for the create rule flow (URL segment after `/create/`).
 * Create Community order matches Figma; `review` closes that stage per design.
 */
export type CreateFlowStep =
  | "informational"
  | "community-name"
  | "community-size"
  | "community-context"
  | "community-structure"
  | "community-upload"
  | "community-save"
  | "review"
  | "core-values"
  | "communication-methods"
  | "membership-methods"
  | "decision-approaches"
  | "conflict-management"
  | "confirm-stakeholders"
  | "final-review"
  | "completed";

/** String keys used by generic text-field steps for `CreateFlowState`. */
export type CreateFlowTextStateField =
  | "title"
  | "summary"
  | "communityContext"
  | "communitySaveEmail";

/**
 * Serialized chip row for `community-structure` (preset + custom labels).
 * Stored in drafts so custom chips survive refresh and server sync.
 */
export type CommunityStructureChipSnapshotRow = {
  id: string;
  label: string;
  state?: string;
};

/** Meaning + violation signals copy for a core value chip (draft + publish). */
export type CoreValueDetailEntry = {
  meaning: string;
  signals: string;
};

/**
 * Flow state for inputs across create-flow steps.
 * Validated on `PUT /api/drafts/me` via `createFlowStateSchema` (Zod + JSON safety checks).
 * Additional string keys are allowed at runtime for forward-compatible step data.
 */
export interface CreateFlowState {
  title?: string;
  summary?: string;
  /** Additional copy fields for multi-step Create Community text frames (Figma). */
  communityContext?: string;
  /** Email collected on the “Save your progress” step (Figma Flow — Text `20097:14948`). */
  communitySaveEmail?: string;
  /** Selected chip ids from `community-size` (MultiSelect). */
  selectedCommunitySizeIds?: string[];
  /** Selected chip ids from `community-structure` (organization types). */
  selectedOrganizationTypeIds?: string[];
  /** Selected chip ids from `community-structure` (scale). */
  selectedScaleIds?: string[];
  /** Selected chip ids from `community-structure` (maturity). */
  selectedMaturityIds?: string[];
  /**
   * Full chip lists for `community-structure` (needed so custom chips round-trip in drafts).
   * IDs alone are insufficient because custom rows are not reconstructible from copy JSON.
   */
  communityStructureChipSnapshots?: {
    organizationTypes?: CommunityStructureChipSnapshotRow[];
    scale?: CommunityStructureChipSnapshotRow[];
    maturity?: CommunityStructureChipSnapshotRow[];
  };
  /** Create Custom — core values step (max five `selectedCoreValueIds`). */
  selectedCoreValueIds?: string[];
  /** Full chip rows for core values (custom labels). */
  coreValuesChipsSnapshot?: CommunityStructureChipSnapshotRow[];
  /** User-authored detail text keyed by chip id (preset ids or custom UUIDs). */
  coreValueDetailsByChipId?: Record<string, CoreValueDetailEntry>;
  /** Create Custom — communication methods step (`/create/communication-methods`); card ids from `create.customRule.communication` presets. */
  selectedCommunicationMethodIds?: string[];
  /** Create Custom — membership / join patterns (`/create/membership-methods`); card ids from `create.customRule.membership` presets. */
  selectedMembershipMethodIds?: string[];
  /** Create Custom — decision approaches (`/create/decision-approaches`); card ids from `create.customRule.decisionApproaches` presets. */
  selectedDecisionApproachIds?: string[];
  /** Create Custom — conflict management (`/create/conflict-management`); card ids from `create.customRule.conflictManagement` presets. */
  selectedConflictManagementIds?: string[];
  /**
   * Set when a user picks a template (Customize or Use without changes) before
   * completing the community stage. The community-review screen consumes this
   * to `router.replace` past `/create/review` to the correct downstream step
   * (`core-values` for customize; `confirm-stakeholders` for use-without-changes)
   * once community data is captured. Cleared the moment the redirect fires, so
   * later visits to `/create/review` render normally.
   */
  pendingTemplateAction?: {
    slug: string;
    mode: "customize" | "useWithoutChanges";
  };
  currentStep?: CreateFlowStep;
  /** Section drafts; structure will tighten as steps persist real shapes. */
  sections?: Record<string, unknown>[];
  /** Stakeholder placeholders until the confirm-stakeholders step defines a schema. */
  stakeholders?: Record<string, unknown>[];
  /** Extra step-specific fields (must be JSON-serializable for server draft sync). */
  [key: string]: unknown;
}

/**
 * Context value interface for CreateFlowContext
 * Provides state management and navigation capabilities
 */
export interface CreateFlowContextValue {
  state: CreateFlowState;
  currentStep: CreateFlowStep | null;
  updateState: (_updates: Partial<CreateFlowState>) => void;
  /** Replace entire flow state (e.g. hydrate from server draft). */
  replaceState: (_next: CreateFlowState) => void;
  /** Reset flow state and clear anonymous localStorage draft keys when present. */
  clearState: () => void;
  /**
   * Scrub only the Create Custom stage selections (core values, communication,
   * membership, decision approaches, conflict management) from state. Keeps
   * the community stage (title, context, size, structure) intact so users can
   * re-enter the custom-rule flow from `/create/review` with a clean slate
   * after a prior "Customize template" prefill.
   */
  resetCustomRuleSelections: () => void;
  /**
   * True after the user has edited any control inside the wizard. Screens flip
   * it via {@link markCreateFlowInteraction} from their event handlers.
   *
   * Current consumer: {@link SignedInDraftHydration} — when a signed-in user
   * has already started editing, we skip replaying their server draft on top
   * of in-progress local state. Save & Exit visibility is driven by step
   * index (`SAVE_EXIT_FROM_STEP_INDEX` in `CreateFlowLayoutClient`), not this
   * flag.
   */
  interactionTouched: boolean;
  markCreateFlowInteraction: () => void;
}
