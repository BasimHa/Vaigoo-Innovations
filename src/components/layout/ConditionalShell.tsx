"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GlobalBackground } from '@/components/layout/GlobalBackground';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

/**
 * Renders the public site shell (Navbar, Footer, GlobalBackground, ScrollToTop)
 * only for non-admin routes. The /careers-admin page gets an isolated bare layout.
 */
export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/careers-admin') || pathname?.startsWith('/carrer-contactus-admin');

  if (isAdmin) {
    // Admin pages: bare body, no site shell
    return <>{children}</>;
  }

  // Public pages: full site shell
  return (
    <>
      <GlobalBackground />
      <Navbar />
      <main className="flex-grow relative z-10 w-full overflow-x-hidden pt-24">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
