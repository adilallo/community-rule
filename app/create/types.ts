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
  /** Create Custom — communication methods step (`/create/communication-methods`); card ids from `create.communication` presets. */
  selectedCommunicationMethodIds?: string[];
  /** Create Custom — membership / join patterns (`/create/membership-methods`); card ids from `create.membership` presets. */
  selectedMembershipMethodIds?: string[];
  /** Create Custom — decision approaches (`/create/decision-approaches`); card ids from `create.rightRail` presets. */
  selectedDecisionApproachIds?: string[];
  /** Create Custom — conflict management (`/create/conflict-management`); card ids from `create.conflictManagement` presets. */
  selectedConflictManagementIds?: string[];
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
   * True after the user edits any template control (pages use local state until wired to `state`).
   * Drives Save & Exit visibility together with hasCreateFlowUserInput (utils/hasCreateFlowUserInput.ts).
   */
  interactionTouched: boolean;
  markCreateFlowInteraction: () => void;
}

/**
 * Base props interface for page templates
 * Will be expanded in template implementation tickets (CR-51-55)
 */
export interface PageTemplateProps {
  // Base props for all page templates
  // Will be expanded in template tickets
}

/**
 * Navigation handlers interface
 * Will be implemented in CR-56
 */
export interface NavigationHandlers {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (_step: CreateFlowStep) => void;
  canGoNext: () => boolean;
  canGoBack: () => boolean;
}
