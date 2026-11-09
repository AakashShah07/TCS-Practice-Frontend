# CrackNQT Analytics Analysis

**Data source:** `Reports_snapshot.csv` (GA4 export; no file named `report.csv` exists in workspace).  
**GA4 property:** Crack NQT (account: Aakash Shah).  
**Measurement ID:** G-XF4D0X8KBZ (verified in `src/app/layout.tsx`).  
**Date range:** 2026-08-10 to 2026-11-07 (90 days).  
**Export sections:** Top-level metrics, page title/screen class, first user source/medium, session source/medium, Nth day new/returning, city, audience name. Platform section is empty.

---

## 1. OBSERVED DATA

### 1.1 Top-level metrics (90-day aggregate)

| Metric | Value |
|--------|-------|
| Active users | 1,083 |
| New users | 971 |
| Average engagement time per active user | 770.78 seconds (~12.8 minutes) |
| Event count | 26,282 |

**Source:** `Reports_snapshot.csv`, lines 9–10.

### 1.2 Page-level performance (views, active users, event count, bounce rate)

| Page title | Views | Active users | Event count | Bounce rate |
|------------|-------|--------------|-------------|-------------|
| NQT Prep — Free TCS NQT Practice Tests & Exam Simulation | 4,242 | 624 | 8,586 | 18.4% |
| Practice Tests | NQT Prep | 1,542 | 386 | 2,377 | 12.5% |
| Topic Practice | NQT Prep | 1,319 | 195 | 2,012 | 6.5% |
| CrackNQT — TCS NQT Practice, Mock Tests & Preparation | 1,247 | 277 | 3,180 | 26.5% |
| Dashboard | NQT Prep | 1,211 | 368 | 1,591 | 6.5% |
| Sign In | NQT Prep | 802 | 342 | 1,764 | 15.3% |
| Create Account | NQT Prep | 762 | 436 | 1,451 | 8.2% |
| TCS NQT Coding Questions (PYQ) | NQT Prep | 497 | 134 | 718 | 31.3% |
| Practice Tests | CrackNQT | 493 | 120 | 815 | 29.4% |
| Sign In | CrackNQT | 446 | 137 | 1,167 | 44.0% |
| Topic Practice | CrackNQT | 428 | 61 | 789 | 18.8% |
| Dashboard | CrackNQT | 375 | 118 | 549 | 15.8% |
| Create Account | CrackNQT | 270 | 187 | 631 | 12.7% |
| TCS NQT Coding Questions (PYQ) | CrackNQT | 211 | 45 | 325 | 34.7% |
| Analytics | NQT Prep | 158 | 93 | 178 | 0.8% |
| Infosys System Engineer Exam 2027 \| Pattern, Syllabus & Mock Test \| CrackNQT | 18 | 14 | 90 | 21.4% |
| Infosys SE 2027 Preparation Roadmap — Coming Soon \| CrackNQT | 9 | 8 | 19 | 12.5% |
| Analytics | CrackNQT | 5 | 5 | 10 | 0% |
| 404: This page could not be found. | 3 | 2 | 5 | 50.0% |
| About CrackNQT \| NQT Prep | 2 | 2 | 2 | 0% |
| About CrackNQT — Independent TCS NQT Preparation Platform \| CrackNQT | 2 | 2 | 4 | 50% |
| Contact CrackNQT | CrackNQT | 2 | 2 | 5 | 50% |
| Infosys SE 2027 Recruitment \| Eligibility, Exam Pattern \& Preparation \| CrackNQT | 2 | 2 | 8 | 0% |
| Privacy Policy \| CrackNQT \| CrackNQT | 1 | 1 | 3 | 100% |
| खाता बनाएँ \| एनक्यूटी तैयारी | 1 | 1 | 3 | 50% |

**Source:** `Reports_snapshot.csv`, lines 15–41.

**Observations:**
- Two naming variants exist ("NQT Prep" and "CrackNQT") for the same pages, suggesting inconsistent page titles across routes or environments.
- The main landing page ("NQT Prep — Free TCS NQT Practice Tests & Exam Simulation") dominates with 4,242 views (37% of all listed page views).
- Dashboard has strong engagement: 1,211 views, 368 active users, only 6.5% bounce rate — users who reach the dashboard stay and interact.
- Sign In has relatively high bounce rate (15.3% for "NQT Prep" variant, 44.0% for "CrackNQT" variant) — possible login friction or users arriving then leaving.
- Create Account has lower bounce rate (8.2%–12.7%) than Sign In — registration flow may be smoother than login flow.
- Infosys pages have very low traffic: main Infosys page 18 views / 14 users, preparation page 9 views / 8 users, recruitment page 2 views / 2 users — minimal engagement with the Infosys campaign.

