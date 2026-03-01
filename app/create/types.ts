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
  | "final-review"
  | "completed";

/**
 * Flow state interface for storing user inputs across all steps
 * Will be expanded in CR-56 with specific field definitions
 */
export interface CreateFlowState {
  // Placeholder structure - will be expanded in CR-56
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
  // Navigation handlers will be added in CR-56
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
