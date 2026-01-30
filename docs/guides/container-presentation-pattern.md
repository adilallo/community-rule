# Container/Presentation Pattern

## Overview

The Container/Presentation pattern separates component logic from presentation, improving testability, reusability, and maintainability. This pattern is now the standard for complex components in this codebase.

## Motivation

### Benefits

- **Testability**: Pure presentation components can be tested independently with simple prop assertions
- **Reusability**: Presentation components can be reused with different data sources or logic
- **Maintainability**: Clear separation makes it easier to locate and modify specific concerns
- **Performance**: Easier to optimize rendering with React.memo on pure components

### When to Use

Use this pattern for components that have:
- Business logic or state management
- Data fetching or API calls
- Analytics tracking
- Complex event handlers
- Custom hooks usage
- Dynamic imports or side effects

Simple presentational components (e.g., `Button`, `Avatar`) can remain as single files.

## Folder Structure

Each component following this pattern should have this structure:

```
app/components/[ComponentName]/
  ├── index.tsx                    # Exports container as default
  ├── [ComponentName].container.tsx # Logic, hooks, state management
  ├── [ComponentName].view.tsx     # Pure presentation component
  └── [ComponentName].types.ts     # Shared TypeScript types
```

### File Responsibilities

#### `index.tsx`
- Exports the container component as the default export
- Optionally exports types for external use
- Maintains backward compatibility with existing import paths

```typescript
export { default } from "./AskOrganizer.container";
export type { AskOrganizerProps } from "./AskOrganizer.types";
```

#### `[ComponentName].container.tsx`
**Contains all logic:**
- React hooks (`useState`, `useEffect`, custom hooks)
- Event handlers and business logic
- Data fetching and API calls
- Analytics tracking
- State management
- Computed values and derived state
- Side effects

**Should NOT contain:**
- JSX layout details (beyond composing the view)
- Inline styles or complex className logic (pass as props)
- Direct DOM manipulation

```typescript
"use client";

import { memo } from "react";
import { useAnalytics } from "../../hooks";
import { AskOrganizerView } from "./AskOrganizer.view";
import type { AskOrganizerProps } from "./AskOrganizer.types";

function AskOrganizerContainer(props: AskOrganizerProps) {
  const { trackEvent } = useAnalytics();
  
  const handleContactClick = () => {
    trackEvent({
      event: "contact_button_click",
      category: "engagement",
      component: "AskOrganizer",
    });
    // ... additional logic
  };
  
  // Compute derived props
  const variantStyles = computeVariantStyles(props.variant);
  
  return (
    <AskOrganizerView
      {...props}
      onContactClick={handleContactClick}
      variantStyles={variantStyles}
    />
  );
}

export default memo(AskOrganizerContainer);
```

#### `[ComponentName].view.tsx`
**Pure presentation:**
- Receives all data via props
- Renders JSX based on props
- No hooks, no state, no side effects
- Only imports other presentational components

**Should NOT contain:**
- `useState`, `useEffect`, or any hooks
- Event handler implementations (receive as callbacks)
- Data fetching or API calls
- Analytics tracking
- Business logic

```typescript
import ContentLockup from "../ContentLockup";
import Button from "../Button";
import type { AskOrganizerViewProps } from "./AskOrganizer.types";

export function AskOrganizerView({
  title,
  subtitle,
  description,
  buttonText,
  buttonHref,
  variant,
  onContactClick,
  variantStyles,
  ...props
}: AskOrganizerViewProps) {
  return (
    <section className={variantStyles.container}>
      <ContentLockup
        title={title}
        subtitle={subtitle}
        description={description}
      />
      <Button
        href={buttonHref}
        onClick={onContactClick}
      >
        {buttonText}
      </Button>
    </section>
  );
}
```

#### `[ComponentName].types.ts`
- Shared TypeScript interfaces and types
- Public props interface (used by consumers)
- Internal view props (used between container and view)
- Any utility types specific to the component

```typescript
export interface AskOrganizerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  variant?: "centered" | "left-aligned" | "compact" | "inverse";
  onContactClick?: (data: ContactClickData) => void;
}

export interface AskOrganizerViewProps extends AskOrganizerProps {
  onContactClick: () => void;
  variantStyles: {
    container: string;
    buttonContainer: string;
  };
}
```

## Rules of Thumb

### Container Components

✅ **DO:**
- Use React hooks (`useState`, `useEffect`, custom hooks)
- Handle all event handlers and business logic
- Fetch data and manage loading states
- Track analytics events
- Compute derived values from props/state
- Compose the view component with computed props

❌ **DON'T:**
- Include complex JSX layout (delegate to view)
- Mix presentation logic with business logic
- Access DOM directly (use refs when necessary)

### View Components

✅ **DO:**
- Receive all data via props
- Render JSX based on props
- Import only presentational components
- Use simple conditional rendering
- Accept callback props for user interactions

❌ **DON'T:**
- Use any React hooks
- Manage state or side effects
- Fetch data or make API calls
- Track analytics directly
- Implement business logic
- Access browser APIs directly

## Example: AskOrganizer

### Before (Monolithic)

