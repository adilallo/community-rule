import { test, expect } from '@playwright/test';
import { runA11y } from './axe';

test('home loads, nav works, basic a11y passes', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page loads
  await expect(page).toHaveTitle(/Community Rule/);
  
  // Check for main navigation elements
  await expect(page.getByRole('banner')).toBeVisible();
  
  // Check for main content
  await expect(page.getByRole('main')).toBeVisible();
  
  // Check for footer
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('keyboard navigation works', async ({ page }) => {
  await page.goto('/');
  
  // Tab through the page
  await page.keyboard.press('Tab');
  
  // Check that focus is visible
  await expect(page.locator(':focus')).toBeVisible();
  
  // Continue tabbing to test navigation
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  }
});

test('accessibility standards are met', async ({ page }) => {
  await page.goto('/');
  
  // Run automated a11y checks
  await runA11y(page, { 
    axeOptions: { 
      runOnly: ['wcag2a', 'wcag2aa'] 
    } 
  });
});

test('responsive design works', async ({ page }) => {
  // Test mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  
  // Check that content is visible on mobile
  await expect(page.getByRole('main')).toBeVisible();
  
  // Test tablet viewport
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.getByRole('main')).toBeVisible();
  
  // Test desktop viewport
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole('main')).toBeVisible();
});

test('images have alt text', async ({ page }) => {
  await page.goto('/');
  
  // Get all images
  const images = page.locator('img');
  const imageCount = await images.count();
  
  // Check that all images have alt attributes
  for (let i = 0; i < imageCount; i++) {
    const image = images.nth(i);
    const alt = await image.getAttribute('alt');
    expect(alt).toBeTruthy();
  }
});

test('links are accessible', async ({ page }) => {
  await page.goto('/');
  
  // Get all links
  const links = page.locator('a');
  const linkCount = await links.count();
  
  // Check that all links have either text content or aria-label
  for (let i = 0; i < linkCount; i++) {
    const link = links.nth(i);
    const text = await link.textContent();
    const ariaLabel = await link.getAttribute('aria-label');
    
    // Link should have either text content or aria-label
    expect(text?.trim() || ariaLabel).toBeTruthy();
  }
});
