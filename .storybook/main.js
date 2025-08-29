/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],

  // Auto-detect environment and apply appropriate settings
  managerHead: (head) => {
    // Only add base href for GitHub Pages (when CI=true or specific environment)
    if (process.env.CI || process.env.STORYBOOK_BASE_PATH) {
      return `${head}<base href="/communityrulestorybook/">`;
    }
    return head;
  },

  previewHead: (head) => {
    // Only add base href for GitHub Pages
    if (process.env.CI || process.env.STORYBOOK_BASE_PATH) {
      return `${head}<base href="/communityrulestorybook/">`;
    }
    return head;
  },

  async viteFinal(cfg) {
    // Set base path for GitHub Pages when needed
    if (process.env.CI || process.env.STORYBOOK_BASE_PATH) {
      cfg.base = "/communityrulestorybook/";
    }

    // Ensure esbuild treats .js as JSX during dep pre-bundling
    cfg.optimizeDeps ??= {};
    cfg.optimizeDeps.esbuildOptions ??= {};
    cfg.optimizeDeps.esbuildOptions.loader = {
      ...(cfg.optimizeDeps.esbuildOptions.loader || {}),
      ".js": "jsx",
      ".ts": "tsx",
    };
    return cfg;
  },
};

export default config;
