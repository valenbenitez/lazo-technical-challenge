import { defineConfig, devices } from "@playwright/test";

/**
 * E2E prerequisites (not started by this config):
 * - Postgres + Nest backend on :3001 (`API_URL` in frontend `.env.local`)
 * - Next frontend on :3000 (`pnpm dev`)
 *
 * Run: `pnpm test:e2e` (from frontend/). Separate from Vitest / `./init.sh`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
