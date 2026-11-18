import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource/noto-nastaliq-urdu/400.css";
import "@fontsource/noto-nastaliq-urdu/700.css";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";
import { characters } from "@/content";
import { BASE } from "@/lib/base";

export const metadata: Metadata = {
  title: "Lafz — Learn Urdu",
  description:
    "A free Urdu course for beginners and heritage speakers. Speaking, listening and reading. Works offline.",
  manifest: `${BASE}/manifest.webmanifest`,
  icons: { icon: `${BASE}/icons/icon.svg`, apple: `${BASE}/icons/apple-touch-icon.png` },
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
        <AppProviders cast={characters().map(({ id, name, emoji, color }) => ({ id, name, emoji, color }))}>{children}</AppProviders>
      </body>
    </html>
  );
}
