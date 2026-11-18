import type { NextConfig } from "next";

// The web build lives at surmud.github.io/lafz/; the Capacitor (iOS/Android) build is served from the
// app bundle root. NEXT_PUBLIC_NATIVE=1 switches to the native layout (see docs/RELEASE.md).
const native = process.env.NEXT_PUBLIC_NATIVE === "1";
const basePath = native ? "" : "/lafz";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