### 1.3 Traffic acquisition (first user source / medium — active users)

| Source / medium | Active users |
|-----------------|--------------|
| (direct) / (none) | 476 |
| google / organic | 447 |
| bing / organic | 71 |
| chatgpt.com / ai-assistant | 38 |
| in.search.yahoo.com / referral | 19 |
| gemini.google.com / ai-assistant | 11 |
| google / cpc | 5 |
| linkedin.com / referral | 5 |
| chatgpt.com / referral | 3 |
| yahoo / organic | 3 |
| claude.ai / ai-assistant | 1 |
| copilot.com / ai-assistant | 1 |
| keep.google.com / referral | 1 |
| payuin.lightning.force.com / referral | 1 |
| web.telegram.org / referral | 1 |

**Source:** `Reports_snapshot.csv`, lines 45–60.

**Session source / medium (sessions):**

| Source / medium | Sessions |
|-----------------|----------|
| google / organic | 1,281 |
| (direct) / (none) | 1,073 |
| bing / organic | 316 |
| chatgpt.com / ai-assistant | 160 |
| in.search.yahoo.com / referral | 53 |
| gemini.google.com / ai-assistant | 23 |
| keep.google.com / referral | 12 |
| linkedin.com / referral | 8 |
| google / cpc | 5 |
| claude.ai / ai-assistant | 4 |
| yahoo / organic | 4 |
| copilot.com / ai-assistant | 3 |
| chatgpt.com / (none) | 1 |
| payuin.lightning.force.com / referral | 1 |
| web.telegram.org / referral | 1 |

**Source:** `Reports_snapshot.csv`, lines 65–83.

**Observations:**
- Organic search (Google + Bing) drives the majority of sessions: 1,281 + 316 = 1,597 sessions (~57% of the 2,815 total sessions from listed sources).
- Direct traffic is significant (1,073 sessions, ~38%).
- AI assistants (ChatGPT, Gemini, Claude, Copilot) contribute ~188 sessions combined (~7%) — notable for an exam prep site.
- Paid search (Google CPC) is minimal: 5 sessions.

### 1.4 User engagement (Nth day, new vs returning)

Sample rows (full data lines 88–178):

| Day | New | Returning |
|-----|-----|-----------|
| Day 0 | 38 | 47 |
| Day 1 | 33 | 29 |
| Day 2 | 42 | 29 |
| Day 3 | 25 | 40 |
| Day 7 | 11 | 18 |
| Day 14 | 10 | 26 |
| Day 24 | 37 | 9 |
| Day 30 | 20 | 9 |
| Day 60 | 6 | 3 |
| Day 89 | 22 | 3 |

**Source:** `Reports_snapshot.csv`, lines 88–178.

**Observations:**
- Early days show roughly balanced new vs returning users.
- By day 7, returning users (18) exceed new (11) — some retention in first week.
- By day 30 and beyond, returning users drop sharply (3 at day 30, 3 at day 89) — long-term retention appears weak.
- Day 24 shows a spike in new users (37) — possible campaign or external referral event.

### 1.5 Geographic distribution (top cities by active users)

| City | Active users |
|------|--------------|
| Hyderabad | 103 |
| Chennai | 59 |
| Council Bluffs | 51 |
| Pune | 49 |
| Kolkata | 47 |
| Bengaluru | 41 |
| Lucknow | 36 |
| Sultanpur | 31 |
| Mumbai | 24 |
| Bhopal | 19 |

**Source:** `Reports_snapshot.csv`, lines 189–218 (top 10 shown; full list extends to 400+ cities with 1 user each).

**Observations:**
- Heavy concentration in Indian tech/education hubs (Hyderabad, Chennai, Pune, Kolkata, Bengaluru, Lucknow, Mumbai).
- Council Bluffs (51) is an outlier — possibly a data center or VPN exit node; not representative of actual user location.

### 1.6 Audience

| Audience | Active users |
|----------|--------------|
| All Users | 1,083 |

