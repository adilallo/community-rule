# Visual Regression Testing Setup

This document explains how to set up and maintain visual regression tests for the CommunityRule platform.

## Overview

Visual regression tests capture screenshots of key UI components and compare them against baseline images to detect unintended visual changes. The tests are configured to work consistently across different environments (local development, CI/CD).

## Configuration

### Playwright Configuration

The visual regression tests are configured in `playwright.config.ts` with the following key settings:

- **OS-agnostic snapshots**: Uses `{testDir}/{testFileName}-snapshots/{arg}-{projectName}.png` template
- **Consistent rendering**: Fixed viewport (1280x800), device scale factor (1), and color scheme (light)
- **Tolerance settings**: Allows 1% pixel difference or 200 pixels maximum difference
- **Animation handling**: Disables animations during screenshot capture

### CI Environment

The CI workflow uses:

- **Ubuntu Linux** with Playwright Docker image for consistent rendering
- **One-time snapshot seeding** on the main branch
- **Artifact packaging** to reduce file count and improve upload performance

## Setting Up Snapshots

### Option 1: CI Seeding (Recommended for New Projects)

1. **Push to main branch**: The CI will automatically generate baseline snapshots
2. **Download artifacts**: Download the `visual-regression-results` artifact
3. **Extract snapshots**: Extract the `tests/e2e/visual-regression.spec.ts-snapshots/` folder
4. **Commit snapshots**: Add and commit the snapshot files to your repository
5. **Remove seeding step**: After snapshots are committed, remove the seeding step from CI

### Option 2: Local Seeding with Docker (Recommended for Existing Projects)

Use the provided script to generate snapshots in the same environment as CI:

```bash
# Using the Docker container (ensures CI consistency)
npm run seed-snapshots

# Or using local environment (may have slight differences)
npm run seed-snapshots:local
```

The Docker approach ensures:

- Same fonts and rendering as CI
- Same file naming conventions
- Same performance characteristics

## Running Visual Regression Tests

### Local Development

```bash
# Run all visual regression tests
npx playwright test tests/e2e/visual-regression.spec.ts

# Run with UI for debugging
npx playwright test tests/e2e/visual-regression.spec.ts --ui

# Update snapshots (use with caution)
PLAYWRIGHT_UPDATE_SNAPSHOTS=1 npx playwright test tests/e2e/visual-regression.spec.ts
```

### CI/CD

Visual regression tests run automatically in the CI pipeline:

- **Main branch**: Generates new snapshots if needed
- **Feature branches**: Compares against existing snapshots
- **Artifacts**: Uploads test results and snapshots for review

## Troubleshooting

### Common Issues

1. **"Snapshot doesn't exist" errors**

   - **Cause**: Baseline snapshots haven't been generated
   - **Solution**: Run snapshot seeding (see above)

2. **Platform-specific failures**

   - **Cause**: Snapshots generated on different OS (macOS vs Linux)
   - **Solution**: Use Docker container for local snapshot generation

3. **Minor pixel differences**

   - **Cause**: Font rendering differences, anti-aliasing, etc.
   - **Solution**: Check tolerance settings in `playwright.config.ts`

4. **Animation-related failures**
   - **Cause**: Animations not fully disabled
   - **Solution**: Ensure `animations: "disabled"` is set in test configuration

### Updating Snapshots

When intentional UI changes are made:

1. **Local update**:

   ```bash
   PLAYWRIGHT_UPDATE_SNAPSHOTS=1 npx playwright test tests/e2e/visual-regression.spec.ts
   ```

2. **Review changes**: Check the updated snapshots in `tests/e2e/visual-regression.spec.ts-snapshots/`

3. **Commit changes**: Add and commit the updated snapshot files

4. **Verify**: Run tests again to ensure they pass

### Performance Considerations

- **CI environment**: Tests run slower due to container overhead
- **Local development**: Faster execution with native browser
- **Artifact size**: Snapshots are compressed and packaged to reduce upload time

## Best Practices

1. **Consistent environment**: Always use the same environment for snapshot generation and testing
2. **Meaningful test names**: Use descriptive names for snapshot files
3. **Selective testing**: Test only critical UI components to maintain reasonable test duration
4. **Regular updates**: Update snapshots when making intentional UI changes
5. **Review failures**: Always review visual regression failures before updating snapshots

## File Structure

```
tests/e2e/
├── visual-regression.spec.ts                    # Test definitions
└── visual-regression.spec.ts-snapshots/         # Baseline images
    ├── homepage-full-chromium.png
    ├── homepage-viewport-chromium.png
    ├── hero-banner-chromium.png
    └── ...
```

## Integration with Other Tests

Visual regression tests complement:

- **Unit tests**: Verify component logic
- **Integration tests**: Verify component interactions
- **E2E tests**: Verify user workflows
- **Accessibility tests**: Verify accessibility compliance

Together, these tests provide comprehensive coverage of the application's functionality and appearance.