```typescript
"use client";

import { memo } from "react";
import { useAnalytics } from "../hooks";
import ContentLockup from "./ContentLockup";
import Button from "./Button";

const AskOrganizer = memo(({ title, variant, ...props }) => {
  const { trackEvent } = useAnalytics();
  
  const handleContactClick = () => {
    trackEvent({ event: "contact_click", component: "AskOrganizer" });
  };
  
  return (
    <section>
      <ContentLockup title={title} />
      <Button onClick={handleContactClick}>Ask an organizer</Button>
    </section>
  );
});
```

### After (Container/Presentation)

**AskOrganizer.container.tsx:**
```typescript
"use client";

import { memo } from "react";
import { useAnalytics } from "../../hooks";
import { AskOrganizerView } from "./AskOrganizer.view";
import type { AskOrganizerProps } from "./AskOrganizer.types";

function AskOrganizerContainer(props: AskOrganizerProps) {
  const { trackEvent } = useAnalytics();
  
  const handleContactClick = () => {
    trackEvent({ event: "contact_click", component: "AskOrganizer" });
  };
  
  return <AskOrganizerView {...props} onContactClick={handleContactClick} />;
}

export default memo(AskOrganizerContainer);
```

**AskOrganizer.view.tsx:**
```typescript
import ContentLockup from "../ContentLockup";
import Button from "../Button";
import type { AskOrganizerViewProps } from "./AskOrganizer.types";

export function AskOrganizerView({
  title,
  onContactClick,
  ...props
}: AskOrganizerViewProps) {
  return (
    <section>
      <ContentLockup title={title} />
      <Button onClick={onContactClick}>Ask an organizer</Button>
    </section>
  );
}
```

## Migration Checklist

When converting an existing component to this pattern:

- [ ] **Identify separation points**
  - [ ] List all hooks and state management
  - [ ] List all event handlers and business logic
  - [ ] List all data fetching and side effects
  - [ ] Identify pure presentation JSX

- [ ] **Create folder structure**
  - [ ] Create `[ComponentName]/` folder
  - [ ] Create `[ComponentName].types.ts` with shared types
  - [ ] Create `[ComponentName].view.tsx` with pure presentation
  - [ ] Create `[ComponentName].container.tsx` with all logic
  - [ ] Create `index.tsx` exporting container

- [ ] **Extract types**
  - [ ] Move component props interface to `types.ts`
  - [ ] Create view props interface extending container props
  - [ ] Export types from `index.tsx` for external use

- [ ] **Move presentation to view**
  - [ ] Copy JSX to view component
  - [ ] Remove all hooks and state
  - [ ] Replace event handlers with callback props
  - [ ] Replace computed values with props
  - [ ] Ensure view is a pure function

- [ ] **Move logic to container**
  - [ ] Move all hooks to container
  - [ ] Move event handlers to container
  - [ ] Move data fetching to container
  - [ ] Compute derived props in container
  - [ ] Render view component with computed props

- [ ] **Update exports**
  - [ ] Export container as default from `index.tsx`
  - [ ] Export types from `index.tsx`
  - [ ] Delete original component file
  - [ ] Verify import paths still work

- [ ] **Update tests**
  - [ ] Verify tests still pass (imports should resolve automatically)
  - [ ] Update any tests that relied on implementation details
  - [ ] Add tests for view component with mocked props if needed

- [ ] **Update Storybook**
  - [ ] Verify stories still work (imports should resolve automatically)
  - [ ] Optionally add view-only stories with mocked props

## Refactored Components

The following components have been refactored to use this pattern:

- ✅ **AskOrganizer** - Analytics tracking and event handlers
- ✅ **NumberedCards** - Schema generation with `useSchemaData` hook
- ✅ **FeatureGrid** - Memoized feature data structures
- ✅ **WebVitalsDashboard** - Dynamic imports, data fetching, complex state
- ✅ **Select** - Complex form state management with refs and keyboard navigation

These components serve as reference implementations for the pattern.

## Remaining Components

The following components are candidates for future conversion:

### High Priority (Complex Logic)
- `Header` / `HomeHeader` - Navigation state, conditional rendering logic
- `MenuBar` - Menu state management, keyboard navigation
- `ContextMenu` - Positioning logic, click outside handling
- `RadioGroup` - Group state management
- `ToggleGroup` - Group state management

### Medium Priority (Some Logic)
- `ContentContainer` - Data fetching or transformation
- `RelatedArticles` - Data fetching, filtering logic
- `RuleStack` - Complex rendering logic
- `LogoWall` - Animation or interaction logic

### Low Priority (Mostly Presentational)
- `Button`, `Avatar`, `Checkbox`, `Input`, `TextArea` - Simple presentational components
- `Separator`, `SectionHeader`, `SectionNumber` - Pure presentation
- `QuoteBlock`, `QuoteDecor`, `HeroDecor` - Decorative components

## Best Practices

1. **Start with complex components** - Components with the most logic benefit most from separation
2. **Keep it simple** - Don't over-engineer simple presentational components
3. **Maintain backward compatibility** - Import paths should remain unchanged
4. **Test both layers** - Test container for logic, view for presentation
5. **Document the pattern** - Add comments explaining non-obvious prop flows
6. **Use TypeScript strictly** - Leverage types to enforce the separation

## Additional Resources

- [React Container/Presenter Pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [Separation of Concerns in React](https://react.dev/learn/thinking-in-react)

---

**Last Updated**: April 2025  
**Maintained by**: CommunityRule Development Team
