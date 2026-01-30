# i18n Translation Workflow Guide

This guide explains how to work with translations in the CommunityRule application. The app uses `next-intl` for managing UI text content, making it easy for content creators and contributors to update text without modifying component code.

## Overview

All UI text is stored in JSON files under `messages/en/`. Components reference these translations using keys, allowing content to be edited independently of the codebase.

## Directory Structure

```
messages/
  en/
    common.json              # Shared UI strings (buttons, links, labels)
    components/
      heroBanner.json        # HeroBanner component translations
      numberedCards.json      # NumberedCards component translations
      askOrganizer.json       # AskOrganizer component translations
      featureGrid.json        # FeatureGrid component translations
      footer.json             # Footer component translations
    navigation.json           # Navigation items
    metadata.json             # Page metadata (title, description)
    index.ts                  # Exports all messages
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

### 4. Update the Component

In your component, use the translation hook:

**Server Components:**
```typescript
import { getTranslations } from "next-intl/server";

export default async function MyComponent() {
  const t = await getTranslations();
  return <h1>{t("heroBanner.title")}</h1>;
}
```

**Client Components:**
```typescript
"use client";
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations();
  return <h1>{t("heroBanner.title")}</h1>;
}
```

**Namespace-specific (recommended for component files):**
```typescript
const t = useTranslations("heroBanner");
return <h1>{t("title")}</h1>;
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

## Adding New Languages (Future)

When adding support for a new language:

1. **Create a new locale directory**: `messages/es/` (for Spanish, for example)
2. **Copy the English files** as a starting point
3. **Translate all strings** in the JSON files
4. **Update `app/i18n/routing.ts`** to include the new locale
5. **Test thoroughly** to ensure all translations are present

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
2. Verify the component is wrapped in `NextIntlClientProvider` (for client components)
3. Ensure `getMessages()` is called in server components

## Resources

- [next-intl Documentation](https://next-intl.dev/docs)
- [Next.js Internationalization](https://nextjs.org/docs/app/guides/internationalization)
- Component-specific translation files in `messages/en/components/`

---

**Last Updated**: January 2025  
**Maintained by**: CommunityRule Development Team
