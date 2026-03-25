import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Navbar } from '@/components/layout/Navbar';
import { GlobalBackground } from '@/components/layout/GlobalBackground';
import { Footer } from '@/components/layout/Footer';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vaigoo Innovations | Future of Innovation",
  description: "We build intelligent digital systems for modern businesses. AI-powered solutions, scalable infrastructure, future-ready products.",
  icons: {
    icon: "/Images/logo/Gemini_Generated_Image_38mz5x38mz5x38mz.png",
    apple: "/Images/logo/Gemini_Generated_Image_38mz5x38mz5x38mz.png",
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
      <body className="min-h-screen bg-background text-foreground flex flex-col relative" suppressHydrationWarning>
        <GlobalBackground />
        <Navbar />
        <main className="flex-grow relative z-10 w-full overflow-x-hidden pt-24">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
