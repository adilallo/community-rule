import { useMemo } from "react";

/**
 * Configuration for component size styles
 */
export interface SizeStyleConfig {
  [key: string]: string | Record<string, string>;
}

/**
 * Configuration for component state styles
 */
export interface StateStyleConfig {
  [key: string]: string | Record<string, string>;
}

/**
 * Options for useComponentStyles hook
 */
export interface UseComponentStylesOptions {
  size: string;
  state?: string;
  disabled?: boolean;
  error?: boolean;
  sizeStyles: SizeStyleConfig;
  stateStyles: StateStyleConfig;
  getStateStyles?: (params: {
    state?: string;
    disabled: boolean;
    error: boolean;
  }) => Record<string, string>;
}

/**
 * Hook for managing component size and state styles
 * Provides a consistent pattern for styling components based on size, state, and error/disabled status
 *
 * @param options - Configuration object with size, state, and style definitions
 *
 * @returns Object with computed style classes
 *
 * @example
 * ```tsx
 * const sizeStyles = {
 *   small: { input: "h-8 text-xs", label: "text-xs" },
 *   medium: { input: "h-10 text-sm", label: "text-sm" },
 * };
 *
 * const stateStyles = {
 *   default: { input: "border-gray-300", label: "text-gray-700" },
 *   focus: { input: "border-blue-500", label: "text-gray-700" },
 * };
 *
 * const { sizeClasses, stateClasses } = useComponentStyles({
 *   size: "medium",
 *   state: "default",
 *   disabled: false,
 *   error: false,
 *   sizeStyles,
 *   stateStyles,
 * });
 * ```
 */
export function useComponentStyles(
  options: UseComponentStylesOptions,
): {
  sizeClasses: Record<string, string>;
  stateClasses: Record<string, string>;
} {
  const {
    size,
    state = "default",
    disabled = false,
    error = false,
    sizeStyles,
    stateStyles,
    getStateStyles,
  } = options;

  const sizeClasses = useMemo(() => {
    const sizeConfig = sizeStyles[size] || sizeStyles.medium || {};
    return typeof sizeConfig === "string"
      ? { base: sizeConfig }
      : (sizeConfig as Record<string, string>);
  }, [size, sizeStyles]);

  const stateClasses = useMemo(() => {
    if (getStateStyles) {
      return getStateStyles({ state, disabled, error });
    }

    // Default state style resolution
    if (disabled) {
      return (stateStyles.disabled || {}) as Record<string, string>;
    }

    if (error) {
      return (stateStyles.error || {}) as Record<string, string>;
    }

    const stateConfig = stateStyles[state] || stateStyles.default || {};
    return typeof stateConfig === "string"
      ? { base: stateConfig }
      : (stateConfig as Record<string, string>);
  }, [state, disabled, error, stateStyles, getStateStyles]);

  return {
    sizeClasses,
    stateClasses,
  };
}
