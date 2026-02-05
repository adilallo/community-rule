/**
 * Utility functions for normalizing component props to match Figma specifications
 * while maintaining backward compatibility with existing lowercase usage.
 * 
 * Figma uses PascalCase (e.g., "Standard", "Inverse") but codebase uses lowercase.
 * These helpers accept both formats and normalize to lowercase for internal use.
 */

/**
 * Normalize mode prop values (Standard/Inverse -> standard/inverse)
 */
export function normalizeMode(
  value: string | undefined,
  defaultValue: "standard" | "inverse" = "standard"
): "standard" | "inverse" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  if (normalized === "standard" || normalized === "inverse") {
    return normalized;
  }
  return defaultValue;
}

/**
 * Normalize state prop values (Default/Hover/Focus/Selected -> default/hover/focus/selected)
 */
export function normalizeState(
  value: string | undefined,
  defaultValue: "default" | "hover" | "focus" | "selected" = "default"
): "default" | "hover" | "focus" | "selected" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  if (
    normalized === "default" ||
    normalized === "hover" ||
    normalized === "focus" ||
    normalized === "selected"
  ) {
    return normalized;
  }
  return defaultValue;
}

/**
 * Normalize state prop values for form inputs (Default/Active/Hover/Focus)
 */
export function normalizeInputState(
  value: string | undefined,
  defaultValue: "default" | "active" | "hover" | "focus" = "default"
): "default" | "active" | "hover" | "focus" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  if (
    normalized === "default" ||
    normalized === "active" ||
    normalized === "hover" ||
    normalized === "focus"
  ) {
    return normalized;
  }
  return defaultValue;
}

/**
 * Normalize toggle state prop values (Default/Hover/Focus/Selected)
 */
export function normalizeToggleState(
  value: string | undefined,
  defaultValue: "default" | "hover" | "focus" | "selected" = "default"
): "default" | "hover" | "focus" | "selected" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  if (
    normalized === "default" ||
    normalized === "hover" ||
    normalized === "focus" ||
    normalized === "selected"
  ) {
    return normalized;
  }
  return defaultValue;
}

/**
 * Type helper for case-insensitive mode prop
 */
export type ModeValue = "standard" | "inverse" | "Standard" | "Inverse";

/**
 * Type helper for case-insensitive state prop
 */
export type StateValue =
  | "default"
  | "hover"
  | "focus"
  | "selected"
  | "Default"
  | "Hover"
  | "Focus"
  | "Selected";

/**
 * Type helper for case-insensitive input state prop
 */
export type InputStateValue =
  | "default"
  | "active"
  | "hover"
  | "focus"
  | "Default"
  | "Active"
  | "Hover"
  | "Focus";

/**
 * Normalize button variant prop values
 */
