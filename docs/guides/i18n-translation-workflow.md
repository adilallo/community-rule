# Translations & UI copy workflow

This guide is for **content editors** updating user-visible text. The
implementation contract (file layout, `useMessages` access pattern, key
casing rules) lives in `.cursor/rules/localization.mdc`.

## Where copy lives

All UI text is JSON under `messages/en/`:

```text
messages/en/
  common.json              # shared strings (buttons, links, generic labels)
  navigation.json          # site nav items
  metadata.json            # page <title> / description
  pages/<slug>.json        # one file per page (home, learn, …)
  components/<name>.json   # one file per shared component default
  create/<step>.json       # one file per create-flow step
  index.ts                 # wires all bundles together
```

The split is intentional:

- **`pages/`** — copy that varies by page context (titles, hero subheads).
- **`components/`** — defaults that ride along with a component on every
  page (aria-labels, alt text patterns).
- **`common.json`** — strings reused across many components (e.g. "Cancel",
  "Learn more").
- **`create/`** — wizard step copy (mirrors the `screenId`).

## Editing existing copy

1. Find the bundle: search `messages/en/` for the existing English string.
2. Edit the value. Leave the key alone.
3. Save and run `npm run dev` — text updates on reload.

If you can't find the string, it may still be hard-coded. Open an issue or
ping a developer; do not change the component file directly.

## Adding a new key

1. Decide which bundle owns the copy (page vs component vs common).
2. Add a descriptive camelCase key. Group related copy in nested objects.
3. If you created a new JSON file, register it in `messages/en/index.ts`
   (a developer will help if you're unsure).
4. Reference the key from the component using `useMessages()` (see the
   localization rule for the snippet).

```json
{
  "_comment": "About page hero copy",
  "hero": {
    "title": "About us",
    "subtitle": "Why CommunityRule exists"
  }
}
```

## Style notes

- **camelCase** for structural keys (`compactTitle`, `imageAlt`).
- **kebab-case** for content ids that match a URL slug, card id, or step
  id (`"in-person-meetings"`, `"peer-mediation"`).
- Use `_comment` to leave context for the next editor.
- Keep terminology consistent — search the messages folder before coining a
  new label.

## Adding a new language (future)

1. Create `messages/<locale>/` mirroring `messages/en/`.
2. Translate strings; keep keys identical.
3. Update `messages/en/index.ts` (or split it per locale) — a developer
   will wire the locale switcher.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Key path renders instead of text (e.g. `hero.title`) | Missing key or typo | Check spelling and bundle path |
| Copy doesn't update | Dev server cache | Restart `npm run dev` |
| TypeScript red squiggle | Bundle not registered | Add the import in `messages/en/index.ts` |
