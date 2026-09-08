import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.PORT || 4173);

/* CI installs Playwright's own Chromium. Locally you can point at one you
   already have with CHROMIUM_PATH=$(which chromium) to skip the download. */
const executablePath = process.env.CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']]
    : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    launchOptions: executablePath ? { executablePath } : {}
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: `node tests/server.mjs ${PORT}`,
    url: `http://localhost:${PORT}/index.html`,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore'
  }
});
