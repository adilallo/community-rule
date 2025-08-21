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
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  managerHead: (head) => `${head}<base href="/communityrulestorybook/">`,
  previewHead: (head) => `${head}<base href="/communityrulestorybook/">`,
  async viteFinal(cfg) {
    // IMPORTANT: Set base path for GitHub Pages sub-path hosting
    cfg.base = "/communityrulestorybook/";
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
