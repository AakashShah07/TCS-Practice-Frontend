export type EventParams = Record<string, string | number | boolean>;

/**
 * Tracks an event in GA4 using the global gtag function.
 * Ensures the application doesn't crash if gtag is not defined.
 */
export const trackEvent = (eventName: string, params?: EventParams) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else if (process.env.NODE_ENV === 'development') {
    console.debug(`[Analytics] ${eventName}:`, params);
  }
};

/**
 * Common event names to ensure consistency.
 */
export const AnalyticsEvents = {
  PRACTICE_STARTED: 'practice_started',
  PRACTICE_COMPLETED: 'practice_completed',
  MOCK_STARTED: 'mock_started',
  MOCK_COMPLETED: 'mock_completed',
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  PREMIUM_CTA_CLICK: 'premium_cta_click',
  PREMIUM_PAGE_VIEW: 'premium_page_view',
  BEGIN_CHECKOUT: 'begin_checkout',
  PAYMENT_INITIATED: 'payment_initiated',
  PURCHASE: 'purchase',
  PAYMENT_FAILED: 'payment_failed',
  PREMIUM_ACTIVATED: 'premium_activated',
};
