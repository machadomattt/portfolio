import { defineConfig, devices } from '@playwright/test'

// When PLAYWRIGHT_BASE_URL is set (by server/index.mjs for the live demo),
// tests run against that already-running instance instead of spawning a
// redundant preview server — this is what lets the "run live" feature in
// the Tests section genuinely re-test the live site.
const liveBaseUrl = process.env.PLAYWRIGHT_BASE_URL
const baseURL = liveBaseUrl || 'http://localhost:4173'

export default defineConfig({
  testDir: './tests/e2e',
  // Leading-underscore spec files are scratch/one-off scripts (e.g. for
  // capturing screenshots) that must never be picked up by the real suite —
  // this matters a lot more here than in a typical project, since the live
  // "run tests" feature spawns this exact suite against the live site.
  testIgnore: '**/_*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: liveBaseUrl
    ? undefined
    : {
        command: 'npm run preview -- --port 4173',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
  ],
})
