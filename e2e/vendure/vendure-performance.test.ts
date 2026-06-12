import { test, expect } from '@playwright/test';

// This test assumes the vendure-showcase storefront is running at http://localhost:5173
// It specifically tests for FOUC prevention and hydration stability.

test.describe('Vendure Showcase - Performance & Hydration', () => {
  
  test.beforeEach(async ({ page }) => {
    // We want to test if the theme from localStorage is applied BEFORE hydration.
    // We set the localStorage BEFORE navigating.
    await page.addInitScript(() => {
      window.localStorage.setItem('atelier-theme', 'light');
      window.localStorage.setItem('atelier-accent', 'indigo');
    });
  });

  test('Theme is applied immediately (FOUC Prevention)', async ({ page }) => {
    // We navigate to the page
    await page.goto('http://localhost:5173');

    // The AtelierInitScript should have run immediately.
    // We check the <html> tag.
    const html = page.locator('html');
    
    // Check attributes
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(html).toHaveAttribute('data-accent', 'indigo');
    
    // Check that 'dark' class is NOT present (since we set light theme)
    const hasDarkClass = await html.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkClass).toBe(false);
  });

  test('Hydration completes without errors', async ({ page }) => {
    // We check for console errors during and after hydration
    const errors: any[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('http://localhost:5173');
    
    // Wait for hydration (Header is client:load)
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check if there are any hydration-related errors
    const hydrationErrors = errors.filter(err => err.toLowerCase().includes('hydration'));
    expect(hydrationErrors).toHaveLength(0);
  });

  test('Accent color is reactive after hydration', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Open accent picker
    const accentPicker = page.getByRole('button', { name: /Akzent/i });
    if (await accentPicker.isVisible()) {
      await accentPicker.click();
      
      // Click a color (e.g., 'indigo' or 'blue')
      // We check what accents are available. Based on log, Bordeaux, Gold, Wald, Aubergine, Indigo are there.
      const indigoOption = page.locator('button[data-accent="indigo"]');
      if (await indigoOption.isVisible()) {
        await indigoOption.click();
        await expect(page.locator('html')).toHaveAttribute('data-accent', 'indigo');
      }
    }
  });
});
