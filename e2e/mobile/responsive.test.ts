import { test, expect } from '@playwright/test';

// Every section route in the section-showcase plus the index overview. Driven
// by the phone matrix in playwright.mobile.config.ts — each test runs once per
// device, so a failure pinpoints the exact viewport + route.
const ROUTES = [
  '/',
  '/hero',
  '/features',
  '/showcase',
  '/storefront',
  '/cta',
  '/pricing',
  '/timeline',
  '/testimonials',
  '/gallery',
  '/footer',
] as const;

test.describe('Mobile responsive — section-showcase', () => {
  for (const route of ROUTES) {
    test(`no horizontal overflow @ ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      // Page must not scroll sideways. Elements that overflow *inside* an
      // overflow-x-auto track (e.g. the command bar's variant pills) don't
      // grow the document, so they don't trip this. 1px tolerance for
      // sub-pixel rounding.
      expect(
        scrollWidth,
        `${route} scrolls horizontally (${scrollWidth}px content in ${clientWidth}px viewport)`,
      ).toBeLessThanOrEqual(clientWidth + 1);
    });

    test(`no broken images @ ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });
      const broken = await page.evaluate(() =>
        [...document.querySelectorAll('img')]
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => img.currentSrc || img.src),
      );
      expect(broken, `broken images on ${route}`).toEqual([]);
    });
  }
});
