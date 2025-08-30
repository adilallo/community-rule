import { AxeBuilder } from "@axe-core/playwright";

export async function runA11y(page, options = {}) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  if (results.violations.length > 0) {
    console.log("Accessibility violations found:", results.violations);
    throw new Error(
      `Found ${results.violations.length} accessibility violations`
    );
  }
}
