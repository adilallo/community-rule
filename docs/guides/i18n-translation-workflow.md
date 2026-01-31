# i18n Translation Workflow Guide

This guide explains how to work with translations in the CommunityRule application. The app uses a hybrid approach combining globalized, shared UI elements with context-aware, localized content pages, making it easy for content creators and contributors to update text without modifying component code.

## Overview

All UI text is stored in JSON files under `messages/en/`. The structure follows best practices:

- **Page-specific content** lives in `pages/` (varies by page context)
- **Component defaults** live in `components/` (shared across pages)
- **Common strings** live in `common.json` (shared UI elements)

Components reference these translations using keys, allowing content to be edited independently of the codebase.

## Directory Structure

```
messages/
  en/
    pages/
      home.json              # Home page specific content
      learn.json             # Learn page specific content
    components/
      heroBanner.json        # Component defaults (aria-labels, alt texts)
      numberedCards.json     # Component defaults
      askOrganizer.json      # Component defaults
      featureGrid.json       # Component defaults
      footer.json            # Shared across pages
      header.json            # Shared across pages
    common.json              # Shared UI strings (buttons, links, labels)
    navigation.json           # Navigation items
    metadata.json            # Page metadata (title, description)
    index.ts                 # Exports all messages
```

## When to Use `pages/` vs `components/`

### Use `pages/` for:

- **Page-specific content**: Titles, subtitles, descriptions that vary by page
- **Context-aware text**: Content that changes based on where the component is used
- **User-facing content**: All text that users see on a specific page

**Example:** The home page hero banner title "Collaborate" goes in `pages/home.json`, not `components/heroBanner.json`

### Use `components/` for:

- **Component defaults**: Aria-labels, alt text patterns, shared behavior text
- **Shared across pages**: Text that doesn't vary by page context
- **Accessibility text**: Aria-labels and alt texts that are component-level

**Example:** The hero banner image alt text "Hero illustration" stays in `components/heroBanner.json` because it's the same across all pages

### Use `common.json` for:

- **Shared UI strings**: Buttons, links, labels used across multiple components
- **Global strings**: Text that appears in many places

## Page-Specific Translations

For page-specific content, use the `pages.*` namespace pattern:

**Server Components:**

```typescript
import messages from "../../messages/en/index";
import { getTranslation } from "../../lib/i18n/getTranslation";

export default function LearnPage() {
  const t = (key: string) => getTranslation(messages, key);

  const contentLockupData = {
    title: t("pages.learn.contentLockup.title"),
    subtitle: t("pages.learn.contentLockup.subtitle"),
  };

  return <ContentLockup {...contentLockupData} />;
}
```

**Client Components:**

```typescript
"use client";
import { useTranslation } from "../../contexts/MessagesContext";

export default function MyComponent() {
  const t = useTranslation("pages.home.heroBanner");
  return <h1>{t("title")}</h1>;
}
```

## Adding New Translation Keys

### 1. Identify the Component

Determine which component needs the translation. If it's a shared string (like a button label), add it to `common.json`. Otherwise, add it to the component-specific file.

### 2. Add the Key to the JSON File

Open the appropriate JSON file and add your translation key. Use descriptive, semantic keys:

**Good:**

```json
{
  "heroBanner": {
    "title": "Collaborate",
    "subtitle": "with clarity"
  }
}
```

**Bad:**

```json
{
  "text1": "Collaborate",
  "text2": "with clarity"
}
```

### 3. Use Nested Objects for Organization

Group related translations together:

```json
{
  "numberedCards": {
    "title": "How CommunityRule works",
    "buttons": {
      "createCommunityRule": "Create CommunityRule",
      "seeHowItWorks": "See how it works"
    }
  }
}
```

### 4. Update the Component or Page

**For Page Components (Server Components):**

```typescript
import messages from "../../messages/en/index";
import { getTranslation } from "../../lib/i18n/getTranslation";

export default function MyPage() {
  const t = (key: string) => getTranslation(messages, key);

  // Use page-specific keys
  const data = {
    title: t("pages.home.heroBanner.title"),
    subtitle: t("pages.home.heroBanner.subtitle"),
  };

  return <HeroBanner {...data} />;
}
```

**For Client Components:**

```typescript
"use client";
import { useTranslation } from "../../contexts/MessagesContext";

export default function MyComponent() {
  // For page-specific content
  const t = useTranslation("pages.home.heroBanner");
  return <h1>{t("title")}</h1>;

  // For component defaults
  const tDefault = useTranslation("heroBanner");
  return <img alt={tDefault("imageAlt")} />;
}
```

## Translation Key Naming Conventions

1. **Use camelCase** for keys: `buttonText`, `ariaLabel`
2. **Use descriptive names**: `createCommunityRule` not `btn1`
3. **Group by component**: Each component has its own namespace
4. **Use nested objects** for related strings: `buttons.createCommunityRule`
5. **Include context in comments**: Use `_comment` fields for clarity

