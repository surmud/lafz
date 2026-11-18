"use client";
import { config } from "./config";

/**
 * Native-only behaviour (Capacitor builds). Loaded lazily and only when NEXT_PUBLIC_NATIVE=1, so the
 * web bundle never carries the plugins.
 * - Android hardware back button: go back in history, or leave the app from the home screen.
 * - Hide the splash screen once the app has rendered.
 */
export async function initNative() {
  if (!config.native) return;
  const [{ App }, { SplashScreen }] = await Promise.all([import("@capacitor/app"), import("@capacitor/splash-screen")]);
  await App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack && location.pathname !== "/") history.back();
    else void App.exitApp();
  });
  await SplashScreen.hide().catch(() => undefined);
}
