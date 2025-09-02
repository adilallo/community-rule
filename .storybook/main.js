/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],

  // Ensure esbuild treats .js as JSX during dep pre-bundling
  async viteFinal(cfg) {
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
