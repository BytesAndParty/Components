import { defineConfig } from '@playwright/test';

// ─── Phone matrix ────────────────────────────────────────────────────────────
// The phone viewports we test mobile layouts against. Chosen to span the
// most-used resolutions worldwide (per StatCounter screen-resolution stats):
// a small Android (360×800, the single most common Android viewport), the
// iPhone SE / 6-7-8 class (375×667), the modern iPhone 12–15 (390×844), Pixel
// (393×873), the iPhone XR/11/Plus class (414×896) and a Pro-Max-class phone
// (430×932). Stored as explicit viewports — not Playwright's named presets — so
// the matrix is self-documenting and independent of preset renames across
// Playwright versions.
const IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';

const PHONES = [
  { name: 'Android-360x800',    width: 360, height: 800, ua: ANDROID_UA },
  { name: 'iPhone-SE-375x667',  width: 375, height: 667, ua: IOS_UA },
  { name: 'iPhone-390x844',     width: 390, height: 844, ua: IOS_UA },
  { name: 'Pixel-393x873',      width: 393, height: 873, ua: ANDROID_UA },
  { name: 'iPhone-XR-414x896',  width: 414, height: 896, ua: IOS_UA },
  { name: 'iPhone-Max-430x932', width: 430, height: 932, ua: IOS_UA },
] as const;

export default defineConfig({
  testDir: './e2e/mobile',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report/mobile', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
  },
  // One project per phone — Playwright runs the whole suite against each
  // viewport, so a failure tells you exactly which device + route broke.
  // isMobile/hasTouch are Chromium-only, which is fine: these projects default
  // to chromium (no browserName override).
  projects: PHONES.map(p => ({
    name: p.name,
    use: {
      viewport: { width: p.width, height: p.height },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: p.ua,
    },
  })),
  webServer: {
    command: 'bun run --cwd section-showcase dev',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
