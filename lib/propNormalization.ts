/**
 * Component prop option arrays and value types.
 *
 * The codebase uses lowercase-canonical enum values (see
 * `.cursor/rules/component-props.mdc`). This module is the single source of
 * valid values for each enum prop — Storybook `argTypes` and any runtime guard
 * import the corresponding `*_OPTIONS` array from here, and the matching
 * `*Value` type is derived from it.
 */

// ---------------------------------------------------------------------------
// Generic shared values
// ---------------------------------------------------------------------------

export const MODE_OPTIONS = ["standard", "inverse"] as const;
export type ModeValue = (typeof MODE_OPTIONS)[number];

export const STATE_OPTIONS = [
  "default",
  "hover",
  "focus",
  "selected",
] as const;
export type StateValue = (typeof STATE_OPTIONS)[number];

export const INPUT_STATE_OPTIONS = [
  "default",
  "active",
  "hover",
  "focus",
] as const;
export type InputStateValue = (typeof INPUT_STATE_OPTIONS)[number];

export const SIZE_OPTIONS = [
  "xsmall",
  "small",
  "medium",
  "large",
  "xlarge",
] as const;
export type SizeValue = (typeof SIZE_OPTIONS)[number];

export const SMALL_MEDIUM_LARGE_OPTIONS = [
  "small",
  "medium",
  "large",
] as const;
export type SmallMediumLargeValue =
  (typeof SMALL_MEDIUM_LARGE_OPTIONS)[number];

export const ALIGNMENT_OPTIONS = ["center", "left"] as const;
export type AlignmentValue = (typeof ALIGNMENT_OPTIONS)[number];

// ---------------------------------------------------------------------------
// Component-specific values
// ---------------------------------------------------------------------------

export const ALERT_STATUS_OPTIONS = [
  "default",
  "positive",
  "warning",
  "danger",
] as const;
export type AlertStatusValue = (typeof ALERT_STATUS_OPTIONS)[number];

export const ALERT_TYPE_OPTIONS = ["toast", "banner"] as const;
export type AlertTypeValue = (typeof ALERT_TYPE_OPTIONS)[number];

export const ALERT_SIZE_OPTIONS = ["s", "m"] as const;
export type AlertSizeValue = (typeof ALERT_SIZE_OPTIONS)[number];

export const TOOLTIP_POSITION_OPTIONS = ["top", "bottom"] as const;
export type TooltipPositionValue = (typeof TOOLTIP_POSITION_OPTIONS)[number];

export const MENU_BAR_SIZE_OPTIONS = [
  "X Small",
  "Small",
  "Medium",
  "Large",
  "X Large",
] as const;
export type MenuBarSizeValue = (typeof MENU_BAR_SIZE_OPTIONS)[number];

export const NAVIGATION_ITEM_VARIANT_OPTIONS = ["default"] as const;
export type NavigationItemVariantValue =
  (typeof NAVIGATION_ITEM_VARIANT_OPTIONS)[number];

export const NAVIGATION_ITEM_SIZE_OPTIONS = ["default", "xsmall"] as const;
export type NavigationItemSizeValue =
  (typeof NAVIGATION_ITEM_SIZE_OPTIONS)[number];

export const CONTENT_LOCKUP_VARIANT_OPTIONS = [
  "hero",
  "feature",
  "learn",
  "ask",
  "ask-inverse",
  "modal",
  "login",
] as const;
export type ContentLockupVariantValue =
  (typeof CONTENT_LOCKUP_VARIANT_OPTIONS)[number];

export const NUMBERED_LIST_SIZE_OPTIONS = ["M", "S"] as const;
export type NumberedListSizeValue = (typeof NUMBERED_LIST_SIZE_OPTIONS)[number];

export const HEADER_LOCKUP_JUSTIFICATION_OPTIONS = ["left", "center"] as const;
export type HeaderLockupJustificationValue =
  (typeof HEADER_LOCKUP_JUSTIFICATION_OPTIONS)[number];

export const HEADER_LOCKUP_SIZE_OPTIONS = ["L", "M"] as const;
export type HeaderLockupSizeValue =
  (typeof HEADER_LOCKUP_SIZE_OPTIONS)[number];

export const HEADER_LOCKUP_PALETTE_OPTIONS = ["default", "inverse"] as const;
export type HeaderLockupPaletteValue =
  (typeof HEADER_LOCKUP_PALETTE_OPTIONS)[number];

export const TEXT_INPUT_SIZE_OPTIONS = ["small", "medium"] as const;
export type TextInputSizeValue = (typeof TEXT_INPUT_SIZE_OPTIONS)[number];

export const CONTENT_CONTAINER_SIZE_OPTIONS = ["xs", "responsive"] as const;
export type ContentContainerSizeValue =
  (typeof CONTENT_CONTAINER_SIZE_OPTIONS)[number];

export const CONTENT_THUMBNAIL_VARIANT_OPTIONS = [
  "vertical",
  "horizontal",
] as const;
export type ContentThumbnailVariantValue =
  (typeof CONTENT_THUMBNAIL_VARIANT_OPTIONS)[number];

