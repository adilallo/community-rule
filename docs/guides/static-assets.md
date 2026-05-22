# Static assets (`public/`)

Convention for files served from `public/`. Path helpers live in
[`lib/assetUtils.ts`](../../lib/assetUtils.ts).

## Folder map

```
public/
  assets/
    icons/              # UI chrome (alert, close, help, pointer)
    logos/              # Brand + social lockups
      partners/         # Logo wall partner SVGs (kebab org slug)
    marketing/          # Hero, feature panels, section numbers, avatars, banners, book cover
    case-study/         # CaseStudy card SVG artwork (canonical)
    shapes/             # Decorative ornaments (stats, quotes, unions, content shapes)
    vector/             # Use-case group marks
    template-mark/      # Governance template SVG marks
    share/              # Share modal channel glyphs
  content/
    blog/               # Per-article SVG thumbnails (see content-creation.md)
```

## Naming rules

- **Directories and filenames:** lowercase kebab-case only.
- **No** PascalCase folders (`Section/`, `Share/`) or Figma-export names
  at the assets root (`Feature_Support.png`, `Icon_Alert.svg`).
- **Prefer** `lib/assetUtils.ts` helpers (`partnerLogoPath`,
  `shareIconPath`, `featurePanelPath`, `ASSETS`, …) over hardcoded
  `/assets/...` strings in components.
- **Blog art** stays under `public/content/blog/` with
  `{slug}-vertical.svg`, `-horizontal.svg`, `-section.svg`, `-tag.svg`.
- **Favicon** reuses `assets/logos/community-rule.svg` (`ASSETS.LOGO` in
  `app/layout.tsx` metadata). Do not place `favicon.ico` or other static
  binaries under `app/` — keep `app/` for routes, layouts, and styles only
  (`globals.css`, `tailwind.css`).

## PNG files and `.gitignore`

`*.png` is listed in `.gitignore`, but marketing and partner PNGs remain
**git-tracked** from before that rule. New PNGs may need `git add -f` to
stage. Raster → SVG conversion is tracked in
[CR-25](https://linear.app/community-rule/issue/CR-25).

## PNG audit (handoff to CR-25)

| Path | Used by | Disposition |
| --- | --- | --- |
| `logos/partners/*.svg` (×6) | LogoWall | **Done** — SVG (kebab org slug, no `logo-` prefix) |
| `marketing/feature-*.png` (×4) | FeatureGrid | **Design review** — convert if vector in Figma, else keep raster |
| `marketing/section-number-*.svg` (×3) | SectionNumber | **Done** — SVG |
| `marketing/avatar-*.svg` (×3) | Avatar / ASSETS | **Done** — SVG |
| `marketing/hero-image.png` | HeroBanner | **Design review** — likely keep raster |
| `marketing/governance-booklet.pdf` | About / Book | **Done** — PDF (`governanceBookletPath()`) |
| `logos/community-rule.svg` | Logo + favicon (`ASSETS.LOGO`) | **Done** — SVG |
| `logos/gitlab.svg` | Footer / social | **Done** — SVG |

## Related docs

- [figma-component-registry.md](../figma-component-registry.md) — Figma Asset
  canvas ↔ `app/components/asset/` and `template-mark/` / `vector/`.
- [content-creation.md](./content-creation.md) — Blog SVG naming under
  `public/content/blog/`.
