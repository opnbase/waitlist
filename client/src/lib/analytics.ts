declare global {
  interface Window { gtag?: (...args: any[]) => void }
}

const GA_ID = import.meta.env.VITE_GA_ID;          

export function trackPage(path: string) {
  if (GA_ID && window.gtag) {
    window.gtag("config", GA_ID, { page_path: path });
  }
}

export function trackEvent(
  action: string,
  params: Record<string, any> = {}
) {
  if (GA_ID && window.gtag) {
    window.gtag("event", action, params);
  }
}
