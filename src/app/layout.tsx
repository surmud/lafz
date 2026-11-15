import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource/noto-nastaliq-urdu/400.css";
import "@fontsource/noto-nastaliq-urdu/700.css";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";

export const metadata: Metadata = {
  title: "Lafz — Urdu for real family life",
  description:
    "Free Urdu course for heritage learners and beginners. No ads, no hearts, mistakes are free. Works offline.",
  manifest: "/lafz/manifest.webmanifest",
  icons: { icon: "/lafz/icons/icon.svg", apple: "/lafz/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf4e8" },
    { media: "(prefers-color-scheme: dark)", color: "#17110e" },
  ],
};

// Runs before paint so the theme never flashes.
const themeScript = `(function(){try{var t=localStorage.getItem("lafz.theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg text-ink antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