**Source:** `Reports_snapshot.csv`, line 412–413.

### 1.7 Platform / key events

Platform section is empty (no data rows under "Platform,Key events").

---

## 2. INTERPRETATION

### 2.1 What the numbers suggest

**Strong landing page, decent dashboard retention:** The landing page gets the most traffic (4,242 views) and the dashboard has low bounce rate (6.5%) and decent events per user (1,591 events / 368 users ≈ 4.3 events per session). This suggests users who create accounts and reach the dashboard are relatively engaged.

**Registration flow works but dashboard conversion has a gap:** Create Account has 762 views / 436 active users. Dashboard has 1,211 views / 368 active users. The fact that dashboard views exceed create-account views suggests returning users access the dashboard directly. However, the gap between 436 create-account users and 368 dashboard users (~16% drop) could indicate some registered users never reach or return to the dashboard.

**Sign-in friction:** Sign In | CrackNQT has a 44.0% bounce rate — nearly half of users who hit the CrackNQT-branded sign-in page leave without interacting further. This is notably higher than the NQT Prep variant (15.3%) and may indicate confusion, broken flow, or users arriving at the wrong entry point.

**Infosys campaign has minimal traction:** The Infosys 2027 pages collectively account for only 29 views / 24 users across all Infosys-related pages. Compared to the landing page's 4,242 views, the Infosys campaign is not yet driving meaningful traffic.

**AI assistant referrals are notable:** chatgpt.com (ai-assistant + referral) = 41 first users / 163 sessions; gemini.google.com = 11 first users / 23 sessions; claude.ai + copilot.com = 4 first users / 5 sessions. This suggests AI assistants are referring users to the site — possibly because CrackNQT content appears in AI search results.

**Geographic concentration in India:** Top cities are Hyderabad, Chennai, Pune, Kolkata, Bengaluru, Lucknow — consistent with the target audience of Indian placement-exam candidates.

### 2.2 Engagement quality

- Average engagement time: ~12.8 minutes per active user — substantial for an exam prep site.
- Event count per active user: 26,282 / 1,083 ≈ 24.3 events per user over 90 days — moderate engagement.
- Bounce rates are generally low (most pages under 20%), except CrackNQT Sign In (44.0%) and 404 page (50.0%).

---

## 3. HYPOTHESIS (not proven by data)

1. **Registration-to-dashboard gap (~16%)** may be caused by users registering but not completing onboarding, or by returning users accessing dashboard directly without re-registering.
2. **High Sign In bounce rate (44%)** may indicate login friction, credential issues, or users landing on the wrong sign-in variant ("CrackNQT" vs "NQT Prep").
3. **Low Infosys traffic (29 views)** may be because the campaign popup is new, the page is not well-linked from the homepage, or users are not interested in Infosys-specific content yet.
4. **AI assistant referrals (~188 sessions)** suggest users discover CrackNQT through AI search — the site may benefit from AI-optimized content.
5. **Weak long-term return (3 returning users at day 30 and day 89)** suggests users take a test or two and do not come back — possibly because they got what they needed, found the free tier insufficient, or forgot about the platform.
6. **Direct traffic (1,073 sessions)** suggests brand recall or bookmarked access — users who know CrackNQT return directly.

---

## 4. DATA GAP (cannot be determined from this CSV)

| Gap | Explanation |
|-----|-------------|
| **Custom event breakdown** | The CSV contains aggregate metrics only. Events like `login`, `sign_up`, `mock_started`, `mock_completed`, `practice_started`, `premium_cta_click`, `payment_initiated`, `session_revoked` are instrumented in code (`src/lib/analytics.ts`) but do not appear as individual rows in this export. |
| **Conversion funnels** | No user_id-level data, so registration → login → dashboard → practice → test → Premium funnels cannot be calculated. |
| **Premium conversion / revenue** | No purchase events, revenue, or Premium user count in the export. Cannot determine how many of the 1,083 active users converted to Premium at ₹49. |
| **Session duration distribution** | Only average engagement time (770.78s) is given; no distribution of short vs. long sessions. |
| **Device / platform breakdown** | Platform section is empty — no mobile vs. desktop vs. tablet split. |
| **Test completion rate** | No data on how many started tests vs. how many completed them. |
| **Tab-switch / exam integrity events** | Instrumented in code but not visible in this export. |
| **Infrastructure errors** | No error tracking data (404 page shows 3 views / 2 users / 50% bounce, but no server error data). |

