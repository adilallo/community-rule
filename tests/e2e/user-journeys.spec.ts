import { test, expect } from '@playwright/test';

test.describe('User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete user journey: learn about CommunityRule', async ({ page }) => {
    // 1. User lands on homepage
    await expect(page.locator('text=Collaborate')).toBeVisible();
    
    // 2. User reads hero section
    await expect(page.locator('text=Help your community make important decisions')).toBeVisible();
    
    // 3. User clicks CTA to learn more
    await page.locator('button:has-text("Learn how CommunityRule works")').click();
    
    // 4. User scrolls to numbered cards section
    await expect(page.locator('h2:has-text("How CommunityRule works")')).toBeVisible();
    
    // 5. User reads the process steps
    await expect(page.locator('text=Document how your community makes decisions')).toBeVisible();
    await expect(page.locator('text=Build an operating manual for a successful community')).toBeVisible();
    await expect(page.locator('text=Get a link to your manual for your group to review and evolve')).toBeVisible();
    
    // 6. User explores rule templates
    await page.locator('text=Consensus clusters').click();
    await page.locator('text=Consensus').click();
    await page.locator('text=Elected Board').click();
    await page.locator('text=Petition').click();
    
    // 7. User checks out features
    await page.locator('text=Decision-making support').click();
    await page.locator('text=Values alignment exercises').click();
    await page.locator('text=Membership guidance').click();
    await page.locator('text=Conflict resolution tools').click();
    
    // 8. User reads testimonial
    await expect(page.locator('text=Jo Freeman')).toBeVisible();
    
    // 9. User decides to contact organizer
    await page.locator('button:has-text("Ask an organizer")').click();
    
    // 10. User creates CommunityRule
    await page.locator('button:has-text("Create CommunityRule")').click();
  });

  test('user journey: explore rule templates', async ({ page }) => {
    // Scroll to rule stack section
    await page.evaluate(() => {
      const element = document.querySelector('text=Consensus clusters');
      element?.scrollIntoView();
    });
    
    // Explore each rule template
    const ruleTemplates = [
      'Consensus clusters',
      'Consensus', 
      'Elected Board',
      'Petition'
    ];
    
    for (const template of ruleTemplates) {
      await page.locator(`text=${template}`).click();
      // Should trigger analytics tracking
      await page.waitForTimeout(500); // Brief pause between clicks
    }
    
    // Click "See all templates"
    await page.locator('button:has-text("See all templates")').click();
  });

  test('user journey: explore feature tools', async ({ page }) => {
    // Scroll to feature grid section
    await page.evaluate(() => {
      const element = document.querySelector('text=We\'ve got your back');
      element?.scrollIntoView();
    });
    
    // Explore each feature
    const features = [
      { name: 'Decision-making support', href: '#decision-making' },
      { name: 'Values alignment exercises', href: '#values-alignment' },
      { name: 'Membership guidance', href: '#membership-guidance' },
      { name: 'Conflict resolution tools', href: '#conflict-resolution' }
    ];
    
    for (const feature of features) {
      await page.locator(`a[href="${feature.href}"]`).click();
      await page.waitForTimeout(500);
    }
  });

  test('user journey: contact organizer', async ({ page }) => {
    // Scroll to ask organizer section
    await page.evaluate(() => {
      const element = document.querySelector('text=Still have questions?');
      element?.scrollIntoView();
    });
    
    // Read the section
    await expect(page.locator('text=Get answers from an experienced organizer')).toBeVisible();
    
    // Click contact button
    await page.locator('button:has-text("Ask an organizer")').click();
    
    // Should trigger analytics tracking
    // In a real app, this might open a contact form or modal
  });

  test('user journey: create CommunityRule', async ({ page }) => {
    // Scroll to numbered cards section
    await page.evaluate(() => {
      const element = document.querySelector('text=Create CommunityRule');
      element?.scrollIntoView();
    });
    
    // Click create button
    await page.locator('button:has-text("Create CommunityRule")').click();
    
    // Should navigate to creation flow
    // In a real app, this would go to a form or wizard
  });

  test('user journey: learn how it works', async ({ page }) => {
    // Click "See how it works" button
    await page.locator('button:has-text("See how it works")').click();
    
    // Should show more detailed information
    // In a real app, this might open a modal or navigate to a detailed page
  });

  test('user journey: scroll through entire page', async ({ page }) => {
    // Start at top
    await expect(page.locator('text=Collaborate')).toBeVisible();
    
    // Scroll through each section
    const sections = [
      'Trusted by leading cooperators',
      'How CommunityRule works',
      'Consensus clusters',
      "We've got your back",
      'Jo Freeman',
      'Still have questions?'
    ];
    
    for (const section of sections) {
      await page.evaluate((text) => {
        const element = document.querySelector(`text=${text}`);
        element?.scrollIntoView();
      }, section);
      
      await page.waitForTimeout(1000); // Wait for scroll and animations
      await expect(page.locator(`text=${section}`)).toBeVisible();
    }
    
    // End at footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('footer')).toBeVisible();
  });

  test('user journey: keyboard navigation through page', async ({ page }) => {
    // Start with tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Navigate through all interactive elements
    let tabCount = 0;
    const maxTabs = 50; // Prevent infinite loop
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      // Check if we've cycled back to the beginning
      const focusedElement = page.locator(':focus');
      if (await focusedElement.count() === 0) {
        break;
      }
    }
    
    // Test Enter key on focused elements
    await page.keyboard.press('Enter');
  });

  test('user journey: mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate through page on mobile
    await expect(page.locator('text=Collaborate')).toBeVisible();
    
    // Scroll through sections
    await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => section.scrollIntoView());
    });
    
    // Test touch interactions
    await page.locator('button:has-text("Learn how CommunityRule works")').click();
    await page.locator('text=Consensus clusters').click();
    await page.locator('button:has-text("Ask an organizer")').click();
  });

  test('user journey: tablet navigation', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate through page on tablet
    await expect(page.locator('text=Collaborate')).toBeVisible();
    
    // Test tablet-specific interactions
    await page.locator('button:has-text("Learn how CommunityRule works")').click();
    await page.locator('text=Consensus clusters').click();
    await page.locator('button:has-text("Ask an organizer")').click();
  });

  test('user journey: desktop navigation', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate through page on desktop
    await expect(page.locator('text=Collaborate')).toBeVisible();
    
    // Test desktop-specific interactions
    await page.locator('button:has-text("Learn how CommunityRule works")').click();
    await page.locator('text=Consensus clusters').click();
    await page.locator('button:has-text("Ask an organizer")').click();
  });

  test('user journey: accessibility navigation', async ({ page }) => {
    // Test screen reader navigation
    await page.keyboard.press('Tab');
    
    // Navigate through landmarks
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Test heading navigation (if supported)
    await page.keyboard.press('Tab');
    
    // Test form navigation
    await page.keyboard.press('Tab');
    
    // Test button activation
    await page.keyboard.press('Enter');
  });

  test('user journey: performance testing', async ({ page }) => {
    // Measure initial page load
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    
    // Measure scroll performance
    const scrollStartTime = Date.now();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const scrollTime = Date.now() - scrollStartTime;
    
    expect(scrollTime).toBeLessThan(1000); // Should scroll smoothly
    
    // Measure interaction response time
    const clickStartTime = Date.now();
    await page.locator('button:has-text("Learn how CommunityRule works")').click();
    const clickTime = Date.now() - clickStartTime;
    
    expect(clickTime).toBeLessThan(500); // Should respond quickly
  });
});
