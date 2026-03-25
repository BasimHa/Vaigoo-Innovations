export const GA_TRACKING_ID = "G-EKZBDMEC19";

// Declare gtag on window for TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

/** Track a page view */
export const pageview = (url: string): void => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

/** Track a custom event */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}): void => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};
