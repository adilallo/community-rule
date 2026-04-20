/**
 * Typography + padding overrides applied to the primary/secondary buttons
 * rendered inside `CreateFlowFooter`. The footer slot expects a compact
 * size regardless of the default `<Button size="xsmall">` output, and both
 * the Create Community / Custom Rule / Review flows and the template-review
 * footer share the same override string — keeping it here prevents drift
 * between those two call sites.
 *
 * The `!` prefixes bypass Button's own size tokens; the extra spacing vars
 * mirror the Figma compact footer button spec. When the design system
 * exposes a native size that matches, this module should collapse.
 */
export const CREATE_FLOW_FOOTER_BUTTON_CLASS =
  "md:!text-[14px] md:!leading-[16px] !text-[12px] !leading-[14px] " +
  "!px-[var(--spacing-measures-spacing-200,8px)] md:!px-[var(--spacing-measures-spacing-250,10px)] " +
  "!py-[var(--spacing-measures-spacing-200,8px)] md:!py-[var(--spacing-measures-spacing-250,10px)]";

/**
 * Template-review "Use without changes" (ghost variant) renders on a dark
 * backdrop and needs an explicit text-color override in addition to the
 * shared compact sizing. Composed from the base class so any future tweak
 * to typography/padding propagates automatically.
 */
export const CREATE_FLOW_FOOTER_BUTTON_ON_DARK_CLASS = `${CREATE_FLOW_FOOTER_BUTTON_CLASS} !text-white`;