Example:

```json
{
  "_comment": "HeroBanner component translations",
  "title": "Collaborate",
  "subtitle": "with clarity",
  "description": "Help your community make important decisions..."
}
```

## Extracting Strings from Components

When migrating a component to use translations:

1. **Identify hardcoded strings** in the component
2. **Create translation keys** in the appropriate JSON file
3. **Replace hardcoded strings** with `t("key.path")` calls
4. **Test the component** to ensure translations load correctly

### Example Migration

**Before:**

```typescript
export default function HeroBanner() {
  return (
    <div>
      <h1>Collaborate</h1>
      <p>with clarity</p>
    </div>
  );
}
```

**After:**

```typescript
"use client";
import { useTranslations } from "next-intl";

export default function HeroBanner() {
  const t = useTranslations("heroBanner");
  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
    </div>
  );
}
```

## Adding a New Page

When creating a new page that needs translations:

1. **Create a page translation file**: `messages/en/pages/about.json` (for example)
2. **Add page-specific content**: All user-facing text for that page
3. **Import in index.ts**: Add the import and export in `messages/en/index.ts`
4. **Use in page component**: Use `t("pages.about.*")` pattern in your page

**Example:**

```typescript
// messages/en/pages/about.json
{
  "hero": {
    "title": "About Us",
    "subtitle": "Learn more about our mission"
  }
}

// app/about/page.tsx
const t = (key: string) => getTranslation(messages, key);
const title = t("pages.about.hero.title");
```

## Adding New Languages (Future)

When adding support for a new language:

1. **Create a new locale directory**: `messages/es/` (for Spanish, for example)
2. **Copy the English files** as a starting point (including `pages/` structure)
3. **Translate all strings** in the JSON files
4. **Test thoroughly** to ensure all translations are present

## Testing Translations

1. **Check for missing keys**: Ensure all translation keys used in components exist in the JSON files
2. **Verify type safety**: TypeScript will catch typos in translation keys at compile time
3. **Test in browser**: Run the dev server and verify text displays correctly
4. **Check for fallbacks**: Missing translations will show the key path (e.g., `heroBanner.title`)

## Best Practices

### For Content Creators

- **Edit JSON files directly**: No need to understand React or TypeScript
- **Use descriptive comments**: Add `_comment` fields to explain context
- **Maintain consistency**: Use the same terminology across components
- **Test changes**: Run the dev server to see your changes immediately

### For Developers

- **Use TypeScript**: Translation keys are type-safe
- **Namespace when possible**: Use `useTranslations("namespace")` for better organization
- **Server components first**: Prefer server-side translations for better performance
- **Extract incrementally**: Migrate components one at a time

## Common Patterns

### Buttons and CTAs

```json
{
  "buttons": {
    "createCommunityRule": "Create CommunityRule",
    "seeHowItWorks": "See how it works"
  }
}
```

### Aria Labels

```json
{
  "ariaLabels": {
    "followBluesky": "Follow us on Bluesky",
    "followGitlab": "Follow us on GitLab"
  }
}
```

### Dynamic Content

For content that varies (like card text), use arrays or numbered keys:

```json
{
  "cards": {
    "card1": { "text": "First step" },
    "card2": { "text": "Second step" },
    "card3": { "text": "Third step" }
  }
}
```

## Troubleshooting

### Translation Key Not Found

If you see a key path like `heroBanner.title` instead of the text:

1. Check the JSON file exists and has the key
2. Verify the key path matches exactly (case-sensitive)
3. Restart the dev server if you just added the key

### TypeScript Errors

If TypeScript complains about translation keys:

1. Ensure the key exists in the JSON file
2. Check for typos in the key path
3. Verify the namespace is correct if using `useTranslations("namespace")`

### Missing Translations

If text doesn't appear:

1. Check the browser console for errors
2. Verify the component is wrapped in `MessagesProvider` (for client components)
3. Ensure `getTranslation()` is called correctly in server components
4. Check if you're using the correct namespace (`pages.*` vs component defaults)

## Architecture: Hybrid Approach

This implementation follows the recognized best practice of combining:

- **Globalized, shared UI elements**: Component defaults in `components/` (aria-labels, alt texts)
- **Context-aware, localized content pages**: Page-specific content in `pages/` (titles, descriptions)

This allows:

- Components to remain flexible and reusable
- Page content to be easily edited without code changes
- Clear separation between shared defaults and page-specific content
- Scalable structure for adding new pages

## Resources

- Component defaults in `messages/en/components/`
- Page-specific content in `messages/en/pages/`
- Shared UI strings in `messages/en/common.json`

---

**Last Updated**: January 2025  
**Maintained by**: CommunityRule Development Team
