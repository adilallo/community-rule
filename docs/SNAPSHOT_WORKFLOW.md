# Visual Regression Snapshot Workflow

Quick reference for managing visual regression snapshots.

## 🚀 **First-Time Setup**

```bash
# 1. Generate baseline snapshots (choose one)
npm run seed-snapshots        # Docker (recommended for CI consistency)
npm run seed-snapshots:local  # Local environment

# 2. Commit the snapshots
git add tests/e2e/visual-regression.spec.ts-snapshots/
git commit -m "Add baseline visual regression snapshots"

# 3. Verify setup
npm run visual:test
```

## 🔄 **Daily Workflow**

```bash
# Run visual regression tests
npm run visual:test

# Run with UI for debugging
npm run visual:ui

# Update snapshots after UI changes
npm run visual:update
```

## 📝 **When UI Changes**

1. **Make your UI changes** (design updates, component modifications, etc.)

2. **Update snapshots to reflect new design:**

   ```bash
   npm run visual:update
   ```

3. **Review changes:**

   ```bash
   git diff tests/e2e/visual-regression.spec.ts-snapshots/
   ```

4. **Commit updated snapshots:**
   ```bash
   git add tests/e2e/visual-regression.spec.ts-snapshots/
   git commit -m "Update snapshots for [describe changes]"
   ```

## 🐛 **Troubleshooting**

### **"Snapshot doesn't exist" errors**

- **Cause**: Baseline snapshots haven't been generated
- **Fix**: Run `npm run seed-snapshots:local`

### **Platform differences (macOS vs Linux)**

- **Cause**: Different font rendering between platforms
- **Fix**: Use `npm run seed-snapshots` (Docker container)

### **Minor pixel differences**

- **Cause**: Font rendering, anti-aliasing differences
- **Fix**: Check tolerance settings in `playwright.config.ts`

### **Animation-related failures**

- **Cause**: Animations not fully disabled
- **Fix**: Ensure `animations: "disabled"` is set (already configured)

## 📁 **File Structure**

```
tests/e2e/
├── visual-regression.spec.ts                    # Test definitions
└── visual-regression.spec.ts-snapshots/         # Baseline images
    ├── homepage-full-chromium.png
    ├── homepage-viewport-chromium.png
    ├── hero-banner-chromium.png
    └── ...
```

## ⚡ **Quick Commands Reference**

| Command                        | Purpose                                         |
| ------------------------------ | ----------------------------------------------- |
| `npm run visual:test`          | Run visual regression tests                     |
| `npm run visual:update`        | Update snapshots after UI changes               |
| `npm run visual:ui`            | Run tests with UI for debugging                 |
| `npm run seed-snapshots`       | Generate baselines with Docker (CI consistency) |
| `npm run seed-snapshots:local` | Generate baselines locally                      |

## 💡 **Best Practices**

1. **Always review changes** before committing updated snapshots
2. **Use descriptive commit messages** when updating snapshots
3. **Test locally first** before pushing to CI
4. **Use Docker for consistency** when generating baselines
5. **Update snapshots promptly** after UI changes to avoid drift

## 🔗 **Related Documentation**

- [Visual Regression Setup](./VISUAL_REGRESSION_SETUP.md) - Detailed setup guide
- [Testing Strategy](../TESTING_STRATEGY.md) - Overall testing approach
