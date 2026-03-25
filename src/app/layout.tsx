import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';
import { ConditionalShell } from '@/components/layout/ConditionalShell';
import { GA_TRACKING_ID } from '@/lib/gtag';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaigoo Innovations",
  description: "We build intelligent digital systems for modern businesses. AI-powered solutions, scalable infrastructure, future-ready products.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      {/* Google Analytics — loads after page is interactive, doesn't block render */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
        `}
      </Script>

      <body className="min-h-screen bg-background text-foreground flex flex-col relative" suppressHydrationWarning>
        <AnalyticsTracker />
        <ConditionalShell>
          {children}
        </ConditionalShell>
      </body>
    </html>
  );
}

