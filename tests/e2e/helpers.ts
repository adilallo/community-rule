import { Locator, Page } from "@playwright/test";

export async function findVisibleButton(
  page: Page,
  text: string
): Promise<Locator> {
  const buttons = page.locator(`button:has-text("${text}")`);
  const buttonCount = await buttons.count();

  for (let i = 0; i < buttonCount; i++) {
    const button = buttons.nth(i);
    if (await button.isVisible()) {
      return button;
    }
  }

  throw new Error(`No visible button with text "${text}" found`);
}

export async function findVisibleElement(
  page: Page,
  selector: string
): Promise<Locator> {
  const elements = page.locator(selector);
  const elementCount = await elements.count();

  for (let i = 0; i < elementCount; i++) {
    const element = elements.nth(i);
    if (await element.isVisible()) {
      return element;
    }
  }

  throw new Error(`No visible element with selector "${selector}" found`);
}
