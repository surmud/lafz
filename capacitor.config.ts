import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Lafz for iOS and Android. The app is the static export built with NEXT_PUBLIC_NATIVE=1 (no
 * /lafz base path), copied into native-www/ by `npm run build:native`. Everything, audio included,
 * is bundled, so the app works offline from the first launch.
 */
const config: CapacitorConfig = {
  appId: "app.lafz",
  appName: "Lafz",
  webDir: "native-www",
  backgroundColor: "#fbf4e8",
  ios: { contentInset: "never", backgroundColor: "#fbf4e8" },
  android: { backgroundColor: "#fbf4e8" },
  plugins: {
    SplashScreen: { launchAutoHide: false, backgroundColor: "#fbf4e8", showSpinner: false },
  },
};

export default config;
