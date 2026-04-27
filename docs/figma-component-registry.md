# Figma → component registry

Quick map from the Figma file **Community Rule System** (`agv0VBLiBlcnSAaiAORgPR`) to this repo’s [`app/components/`](/app/components/). Figma uses eleven top-level “❖” areas; `app/components` adds a few app-only buckets (not 1:1 with Figma pages).

| Figma (page) | Code | Notes |
| --- | --- | --- |
| [Utility](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=20515-15809) | `utility/` | Create chrome, modals header/footer, tag, scroll, sidebar, dividers, etc. |
| [Asset](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=1240-9089) | `asset/` + `icons/` | Icons, logos; Avatar component currently under `icons/Avatar.tsx` |
| [Button](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=497-3016) | `buttons/` | Figma `Button/`; code uses plural folder name. |
| [Card](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=17865-24349) | `cards/` | Step / rule / icon / selection style cards. |
| [Control](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=5944-58611) | `controls/` | Inputs, toggles, select, switch, upload, etc. |
| [Layout](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21836-20542) | `layout/` | List / list entry / list edit. |
| [Modals](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=5944-47704) | `modals/` | Alert, create, dialog, login, tooltip, context menu, … |
| [Navigation](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=5944-69518) | `navigation/` | Top nav, footer, menu bar, link. |
| [Progress](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21163-24443) | `progress/` | Stepper, proportion bar. |
| [Sections](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=17865-24546) | `sections/` | Page-level / marketing-style compositions. |
| [Type](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=21473-29498) | `type/` | Some “section header” / lockup patterns also live in `sections/`; check both. |
| — | `content/` | Not a Figma DS page; app content shells / thumbnails. |
| — | `localization/` | Not a Figma DS page; i18n UI. |

*Update this when you add a new top-level `app/components/*` package or a new Figma canvas.*
