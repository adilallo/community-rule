/**
 * Type definitions for the Create Rule Flow
 *
 * These types define the structure for the full-screen create rule flow,
 * including step types, state management, and context interfaces.
 */

/**
 * Valid step IDs for the create rule flow
 */
export type CreateFlowStep =
  | "informational"
  | "text"
  | "select"
  | "upload"
  | "review"
  | "cards"
  | "right-rail"
  | "confirm-stakeholders"
  | "final-review"
  | "completed";

/**
 * Flow state for inputs across create-flow steps.
 * Validated on `PUT /api/drafts/me` via `createFlowStateSchema` (Zod + JSON safety checks).
 * Additional string keys are allowed at runtime for forward-compatible step data.
 */
export interface CreateFlowState {
  title?: string;
  summary?: string;
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
   * Drives Save & Exit visibility together with `hasCreateFlowUserInput(state)`.
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
