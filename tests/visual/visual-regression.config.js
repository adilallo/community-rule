/**
 * Visual Regression Testing Configuration
 *
 * This file defines the configuration for visual regression testing across
 * different breakpoints, components, and scenarios.
 */

// Breakpoint definitions for responsive testing
export const breakpoints = {
  // Mobile breakpoints
  xs: { width: 320, height: 700, name: "Extra Small" },
  sm: { width: 360, height: 700, name: "Small" },
  md: { width: 480, height: 700, name: "Medium" },

  // Tablet breakpoints
  lg: { width: 640, height: 700, name: "Large" },
  xl: { width: 768, height: 700, name: "Extra Large" },

  // Desktop breakpoints
  "2xl": { width: 1024, height: 700, name: "2XL" },
  "3xl": { width: 1280, height: 700, name: "3XL" },
  "4xl": { width: 1440, height: 700, name: "4XL" },
  full: { width: 1920, height: 700, name: "Full HD" },
};

// Key breakpoints for focused testing
export const keyBreakpoints = [
  breakpoints.xs, // Mobile
  breakpoints.md, // Tablet
  breakpoints.xl, // Desktop
];

// Visual testing scenarios
export const visualScenarios = {
  // Component states
  states: {
    default: "Default state",
    hover: "Hover state",
    focus: "Focus state",
    active: "Active/pressed state",
    disabled: "Disabled state",
  },

  // Interactive states
  interactions: {
    hover: "Element hovered",
    focus: "Element focused",
    click: "Element clicked",
    loading: "Loading state",
    error: "Error state",
  },

  // Content variations
  content: {
    short: "Short content",
    long: "Long content",
    empty: "Empty state",
    loading: "Loading content",
    error: "Error content",
  },

  // Layout scenarios
  layout: {
    compact: "Compact layout",
    spacious: "Spacious layout",
    stacked: "Stacked layout",
    grid: "Grid layout",
    list: "List layout",
  },
};

// Chromatic configuration
export const chromaticConfig = {
  // Viewports for Chromatic screenshots
  viewports: Object.values(breakpoints).map((bp) => bp.width),

  // Delay for layout stabilization
  delay: 200,

  // Modes for different themes
  modes: {
    light: {},
    dark: {
      colorScheme: "dark",
    },
  },

  // Storybook viewport configuration
  storybookViewports: Object.entries(breakpoints).reduce((acc, [key, bp]) => {
    acc[key] = {
      name: bp.name,
      styles: {
        width: `${bp.width}px`,
        height: `${bp.height}px`,
      },
    };
    return acc;
  }, {}),
};

// Playwright visual testing configuration
export const playwrightVisualConfig = {
  // Screenshot options
  screenshot: {
    fullPage: false,
    type: "png",
    quality: 90,
  },

  // Visual comparison options
  visualComparison: {
    threshold: 0.1, // 10% difference threshold
    maxDiffPixels: 100,
    maxDiffPixelRatio: 0.1,
  },

  // Test timeouts
  timeouts: {
    navigation: 30000,
    action: 5000,
    assertion: 10000,
  },
};

// Component-specific visual testing configurations
export const componentConfigs = {
  Header: {
    breakpoints: [breakpoints.xs, breakpoints.md, breakpoints.xl],
    states: ["default", "hover", "focus"],
    scenarios: ["navigation", "authentication", "responsive"],
  },

  Footer: {
    breakpoints: [breakpoints.xs, breakpoints.md, breakpoints.xl],
    states: ["default", "hover", "focus"],
    scenarios: ["navigation", "social", "legal"],
  },

  Button: {
    breakpoints: [breakpoints.sm, breakpoints.md, breakpoints.lg],
    states: ["default", "hover", "focus", "active", "disabled"],
    variants: ["default", "home"],
    sizes: ["xsmall", "small", "medium", "large", "xlarge"],
  },

  Logo: {
    breakpoints: [breakpoints.xs, breakpoints.md, breakpoints.xl],
    states: ["default", "hover"],
    variants: ["with-text", "icon-only"],
  },

  MenuBar: {
    breakpoints: [breakpoints.xs, breakpoints.md, breakpoints.xl],
    states: ["default", "hover", "focus"],
    scenarios: ["navigation", "dropdown"],
  },
};

// Visual regression test patterns
export const testPatterns = {
  // Basic component testing
  basic: {
    description: "Basic component rendering",
    steps: [
      "Navigate to component",
      "Wait for layout stabilization",
      "Take screenshot",
    ],
  },

  // Interactive state testing
  interactive: {
    description: "Interactive state testing",
    steps: [
      "Navigate to component",
      "Interact with element (hover/focus/click)",
      "Wait for state change",
      "Take screenshot",
    ],
  },

  // Responsive testing
  responsive: {
    description: "Responsive behavior testing",
    steps: [
      "Set viewport size",
      "Navigate to component",
      "Wait for layout stabilization",
      "Take screenshot",
      "Repeat for all breakpoints",
    ],
  },

  // Content variation testing
  contentVariation: {
    description: "Content variation testing",
    steps: [
      "Navigate to component with different content",
      "Wait for layout stabilization",
      "Take screenshot",
      "Compare with baseline",
    ],
  },
};

// Export all configurations
export default {
  breakpoints,
  keyBreakpoints,
  visualScenarios,
  chromaticConfig,
  playwrightVisualConfig,
  componentConfigs,
  testPatterns,
};
