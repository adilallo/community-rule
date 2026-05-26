import createMDX from "@next/mdx";

/* eslint-env node */

/** Keep viewBox and unique clip/mask IDs when multiple SVGR icons share a page. */
const svgrLoaderOptions = {
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
      {
        name: "prefixIds",
        params: {
          prefixClassNames: false,
        },
      },
    ],
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client"],
  // React Compiler — annotation mode: opt-in via the `"use memo"` directive at
  // the top of a component/hook. With no annotations in the codebase yet, this
  // is plumbing only (no behavior change). Migrate hand-written `useMemo`/
  // `useCallback` containers incrementally and rely on `eslint-plugin-react-
  // compiler` to surface any code that the compiler bails on.
  reactCompiler: {
    compilationMode: "annotation",
  },
  /**
   * `next dev --turbopack` does not use `webpack()`; without this, `.svg`
   * imports resolve as asset URLs and {@link app/components/asset/icon/Icon.tsx}
   * cannot render them as components.
   */
  turbopack: {
    rules: {
      "*.svg": {
        condition: { not: "foreign" },
        loaders: [
          {
            loader: "@svgr/webpack",
            options: svgrLoaderOptions,
          },
        ],
        as: "*.js",
      },
    },
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["react", "react-dom"],
    // Cache Components (the Next 16 successor to `experimental.ppr`) — components
    // without `"use cache"` are dynamic by default, and any cookies/headers
    // access outside a `<Suspense>` boundary becomes a build-time error. The
    // `(app)` and `(admin)` layouts wrap `<ConditionalNavigation />` in
    // `<Suspense>` so the static shell prerenders while the session-aware nav
    // streams in. Replaces the prior `force-dynamic` route-segment exports.
    cacheComponents: true,
  },
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
      use: [{ loader: "@svgr/webpack", options: svgrLoaderOptions }],
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
