import { useState, useCallback, useMemo } from "react";

/**
 * Validation rule function type
 */
export type ValidationRule<T = string> = (_value: T) => string | null;

/**
 * Validation rules for common patterns
 */
export const validationRules = {
  required: (value: unknown): string | null => {
    if (value === null || value === undefined || value === "") {
      return "This field is required";
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value) return null; // Let required handle empty values
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : "Please enter a valid email address";
  },

  minLength:
    (min: number) =>
    (value: string): string | null => {
      if (!value) return null;
      return value.length >= min
        ? null
        : `Must be at least ${min} characters long`;
    },

  maxLength:
    (max: number) =>
    (value: string): string | null => {
      if (!value) return null;
      return value.length <= max
        ? null
        : `Must be no more than ${max} characters long`;
    },

  pattern:
    (regex: RegExp, message: string) =>
    (value: string): string | null => {
      if (!value) return null;
      return regex.test(value) ? null : message;
    },
};

/**
 * Form field validation state
 */
export interface FieldValidation {
  value: string;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

/**
 * Options for useFormValidation hook
 */
export interface UseFormValidationOptions {
  initialValues: Record<string, string>;
  validationRules?: Record<string, ValidationRule[]>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

/**
 * Hook for form validation
 * Provides validation state and handlers for form fields
 *
 * @param options - Configuration object with initial values and validation rules
 *
 * @returns Object with validation state, handlers, and utilities
 *
 * @example
 * ```tsx
 * const {
 *   values,
 *   errors,
 *   touched,
 *   handleChange,
 *   handleBlur,
 *   validate,
 *   isValid,
 * } = useFormValidation({
 *   initialValues: { email: "", password: "" },
 *   validationRules: {
 *     email: [validationRules.required, validationRules.email],
 *     password: [validationRules.required, validationRules.minLength(8)],
 *   },
 * });
 *
 * <input
 *   value={values.email}
 *   onChange={handleChange}
 *   onBlur={handleBlur}
 *   name="email"
 * />
 * {errors.email && <span>{errors.email}</span>}
 * ```
 */
export function useFormValidation(options: UseFormValidationOptions) {
  const {
    initialValues,
    validationRules: rules = {},
    validateOnChange = true,
    validateOnBlur = true,
  } = options;

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Validate a single field
  const validateField = useCallback(
    (name: string, value: string): string | null => {
      const fieldRules = rules[name] || [];
      for (const rule of fieldRules) {
        const error = rule(value);
        if (error) return error;
      }
      return null;
    },
    [rules],
  );

  // Validate all fields
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    Object.keys(values).forEach((name) => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      } else {
        newErrors[name] = null;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  // Handle field change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      if (validateOnChange) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateOnChange, validateField],
  );

  // Handle field blur
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validateOnBlur) {
        const error = validateField(name, values[name]);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateOnBlur, validateField, values],
  );

  // Check if form is valid
  const isValid = useMemo(() => {
    return Object.values(errors).every((error) => error === null);
  }, [errors]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
    setErrors({});
  }, [initialValues]);

  // Set field value programmatically
  const setValue = useCallback(
    (name: string, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      if (validateOnChange) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validateOnChange, validateField],
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    isValid,
    reset,
    setValue,
  };
}