export const SECTION_HEADER_VARIANT_OPTIONS = [
  "default",
  "multi-line",
] as const;
export type SectionHeaderVariantValue =
  (typeof SECTION_HEADER_VARIANT_OPTIONS)[number];

export const QUOTE_BLOCK_VARIANT_OPTIONS = [
  "compact",
  "standard",
  "extended",
] as const;
export type QuoteBlockVariantValue =
  (typeof QUOTE_BLOCK_VARIANT_OPTIONS)[number];

export const NUMBER_CARD_SIZE_OPTIONS = [
  "small",
  "medium",
  "large",
  "xlarge",
] as const;
export type NumberCardSizeValue = (typeof NUMBER_CARD_SIZE_OPTIONS)[number];

export const ASK_ORGANIZER_VARIANT_OPTIONS = [
  "centered",
  "left-aligned",
  "compact",
  "inverse",
] as const;
export type AskOrganizerVariantValue =
  (typeof ASK_ORGANIZER_VARIANT_OPTIONS)[number];

export const CONTEXT_MENU_ITEM_SIZE_OPTIONS = [
  "small",
  "medium",
  "large",
] as const;
export type ContextMenuItemSizeValue =
  (typeof CONTEXT_MENU_ITEM_SIZE_OPTIONS)[number];

export const TOGGLE_GROUP_POSITION_OPTIONS = [
  "left",
  "middle",
  "right",
] as const;
export type ToggleGroupPositionValue =
  (typeof TOGGLE_GROUP_POSITION_OPTIONS)[number];

export const LABEL_VARIANT_OPTIONS = ["default", "horizontal"] as const;
export type LabelVariantValue = (typeof LABEL_VARIANT_OPTIONS)[number];

export const TEXT_AREA_APPEARANCE_OPTIONS = ["default", "embedded"] as const;
export type TextAreaAppearanceValue =
  (typeof TEXT_AREA_APPEARANCE_OPTIONS)[number];

export const RULE_CARD_SIZE_OPTIONS = ["XS", "S", "M", "L"] as const;
export type RuleCardSizeValue = (typeof RULE_CARD_SIZE_OPTIONS)[number];

export const CHIP_STATE_OPTIONS = [
  "unselected",
  "selected",
  "disabled",
  "custom",
] as const;
export type ChipStateValue = (typeof CHIP_STATE_OPTIONS)[number];

export const CHIP_PALETTE_OPTIONS = ["default", "inverse"] as const;
export type ChipPaletteValue = (typeof CHIP_PALETTE_OPTIONS)[number];

export const CHIP_SIZE_OPTIONS = ["s", "m"] as const;
export type ChipSizeValue = (typeof CHIP_SIZE_OPTIONS)[number];

export const MULTI_SELECT_SIZE_OPTIONS = ["s", "m"] as const;
export type MultiSelectSizeValue = (typeof MULTI_SELECT_SIZE_OPTIONS)[number];

export const INPUT_LABEL_SIZE_OPTIONS = ["s", "m"] as const;
export type InputLabelSizeValue = (typeof INPUT_LABEL_SIZE_OPTIONS)[number];

export const INPUT_LABEL_PALETTE_OPTIONS = ["default", "inverse"] as const;
export type InputLabelPaletteValue =
  (typeof INPUT_LABEL_PALETTE_OPTIONS)[number];

export const MENU_BAR_ITEM_STATE_OPTIONS = [
  "default",
  "hover",
  "selected",
] as const;
export type MenuBarItemStateValue =
  (typeof MENU_BAR_ITEM_STATE_OPTIONS)[number];

export const MENU_BAR_ITEM_MODE_OPTIONS = ["default", "inverse"] as const;
export type MenuBarItemModeValue = (typeof MENU_BAR_ITEM_MODE_OPTIONS)[number];

export const MENU_BAR_ITEM_SIZE_OPTIONS = MENU_BAR_SIZE_OPTIONS;
export type MenuBarItemSizeValue = MenuBarSizeValue;

export const BUTTON_TYPE_OPTIONS = [
  "filled",
  "outline",
  "ghost",
  "danger",
] as const;
export type ButtonTypeValue = (typeof BUTTON_TYPE_OPTIONS)[number];

export const BUTTON_PALETTE_OPTIONS = ["default", "inverse"] as const;
export type ButtonPaletteValue = (typeof BUTTON_PALETTE_OPTIONS)[number];

export const BUTTON_STATE_OPTIONS = [
  "default",
  "focus",
  "active",
  "hover",
  "disabled",
] as const;
export type ButtonStateValue = (typeof BUTTON_STATE_OPTIONS)[number];

export const PROPORTION_BAR_VARIANT_OPTIONS = [
  "default",
  "segmented",
] as const;
export type ProportionBarVariantValue =
  (typeof PROPORTION_BAR_VARIANT_OPTIONS)[number];
