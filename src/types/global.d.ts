export {};

declare global {
  interface Window {
    gtag: (
      type: 'event' | 'config' | 'js',
      eventName: string,
      params?: Record<string, string | number | boolean> | Date
    ) => void;
    dataLayer: any[];
  }
}
