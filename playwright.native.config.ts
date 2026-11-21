import { defineConfig, devices } from "@playwright/test";

/**
 * The iOS/Android build: `npm run build:native` writes native-www/, served here at the root exactly as
 * Capacitor serves it from the app bundle. Run with `npm run e2e:native`.
 */
const PORT = 4174;

export default defineConfig({
  testDir: "e2e-native",
  outputDir: "test-results-native",
  fullyParallel: true,
  timeout: 120_000,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}/`,
    trace: "retain-on-failure",
    contextOptions: { reducedMotion: "reduce" },
    launchOptions: { args: ["--autoplay-policy=no-user-gesture-required"] },
  },
  projects: [{ name: "iphone", use: { ...devices["iPhone 13"], browserName: "chromium", viewport: { width: 390, height: 844 } } }],
  webServer: {
    command: `SERVE_ROOT=native-www SERVE_BASE= node scripts/serve-out.mjs ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: false,
  },
});
