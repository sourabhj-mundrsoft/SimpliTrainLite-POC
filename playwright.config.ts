import { defineConfig, devices } from "@playwright/test";
import { isAppSelected } from "./e2e/selected-apps";

const applications = [
  { id: "simplitrain_lite", script: "dev:app1", port: 3001 },
  { id: "application-2", script: "dev:app2", port: 3002 },
  { id: "application-3", script: "dev:app3", port: 3003 },
];

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
  webServer: applications
    .filter((app) => isAppSelected(app.id))
    .map((app) => ({
      command: `pnpm ${app.script}`,
      url: `http://localhost:${app.port}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    })),
});
