# Community Rule

A Next.js application for community decision-making and governance documentation.

## 📋 Requirements

- **Node.js**: 20.0.0 or higher (LTS recommended)
- **npm**: 10.0.0 or higher

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing Framework

This project uses a simplified, component‑first testing model:

- **Component tests (Vitest + RTL)** live in `tests/components/` with a single file per component.
- **E2E tests (Playwright)** cover critical user journeys and visual regression.

### Quick Test Commands

```bash
# All component tests with coverage
npm test

# Component tests only (new structure)
npm run test:component

# E2E tests only
npm run test:e2e
```

### Test Coverage

- ✅ **428 Unit Tests** (94.88% coverage - exceeds 85% target)
- ✅ **92 E2E Tests** across 4 browsers
- ✅ **23 Visual Regression Tests** per browser
- ✅ **Performance Budgets** with Lighthouse CI
- ✅ **WCAG 2.1 AA Compliance** with automated testing
- ✅ **Bundle Analysis** with automated monitoring
- ✅ **Web Vitals Tracking** with real-time metrics

### CI/CD Pipeline

- **Gitea Actions** with 7 parallel jobs
- **Cross-browser testing** (Chromium, Firefox, WebKit, Mobile)
- **Visual regression testing**
- **Performance monitoring**
- **Code coverage reporting**

📖 **For detailed testing documentation, see `docs/TESTING_GUIDE.md` and [docs/README.md](docs/README.md)**

## ⚡ Performance Optimizations

This project includes comprehensive performance optimizations for sub-2-second load times:

### Frontend Optimizations

- **✅ Code Splitting**: Dynamic imports for non-critical components
- **✅ React.memo**: Applied to all 30+ components to prevent unnecessary re-renders
- **✅ Image Optimization**: Enhanced `next/image` with lazy loading and blur placeholders
- **✅ Font Optimization**: Preloading and fallbacks for all fonts
- **✅ Bundle Analysis**: Real-time monitoring with performance budgets
- **✅ Error Boundaries**: Comprehensive error handling

### Performance Monitoring

```bash
# Individual monitoring tools
npm run bundle:analyze      # Analyze bundle sizes and budgets
npm run performance:monitor # Performance metrics and Lighthouse CI
npm run web-vitals:track   # Core Web Vitals tracking

# Comprehensive testing
npm run test:performance    # All performance tests
npm run monitor:all         # All monitoring tools
```

### Performance Targets

- **Bundle Size**: <250KB gzipped (currently 101KB) ✅
- **Core Web Vitals**: All metrics in "Good" range ✅
- **Lighthouse Score**: >90 on all critical pages ✅
- **Load Time**: <2 seconds on 3G connections ✅

## 📚 Storybook Development

This project includes Storybook for component development and documentation. The setup automatically detects the environment and applies the appropriate configuration.

### Local Development

For local Storybook development:

```bash
npm run storybook:local
# or simply
npm run storybook
```

This will:

- Start Storybook at `http://localhost:6006`
- Use relative paths for assets (no base path)

### GitHub Pages Deployment

For GitHub Pages deployment with base path:

```bash
npm run storybook:build:github
```

This will:

- Build Storybook with `/communityrulestorybook/` base path
- Generate files ready for GitHub Pages deployment

### CI/CD Integration

The CI pipeline automatically uses the GitHub Pages configuration when building Storybook.

### Configuration

The Storybook configuration automatically detects the environment:

- **Local development**: No base path, relative assets
- **CI/Production**: Base path `/communityrulestorybook/` for GitHub Pages

## 📋 Available Scripts

### Development

- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js application for production
- `npm run start` - Start Next.js production server

### Testing

- `npm test` - Run all component tests with coverage
- `npm run test:component` - Run tests in `tests/components/` only
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:e2e` - Run E2E tests only
- `npm run e2e` - Alias for Playwright E2E tests
- `npm run e2e:ui` - Run E2E tests with UI
- `npm run e2e:serve` - Start dev server and run E2E tests
- `npm run lhci` - Run performance tests

### Storybook

- `npm run storybook:local` - Start Storybook for local development
- `npm run storybook:github` - Start Storybook with GitHub Pages configuration
- `npm run storybook:build` - Build Storybook for local deployment
- `npm run storybook:build:github` - Build Storybook for GitHub Pages
- `npm run storybook` - Start Storybook with current configuration

## 🏗️ Project Structure

```
community-rule/
├── app/                          # Next.js app directory
│   ├── components/              # React components
│   ├── hooks/                   # Custom React hooks
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── config/                       # Project-specific configuration
│   ├── gitea-runner.yaml       # Gitea runner configuration
│   └── runner-config.yaml      # Runner configuration
├── docs/                         # Documentation
│   ├── README.md               # Documentation index
│   ├── TESTING_GUIDE.md        # Testing guide
│   ├── CUSTOM_HOOKS.md         # Custom hooks documentation
│   └── guides/                 # Guides
│       └── content-creation.md # Content creation guide
├── scripts/                      # Utility scripts
│   ├── start-runner.sh        # Start Gitea runner
│   ├── status-runner.sh       # Check runner status
│   └── stop-runner.sh         # Stop Gitea runner
├── tests/                        # Test files
│   ├── components/             # Component tests (Vitest + RTL)
│   ├── pages/                 # Page-level tests
│   ├── e2e/                   # E2E tests (Playwright)
│   ├── utils/                 # Test utilities (componentTestSuite, etc.)
│   ├── msw/                   # MSW server setup
│   └── accessibility/         # E2E accessibility checks
├── .storybook/                  # Storybook configuration
├── .gitea/                      # Gitea Actions workflows
│   └── workflows/
│       └── ci.yaml            # CI/CD pipeline
└── public/                      # Static assets
```

## 🔧 Technology Stack

- **Framework**: Next.js 16 + React 19
- **Runtime**: Node.js 20+ (LTS)
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest + Playwright + Lighthouse CI
- **Documentation**: Storybook 10
- **CI/CD**: Gitea Actions
- **Hosting**: Gitea (Git hosting)

## 📖 Documentation

- **[Documentation Index](docs/README.md)** - Complete documentation guide
- **[Testing Guide](docs/TESTING_GUIDE.md)** - Testing strategy, component tests, E2E tests, and accessibility
- **[Custom Hooks](docs/CUSTOM_HOOKS.md)** - Documentation for custom React hooks
- **[Content Creation Guide](docs/guides/content-creation.md)** - Guide for creating blog content
- **[Storybook](http://localhost:6006)** - Component documentation (local)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Write tests first** (see [Testing Guide](docs/TESTING_GUIDE.md))
4. **Make your changes**
5. **Run tests**: `npm test && npm run e2e`
6. **Commit changes**: `git commit -m "feat: add amazing feature"`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Create Pull Request**

### Development Workflow

- All changes must have tests
- CI pipeline runs automatically on PRs
- Visual regression tests ensure UI consistency
- Performance budgets must be met
- Accessibility standards must be maintained

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
