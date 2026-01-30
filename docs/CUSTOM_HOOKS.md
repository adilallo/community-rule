# Custom Hooks Documentation

This document provides comprehensive documentation for all custom hooks available in the project.

## Overview

Custom hooks encapsulate reusable logic and patterns across components, improving code organization, maintainability, and consistency.

## Available Hooks

### `useClickOutside`

Detects clicks outside of specified elements. Useful for closing dropdowns, modals, or menus.

**Location:** `app/hooks/useClickOutside.ts`

**Usage:**

```tsx
import { useClickOutside } from "../hooks";

const menuRef = useRef<HTMLDivElement>(null);
const buttonRef = useRef<HTMLButtonElement>(null);
const [isOpen, setIsOpen] = useState(false);

useClickOutside([menuRef, buttonRef], () => setIsOpen(false), isOpen);
```

**Parameters:**

- `refs`: Array of refs to elements that should not trigger the callback
- `handler`: Callback function to execute when clicking outside
- `enabled`: Whether the hook is enabled (default: true)

**Example:** Used in `Select.tsx` for closing dropdown menus

---

### `useAnalytics`

Centralized analytics tracking for component interactions. Supports both Google Analytics (gtag) and custom callbacks.

**Location:** `app/hooks/useAnalytics.ts`

**Usage:**

```tsx
import { useAnalytics } from "../hooks";

const { trackEvent, trackCustomEvent } = useAnalytics();

// Standard event tracking
trackEvent({
  event: "button_click",
  category: "engagement",
  label: "contact_button",
  component: "AskOrganizer",
});

// Custom event with callback
trackCustomEvent(
  "contact_button_click",
  {
    component: "AskOrganizer",
    variant: "centered",
  },
  onContactClick, // Optional callback
);
```

**Returns:**

- `trackEvent`: Function to track standard analytics events
- `trackCustomEvent`: Function to track custom events with optional callback

**Example:** Used in `AskOrganizer.tsx` for tracking button clicks

---

### `useComponentId`

Generates unique component IDs for accessibility. Provides consistent ID generation pattern.

**Location:** `app/hooks/useComponentId.ts`

**Usage:**

```tsx
import { useComponentId } from "../hooks";

const { id, labelId } = useComponentId("input", props.id);
// id: "input-123" or props.id if provided
// labelId: "input-123-label"
```

**Parameters:**

- `prefix`: Prefix for the generated ID (e.g., "input", "select")
- `providedId`: Optional ID provided via props (takes precedence)

**Returns:**

- `id`: Component ID
- `labelId`: Associated label ID for accessibility

**Example:** Used in `Input.tsx`, `TextArea.tsx`, `Checkbox.tsx`

---

### `useFormField`

Manages form field event handlers with disabled state handling. Ensures handlers respect disabled state.

**Location:** `app/hooks/useFormField.ts`

**Usage:**

```tsx
import { useFormField } from "../hooks";

const { handleChange, handleFocus, handleBlur } = useFormField(disabled, {
  onChange: (e) => setValue(e.target.value),
  onFocus: (e) => setFocused(true),
  onBlur: (e) => setFocused(false),
});

// Use in component
<input onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />;
```

**Parameters:**

- `disabled`: Whether the field is disabled
- `handlers`: Object containing onChange, onFocus, onBlur handlers

**Returns:**

- `handleChange`: Wrapped onChange handler
- `handleFocus`: Wrapped onFocus handler
- `handleBlur`: Wrapped onBlur handler

**Example:** Used in `Input.tsx`, `TextArea.tsx`

---

### `useComponentStyles`

Manages component size and state styles. Provides a consistent pattern for styling components.

**Location:** `app/hooks/useComponentStyles.ts`

**Usage:**

```tsx
import { useComponentStyles } from "../hooks";

const sizeStyles = {
  small: { input: "h-8 text-xs", label: "text-xs" },
  medium: { input: "h-10 text-sm", label: "text-sm" },
};

const stateStyles = {
  default: { input: "border-gray-300", label: "text-gray-700" },
  focus: { input: "border-blue-500", label: "text-gray-700" },
};

const { sizeClasses, stateClasses } = useComponentStyles({
  size: "medium",
  state: "default",
  disabled: false,
  error: false,
  sizeStyles,
  stateStyles,
});
```

**Note:** This hook is available but styling logic is often component-specific. Consider using it when you have multiple components with similar styling patterns.

---

### `useSchemaData`

Generates Schema.org structured data (JSON-LD) for SEO and search engines.

**Location:** `app/hooks/useSchemaData.ts`

**Usage:**