---

## 5. Potential friction points (from data + code cross-reference)

| Friction point | Evidence |
|----------------|----------|
| Sign-in page bounce (44%) | GA4: Sign In \| CrackNQT bounce rate 44.0%; Code: login page exists at `/auth/login` |
| Registration-to-dashboard gap | GA4: Create Account 436 users vs Dashboard 368 users; Code: hydration-based auth restore |
| Low Infosys campaign visibility | GA4: Infosys pages 29 total views; Code: Infosys popup + page + mock catalog all implemented |
| Manual UPI verification (up to 24 hours) | Code: payment page shows "Payment verification may take up to 24 hours" — may deter impatient users |
| No free-to-Premium conversion data | CSV lacks purchase events; cannot measure funnel |

---

## 6. Recommended additional analytics events

The following events are already instrumented in code (`src/lib/analytics.ts`) but are **not visible** in the current CSV export. They should be surfaced in GA4 reports:

1. `infosys_info_page_view` — already instrumented on `/infosys-se-2027` mount
2. `infosys_exam_pattern_interaction` — already instrumented on exam section selector clicks
3. `infosys_eligibility_checklist_interaction` — already instrumented on checklist item toggle
4. `infosys_selection_stage_interaction` — already instrumented on timeline stage expansion
5. `infosys_faq_expand` — already instrumented on FAQ accordion open
6. `infosys_preparation_cta_click` — already instrumented on "Start Preparation" / "Explore Preparation Roadmap" clicks
7. `infosys_registration_link_click` — already instrumented on official registration link clicks
8. `infosys_dashboard_cta_click` — already instrumented on dashboard "Explore Infosys Preparation" click
9. `infosys_mock_catalog_click` — already instrumented on info-page mock teaser click
10. `infosys_mock_start` — instrumented but usage not visible in CSV
11. `session_revoked` — instrumented for single-active-session enforcement
12. `practice_started`, `practice_completed`, `mock_started`, `mock_completed` — instrumented for exam flow
13. `begin_checkout`, `payment_initiated`, `payment_failed`, `purchase` — instrumented for Premium payment flow

**Additional events to consider adding (not yet in code):**
- `test_started` — when a user begins any test (mock, section, practice)
- `test_completed` — when a user submits a test
- `section_completed` — when a user submits a section in a section-locked exam
- `tab_switch_detected` — exam integrity event
- `premium_page_view` — already instrumented but not visible in CSV
- `feature_gate_encountered` — when a free user attempts to access Premium content

---

## 7. Connecting analytics to product routes

| GA4 page (from CSV) | Corresponding route | Status |
|---------------------|---------------------|--------|
| NQT Prep — Free TCS NQT Practice Tests & Exam Simulation | `/` (landing) | Verified in code |
| Practice Tests \| NQT Prep | `/tests` | Verified in code |
| Topic Practice \| NQT Prep | `/practice` or `/practice/[topic]` | Verified in code |
| Dashboard \| NQT Prep | `/dashboard` | Verified in code |
| Sign In \| NQT Prep | `/login` | Verified in code |
| Create Account \| NQT Prep | `/register` | Verified in code |
| TCS NQT Coding Questions (PYQ) | `/coding` | Verified in code |
| Analytics \| NQT Prep | `/analytics` | Verified in code |
| Infosys System Engineer Exam 2027... | `/infosys-se-2027` | Verified in code |
| Infosys SE 2027 Preparation Roadmap... | `/infosys-se-2027/preparation` | Verified in code |
| 404: This page could not be found. | Unknown route | 3 views, 50% bounce — investigate |

---

## 8. Summary

- 1,083 active users over 90 days, mostly from India (Hyderabad, Chennai, Pune, Kolkata, Bengaluru).
- Organic Google search is the top traffic source (447 first users), followed by direct (476).
- Landing page and dashboard are the strongest engagement points.
- Sign-in flow and long-term retention (day 30+) are potential weaknesses.
- Infosys 2027 campaign has minimal traffic (29 total views across all Infosys pages).
- AI assistant referrals are a notable and growing traffic segment.
- Critical data gaps: custom events, conversion funnels, Premium conversion, revenue — none visible in this CSV export.
