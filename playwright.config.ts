import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  expect: {
    timeout: 15_000,
  },
  use: {
    ...devices["Desktop Chrome"],
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "pnpm dev:app1",
      url: "http://localhost:3001",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "pnpm dev:app2",
      url: "http://localhost:3002",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "pnpm dev:app3",
      url: "http://localhost:3003",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
