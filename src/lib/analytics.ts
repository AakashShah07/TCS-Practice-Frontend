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
  SESSION_REVOKED: 'session_revoked',
  INFOSYS_DASHBOARD_CTA_CLICK: 'infosys_dashboard_cta_click',
  INFOSYS_MOCK_CATALOG_CLICK: 'infosys_mock_catalog_click',
  INFOSYS_MOCK_START: 'infosys_mock_start',
  INFOSYS_CAMPAIGN_POPUP_VIEW: 'infosys_campaign_popup_view',
  INFOSYS_CAMPAIGN_POPUP_DISMISS: 'infosys_campaign_popup_dismiss',
  INFOSYS_CAMPAIGN_CTA_CLICK: 'infosys_campaign_cta_click',
  INFOSYS_CAMPAIGN_POPUP_SESSION: 'infosys_campaign_popup_session',
  INFOSYS_INFO_PAGE_VIEW: 'infosys_info_page_view',
  INFOSYS_EXAM_PATTERN_INTERACTION: 'infosys_exam_pattern_interaction',
  INFOSYS_ELIGIBILITY_CHECKLIST_INTERACTION: 'infosys_eligibility_checklist_interaction',
  INFOSYS_SELECTION_STAGE_INTERACTION: 'infosys_selection_stage_interaction',
  INFOSYS_FAQ_EXPAND: 'infosys_faq_expand',
  INFOSYS_PREPARATION_CTA_CLICK: 'infosys_preparation_cta_click',
  INFOSYS_REGISTRATION_LINK_CLICK: 'infosys_registration_link_click',
};
