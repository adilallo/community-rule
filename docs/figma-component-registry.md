# Figma → component registry

Quick map from the Figma file **Community Rule System** (`agv0VBLiBlcnSAaiAORgPR`) to this repo’s [`app/components/`](/app/components/). Figma uses eleven top-level “❖” areas; `app/components` adds a few app-only buckets (not 1:1 with Figma pages).

| Figma (page) | Code | Notes |
| --- | --- | --- |
| [Utility](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=20515-15809) | `utility/` | Create chrome, tag, scroll, sidebar, dividers, etc. |
| [Asset](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=1240-9089) | **`app/components/asset/`**, **`public/assets/template-mark/`**, **`public/assets/vector/`** | Components under **`asset/`**; flat kebab **`*.svg`** in **`template-mark/`** & **`vector/`** (see conventions below). |
| [Button](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=497-3016) | `buttons/` | PascalCase package per primitive — **`Button/`**, **`InlineTextButton/`** (see conventions below). |
| [Card](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=17865-24349) | `cards/` | One PascalCase package per surface—**`Selection/`** (Figma **Card / CardSelection**), **`CardStack/`**, **`Rule/`** (Figma **Card / Rule**), **`Icon/`**, **`Mini/`**, **`Step/`** (Figma **Card / Step**), **`TemplateReviewCard/`** (see conventions below). |
| [Control](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=5944-58611) | `controls/` | Checkbox, radio, text field, select, toggle, switch, incrementer, upload, multi-select, chip, … (see **Control conventions** below). **`InfoMessageBox`** canonical here. |
| [Layout](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21836-20542) | `layout/` | **`List/`**, **`ListEntry/`** + **`listSizeLayout.ts`**. **Tabs** / **Accordion** are in Figma only—**not** in code yet (see **Layout conventions**). |
| [Modals](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=5944-47704) | `modals/` | Alert, Create, Dialog, Login, Tooltip, **`ModalHeader`** / **`ModalFooter`** (see **Modals conventions**). |
| [Navigation](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=5944-69518) | `navigation/` | **Footer**, **Top**, **`Menu`** + **`MenuItem`**, **Link** matrix — plus create-flow chrome (see **Navigation conventions**, [**CR-104**](https://linear.app/community-rule/issue/CR-104/backlog-design-system-component-cleanup) §8). |
| [Progress](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21163-24443) | `progress/` | **`Stepper`**, **`ProportionBar`** — see **Progress conventions**. |
| [Sections](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=17865-24546) | `sections/` | Marketing / page compositions — see **Sections conventions** ([**CR-104**](https://linear.app/community-rule/issue/CR-104/backlog-design-system-component-cleanup) §10). |
| [Type](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21473-29498) | `type/` | Section header, lockups, numbered list, input label, published rule tree — see **Type conventions** ([**CR-104**](https://linear.app/community-rule/issue/CR-104/backlog-design-system-component-cleanup) §11). |
| — | `content/` | Not a Figma DS page; app content shells / thumbnails. |
| — | `localization/` | Not a Figma DS page; i18n UI. |
| — | `app/(admin)/**/_components/` | Admin-only UI colocated with a route (e.g. **`WebVitalsDashboard`** under **`monitor/_components/`** for **`/monitor`** and **`/api/web-vitals`**). Outside **`app/components/`** buckets; document here when it’s effectively part of the design-system map. |

## Utility conventions (Figma “Utility” canvas)

- **Figma `.utility/Input`** (field primitive) maps to **`controls/TextInput`** (and related control atoms). No separate `utility/Input` component — **Control** is canonical.
- **`InputLabel`** (standalone label + optional help asterisk/helpers) lives under **`type/InputLabel`** (Figma may still nest it under Utility in the file).
- **Lines / rules:** use **`utility/Divider`** only (`content` \| `menu` × horizontal \| vertical). The old **`Separator`** component was removed; Figma aligns with Divider, not a second primitive.
- **Create-flow chrome (`CreateFlowFooter`, `CreateFlowTopNav`)** lives next to **`Top`** / **`Footer`** under **`navigation/`** — wizard shell / step navigation, grouped with other nav-like components even though Figma files it under Utility.
- **Scrims / number indicators:** promote to shared **`utility`** primitives only when reuse is justified; otherwise keep local to screens.

## Button conventions (Figma “Button” canvas)

- **`buttons/Button/`** — **`Button.tsx`** + **`index.tsx`**. Variants (**filled**, **outline**, **ghost**, **danger**) and **`palette`** / **`size`** align with **`lib/propNormalization`**. **`href`** renders an `<a>` when not disabled.
- **`buttons/InlineTextButton/`** — tertiary inline **`<button>`** (underline, inherited typography) for in-paragraph controls—**not** primary actions.

## Control conventions (Figma [“Control”](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=5944-58611) canvas)

Inventory aligns with [**CR-104**](https://linear.app/community-rule/issue/CR-104/backlog-design-system-component-cleanup) §5 (audit only—confirm with product before new primitives).

| Figma (typical control) | Code (`app/components/controls/`) | Notes |
| --- | --- | --- |
| Checkbox + group | **`Checkbox/`**, **`CheckboxGroup/`** | |
| Radio + group | **`RadioButton/`**, **`RadioGroup/`** | |
| Text input (single-line) | **`TextInput/`** | Same primitive as Figma `.utility/Input` matrix (**Utility** calls it out; **Control** is canonical). |
| Select | **`SelectInput/`**, **`SelectOption/`** | `SelectDropdown` lives beside **`SelectInput`** as an implementation detail. |
| Text area | **`TextArea/`** | |
| Toggle (single) | **`Toggle/`** | Not the same as **Toggle Group**. |
| Toggle group | **`ToggleGroup/`** | |
| Switch | **`Switch/`** | |
| Proportion / incrementer | **`Incrementer/`**, **`IncrementerBlock/`** | The **wizard progress bar** is **`progress/ProportionBar`** (Figma **Progress**, not `controls/`). Naming split is intentional until docs/product reconcile—see **CR-104** Naming table + [**CR-60**](https://linear.app/community-rule/issue/CR-60/control-incrementer). |
| Upload | **`Upload/`** | |
| Multi-select | **`MultiSelect/`** | |
| Chip | **`Chip/`** | |
| Field + counter | **`InputWithCounter/`** | Composite. |
| Info / guidance strip | **`InfoMessageBox/`** | May be nested under Utility in the file; **code home** is **`controls/`**. |

**Gaps / TBD:** date picker and other checklist-style items on the Control canvas—**not** assumed shipped; confirm with design.

- **Pattern:** **`container` / `view` / `types`** for heavier controls (**`TextInput`**, **`MultiSelect`**, …); **`index.tsx`** entry per package; enum slices in **`lib/propNormalization`** where listed in **`testing.mdc`**.

## Layout conventions (Figma [“Layout”](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21836-20542) canvas)

Tracks [**CR-104**](https://linear.app/community-rule/issue/CR-104/backlog-design-system-component-cleanup) §6: **inventory only**. **Do not** add **`Tabs`**, **`Accordion`**, or other Layout primitives until a shipped surface needs them and design is agreed—**no scaffold components** for Figma-only patterns.

| Figma (typical) | Code (`app/components/layout/`) | Notes |
| --- | --- | --- |
| List / list container | **`List/`** | **`List.container.tsx`**, **`List.view.tsx`**, **`List.types.ts`**. |
| List item / entry row | **`ListEntry/`** | **`ListEntry.container.tsx`**, **`ListEntry.view.tsx`**, **`ListEntry.types.ts`** (re-exports **`LIST_SIZE_OPTIONS`** consumed by **`List`**). |
| Shared list sizing | **`listSizeLayout.ts`** | Layout constants / classes shared by **`List`** and **`ListEntry`**. |
| List edit | — | No **`ListEdit`** package in this repo today; editing flows may be screen-local or future work—confirm in Figma vs product before introducing a shared primitive. |
| Tabs | — | **Not implemented.** |
| Accordion | — | **Not implemented.** |

**Coverage note:** Figma’s Base / List matrix may be larger than **`List`** / **`ListEntry`** props—parity is **incremental**, not assumed 1:1.

## Modals conventions (Figma [“Modals”](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=5944-47704) canvas)

Inventory aligns with [**CR-104**](https://linear.app/community-rule/issue/CR-104/backlog-design-system-component-cleanup) §7. **No new modal packages** in this pass—only documentation of what already lives in **`app/components/modals/`**.

| Figma (typical) | Code (`app/components/modals/`) | Notes |
| --- | --- | --- |
| Modal / Alert | **`Alert/`** | Toast + banner variants; details in **`alerts.mdc`**. |
| Modal / Create | **`Create/`** | Create-flow modal; **`CreateModalFrame.view.tsx`** + **`useCreateModalA11y.ts`** are **shared** with **`Dialog`**. |
| Modal / Login | **`Login/`** | **`LoginForm.tsx`** is also wired from **`AuthModalContext`** and **`/login`**. |
| Modal / Tooltip | **`Tooltip/`** | |
| Dialog (generic overlay) | **`Dialog/`** | Reuses **`CreateModalFrameView`** and **`useCreateModalA11y`**. |
| Context menu | — | **Not implemented** — removed unused primitives; reintroduce when a shipped surface needs it. |
| Headers / footers (often under Utility in Figma) | **`ModalHeader/`**, **`ModalFooter/`** | Composed chrome; **canonical code** is under **`modals/`**. |

**Gaps / TBD:** **Modal / Share** — product may use share callbacks elsewhere; no dedicated **`Share/`** modal package yet (**CR-104**).

- **Pattern:** **`container` / `view` / `types`** for **`Alert`**, **`Create`**, **`Dialog`**, **`Login`**, **`Tooltip`**, **`ModalHeader`**, **`ModalFooter`**.

## Navigation conventions (Figma [“Navigation”](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=5944-69518) canvas)

Inventory aligns with [**CR-104**](https://linear.app/community-rule/issue/CR-104/backlog-design-system-component-cleanup) §8: **audit / documentation only** — **no new navigation packages** and **no renames** without product/design sign-off.

**Figma (Navigation canvas)** lists **Footer**, "**Top**", **Menu** plus **`.utility/Menu Item`**, and the **Link** property matrix. **Code** (per §8): **`Footer`**, **`Top`** (package **`Top/`**), **`Menu.tsx`** + **`MenuItem/`**, **`NavigationItem`**, **`Link`** — paths below.

| Figma (typical) | Code (`app/components/navigation/`) | Notes |
| --- | --- | --- |
| Navigation / Footer | **`Footer.tsx`** | Marketing site footer; single module at bucket root. |
| Navigation / Top | **`Top/`** | **`Top.container.tsx`**, **`Top.view.tsx`**, **`Top.types.ts`**, **`index.tsx`**. **`TopWithPathname.tsx`** wraps **`Top`**: **`folderTop`** from pathname, session sync (**`initialSignedIn`** from server). |
| Navigation / **Menu**; Figma **`.utility/Menu Item`** | **`Menu.tsx`** + **`MenuItem/`** | **`Menu`** — root **`nav`** (**`role="menubar"`**). **`MenuItem/`** — split package for entries. |
| (same Figma family; composable row) | **`NavigationItem/`** | Split package; rows inside **`Top`** and related shells. Overlap with “menu item” frames is **document-only** — do not assume 1:1 Figma node ↔ file without design. |
| **Link** matrix | **`Link/`** | Next.js **`Link`** wrapper + Figma “Link, CTA” styling; used in nav and content (e.g. **`Rule`**). |
| Create-flow top chrome (often **Utility** in Figma) | **`CreateFlowTopNav/`** | Wizard header; **`CreateFlowLayoutClient`**. |
| Create-flow bottom chrome (often **Utility** in Figma) | **`CreateFlowFooter/`** | Wizard footer + **`ProportionBar`**; **`CreateFlowLayoutClient`**. |
| App shell (not a DS atom) | **`ConditionalNavigation.tsx`**, **`ConditionalNavigationClient.tsx`** | Server: session for first paint. Client: hide global **`Top`** on **`/create/*`** and **`/login`**; else **`TopWithPathname`**. **Tolerated `usePathname()`** — no new pathname-conditional chrome (**`routes.mdc`**). |

**Also under Utility in Figma:** **`CreateFlowTopNav`** / **`CreateFlowFooter`** are filed under Utility but **canonical code** is here with **`Top`** / **`Footer`** (see **Utility conventions**).

**Gaps / TBD (§8):** **`Link`** — Figma carries **many state variants**; the repo may need a **visual parity pass**, not necessarily new files. Confirm with design before treating current props as complete.

**Naming (historical CR-104 note):** Figma **Navigation / Menu** now matches code **`Menu`** + **`MenuItem`** (replacing the older **`MenuBar`** / **`MenuBarItem`** names).

- **Pattern:** **`container` / `view` / `types`** + **`index.tsx`** for **`Top`**, **`CreateFlowTopNav`**, **`CreateFlowFooter`**, **`NavigationItem`**, **`Link`**, **`MenuItem`**. Root **`Menu.tsx`** and **`Footer.tsx`** stay single-file until a split is justified.

## Progress conventions (Figma [“Progress”](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21163-24443) canvas)

Inventory aligns with [**CR-104**](https://linear.app/community-rule/issue/CR-104/backlog-design-system-component-cleanup) §9.

| Figma (typical) | Code (`app/components/progress/`) | Notes |
| --- | --- | --- |
| Progress / Stepper | **`Stepper/`** | **`Stepper.container.tsx`**, **`Stepper.view.tsx`**, **`Stepper.types.ts`**, **`index.tsx`**. Dots use **`role="progressbar"`** with **`active`** (1-based) and **`totalSteps`**. |
| Progress / Bar (multi-segment) | **`ProportionBar/`** | Three background segments + fill layer. **`progress`** is **`ProportionBarState`** (`1-0` … `3-2`; see **`ProportionBar.types.ts`**). Middle-segment ratios for **`2-*`** match Figma (non-uniform; see **`ProportionBar.view.tsx`**). |
| Figma **Control / Proportion** (incrementer) | **`controls/Incrementer/`**, **`IncrementerBlock/`** | **Not** the wizard bar — numeric control. Wizard chrome uses **`ProportionBar`** (see **Control conventions** + [**CR-60**](https://linear.app/community-rule/issue/CR-60/control-incrementer)). |

**Composition:** **`CreateFlowFooter`** (under **`navigation/`**) embeds **`ProportionBar`** in the create-flow shell (Figma often files that chrome under **Utility**).

**Gaps / TBD:** **`ProportionBar` `variant`** (`default` \| `segmented`, from **`lib/propNormalization`**) is **reserved** — both values render the **same** fill today. Extend visually only when design distinguishes them. **`aria-label`** strings in **`ProportionBar.view.tsx`** are **hardcoded English**; move to **`messages/`** if product wants i18n here.

## Sections conventions (Figma [“Sections”](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=17865-24546) canvas)

Inventory aligns with [**CR-104**](https://linear.app/community-rule/issue/CR-104/backlog-design-system-component-cleanup) §10: **audit / documentation** — many Figma blocks are **marketing-only**; confirm roadmap before treating gaps as committed build work.

**Cross-bucket:** Figma **Type / SectionHeader** ([17411:10981](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=17411-10981)) is implemented as **`type/SectionHeader/`** and composed by **`sections/CardSteps`**, **`sections/RuleStack`**, etc. The **Community Rule** long-form body ([16489:4507](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=16489-4507)) is filed under **Sections** in Figma but implemented in **`type/CommunityRule/`** — see **Type conventions**.

| Figma / product (typical) | Code (`app/components/sections/`) | Notes |
| --- | --- | --- |
| Hero | **`HeroBanner/`** | **`HeroBanner.tsx`** + **`HeroDecor.tsx`** + **`index.tsx`** (presentational package). |
| Content banner | **`ContentBanner.tsx`** | Single module at bucket root. |
| Logo wall | **`LogoWall/`** | **`container` / `view` / `types`** + **`index.tsx`**. |
| Card steps (SectionCardSteps) | **`CardSteps/`** | Composes **`cards/Step`** (Figma **Card / Step** — not **`progress/Stepper`**). |
| Rule stack | **`RuleStack/`** | |
| Feature grid | **`FeatureGrid/`** | |
| Quote block | **`QuoteBlock/`** | |
| Ask organizer | **`AskOrganizer/`** | |
| Related content | **`RelatedArticles/`** | Article list / cards — confirm naming vs Figma “related slider” frames. |
| Template grid (governance) | **`GovernanceTemplateGrid/`** | **`GovernanceTemplateGridSkeleton`** colocated. |
| Section index / number | **`SectionNumber.tsx`** | Single module. |

**Gaps / TBD (§10, confirm with design / roadmap):** **PageHeader**, **CardGroup**, **Section Accordion**, **Section / Stats** (hero metrics distinct from **`cards/Step`** — [**CR-59**](https://linear.app/community-rule/issue/CR-59/card-stat)), **Related slider** (vs **`RelatedArticles`** parity), **About header**, **triple-step** / text blocks, **orgs** strip, and other Figma-only compositions.

- **Pattern:** Prefer **`container` / `view` / `types`** + **`index.tsx`** for **new** section composites. Older or small surfaces may stay a **single `*.tsx`** at **`sections/`** root (**`ContentBanner`**, **`SectionNumber`**) — match neighbors when extending.

## Type conventions (Figma [“Type”](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21473-29498) canvas)

Inventory aligns with [**CR-104**](https://linear.app/community-rule/issue/CR-104/backlog-design-system-component-cleanup) §11. Figma **Type** covers section headers (1 vs 3 lines, size tiers), **Header / Content lockups**, **Type / Numbered List** (+ list item), long-form text exemplars, and related typography. In code, those surfaces live under **`app/components/type/`** (plus **`InputLabel`**, which Figma sometimes nests under Utility — see **Utility conventions**).

**Cross-bucket:** **`CommunityRule/`** implements the **Sections** canvas frame **Community Rule** ([**16489:4507**](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=16489-4507)) — typography-first long-form body; **canonical code** is under **`type/`** (not **`sections/`**).

| Figma (typical) | Code (`app/components/type/`) | Notes |
| --- | --- | --- |
| Section header (1 vs 3 lines, responsive sizes) | **`SectionHeader/`** | Figma [**17411:10981**](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=17411-10981). **`SectionHeader.tsx`** + **`index.tsx`**; **`default`** / **`multi-line`**; optional **`stackedDesktopLines`**. Composed by **`sections/CardSteps`**, **`sections/RuleStack`**, etc. |
| Header lockup / content lockup | **`HeaderLockup/`**, **`ContentLockup/`** | **`container` / `view` / `types`** + **`index.tsx`** where split. |
| Type / Numbered List (+ item) | **`NumberedList/`** | **`container` / `view` / `types`** + **`index.tsx`**. |
| `.utility/Input label` (often filed under Utility in Figma) | **`InputLabel/`** | See also **Utility conventions** — **`InputLabel`** is canonical under **`type/`**. |
| “Community Rule” published body (Sections canvas) | **`CommunityRule/`** | Composes **`Section`** + **`TextBlock`**. Category + entries; optional entry **`blocks`**; plain **`body`** splits on blank lines. |
| Community Rule **Section** (rail + category + stack) | **`Section/`** | Figma [**22002:30757**](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22002-30757). Optional vertical rail (`showRail`). |
| Community Rule **Text Block** (title + paragraphs or labeled rows) | **`TextBlock/`** | Figma Utility [**22001:29793**](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22001-29793). **`rows`** for label + body stacks (12px / 8px gaps). |

**Gaps / TBD (§11, confirm with design / roadmap):** Additional large **Type**-canvas text compositions or exemplars that do not map cleanly to **`CommunityRule`**, **`TextBlock`**, or the lockup components may stay **Figma-only** until a shipped surface needs them — same rule as other CR-104 inventories (no scaffold purely for parity).

## Card conventions (Figma “Card” canvas)

- **Pattern:** follow the **container / view / types** split (**`Selection/`**, **`CardStack/`**, **`Rule/`**, **`Icon/`**, **`Mini/`**) unless a component stays a single module (**`Step/`** uses one **`Step.tsx`** + **`index.tsx`** only).
- **`Rule/`** — Figma **Card / Rule**. **`Rule.container.tsx`**, **`Rule.view.tsx`**, **`Rule.types.ts`**.
- **`Selection/`** — Figma **Card / CardSelection** (e.g. `16775:28762`): optional recommended/selected **`Tag`**, label, support text. Stacked layout uses `orientation="horizontal"`; row + info icon + tag right uses `orientation="vertical"`.
- **`Step/`** — Figma **Card / Step** (numbered step tile + text). Shipped on the home page via **`sections/CardSteps`**. Not the **Progress / Stepper** wizard control.
- **`CardStack/`** — selectable stacks + expand affordance for create-flow method pickers (**Figma may still say “Utility / CardStack”;** code lives here).
- **`TemplateReviewCard/`** — template review grid + chip detail modal (**`TemplateChipDetailModal`** colocated in the package).

## Asset conventions (Figma “Asset” canvas)

- **Imports:** use **`asset/icon`** (named **`Icon`** component), **`asset/Logo`**, **`asset/Avatar`**, etc.—same rule as **`buttons/Button`**, no top-level **`asset/index.tsx`** barrel.
- **`asset/icon/`** — **`Icon.tsx`** maps icon names to SVG modules beside it (`arrow_back.svg`, …); **`index.tsx`** re-exports **`Icon`** and **`ICON_NAME_OPTIONS`** / types.
- **`public/assets/vector/<slug>.svg`** — Figma Asset / Vector marks (same kebab **`slug`** convention as **`public/assets/template-mark/`**). Use **`vectorMarkPath(slug)`** in **`lib/assetUtils.ts`**.
- **`asset/Logo`** — Community Rule **`Logo`** component (folder PascalCase, like **`Avatar/`**).
- **`asset/Avatar`** + **`asset/AvatarContainer`** — paired circular image stacks (e.g. top nav). Fuller DS Avatar behavior (**initials**, upload routing, …) tracked as **[CR-58](https://linear.app/community-rule/issue/CR-58)**.

*Update this when you add a new top-level `app/components/*` package or a new Figma canvas.*