export function normalizeVariant(
  value: string | undefined,
  defaultValue: "filled" = "filled"
): "filled" | "filled-inverse" | "outline" | "outline-inverse" | "ghost" | "ghost-inverse" | "danger" | "danger-inverse" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const variants = [
    "filled",
    "filled-inverse",
    "outline",
    "outline-inverse",
    "ghost",
    "ghost-inverse",
    "danger",
    "danger-inverse",
  ];
  if (variants.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize button size prop values
 */
export function normalizeSize(
  value: string | undefined,
  defaultValue: "xsmall" = "xsmall"
): "xsmall" | "small" | "medium" | "large" | "xlarge" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const sizes = ["xsmall", "small", "medium", "large", "xlarge"];
  if (sizes.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize alert status prop values
 */
export function normalizeAlertStatus(
  value: string | undefined,
  defaultValue: "default" = "default"
): "default" | "positive" | "warning" | "danger" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const statuses = ["default", "positive", "warning", "danger"];
  if (statuses.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize alert type prop values
 */
export function normalizeAlertType(
  value: string | undefined,
  defaultValue: "toast" = "toast"
): "toast" | "banner" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const types = ["toast", "banner"];
  if (types.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize tooltip position prop values
 */
export function normalizeTooltipPosition(
  value: string | undefined,
  defaultValue: "top" = "top"
): "top" | "bottom" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const positions = ["top", "bottom"];
  if (positions.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Type helper for case-insensitive variant prop
 */
export type VariantValue =
  | "filled"
  | "filled-inverse"
  | "outline"
  | "outline-inverse"
  | "ghost"
  | "ghost-inverse"
  | "danger"
  | "danger-inverse"
  | "Filled"
  | "Filled-Inverse"
  | "Outline"
  | "Outline-Inverse"
  | "Ghost"
  | "Ghost-Inverse"
  | "Danger"
  | "Danger-Inverse";

/**
 * Type helper for case-insensitive size prop
 */
export type SizeValue =
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "XSmall"
  | "Small"
  | "Medium"
  | "Large"
  | "XLarge";

/**
 * Normalize menu bar size prop values
 */
export function normalizeMenuBarSize(
  value: string | undefined,
  defaultValue: "default" = "default"
): "xsmall" | "default" | "medium" | "large" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const sizes = ["xsmall", "default", "medium", "large"];
  if (sizes.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize menu bar item variant prop values
 */
export function normalizeMenuBarItemVariant(
  value: string | undefined,
  defaultValue: "default" = "default"
): "default" | "home" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const variants = ["default", "home"];
  if (variants.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize navigation item variant prop values
 */
export function normalizeNavigationItemVariant(
  value: string | undefined,
  defaultValue: "default" = "default"
): "default" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  if (normalized === "default") {
    return "default";
  }
  return defaultValue;
}

/**
 * Normalize navigation item size prop values
 */
export function normalizeNavigationItemSize(
  value: string | undefined,
  defaultValue: "default" = "default"
): "default" | "xsmall" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const sizes = ["default", "xsmall"];
  if (sizes.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize content lockup variant prop values
 */
export function normalizeContentLockupVariant(
  value: string | undefined,
  defaultValue: "hero" = "hero"
): "hero" | "feature" | "learn" | "ask" | "ask-inverse" | "modal" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const variants = ["hero", "feature", "learn", "ask", "ask-inverse", "modal"];
  if (variants.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize alignment prop values
 */
export function normalizeAlignment(
  value: string | undefined,
  defaultValue: "center" = "center"
): "center" | "left" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const alignments = ["center", "left"];
  if (alignments.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize content container size prop values
 */
export function normalizeContentContainerSize(
  value: string | undefined,
  defaultValue: "responsive" = "responsive"
): "xs" | "responsive" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const sizes = ["xs", "responsive"];
  if (sizes.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize content thumbnail variant prop values
 */
export function normalizeContentThumbnailVariant(
  value: string | undefined,
  defaultValue: "vertical" = "vertical"
): "vertical" | "horizontal" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const variants = ["vertical", "horizontal"];
  if (variants.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize section header variant prop values
 */
export function normalizeSectionHeaderVariant(
  value: string | undefined,
  defaultValue: "default" = "default"
): "default" | "multi-line" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const variants = ["default", "multi-line"];
  if (variants.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize quote block variant prop values
 */
export function normalizeQuoteBlockVariant(
  value: string | undefined,
  defaultValue: "standard" = "standard"
): "compact" | "standard" | "extended" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const variants = ["compact", "standard", "extended"];
  if (variants.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize number card size prop values (already PascalCase in codebase, supports both)
 */
export function normalizeNumberCardSize(
  value: string | undefined,
  defaultValue: "Medium" = "Medium"
): "Small" | "Medium" | "Large" | "XLarge" {
  if (!value) return defaultValue;
  // Check if already PascalCase
  if (value === "Small" || value === "Medium" || value === "Large" || value === "XLarge") {
    return value;
  }
  // Normalize lowercase to PascalCase
  const normalized = value.toLowerCase();
  if (normalized === "small") return "Small";
  if (normalized === "medium") return "Medium";
  if (normalized === "large") return "Large";
  if (normalized === "xlarge") return "XLarge";
  return defaultValue;
}

/**
 * Normalize ask organizer variant prop values
 */
export function normalizeAskOrganizerVariant(
  value: string | undefined,
  defaultValue: "centered" = "centered"
): "centered" | "left-aligned" | "compact" | "inverse" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const variants = ["centered", "left-aligned", "compact", "inverse"];
  if (variants.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize context menu item size prop values
 */
export function normalizeContextMenuItemSize(
  value: string | undefined,
  defaultValue: "medium" = "medium"
): "small" | "medium" | "large" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const sizes = ["small", "medium", "large"];
  if (sizes.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize image placeholder color prop values
 */
export function normalizeImagePlaceholderColor(
  value: string | undefined,
  defaultValue: "blue" = "blue"
): "blue" | "green" | "purple" | "red" | "orange" | "teal" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const colors = ["blue", "green", "purple", "red", "orange", "teal"];
  if (colors.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize toggle group position prop values
 */
export function normalizeToggleGroupPosition(
  value: string | undefined,
  defaultValue: "left" = "left"
): "left" | "middle" | "right" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const positions = ["left", "middle", "right"];
  if (positions.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize label variant prop values
 */
export function normalizeLabelVariant(
  value: string | undefined,
  defaultValue: "default" = "default"
): "default" | "horizontal" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const variants = ["default", "horizontal"];
  if (variants.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize small/medium/large size prop values (for SelectInput, TextArea, etc.)
 */
export function normalizeSmallMediumLargeSize(
  value: string | undefined,
  defaultValue: "medium" = "medium"
): "small" | "medium" | "large" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const sizes = ["small", "medium", "large"];
  if (sizes.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize RuleCard size prop values (L/M -> l/m -> L/M)
 */
export function normalizeRuleCardSize(
  value: string | undefined,
  defaultValue: "L" = "L"
): "XS" | "S" | "M" | "L" {
  if (!value) return defaultValue;
  const normalized = value.toUpperCase();
  if (normalized === "XS" || normalized === "S" || normalized === "M" || normalized === "L") {
    return normalized;
  }
  return defaultValue;
}

/**
 * Type helper for case-insensitive Chip state prop
 */
export type ChipStateValue =
  | "unselected"
  | "selected"
  | "disabled"
  | "custom"
  | "Unselected"
  | "Selected"
  | "Disabled"
  | "Custom";

/**
 * Type helper for case-insensitive Chip palette prop
 */
export type ChipPaletteValue =
  | "default"
  | "inverse"
  | "Default"
  | "Inverse";

/**
 * Type helper for case-insensitive Chip size prop
 */
export type ChipSizeValue = "s" | "m" | "S" | "M";

/**
 * Normalize Chip state prop values (Unselected/Selected/Disabled/Custom)
 */
export function normalizeChipState(
  value: string | undefined,
  defaultValue: "unselected" = "unselected",
): "unselected" | "selected" | "disabled" | "custom" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const states = ["unselected", "selected", "disabled", "custom"];
  if (states.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize Chip palette prop values (Default/Inverse -> default/inverse)
 */
export function normalizeChipPalette(
  value: string | undefined,
  defaultValue: "default" = "default",
): "default" | "inverse" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const palettes = ["default", "inverse"];
  if (palettes.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize Chip size prop values (S/M -> s/m)
 */
export function normalizeChipSize(
  value: string | undefined,
  defaultValue: "s" = "s",
): "s" | "m" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const sizes = ["s", "m"];
  if (sizes.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize MultiSelect size prop values (S/M -> s/m)
 */
export function normalizeMultiSelectSize(
  value: string | undefined,
  defaultValue: "m" = "m",
): "s" | "m" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const sizes = ["s", "m"];
  if (sizes.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize InputLabel size prop values (S/M -> s/m)
 */
export function normalizeInputLabelSize(
  value: string | undefined,
  defaultValue: "s" = "s",
): "s" | "m" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const sizes = ["s", "m"];
  if (sizes.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}

/**
 * Normalize InputLabel palette prop values (Default/Inverse -> default/inverse)
 */
export function normalizeInputLabelPalette(
  value: string | undefined,
  defaultValue: "default" = "default",
): "default" | "inverse" {
  if (!value) return defaultValue;
  const normalized = value.toLowerCase();
  const palettes = ["default", "inverse"];
  if (palettes.includes(normalized)) {
    return normalized as typeof defaultValue;
  }
  return defaultValue;
}
