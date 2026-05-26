import createMDX from "@next/mdx";

/* eslint-env node */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client"],
  /**
   * `next dev --turbopack` does not use `webpack()`; without this, `.svg`
   * imports resolve as asset URLs and {@link app/components/asset/icon/Icon.tsx}
   * cannot render them as components.
   */
  turbopack: {
    rules: {
      "*.svg": {
        condition: { not: "foreign" },
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["react", "react-dom"],
  },
  // Phase 3 canary stub (not enabled): React Compiler probe surfaces a missing
  // `babel-plugin-react-compiler` dep — Next 16 also moved this top-level out
  // of `experimental`. See `docs/perf/next16-eval.md` for evaluation results.
  // Compression
  compress: true,
  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Headers for caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Long-cache static marketing art (avatars, vectors, case-study, etc.)
        // since the file content is hashed into the URL by Next at request time
        // through the image optimizer for raster, and changes require a deploy.
        source: "/assets/:path*\\.(svg|png|webp|avif|jpg|jpeg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  webpack(config, { dev, isServer }) {
    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // Bundle analysis - only in production builds
    if (process.env.ANALYZE === "true" && !dev) {
      try {
        const BundleAnalyzerPlugin =
          require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: isServer
              ? "../analyze/server.html"
              : "../analyze/client.html",
          }),
        );
      } catch (error) {
        console.warn("Bundle analyzer not available:", error.message);
      }
    }

    // Production optimizations
    if (!dev && !isServer) {
      // Tree shaking optimization
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },
  async redirects() {
    return [
      {
        source: "/create/right-rail",
        destination: "/create/decision-approaches",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
