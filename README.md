# Community Rule

A Next.js application for community decision-making and governance documentation.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Storybook Development

This project includes Storybook for component development and documentation. The setup supports both local development and GitHub Pages deployment.

### Local Development

For local Storybook development (no base path):

```bash
npm run storybook:local
```

This will:

- Copy local configuration files (without GitHub Pages base path)
- Start Storybook at `http://localhost:6006`
- Ignore configuration changes in git

### Production Deployment

When ready to deploy to GitHub Pages:

1. **Restore GitHub Pages configuration:**

   ```bash
   npm run storybook:restore
   ```

2. **Build Storybook:**

   ```bash
   npm run build-storybook
   ```

3. **Deploy to GitHub Pages repository:**

   ```bash
   # Copy the build to your GitHub Pages repository
   cp -r storybook-static/* /path/to/communityrulestorybook/

   # Or if you have it as a git submodule:
   cp -r storybook-static/* communityrulestorybook/
   cd communityrulestorybook
   git add .
   git commit -m "Update Storybook build"
   git push origin main
   ```

### Switching Between Configurations

- **Local Development:** `npm run storybook:local`
- **Production Build:** `npm run storybook:restore` then `npm run build-storybook`
- **Back to Local:** `npm run storybook:local`

The gitignore is configured to prevent configuration file changes from triggering git changes during local development.

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js application for production
- `npm run start` - Start Next.js production server
- `npm run storybook:local` - Start Storybook with local configuration
- `npm run storybook:restore` - Restore GitHub Pages configuration
- `npm run build-storybook` - Build Storybook for production
- `npm run storybook` - Start Storybook with current configuration
