/**
 * Custom hooks for reusable component logic
 *
 * This module exports all custom hooks used throughout the application.
 * Hooks encapsulate complex logic and state management that can be reused
 * across multiple components.
 */

export { useClickOutside } from "./useClickOutside";
export { useAnalytics } from "./useAnalytics";
export { useComponentId } from "./useComponentId";
export { useFormField } from "./useFormField";
export { useComponentStyles } from "./useComponentStyles";
export { useSchemaData } from "./useSchemaData";
export {
  useMediaQuery,
  useIsMobile,
  useIsDesktop,
  BREAKPOINTS,
} from "./useMediaQuery";
export { useFormValidation, validationRules } from "./useFormValidation";
export type {
  SizeStyleConfig,
  StateStyleConfig,
  UseComponentStylesOptions,
} from "./useComponentStyles";
export type {
  SchemaOrganization,
  SchemaWebSite,
  SchemaHowTo,
  SchemaArticle,
  SchemaBreadcrumbList,
} from "./useSchemaData";
export type {
  ValidationRule,
  FieldValidation,
  UseFormValidationOptions,
} from "./useFormValidation";
