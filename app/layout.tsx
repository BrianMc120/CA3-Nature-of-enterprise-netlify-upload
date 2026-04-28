import type { Metadata } from "next";
import { Fraunces, Lexend } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./_components/AuthProvider";
import { SettingsProvider } from "./_components/SettingsProvider";
import GlobalKeyboardShortcuts from "./_components/GlobalKeyboardShortcuts";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
});

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "Campus Companion", template: "%s · Campus Companion" },
  description: "Your warm, welcoming hub for first-year campus life.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${lexend.variable}`}
      data-text-size="default"
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-stone-900 focus:text-white focus:px-5 focus:py-3 focus:rounded-xl focus:font-semibold focus:text-base"
        >
          Skip to main content
        </a>
        <SettingsProvider>
          <AuthProvider>{children}</AuthProvider>
        </SettingsProvider>
        <GlobalKeyboardShortcuts />
      </body>
    </html>
  );
}
