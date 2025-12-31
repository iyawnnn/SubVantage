import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // 1. 👇 The Critical Fix: Tell Playwright to ONLY look here
  testDir: "./tests/e2e",

  // 2. Run tests in files in parallel
  fullyParallel: true,

  // 3. Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // 4. Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // 5. Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // 6. Reporter to use.
  reporter: "html",

  use: {
    // 7. Base URL for your app (matches your pnpm dev port)
    baseURL: "http://localhost:3000",

    // 8. Collect trace when retrying the failed test.
    trace: "on-first-retry",
  },

  // 9. Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // 10. Run your local dev server before starting the tests
  // This ensures your app is running at localhost:3000
  webServer: {
    // If we are in CI, run the production server. Locally, run dev.
    command: process.env.CI ? "pnpm start" : "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // Give it 2 minutes to boot up in the cloud
  },
});
