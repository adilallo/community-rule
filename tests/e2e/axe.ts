import { injectAxe, checkA11y } from "@axe-core/playwright";

export async function runA11y(page, options = {}) {
  await injectAxe(page);
  await checkA11y(page, undefined, {
    detailedReport: true,
    detailedReportOptions: { html: true },
    ...options,
  });
}
