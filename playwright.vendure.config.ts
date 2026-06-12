import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/vendure',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:4321',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'bun run --cwd vendure-showcase/storefront dev --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