```tsx
import { useSchemaData } from "../hooks";

// HowTo schema
const schemaData = useSchemaData({
  type: "HowTo",
  name: "How to build a community",
  description: "Step-by-step guide",
  steps: [
    { name: "Step 1", text: "Start here" },
    { name: "Step 2", text: "Continue here" },
  ],
});

// Organization schema
const orgSchema = useSchemaData({
  type: "Organization",
  name: "Media Economies Design Lab",
  url: "https://communityrule.com",
  email: "medlab@colorado.edu",
  sameAs: ["https://twitter.com/medlab"],
});

// Render in component
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
/>;
```

**Supported Types:**

- `Organization` - Organization information
- `WebSite` - Website navigation and search
- `HowTo` - Step-by-step instructions
- `Article` - Blog posts and articles
- `BreadcrumbList` - Navigation breadcrumbs

**Example:** Used in `NumberedCards.tsx`, `Header.tsx`, `Footer.tsx`

---

### `useMediaQuery`

Responsive breakpoint detection using window.matchMedia.

**Location:** `app/hooks/useMediaQuery.ts`

**Usage:**

```tsx
import { useMediaQuery, useIsMobile, useIsDesktop } from "../hooks";

// Using breakpoint key
const isMobile = useMediaQuery("lg", "max");
// Returns true if screen width < 1024px

// Using custom query
const isDesktop = useMediaQuery("(min-width: 1024px)");

// Convenience hooks
const isMobile = useIsMobile(); // Below lg breakpoint
const isDesktop = useIsDesktop(); // lg breakpoint and above
```

**Available Breakpoints:**

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Example:** Used in `RelatedArticles.tsx` for responsive behavior

---

### `useFormValidation`

Form validation with field-level error handling.

**Location:** `app/hooks/useFormValidation.ts`

**Usage:**

```tsx
import { useFormValidation, validationRules } from "../hooks";

const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  validate,
  isValid,
  reset,
} = useFormValidation({
  initialValues: { email: "", password: "" },
  validationRules: {
    email: [validationRules.required, validationRules.email],
    password: [validationRules.required, validationRules.minLength(8)],
  },
  validateOnChange: true,
  validateOnBlur: true,
});

// In component
<input
  name="email"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
/>;
{
  errors.email && touched.email && <span>{errors.email}</span>;
}
```

**Available Validation Rules:**

- `validationRules.required` - Field is required
- `validationRules.email` - Valid email format
- `validationRules.minLength(n)` - Minimum length
- `validationRules.maxLength(n)` - Maximum length
- `validationRules.pattern(regex, message)` - Custom regex pattern

**Returns:**

- `values` - Current form values
- `errors` - Field error messages
- `touched` - Fields that have been interacted with
- `handleChange` - Change handler
- `handleBlur` - Blur handler
- `validate` - Manual validation function
- `isValid` - Boolean indicating if form is valid
- `reset` - Reset form to initial values
- `setValue` - Programmatically set field value

---

## Best Practices

1. **Import from index:** Always import hooks from `app/hooks` index file:

   ```tsx
   import { useAnalytics, useComponentId } from "../hooks";
   ```

2. **TypeScript:** All hooks are fully typed. Use TypeScript for better IDE support.

3. **Testing:** Hooks should be tested independently. See `tests/unit/hooks/` for examples.

4. **Documentation:** When creating new hooks, add JSDoc comments and update this documentation.

5. **Performance:** Hooks use `useMemo` and `useCallback` where appropriate to prevent unnecessary re-renders.

## Refactored Components

The following components have been refactored to use custom hooks:

- **Select** - Uses `useClickOutside` (now uses Container/Presentation pattern)
- **AskOrganizer** - Uses `useAnalytics` (now uses Container/Presentation pattern)
- **Input.tsx** - Uses `useComponentId` and `useFormField`
- **TextArea.tsx** - Uses `useComponentId` and `useFormField`
- **Checkbox.tsx** - Uses `useComponentId`
- **NumberedCards** - Uses `useSchemaData` (now uses Container/Presentation pattern)
- **RelatedArticles.tsx** - Uses `useIsMobile`

> **Note**: Components marked with "Container/Presentation pattern" have been refactored to separate logic (container) from presentation (view). Hooks are used in the container components. See [Container/Presentation Pattern Guide](./guides/container-presentation-pattern.md) for details.

## Adding New Hooks

When creating a new hook:

1. Create the hook file in `app/hooks/`
2. Export it from `app/hooks/index.ts`
3. Add JSDoc comments with examples
4. Write unit tests in `tests/unit/hooks/`
5. Update this documentation
6. Refactor at least one component to use it as a proof of concept

## Testing

All hooks have unit tests in `tests/unit/hooks/`. Run tests with:

```bash
npm test -- tests/unit/hooks
```

## See Also

- [React Hooks Documentation](https://react.dev/reference/react) - Official React hooks documentation
