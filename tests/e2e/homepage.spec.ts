import { test, expect } from '@playwright/test';
import { runA11y } from './axe';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads successfully with all sections', async ({ page }) => {
    // Check page title and meta
    await expect(page).toHaveTitle(/CommunityRule/);
    
    // Check main sections are present
    await expect(page.locator('h1, h2').filter({ hasText: 'Collaborate' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'How CommunityRule works' })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: "We've got your back" })).toBeVisible();
    
    // Check key components are rendered
    await expect(page.locator('img[alt="Hero illustration"]')).toBeVisible();
    await expect(page.locator('text=Trusted by leading cooperators')).toBeVisible();
    await expect(page.locator('text=Jo Freeman')).toBeVisible();
  });

  test('hero banner section functionality', async ({ page }) => {
    // Check hero content
    await expect(page.locator('text=Collaborate')).toBeVisible();
    await expect(page.locator('text=with clarity')).toBeVisible();
    await expect(page.locator('text=Help your community make important decisions')).toBeVisible();
    
    // Check CTA button
    const ctaButton = page.locator('button:has-text("Learn how CommunityRule works")');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();
    
    // Test button interaction
    await ctaButton.click();
    // Should scroll to the numbered cards section
    await expect(page.locator('h2:has-text("How CommunityRule works")')).toBeVisible();
  });

  test('logo wall section displays correctly', async ({ page }) => {
    // Check section label
    await expect(page.locator('text=Trusted by leading cooperators')).toBeVisible();
    
    // Check logos are present
    await expect(page.locator('img[alt="Food Not Bombs"]')).toBeVisible();
    await expect(page.locator('img[alt="Start COOP"]')).toBeVisible();
    await expect(page.locator('img[alt="Metagov"]')).toBeVisible();
    await expect(page.locator('img[alt="Open Civics"]')).toBeVisible();
    await expect(page.locator('img[alt="Mutual Aid CO"]')).toBeVisible();
    await expect(page.locator('img[alt="CU Boulder"]')).toBeVisible();
    
    // Check logos have proper attributes
    const logos = page.locator('img[alt*="Logo"]');
    await expect(logos).toHaveCount(6);
    
    // Test hover effects (visual test)
    await page.locator('img[alt="Food Not Bombs"]').hover();
    // Should see hover state (opacity change)
  });

  test('numbered cards section functionality', async ({ page }) => {
    // Check section header
    await expect(page.locator('h2:has-text("How CommunityRule works")')).toBeVisible();
    await expect(page.locator('text=Here\'s a quick overview of the process')).toBeVisible();
    
    // Check all three cards are present
    await expect(page.locator('text=Document how your community makes decisions')).toBeVisible();
    await expect(page.locator('text=Build an operating manual for a successful community')).toBeVisible();
    await expect(page.locator('text=Get a link to your manual for your group to review and evolve')).toBeVisible();
    
    // Check numbered indicators
    await expect(page.locator('text=1')).toBeVisible();
    await expect(page.locator('text=2')).toBeVisible();
    await expect(page.locator('text=3')).toBeVisible();
    
    // Check CTA buttons
    await expect(page.locator('button:has-text("Create CommunityRule")')).toBeVisible();
    await expect(page.locator('button:has-text("See how it works")')).toBeVisible();
  });

  test('rule stack section interactions', async ({ page }) => {
    // Check all four rule cards are present
    await expect(page.locator('text=Consensus clusters')).toBeVisible();
    await expect(page.locator('text=Consensus')).toBeVisible();
    await expect(page.locator('text=Elected Board')).toBeVisible();
    await expect(page.locator('text=Petition')).toBeVisible();
    
    // Check rule descriptions
    await expect(page.locator('text=Units called Circles have the ability to decide')).toBeVisible();
    await expect(page.locator('text=Decisions that affect the group collectively')).toBeVisible();
    await expect(page.locator('text=An elected board determines policies')).toBeVisible();
    await expect(page.locator('text=All participants can propose and vote')).toBeVisible();
    
    // Test card interactions
    const consensusCard = page.locator('[aria-label*="Consensus clusters"]');
    await consensusCard.click();
    // Should trigger analytics tracking (console log in test environment)
    
    // Check "See all templates" button
    await expect(page.locator('button:has-text("See all templates")')).toBeVisible();
  });

  test('feature grid section functionality', async ({ page }) => {
    // Check section header
    await expect(page.locator('h2:has-text("We\'ve got your back")')).toBeVisible();
    await expect(page.locator('text=Use our toolkit to improve, document, and evolve your organization')).toBeVisible();
    
    // Check all four feature cards
    await expect(page.locator('text=Decision-making support')).toBeVisible();
    await expect(page.locator('text=Values alignment exercises')).toBeVisible();
    await expect(page.locator('text=Membership guidance')).toBeVisible();
    await expect(page.locator('text=Conflict resolution tools')).toBeVisible();
    
    // Check feature links
    const featureLinks = page.locator('a[href^="#"]');
    await expect(featureLinks).toHaveCount(4);
    
    // Test feature card interactions
    await page.locator('a[href="#decision-making"]').click();
    // Should navigate to decision-making section
  });

  test('quote block section displays correctly', async ({ page }) => {
    // Check quote content
    await expect(page.locator('text=The rules of decision-making must be open')).toBeVisible();
    
    // Check author and source
    await expect(page.locator('text=Jo Freeman')).toBeVisible();
    await expect(page.locator('text=The Tyranny of Structurelessness')).toBeVisible();
    
    // Check avatar
    await expect(page.locator('img[alt="Portrait of Jo Freeman"]')).toBeVisible();
    
    // Check decorative elements
    await expect(page.locator('[class*="pointer-events-none absolute z-0"]')).toBeVisible();
  });

  test('ask organizer section functionality', async ({ page }) => {
    // Check section content
    await expect(page.locator('text=Still have questions?')).toBeVisible();
    await expect(page.locator('text=Get answers from an experienced organizer')).toBeVisible();
    
    // Check CTA button
    const askButton = page.locator('button:has-text("Ask an organizer")');
    await expect(askButton).toBeVisible();
    await expect(askButton).toBeEnabled();
    
    // Test button interaction
    await askButton.click();
    // Should trigger analytics tracking
  });

  test('header navigation functionality', async ({ page }) => {
    // Check header is present
    await expect(page.locator('header')).toBeVisible();
    
    // Check navigation elements
    await expect(page.locator('nav')).toBeVisible();
    
    // Test logo/header click
    const header = page.locator('header');
    await header.click();
    // Should stay on homepage
    await expect(page).toHaveURL('/');
  });

  test('footer section displays correctly', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer is present
    await expect(page.locator('footer')).toBeVisible();
    
    // Check footer content
    await expect(page.locator('footer')).toContainText('CommunityRule');
  });

  test('responsive design behavior', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1, h2').filter({ hasText: 'Collaborate' })).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1, h2').filter({ hasText: 'Collaborate' })).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('h1, h2').filter({ hasText: 'Collaborate' })).toBeVisible();
  });

  test('keyboard navigation and accessibility', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Navigate through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Test Enter key on buttons
    await page.keyboard.press('Enter');
    
    // Test Escape key
    await page.keyboard.press('Escape');
  });

  test('page performance metrics', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Check for any console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.reload();
    expect(consoleErrors.length).toBe(0);
  });

  test('accessibility standards compliance', async ({ page }) => {
    await runA11y(page, {
      rules: {
        'color-contrast': { enabled: true },
        'heading-order': { enabled: true },
        'landmark-one-main': { enabled: true },
        'page-has-heading-one': { enabled: true },
        'region': { enabled: true }
      }
    });
  });

  test('scroll behavior and smooth scrolling', async ({ page }) => {
    // Test smooth scrolling to sections
    const ctaButton = page.locator('button:has-text("Learn how CommunityRule works")');
    await ctaButton.click();
    
    // Should smoothly scroll to numbered cards section
    await page.waitForTimeout(1000); // Wait for scroll animation
    
    // Check we're at the numbered cards section
    await expect(page.locator('h2:has-text("How CommunityRule works")')).toBeVisible();
  });

  test('image loading and optimization', async ({ page }) => {
    // Check all images load properly
    const images = page.locator('img');
    await expect(images).toHaveCount.greaterThan(0);
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check for any broken images
    const brokenImages = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs).filter(img => !img.complete || img.naturalWidth === 0);
    });
    
    expect(brokenImages.length).toBe(0);
  });

  test('form interactions and validation', async ({ page }) => {
    // Test any form elements (if present)
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      // Test form submission
      const submitButton = page.locator('button[type="submit"]');
      if (await submitButton.count() > 0) {
        await submitButton.click();
        // Should handle form submission appropriately
      }
    }
  });

  test('error handling and fallbacks', async ({ page }) => {
    // Test with slow network
    await page.route('**/*', route => {
      route.continue();
    });
    
    // Test with offline mode
    await page.setOffline(true);
    await page.reload();
    
    // Should handle offline state gracefully
    await expect(page.locator('body')).toBeVisible();
    
    // Restore online mode
    await page.setOffline(false);
  });
});
