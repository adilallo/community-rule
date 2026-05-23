/** @type { import('@storybook/nextjs').StorybookConfig } */
module.exports = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    // Removed @storybook/addon-essentials due to version mismatch with Storybook 10.x
    // Using individual addons instead. Interaction helpers import from storybook/test
    // (bundled with storybook@10); @storybook/addon-interactions was merged into SB 8 core.
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],

  // Webpack configuration to resolve Next.js modules for Next.js 16 compatibility
  async webpackFinal(config) {
    // Ensure Next.js modules are resolved correctly
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
    };

    // Ensure node_modules are resolved
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      "node_modules",
    ];

    return config;
  },
};
