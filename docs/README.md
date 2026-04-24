# Documentation

User-facing docs. Implementation conventions live in `.cursor/rules/`.

## Canonical references

- [create-flow.md](./create-flow.md) — Custom create-rule wizard: stages,
  URLs, persistence. Source of truth for product/eng alignment.
- [testing-guide.md](./testing-guide.md) — Testing philosophy, layer
  coverage, and Prisma migration smoke before merge.

## Author guides (`guides/`)

- [content-creation.md](./guides/content-creation.md) — Writing and
  publishing blog posts.
- [i18n-translation-workflow.md](./guides/i18n-translation-workflow.md) —
  Editing UI copy and translation bundles.

## Temporary backend planning

These will be deleted once the backend services are stood up:

- [relaunch-brief.md](./relaunch-brief.md) — short executive summary for MEDLab Cloudron admin: what the relaunch is, what's being replaced, how cutover works.
- [guides/backend-roadmap.md](./guides/backend-roadmap.md)
- [guides/backend-linear-tickets.md](./guides/backend-linear-tickets.md)
- [guides/template-recommendation-matrix.md](./guides/template-recommendation-matrix.md)
- [guides/ops-backend-deploy.md](./guides/ops-backend-deploy.md) — technical deploy handoff + cutover plan (Cloudron, env vars, health checks, follow-up tickets).

## Cursor rules

Implementation contracts are enforced by `.cursor/rules/*.mdc`:

| Rule | Scope |
| --- | --- |
| `component-structure.mdc` | 4-file split (container/view/types/index). |
| `component-props.mdc` | Lowercase enum prop convention + Figma traceability. |
| `tailwind-styling.mdc` | Token usage and class composition. |
| `localization.mdc` | `messages/` bundles and `useMessages()`. |
| `testing.mdc` | Test layout, helpers, required imports. |
| `storybook.mdc` | Story location and `argTypes` patterns. |
| `hooks.mdc` | Custom hook authoring + TSDoc as the API reference. |
| `create-flow.mdc` | Wizard step / screen registry conventions. |
| `api-routes.mdc` | API route handler conventions. |
