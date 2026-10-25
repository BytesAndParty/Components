import { defineConfig, devices } from '@playwright/test';

// Storefront suite (FOUC prevention, hydration). The storefront dev server runs
// on 5173 (vendure-showcase/storefront/astro.config.mjs); the components
// showcase moved to 5171 to avoid that collision.
const SHOP_API_URL =
  process.env.VENDURE_SHOP_API_URL ?? 'https://vendure-showcase.169-58-203-37.sslip.io/shop-api';

export default defineConfig({
  testDir: './e2e/vendure',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:5173',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // --ignore-lock keeps astro dev in the foreground. Without it, Astro 7.3
    // detaches into a background daemon when it detects an AI agent, and
    // Playwright reports "exited early" while the orphaned server keeps 5173.
    command: 'bun run --cwd vendure-showcase/storefront dev --ignore-lock',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    // The pages query Vendure while rendering. Default to the VPS server, the
    // same one build:all uses; override with VENDURE_SHOP_API_URL for a local one.
    env: {
      VENDURE_SHOP_API_URL: SHOP_API_URL,
      PUBLIC_SHOP_API_URL: SHOP_API_URL,
    },
  },
});
