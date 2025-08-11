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
    "@storybook/addon-viewport",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  async viteFinal(cfg) {
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
