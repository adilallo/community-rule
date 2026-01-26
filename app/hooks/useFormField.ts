import { useCallback } from "react";

/**
 * Hook for managing form field event handlers with disabled state handling
 * Ensures handlers respect disabled state and provides consistent behavior
 *
 * @param disabled - Whether the field is disabled
 * @param handlers - Object containing onChange, onFocus, onBlur handlers
 *
 * @returns Object with wrapped handlers that respect disabled state
 *
 * @example
 * ```tsx
 * const { handleChange, handleFocus, handleBlur } = useFormField(disabled, {
 *   onChange: (e) => setValue(e.target.value),
 *   onFocus: (e) => setFocused(true),
 *   onBlur: (e) => setFocused(false),
 * });
 * ```
 */
interface FormFieldHandlers<T = HTMLElement> {
  onChange?: (e: React.ChangeEvent<T>) => void;
  onFocus?: (e: React.FocusEvent<T>) => void;
  onBlur?: (e: React.FocusEvent<T>) => void;
}

interface UseFormFieldReturn<T = HTMLElement> {
  handleChange: (e: React.ChangeEvent<T>) => void;
  handleFocus: (e: React.FocusEvent<T>) => void;
  handleBlur: (e: React.FocusEvent<T>) => void;
}

export function useFormField<T extends HTMLElement = HTMLElement>(
  disabled: boolean,
  handlers: FormFieldHandlers<T>,
): UseFormFieldReturn<T> {
  const { onChange, onFocus, onBlur } = handlers;

  const handleChange = useCallback(
    (e: React.ChangeEvent<T>) => {
      if (!disabled && onChange) {
        onChange(e);
      }
    },
    [disabled, onChange],
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<T>) => {
      if (!disabled && onFocus) {
        onFocus(e);
      }
    },
    [disabled, onFocus],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<T>) => {
      if (!disabled && onBlur) {
        onBlur(e);
      }
    },
    [disabled, onBlur],
  );

  return {
    handleChange,
    handleFocus,
    handleBlur,
  };
}
