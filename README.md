# Community Rule

A Next.js application for community decision-making and governance documentation.

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Testing Framework

This project includes a comprehensive testing framework with multiple layers of testing:

### Quick Test Commands

```bash
# Unit tests with coverage
npm test

# E2E tests
npm run e2e

# Performance tests
npm run lhci

# Storybook tests
npm run test:sb
```

### Test Coverage

- ✅ **124 Unit Tests** (8 components + 1 integration)
- ✅ **308 E2E Tests** (4 browsers × 77 tests)
- ✅ **92 Visual Regression Screenshots**
- ✅ **Performance Budgets**
- ✅ **Accessibility Compliance**

### CI/CD Pipeline

- **Gitea Actions** with 7 parallel jobs
- **Cross-browser testing** (Chromium, Firefox, WebKit, Mobile)
- **Visual regression testing**
- **Performance monitoring**
- **Code coverage reporting**

📖 **For detailed testing documentation, see [docs/TESTING.md](docs/TESTING.md)**

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

- `npm test` - Run unit tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run e2e` - Run E2E tests
- `npm run e2e:ui` - Run E2E tests with UI
- `npm run e2e:serve` - Start dev server and run E2E tests
- `npm run lhci` - Run performance tests
- `npm run test:sb` - Run Storybook tests

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
│   ├── layout.js               # Root layout
│   └── page.js                 # Homepage
├── tests/                       # Test files
│   ├── unit/                   # Unit tests (8 components)
│   ├── integration/            # Integration tests
│   └── e2e/                    # E2E tests (4 test suites)
├── docs/                        # Documentation
│   └── TESTING.md              # Comprehensive testing guide
├── .storybook/                  # Storybook configuration
├── .gitea/                      # Gitea Actions workflows
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
└── public/                      # Static assets
```

## 🔧 Technology Stack

- **Framework**: Next.js 15 + React 19
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest + Playwright + Lighthouse CI
- **Documentation**: Storybook 9
- **CI/CD**: Gitea Actions
- **Hosting**: Gitea (Git hosting)

## 📖 Documentation

- **[Testing Framework](docs/TESTING.md)** - Comprehensive testing guide
- **[Storybook](http://localhost:6006)** - Component documentation (local)
- **[GitHub Pages Storybook](https://your-username.github.io/communityrulestorybook/)** - Public component docs

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Write tests first** (see [Testing Guide](docs/TESTING.md))
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
<<<<<<< HEAD

# Test from working commit

=======

# Test trigger

> > > > > > > bead0c737303fb7e83b3be0c5dbd121b00351b90

# Test new runner

# Test host mode
