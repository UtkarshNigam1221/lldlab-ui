import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  // 220+ page loads fetch Google Fonts in parallel; 30s per test times out under that load.
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:61000' },
  webServer: { command: 'npx ladle preview --port 61000', url: 'http://localhost:61000', reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
