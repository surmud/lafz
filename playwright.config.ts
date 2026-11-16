import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

export default defineConfig({
  testDir: "e2e",
  testIgnore: process.env.LAFZ_EXPERIMENTAL ? [] : ["experimental/**"],
  outputDir: "test-results",
  fullyParallel: true,
  timeout: 120_000,
  retries: 1,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}/lafz/`,
    trace: "retain-on-failure",
    contextOptions: { reducedMotion: "reduce" },
    launchOptions: { args: ["--autoplay-policy=no-user-gesture-required"] },
  },
  projects: [
    { name: "iphone", use: { ...devices["iPhone 13"], browserName: "chromium", viewport: { width: 375, height: 812 } } },
    { name: "pixel", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `node scripts/serve-out.mjs ${PORT}`,
    url: `http://localhost:${PORT}/lafz/`,
    reuseExistingServer: !process.env.CI,
  },
});
