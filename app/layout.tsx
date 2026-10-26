import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { sans, mono } from "@/lib/fonts";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "Content Pillar Tracker";
const HANDLE = process.env.X_ACCOUNT_HANDLE || "your account";

export const metadata: Metadata = {
  title: BRAND,
  description: `Per-pillar posting cadence & performance for the @${HANDLE} X account.`,
};

// Google sign-in is restricted to AUTH_ALLOWED_DOMAIN (see auth.ts).
// The money-spending sync/classify endpoints stay locked to CRON_SECRET.
//
// Navigation lives entirely in the left rail (Sidebar) — the header only carries
// the wordmark (a home link) and the logo, so the two aren't redundant.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-screen bg-black font-sans text-white antialiased">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-black/70 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-sm font-medium tracking-[-0.01em] transition hover:opacity-80">
              {BRAND}
            </Link>
            <span className="font-mono text-[11px] uppercase tracking-wide text-white/40">@{HANDLE}</span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
