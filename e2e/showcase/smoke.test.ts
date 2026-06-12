import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Showcase App', () => {
  test('Home page renders successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Components Showcase/i);
    // Check if the sidebar or main navigation is present
    await expect(page.locator('nav').first()).toBeVisible();
  });

  test('Inputs page renders and shows form elements', async ({ page }) => {
    await page.goto('/inputs');
    // Verify specific input-related components by their headings
    await expect(page.getByRole('heading', { name: /FormInput/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Checkbox/i })).toBeVisible();
  });

  test('Shop page renders and shows product items', async ({ page }) => {
    await page.goto('/shop');
    // Expect product items with "Warenkorb" buttons
    const cartButtons = page.getByRole('button', { name: /Warenkorb/i });
    await expect(cartButtons.first()).toBeVisible();
  });

  test('Data page renders and shows a table', async ({ page }) => {
    await page.goto('/data');
    // Check for table elements from TanStack Table
    const tables = page.locator('table');
    await expect(tables.first()).toBeVisible();
    await expect(page.locator('thead').first()).toBeVisible();
  });

  test('Navigation works between pages', async ({ page }) => {
    await page.goto('/');
    // Use the sidebar navigation
    const nav = page.locator('nav');
    await nav.getByRole('button', { name: /Shop/i }).click();
    
    await expect(page).toHaveURL(/\/shop/);
    await expect(page.getByRole('button', { name: /Warenkorb/i }).first()).toBeVisible();
  });
});
