# CrackNQT Analytics Specification

This document defines the analytics events implemented for CrackNQT to measure the conversion funnel and user engagement.

## Implementation Details
- **System:** Google Analytics 4 (GA4)
- **Measurement ID:** `G-XF4D0X8KBZ`
- **Helper:** `src/lib/analytics.ts`
- **Events:** `trackEvent(eventName, params)`

---

## Event Definitions

| Event Name | Trigger | Parameters | Purpose |
| :--- | :--- | :--- | :--- |
| `practice_started` | Practice start | `practice_topic`, `practice_category`, `question_count`, `difficulty`, `source_page` | Track usage of practice features. |
| `mock_completed` | Mock test submission | `mock_id`, `mock_category`, `score_band`, `completion_status` | Measure mock test performance and completion. |
| `premium_cta_click` | Premium CTA click | `source_page`, `cta_location`, `cta_text` | Track conversion interest. |

---

## Next Steps
- Implement `signup` events.
- Implement `checkout` and `payment` events (server-side/webhook-verified).
- Set up Key Events in GA4.
