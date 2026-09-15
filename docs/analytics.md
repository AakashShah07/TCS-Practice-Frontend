# Analytics Strategy (GA4)

This document defines the analytics funnel, event definitions, parameters, and setup instructions for the CrackNQT platform.

## 1. Core Analytics Helper (`src/lib/analytics.ts`)

All analytics events MUST be fired through `trackEvent` to ensure consistency and prevent application crashes if GA4 is blocked or fails.

```typescript
export const trackEvent = (eventName: string, params?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else if (process.env.NODE_ENV === 'development') {
    console.debug(`[Analytics] ${eventName}:`, params);
  }
};
```

## 2. Event Definition Table

| Event | Trigger | Parameters | Key Event? | Source of Truth |
| :--- | :--- | :--- | :--- | :--- |
| `practice_started` | Practice session begins | `practice_topic`, `practice_category`, `source_page` | No | Frontend |
| `practice_completed` | Practice session finishes | `practice_topic`, `practice_category`, `question_count`, `difficulty`, `source_page` | No | Frontend |
| `mock_started` | Mock test begins | `mock_id`, `mock_category`, `mock_type` | No | Frontend |
| `mock_completed` | Mock test submitted | `mock_id`, `mock_category`, `mock_type`, `score_band` | Yes | Backend/Frontend |
| `sign_up` | Account creation confirmed | `method`, `source_page` | Yes | Backend |
| `login` | Login confirmed | `method` | No | Backend |
| `premium_cta_click` | Premium CTA clicked | `source_page`, `cta_location`, `cta_text` | No | Frontend |
| `premium_page_view` | Premium page viewed | `source_page` | No | Frontend |
| `begin_checkout` | Checkout initiated | `items`, `value`, `currency` | Yes | Frontend |
| `payment_initiated` | Payment started | `product`, `payment_method`, `value`, `currency` | No | Frontend |
| `purchase` | Payment successful | `transaction_id`, `value`, `currency`, `items` | YES | Backend |
| `payment_failed` | Payment failed/cancelled | `failure_category` | No | Backend/Frontend |
| `premium_activated` | Premium access granted | - | No | Backend |

## 3. Funnels

### A. OPEN FUNNEL (Product Engagement)
Landing → practice_started → practice_completed → mock_started → mock_completed → premium_cta_click → premium_page_view → begin_checkout → payment_initiated → purchase

### B. CLOSED FUNNEL (Strict Journey)
Users must start from the first step in a session to be counted.

## 4. Privacy Rules
- DO NOT send PII (email, name, phone, user ID).
- DO NOT send authentication identifiers.
- DO NOT send raw user input (question text, answers).
- DO NOT send payment-sensitive information (card details).

## 5. Implementation Notes
- Use `INR` for currency.
- Ensure idempotency for `purchase` and `premium_activated`.
- All `purchase` events must use a backend-verified `order_id` as `transaction_id`.

## 6. Implementation & QA Status

| Event | Implemented | Verified |
| :--- | :--- | :--- |
| `practice_started` | Yes | Yes |
| `practice_completed` | Yes | Yes |
| `mock_started` | Yes | Yes |
| `mock_completed` | Yes | Yes |
| `login` | Yes | Yes |
| `premium_cta_click` | Partial | Partial |
| `sign_up` | No | No |
| `premium_page_view` | No | No |
| `begin_checkout` | No | No |
| `payment_initiated` | No | No |
| `purchase` | No | No |
| `payment_failed` | No | No |
| `premium_activated` | No | No |

### QA Instructions
1. **Real-time QA:** Use GA4 DebugView to verify events.
2. **Key Events:** Mark `purchase`, `sign_up`, `mock_completed`, `begin_checkout` as Key Events in GA4.
3. **Funnel Setup:** Configure "Open" and "Closed" funnels in GA4 Exploration.
4. **Attribution:** Verify UTM parameters (`utm_source`, `utm_medium`, etc.) are captured by GA4 automatically.
5. **Purchase Verification:** Ensure `transaction_id` from backend matches payment provider's order ID.
