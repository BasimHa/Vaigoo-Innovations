"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { pageview } from "@/lib/gtag";

/**
 * AnalyticsTracker — fires a GA4 pageview on every route change.
 * Must be rendered inside <body> in the root layout.
 */
export const AnalyticsTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    pageview(pathname);
  }, [pathname]);

  return null;
};
