# CrackNQT Research — Combined Report

> **Combined research seed materials for the MiroFish AI simulation platform.**  
> This document merges all 5 research files: README, Product Overview, Analytics Analysis, Student Personas (Simulated), and Premium Experiment Research.

---

## Table of Contents

1. [README — Purpose, Data Sources, Evidence Guidelines](#readme)
2. [CrackNQT Product Overview](#cracknqt-overview)
3. [Analytics Analysis](#cracknqt-analytics)
4. [Student Personas (Simulated)](#student-personas)
5. [Premium Experiment Research](#premium-experiment)

---

## README

**Purpose:** This document set contains research documents prepared as seed materials for the **MiroFish AI simulation platform**. The documents describe the CrackNQT product, its actual GA4 analytics, hypothetical student personas, and potential experiments to improve engagement, retention, and Premium conversion.

**Goal:** Simulate a diverse group of Indian placement-exam preparation students interacting with the actual CrackNQT product. Product features are grounded in the source code. Analytics findings are grounded in GA4 export data. Student motivations are treated as hypotheses, not factual customer feedback.

### Documents included

| File | Description |
|------|-------------|
| `cracknqt-overview.md` | Complete factual overview of CrackNQT: product purpose, routes, features, free vs. Premium functionality, user journey, evidence limitations. |
| `cracknqt-analytics.md` | Data-grounded analysis of the GA4 export (`Reports_snapshot.csv`). Traffic, page performance, engagement, traffic sources, data gaps, and recommended additional events. |
| `student-personas.md` | Eight simulated student personas (TCS-focused, Infosys-focused, budget-conscious, free-resource-focused, multi-exam, consistency-struggling, registered-but-inactive, one-test-and-done). All explicitly labeled as hypotheses. |
| `premium-experiment.md` | Verified Premium offering (price, features, purchase flow), free-vs-Premium comparison, purchase barriers, and 8 realistic experiments with hypotheses, metrics, risks, and effort estimates. |

### Data sources

| Source | What it contains | Status |
|--------|------------------|--------|
| `src/` (frontend source code) | All React components, API clients, Zustand stores, TypeScript types, configuration | Verified against actual files |
| `Reports_snapshot.csv` | GA4 export for property "Crack NQT" (account: Aakash Shah), date range 2026-08-10 to 2026-11-07 | Used as `report.csv` equivalent; note: filename differs from requested `report.csv` |
| `src/lib/analytics.ts` | GA4 instrumentation wrapper and event name constants | Verified |
| `src/app/layout.tsx` | GA4 gtag script with measurement ID `G-XF4D0X8KBZ` | Verified |

**Note:** No file named `report.csv` exists in the workspace. The GA4 export found is `Reports_snapshot.csv` (7,239 bytes). All analytics findings reference `Reports_snapshot.csv`.

### Evidence guidelines

1. **Verified features** — Described only where confirmed in source code (routes, components, API clients, Zustand stores, or types).
2. **UNVERIFIED** — Features or behaviors that exist in UI but whose backend/API behavior could not be confirmed from source alone are marked `UNVERIFIED`.
3. **OBSERVED DATA / INTERPRETATION / HYPOTHESIS / DATA GAP** — Analytics sections explicitly separate what the CSV shows from what is inferred.
4. **SIMULATED PERSONA / HYPOTHESIS** — All student personas and motivations are explicitly labeled as simulated. They are not real customers or actual feedback.
5. **No secrets** — No environment variables, API keys, tokens, passwords, or private user data are exposed. The file `rzp-key.csv` exists on disk but is gitignored and was not read or included.
6. **No modification** — No application source code was modified during this research.

### Suggested simulation objective (for MiroFish)

> "Simulate a diverse group of Indian placement-exam preparation students interacting with the actual CrackNQT product. Explore their potential needs, concerns, study behavior, registration decisions, practice behavior, return behavior, and perceptions of the verified Premium offering. Ground product features in the source code and analytics findings in GA4 data. Treat student motivations as hypotheses, not factual customer feedback. Identify realistic product improvements and experiments that could improve engagement, retention, and Premium conversion without deceptive or manipulative tactics."

---

## CrackNQT Product Overview

**Source of truth:** Frontend source code under `src/` (Next.js 16.2.3, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, Axios).  
**Production URL:** https://cracknqt.vercel.app  
**GA4 measurement ID:** G-XF4D0X8KBZ  
**GA4 export:** `Reports_snapshot.csv` (no file named `report.csv` exists; this CSV was used instead).

---

### 1. Product purpose

CrackNQT is a free-to-start online exam preparation platform for Indian placement-exam candidates, with a primary focus on the **TCS NQT (National Qualifier Test)**. It offers topic-wise practice, full-length timed mock tests, coding question practice (previous-year questions), results review, progress analytics, and an optional one-time Premium upgrade.

Positioning from the landing page: "Free to start. No ads. Built for NQT." and "Prepare for TCS NQT with topic-wise practice, exam-style mock tests and performance tracking. Start free and unlock advanced preparation with Premium."

---

### 2. Target audience

Verified from landing page copy and syllabus data: Indian students and freshers preparing for placement exams, specifically TCS NQT (2026 batch referenced in syllabus content), with secondary company-specific pages for Infosys, Wipro, Accenture, Cognizant, Capgemini, Tech Mahindra, and HCL. GA4 city data shows users concentrated in Indian cities (Hyderabad, Chennai, Pune, Kolkata, Bengaluru, Lucknow, etc.).

---

### 3. Routes and page structure

The application uses Next.js App Router with route groups:

| Route group | Purpose | Pages |
|-------------|---------|-------|
| Root `/` | Public landing/marketing page | `src/app/page.tsx` |
| `(public)` | Public SEO/marketing pages (no navbar) | `/about`, `/contact`, `/privacy-policy`, `/tcs-nqt-cutoff`, `/tcs-nqt-preparation`, `/tcs-nqt-syllabus`, `/infosys-se-2027`, `/infosys-se-2027/preparation` |
| `(auth)` | Unauthenticated flows | `/login`, `/register` |
| `(main)` | Authenticated product shell (shared Navbar + Footer) | `/dashboard`, `/tests`, `/tests/foundation`, `/tests/advanced`, `/tests/mock`, `/practice`, `/practice/[topic]`, `/coding`, `/coding/[id]`, `/analytics`, `/premium`, `/premium/payment`, `/results/[testId]`, `/results/[testId]/review`, `/exams/infosys-2027/mocks` |
| `exam/[testId]` | Full-screen exam interface (no navbar/footer) | `/exam/[testId]` |

Route groups are verified in `src/app/` directory structure. Route groups do not add URL segments.

---

### 4. Actual features (verified in source code)

#### 4.1 Landing page (`/`)

Verified in `src/app/page.tsx`:
- Company selection cards: TCS NQT, Infosys, Wipro, Accenture, Cognizant, Capgemini, Tech Mahindra, HCL (each links to `/register` — **UNVERIFIED whether this leads to company-specific content or generic registration**)
- TCS NQT syllabus breakdown (Foundation: ~65 questions / 75 mins; Advanced: 16–18 questions / 115 mins) — **verified in code**
- "Choose How You Prepare": Free (₹0) vs Premium (₹49) cards — **verified**
- Popular tests section (static mock data in component, not fetched from API) — **UNVERIFIED whether these are real backend tests**
- Topic practice cards (Quantitative Aptitude, Logical Reasoning, Verbal Ability, Programming, DBMS, Operating Systems, Computer Networks, OOPs Concepts, SQL Queries) — each links to `/register` — **UNVERIFIED backend behavior**
- FAQ section (5 questions) with JSON-LD FAQPage schema — **verified**
- FAQ answers state Premium is ₹49 one-time, lifetime access, not a subscription — **verified**

#### 4.2 Authentication

Verified in `src/lib/api/auth.ts`, `src/stores/auth-store.ts`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`:
- **Register:** POST `/auth/register` with name, email, password. Returns AuthResponse (user, accessToken, refreshToken, sessionId).
- **Login:** POST `/auth/login` with email, password. Returns same AuthResponse.
- **Get me:** GET `/auth/me` returns current user.
- **Refresh token:** POST `/auth/refresh` with refreshToken. Atomic refresh-token rotation.
- **Logout:** POST `/auth/logout`.
- **Token storage:** accessToken, refreshToken, user, sessionId stored in localStorage.
- **Hydration:** `useAuthStore.hydrate()` restores session from localStorage on app load.
- **Session management:** access token + refresh token (JWT), sessionId in tokens, MongoDB session records (per backend contract documentation in project docs).
- **401 handling:** silent token refresh with single-flight queue; 401 on refresh or expired refresh → clear session and redirect to login.
- **SESSION_REVOKED handling:** when backend returns code `SESSION_REVOKED`, frontend clears auth immediately, shows animated "Your session has ended" screen, redirects to login. Idempotent (only one screen per revocation event).
- **Cross-tab coordination:** BroadcastChannel (`cracknqt-session`) for logout/session-ended messages; tokens never broadcast.
- **Manual logout:** calls backend `/auth/logout` (best-effort), clears local state, broadcasts to other tabs.

#### 4.3 Dashboard (`/dashboard`)

Verified in `src/app/(main)/dashboard/page.tsx`, `src/stores/progress-store.ts`, `src/lib/api/analytics.ts`:
- **Stats cards:** Tests Completed, Average Score, Questions Solved, Time Practiced — fetched from `fetchDashboardAnalytics()` (**UNVERIFIED exact endpoint path**).
- **Recent tests:** history list fetched from `fetchHistory(1, 5)` (GET `/results/user/history?page=1&limit=5`).
- **Exam pattern overview:** Foundation Section (65 Qs, 75 mins), Advanced Section (14 Qs, 25 mins) — static display, no negative marking, total 79 questions / 120 minutes.
- **Quick Start:** Numerical Ability, Reasoning Ability, Verbal Ability, Advanced Reasoning — links to `/tests/foundation?section=...` and `/tests/advanced`.
- **Full Mock Test:** 79 Questions, 120 Minutes, Easy Mode — links to `/tests/mock`.
- **Premium Unlock CTA:** "Unlock Premium Access" — ₹49 one-time, lifetime access — links to `/premium`.
- **Company Preparation section:** Infosys Hiring 2027 featured card — links to `/infosys-se-2027`.

**Free vs Premium on dashboard:** Premium features listed as "Hard Mode Mock Tests", "Advanced Analytics", "Performance Intelligence". Free users see the CTA but cannot access Premium content without purchasing.

#### 4.4 Tests (`/tests`, `/tests/foundation`, `/tests/advanced`, `/tests/mock`)

Verified in `src/app/(main)/tests/page.tsx`, `src/lib/api/tests.ts`:
- **fetchTests(type?, section?)** — GET `/tests` with optional query params. Returns Test[].
- **fetchTestById(testId)** — GET `/tests/:id`.
- **Test types:** `section_test`, `full_mock`, `topic_practice`.
- **Sections:** numerical, reasoning, verbal, advanced, technical.
- **Full Mock Test:** 79 questions, 120 minutes — static card on dashboard and tests page.
- **Section tests:** foundation (numerical, reasoning, verbal), advanced.

#### 4.5 Practice (`/practice`, `/practice/[topic]`)

Verified in `src/lib/api/practice.ts`, `src/app/(main)/practice/page.tsx`:
- **fetchTopicsWithCounts(section)** — GET `/tests/topics/${section}` returns topic counts (easy/medium/hard).
- **fetchPracticeQuestions(section, topic, params?)** — GET `/tests/practice/${section}/${topic}` with optional difficulty and limit.
- **generatePracticeTest(params)** — POST `/tests/generate-practice` returns a generated test with questions.
- Topics verified in landing page: Quantitative Aptitude, Logical Reasoning, Verbal Ability, Programming, DBMS, Operating Systems, Computer Networks, OOPs Concepts, SQL Queries.

#### 4.6 Coding (`/coding`, `/coding/[id]`)

Verified in `src/lib/api/coding.ts`, `src/app/(main)/coding/page.tsx`:
- **fetchCodingQuestions(params?)** — GET `/coding` with optional difficulty/topic filters.
- **fetchCodingTopics()** — GET `/coding/topics`.
- **fetchCodingQuestion(id)** — GET `/coding/:id`.
- **Coding question type:** problem statement, constraints, examples, brute force solution, optimal solution, time/space complexity.
- Languages listed in landing page: C, C++, Java, Python, Perl.

#### 4.7 Exam interface (`/exam/[testId]`)

Verified in `src/app/exam/[testId]/page.tsx`, `src/lib/api/exam.ts`, `src/stores/test-store.ts`:
- **Full-screen exam** (requestFullscreen on start).
- **Section-locked exams** (numerical → reasoning → verbal → advanced; sections must be submitted sequentially).
- **Question status tracking:** not_visited, not_answered, answered, marked_for_review.
- **Per-question time tracking.**
- **Tab-switch detection** for exam integrity (records tab switches via API).
- **Pause functionality** (frontend-only; backend counts wall-clock from startedAt).
- **localStorage backup** of exam progress (key: `exam_backup`, discarded after 4 hours).
- **Dead attempt handling:** if backend returns 400 (attempt no longer active), `attemptDead` flag set; further API calls skipped.
- **Section types:** numerical, reasoning, verbal, advanced.
- **Question groups / shared stimuli:** data_interpretation, reading_comprehension, image_based, table_based, case_study, data_sufficiency, syllogism — used for Infosys mock tests with grouped questions.
- **startAttempt:** POST `/attempts/start/${testId}`.
- **saveAnswer:** PUT `/attempts/${attemptId}/answer`.
- **markForReview:** PUT `/attempts/${attemptId}/mark-review`.
- **clearResponse:** PUT `/attempts/${attemptId}/clear`.
- **navigate:** PUT `/attempts/${attemptId}/navigate`.
- **recordTabSwitch:** PUT `/attempts/${attemptId}/tab-switch`.
- **submitAttempt:** POST `/attempts/${attemptId}/submit`.

#### 4.8 Results (`/results/[testId]`, `/results/[testId]/review`)

Verified in `src/lib/api/results.ts`, `src/app/(main)/results/[testId]/page.tsx`:
- **fetchResult(attemptId)** — GET `/results/${attemptId}` returns TestResult (score, percentage, correct, wrong, skipped, timeTaken, sectionWise, topicWise, questionDetails).
- **fetchReview(attemptId)** — GET `/results/${attemptId}/review` returns ReviewResponse with correct answers and per-question details.
- **fetchHistory(page, limit)** — GET `/results/user/history?page=1&limit=10` returns paginated attempt history.

#### 4.9 Analytics page (`/analytics`)

Verified in `src/app/(main)/analytics/page.tsx`, `src/components/analytics/`:
- Performance charts, topic strengths, topic intelligence components — **UI verified; exact API endpoints for analytics data not individually inspected beyond dashboard analytics**.

#### 4.10 Premium system

Verified in `src/lib/constants/pricing.ts`, `src/components/premium/PremiumHero.tsx`, `src/components/premium/PricingCard.tsx`, `src/components/premium/FeatureGrid.tsx`, `src/app/(main)/premium/page.tsx`, `src/app/(main)/premium/payment/page.tsx`:

**Premium price:** ₹49 (verified in multiple files).

**Premium plan:** One-time payment, lifetime access, no subscription.

**Premium features (verified in code):**
- 50 Mock Tests (PricingCard benefits list)
- Coding Challenges
- Prime Prep
- AI Analytics
- Lifetime Updates
- Hard Mode Mock Tests (dashboard Premium card)
- Advanced Analytics (dashboard Premium card)
- Performance Intelligence (dashboard Premium card)

**Free vs Premium restrictions:**
- Free users see Premium CTAs but cannot access Premium tests/features without purchasing.
- Premium gating: `user.isPremium` from auth store controls UI (e.g., Analytics link shows lock icon if not premium).
- Payment flow: UPI-based manual verification.

**Payment flow (verified in `src/app/(main)/premium/payment/page.tsx`):**
- UPI ID: `aakashshah0707@okicici` (labeled "Placeholder UPI ID" in code comment).
- Amount: ₹49.
- User enters 12-digit UTR/Transaction ID.
- POST `/payment/submit` with utr and productId.
- **Manual verification:** "Payment verification may take up to 24 hours. Your Premium access will be activated after verification." — **manual process, not automatic.**
- Analytics events: `BEGIN_CHECKOUT` (value: 49, currency: INR), `PAYMENT_INITIATED`, `PAYMENT_FAILED`.
- **Alternative direct upgrade:** `PricingCard.tsx` calls `PUT /admin/users/${user._id}/premium` with `isPremium: true, subscriptionType: "monthly"` — **UNVERIFIED whether this is a working production path or a dev/test path.**

#### 4.11 Infosys 2027 campaign

Verified in `src/lib/constants/campaigns.ts`, `src/lib/infosys-2027-data.ts`, `src/lib/infosys-2027-mocks.ts`, `src/app/(public)/infosys-se-2027/page.tsx`, `src/app/(main)/exams/infosys-2027/mocks/page.tsx`:

**Infosys info page (`/infosys-se-2027`):**
- Hero, job overview, eligibility (reported criteria: Class 10 60%, Class 12 60%, Diploma 65%, BTech 65% — labeled as reported from college-specific notice), exam pattern (60 questions, 7 sections, 120 minutes, 75 objective marks), selection process timeline, syllabus overview, FAQ (10 questions), official registration link (`https://surveys.infosysapps.com/r/a/SEcampusregistration2027batch`), official sample paper (`https://infytq.onwingspan.com/public-assets/InfosysCampusRecruitmentSampleTest-SystemsEngineer.pdf`).
- All infosys data explicitly labeled as "reported" — not confirmed as universal Infosys criteria.

**Infosys mock catalog (`/exams/infosys-2027/mocks`):**
- Mock tests configured in `src/lib/infosys-2027-mocks.ts` (Data Interpretation Fair Stalls Logic Set, Mixed Reasoning & Verbal Set, Advanced Reasoning & Verbal Set Hard, Hard Mixed Set).
- Live counts fetched from backend via `fetchTestById`.
- Only active tests shown; locked if premium and user not premium.

#### 4.12 Theme and UI

- Tailwind CSS v4 with oklch color system.
- Light/dark/system theme via `next-themes`.
- shadcn/ui components (button, card, dialog, accordion, etc.).
- Framer Motion for animations.
- Lucide React for icons.
- Sonner for toasts.
- next/font (Geist font).

---

### 5. Free-user functionality (verified)

- Register / login
- Take topic practice tests (any topic)
- Take Full Mock Test (Easy Mode, 79 questions, 120 minutes)
- Take section tests
- View results and answer review
- View dashboard with basic analytics (tests completed, avg score, questions solved, time practiced)
- View attempt history
- Access coding question bank
- Access Infosys info page and mock catalog (free tests)
- Light/dark theme
- No ads during practice (claimed in FAQ — **UNVERIFIED whether ads are actually served elsewhere**)

---

### 6. Premium functionality (verified)

- All free features plus:
- Hard Mode Mock Tests
- Advanced Analytics
- Performance Intelligence
- Coding challenges / Prime Prep
- AI-powered analytics
- 50 mock tests (claimed in PricingCard — **UNVERIFIED whether this maps to a specific backend filter**)
- Price: ₹49 one-time, lifetime access
- Purchase via UPI with manual UTR verification (up to 24 hours)

---

### 7. User journey (landing → practice → test → Premium)

1. **Landing page (`/`)**: User sees TCS NQT focus, company cards, syllabus, pricing (₹49), FAQ.
2. **Registration/Login** (`/register`, `/login`): User creates account or signs in. Tokens stored in localStorage.
3. **Dashboard (`/dashboard`)**: User sees progress stats, Quick Start section, Full Mock Test CTA, Premium upsell.
4. **Practice or Test** (`/practice/[topic]`, `/tests/foundation`, `/exam/[testId]`): User takes a timed test with section locking, tab-switch detection, answer tracking.
5. **Results** (`/results/[testId]`, `/results/[testId]/review`): User sees score, section-wise breakdown, correct answers.
6. **Premium upsell**: Dashboard Premium card or Premium page → `/premium/payment` → UPI payment → manual verification → Premium activated.

---

### 8. Current product goals (inferred from code and content)

- **Primary:** Convert free users to Premium at ₹49 one-time (lifetime access).
- **Secondary:** Drive TCS NQT preparation usage (mock tests, practice, analytics).
- **Tertiary:** Expand to other company exams (Infosys, Wipro, Accenture, Cognizant, Capgemini, Tech Mahindra, HCL) with company-specific pages and mock tests.

---

### 9. Research objectives

1. Understand why users register but don't practice (GA4 shows Create Account: 762 views / 436 users; Dashboard: 1,211 views / 368 users — gap between registration and dashboard usage).
2. Understand why users take one test but don't return (GA4 Nth day data shows new vs returning users; day 0: 38 new / 47 returning).
3. Identify barriers to Premium conversion at ₹49 (GA4 shows Premium page: 1,247 views / 277 users; payment flow exists but no conversion data in CSV).
4. Evaluate Infosys 2027 campaign traction (GA4 shows Infosys pages: 18 views / 14 users for main page, 9 views / 8 users for preparation — very low traffic).
5. Identify friction in the UPI manual verification payment flow.

---

### 10. Evidence limitations

- **No `report.csv` exists** — used `Reports_snapshot.csv` instead. Filename discrepancy noted.
- **CSV lacks custom event breakdown** — only aggregate page views, active users, event counts, bounce rates. Cannot see `login`, `mock_started`, `payment_initiated`, etc. as individual event rows.
- **CSV lacks funnel data** — no user_id-level data, so registration→practice→test completion→Premium funnels cannot be calculated from the CSV alone.
- **CSV lacks revenue/conversion data** — no purchase events, revenue, or Premium conversion metrics visible in the export.
- **Some features marked UNVERIFIED** where UI exists but backend behavior couldn't be confirmed from frontend source alone.
- **Backend code not inspected** — server-side logic, database schemas, and actual API responses not available in frontend repo.
- **GA4 property ID G-XF4D0X8KBZ** verified in code, but actual GA4 dashboard access not available to confirm real-time data.

---

## Analytics Analysis

**Data source:** `Reports_snapshot.csv` (GA4 export; no file named `report.csv` exists in workspace).  
**GA4 property:** Crack NQT (account: Aakash Shah).  
**Measurement ID:** G-XF4D0X8KBZ.  
**Date range:** 2026-08-10 to 2026-11-07 (90 days).  
**Export sections:** Top-level metrics, page title/screen class, first user source/medium, session source/medium, Nth day new/returning, city, audience name. Platform section is empty.

---

### 1. OBSERVED DATA

#### 1.1 Top-level metrics (90-day aggregate)

| Metric | Value |
|--------|-------|
| Active users | 1,083 |
| New users | 971 |
| Average engagement time per active user | 770.78 seconds (~12.8 minutes) |
| Event count | 26,282 |

**Source:** `Reports_snapshot.csv`, lines 9–10.

#### 1.2 Page-level performance

| Page title | Views | Active users | Event count | Bounce rate |
|------------|-------|--------------|-------------|-------------|
| NQT Prep — Free TCS NQT Practice Tests & Exam Simulation | 4,242 | 624 | 8,586 | 18.4% |
| Practice Tests \| NQT Prep | 1,542 | 386 | 2,377 | 12.5% |
| Topic Practice \| NQT Prep | 1,319 | 195 | 2,012 | 6.5% |
| CrackNQT — TCS NQT Practice, Mock Tests & Preparation | 1,247 | 277 | 3,180 | 26.5% |
| Dashboard \| NQT Prep | 1,211 | 368 | 1,591 | 6.5% |
| Sign In \| NQT Prep | 802 | 342 | 1,764 | 15.3% |
| Create Account \| NQT Prep | 762 | 436 | 1,451 | 8.2% |
| TCS NQT Coding Questions (PYQ) \| NQT Prep | 497 | 134 | 718 | 31.3% |
| Practice Tests \| CrackNQT | 493 | 120 | 815 | 29.4% |
| Sign In \| CrackNQT | 446 | 137 | 1,167 | 44.0% |
| Topic Practice \| CrackNQT | 428 | 61 | 789 | 18.8% |
| Dashboard \| CrackNQT | 375 | 118 | 549 | 15.8% |
| Create Account \| CrackNQT | 270 | 187 | 631 | 12.7% |
| TCS NQT Coding Questions (PYQ) \| CrackNQT | 211 | 45 | 325 | 34.7% |
| Analytics \| NQT Prep | 158 | 93 | 178 | 0.8% |
| Infosys System Engineer Exam 2027 \| Pattern, Syllabus & Mock Test \| CrackNQT | 18 | 14 | 90 | 21.4% |
| Infosys SE 2027 Preparation Roadmap — Coming Soon \| CrackNQT | 9 | 8 | 19 | 12.5% |
| Analytics \| CrackNQT | 5 | 5 | 10 | 0% |
| 404: This page could not be found. | 3 | 2 | 5 | 50.0% |
| About CrackNQT \| NQT Prep | 2 | 2 | 2 | 0% |
| About CrackNQT — Independent TCS NQT Preparation Platform \| CrackNQT | 2 | 2 | 4 | 50% |
| Contact CrackNQT \| CrackNQT | 2 | 2 | 5 | 50% |
| Infosys SE 2027 Recruitment \| Eligibility, Exam Pattern \& Preparation \| CrackNQT | 2 | 2 | 8 | 0% |
| Privacy Policy \| CrackNQT \| CrackNQT | 1 | 1 | 3 | 100% |
| खाता बनाएँ \| एनक्यूटी तैयारी | 1 | 1 | 3 | 50% |

**Source:** `Reports_snapshot.csv`, lines 15–41.

**Observations:**
- Two naming variants exist ("NQT Prep" and "CrackNQT") for the same pages, suggesting inconsistent page titles across routes or environments.
- The main landing page ("NQT Prep — Free TCS NQT Practice Tests & Exam Simulation") dominates with 4,242 views (37% of all listed page views).
- Dashboard has strong engagement: 1,211 views, 368 active users, only 6.5% bounce rate.
- Sign In has relatively high bounce rate (15.3% for "NQT Prep" variant, 44.0% for "CrackNQT" variant).
- Create Account has lower bounce rate (8.2%–12.7%) than Sign In.
- Infosys pages have very low traffic: main Infosys page 18 views / 14 users, preparation page 9 views / 8 users, recruitment page 2 views / 2 users.

#### 1.3 Traffic acquisition (first user source / medium — active users)

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

**Observations:**
- Organic search (Google + Bing) drives the majority of sessions: 1,281 + 316 = 1,597 sessions (~57% of total).
- Direct traffic is significant (1,073 sessions, ~38%).
- AI assistants (ChatGPT, Gemini, Claude, Copilot) contribute ~188 sessions combined (~7%).
- Paid search (Google CPC) is minimal: 5 sessions.

#### 1.4 User engagement (Nth day, new vs returning)

Sample rows:

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
- By day 7, returning users (18) exceed new (11).
- By day 30 and beyond, returning users drop sharply (3 at day 30, 3 at day 89) — long-term retention appears weak.
- Day 24 shows a spike in new users (37) — possible campaign or external referral event.

#### 1.5 Geographic distribution (top cities by active users)

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

**Observations:**
- Heavy concentration in Indian tech/education hubs (Hyderabad, Chennai, Pune, Kolkata, Bengaluru, Lucknow, Mumbai).
- Council Bluffs (51) is an outlier — possibly a data center or VPN exit node.

#### 1.6 Audience

| Audience | Active users |
|----------|--------------|
| All Users | 1,083 |

#### 1.7 Platform / key events

Platform section is empty (no data rows).

---

### 2. INTERPRETATION

**Strong landing page, decent dashboard retention:** The landing page gets the most traffic (4,242 views) and the dashboard has low bounce rate (6.5%) and decent events per user (1,591 events / 368 users ≈ 4.3 events per session).

**Registration flow works but dashboard conversion has a gap:** Create Account has 762 views / 436 active users. Dashboard has 1,211 views / 368 active users. The gap between 436 create-account users and 368 dashboard users (~16% drop) could indicate some registered users never reach or return to the dashboard.

**Sign-in friction:** Sign In \| CrackNQT has a 44.0% bounce rate — nearly half of users who hit the CrackNQT-branded sign-in page leave without interacting further.

**Infosys campaign has minimal traction:** The Infosys 2027 pages collectively account for only 29 views / 24 users across all Infosys-related pages. Compared to the landing page's 4,242 views, the Infosys campaign is not yet driving meaningful traffic.

**AI assistant referrals are notable:** chatgpt.com (ai-assistant + referral) = 41 first users / 163 sessions; gemini.google.com = 11 first users / 23 sessions; claude.ai + copilot.com = 4 first users / 5 sessions.

**Geographic concentration in India:** Top cities are Hyderabad, Chennai, Pune, Kolkata, Bengaluru, Lucknow — consistent with the target audience of Indian placement-exam candidates.

**Engagement quality:**
- Average engagement time: ~12.8 minutes per active user.
- Event count per active user: 26,282 / 1,083 ≈ 24.3 events per user over 90 days.
- Bounce rates are generally low (most pages under 20%), except CrackNQT Sign In (44.0%) and 404 page (50.0%).

---

### 3. HYPOTHESIS (not proven by data)

1. **Registration-to-dashboard gap (~16%)** may be caused by users registering but not completing onboarding, or by returning users accessing dashboard directly without re-registering.
2. **High Sign In bounce rate (44%)** may indicate login friction, credential issues, or users landing on the wrong sign-in variant ("CrackNQT" vs "NQT Prep").
3. **Low Infosys traffic (29 views)** may be because the campaign popup is new, the page is not well-linked from the homepage, or users are not interested in Infosys-specific content yet.
4. **AI assistant referrals (~188 sessions)** suggest users discover CrackNQT through AI search — the site may benefit from AI-optimized content.
5. **Weak long-term return (3 returning users at day 30 and day 89)** suggests users take a test or two and do not come back.
6. **Direct traffic (1,073 sessions)** suggests brand recall or bookmarked access.

---

### 4. DATA GAP (cannot be determined from this CSV)

| Gap | Explanation |
|-----|-------------|
| **Custom event breakdown** | The CSV contains aggregate metrics only. Events like `login`, `sign_up`, `mock_started`, `mock_completed`, `practice_started`, `premium_cta_click`, `payment_initiated`, `session_revoked` are instrumented in code but do not appear as individual rows in this export. |
| **Conversion funnels** | No user_id-level data, so registration → login → dashboard → practice → test → Premium funnels cannot be calculated. |
| **Premium conversion / revenue** | No purchase events, revenue, or Premium user count in the export. Cannot determine how many of the 1,083 active users converted to Premium at ₹49. |
| **Session duration distribution** | Only average engagement time (770.78s) is given; no distribution of short vs. long sessions. |
| **Device / platform breakdown** | Platform section is empty — no mobile vs. desktop vs. tablet split. |
| **Test completion rate** | No data on how many started tests vs. how many completed them. |
| **Tab-switch / exam integrity events** | Instrumented in code but not visible in this export. |
| **Infrastructure errors** | No error tracking data (404 page shows 3 views / 2 users / 50% bounce, but no server error data). |

---

### 5. Potential friction points

| Friction point | Evidence |
|----------------|----------|
| Sign-in page bounce (44%) | GA4: Sign In \| CrackNQT bounce rate 44.0%; Code: login page exists at `/auth/login` |
| Registration-to-dashboard gap | GA4: Create Account 436 users vs Dashboard 368 users; Code: hydration-based auth restore |
| Low Infosys campaign visibility | GA4: Infosys pages 29 total views; Code: Infosys popup + page + mock catalog all implemented |
| Manual UPI verification (up to 24 hours) | Code: payment page shows "Payment verification may take up to 24 hours" — may deter impatient users |
| No free-to-Premium conversion data | CSV lacks purchase events; cannot measure funnel |

---

### 6. Recommended additional analytics events

The following events are already instrumented in code but are **not visible** in the current CSV export:

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
- `feature_gate_encountered` — when a free user attempts to access Premium content

---

### 7. Connecting analytics to product routes

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

### 8. Summary

- 1,083 active users over 90 days, mostly from India (Hyderabad, Chennai, Pune, Kolkata, Bengaluru).
- Organic Google search is the top traffic source (447 first users), followed by direct (476).
- Landing page and dashboard are the strongest engagement points.
- Sign-in flow and long-term retention (day 30+) are potential weaknesses.
- Infosys 2027 campaign has minimal traffic (29 total views across all Infosys pages).
- AI assistant referrals are a notable and growing traffic segment.
- Critical data gaps: custom events, conversion funnels, Premium conversion, revenue — none visible in this CSV export.

---

## Student Personas (Simulated)

**All personas in this document are `SIMULATED PERSONA` / `HYPOTHESIS`.** They are not real customers, not actual feedback, and not derived from any user research. They are research hypotheses designed for MiroFish simulation, grounded in verified CrackNQT features and GA4 analytics findings.

---

### Persona 1: Rajesh — TCS NQT-focused final-year student

**SIMULATED PERSONA — HYPOTHESIS**

**Background:**
- Final-year B.Tech (Computer Science) student, graduating 2027
- From Hyderabad (top GA4 city: 103 active users)
- Preparing for TCS NQT 2026/2027
- Has heard of CrackNQT through Google search (top traffic source: google/organic, 447 first users)

**Goals:**
- Clear the TCS NQT Foundation and Advanced sections
- Get a Ninja or Digital role at TCS
- Practice section-wise: numerical ability, reasoning ability, verbal ability

**Needs:**
- Timed, section-locked mock tests that mirror the real TCS NQT format
- Progress tracking to know if he's improving
- Free resources first; willing to pay ₹49 only if value is clear

**Potential friction:**
- **Verified feature:** Section-locked exams exist (`sectionLocked: boolean` in `Test` type; sequential submission enforced in `test-store.ts`).
- **Verified feature:** Dashboard shows Tests Completed, Average Score, Questions Solved, Time Practiced — useful for tracking.
- **UNVERIFIED:** Whether the full mock test (79 questions, 120 minutes) accurately reflects the real TCS NQT timing and difficulty.
- **UNVERIFIED:** Whether coding questions (Python/Java/C++ options) are sufficient for the Advanced coding round.

**Reasons for not registering:**
- May not see value in creating an account before trying a test
- Landing page shows "Start Free Mock Test" button linking to `/register` — if he expects to practice without registering, this is a barrier

**Reasons for not practicing:**
- If the first test feels too hard or too easy, may not return
- No immediate feedback on whether his TCS NQT readiness is improving (dashboard analytics exist but **UNVERIFIED** if they are actionable enough)

**Reasons for not returning:**
- Took one mock test, got a score, didn't see a clear next step
- Weak long-term return pattern observed in GA4 (only 3 returning users at day 30 and day 89)

**Reasons for not purchasing Premium:**
- ₹49 one-time may be acceptable, but only if he believes hard-mode mocks and advanced analytics will improve his score
- Manual UPI verification (up to 24 hours) may deter immediate purchase

**Product opportunities:**
- Clear "Start with a free mock test without registering" option
- Post-test recommendation: "Your weak topic is Geometry — here are 5 practice questions"

**Research questions for MiroFish:**
- Does Rajesh complete the full 120-minute mock test or drop off mid-way?
- Does seeing the dashboard analytics (avg score, questions solved) motivate him to take another test?
- Does the section-locked format feel authentic to the real TCS NQT?

---

### Persona 2: Priya — Infosys-focused final-year student

**SIMULATED PERSONA — HYPOTHESIS**

**Background:**
- Final-year B.Tech (Information Technology), graduating 2027
- From Pune (GA4 city: 49 active users)
- Targeting Infosys SE 2027 campus drive
- Discovered CrackNQT through the Infosys campaign or Google search for "Infosys System Engineer exam pattern"

**Goals:**
- Understand Infosys SE eligibility and exam pattern
- Practice reasoning, verbal, and pseudocode questions
- Take Infosys-style mock tests

**Needs:**
- Reliable information on Infosys exam pattern (reported: 60 questions, 7 sections, 120 minutes)
- Practice questions for pseudocode, data sufficiency, reading comprehension
- Free mock tests specific to Infosys

**Potential friction:**
- **Verified feature:** Infosys info page (`/infosys-se-2027`) exists with exam pattern, eligibility (labeled "reported"), syllabus, FAQ, and official registration link
- **Verified feature:** Infosys mock catalog (`/exams/infosys-2027/mocks`) with 4 configured mock tests
- **GA4 observed:** Infosys pages have very low traffic (18 views / 14 users for main page; 9 views / 8 users for preparation; 2 views / 2 users for recruitment)
- **UNVERIFIED:** Whether the Infosys mock tests in the backend match the actual Infosys SE exam format

**Reasons for not registering:**
- Wants to read the exam pattern first without creating an account
- Infosys page links to official registration (`https://surveys.infosysapps.com/r/a/SEcampusregistration2027batch`) — she may go there instead of CrackNQT registration

**Reasons for not practicing:**
- If the Infosys mock catalog shows only 1 free test, she may feel there isn't enough content
- Pseudocode practice questions exist in coding bank (**verified**) but may not be clearly labeled as Infosys-relevant

**Reasons for not returning:**
- Took the one free Infosys mock, didn't see more upcoming
- Preparation roadmap page is a placeholder ("Coming Soon") — no actionable next step

**Reasons for not purchasing Premium:**
- Premium claims "50 Mock Tests" (**verified** in PricingCard benefits) but Priya can't verify if any are Infosys-specific
- ₹49 for lifetime access may seem low-value if she only needs Infosys prep for one cycle

**Product opportunities:**
- Make the Infosys mock catalog more prominent from the info page
- Add a clear "Start free Infosys mock" button on the info page hero
- Show how many Infosys mock tests are free vs Premium before asking for registration

**Research questions for MiroFish:**
- Does Priya trust the "reported" eligibility and salary figures, or does she go straight to the official registration link?
- Does she take the Infosys mock test on mobile or desktop?
- Does she return after taking one Infosys mock?

---

### Persona 3: Amit — Budget-conscious student

**SIMULATED PERSONA — HYPOTHESIS**

**Background:**
- B.Com graduate, 2027 batch
- From a tier-2 city (GA4 data shows users from Sultanpur, Bhopal, Bhubaneswar, etc.)
- Limited disposable income; carefully evaluates every paid product

**Goals:**
- Prepare for placement exams without spending money
- Find the best free resources before considering any payment

**Needs:**
- Free practice questions and mock tests
- Clear statement of what is free vs. Premium
- No hidden costs

**Potential friction:**
- **Verified feature:** Landing page FAQ states "No. You can start with the free resources and practice available on CrackNQT. Premium is optional."
- **Verified feature:** Full Mock Test (Easy Mode) is free — 79 questions, 120 minutes
- **Verified feature:** Topic practice is available by section (numerical, reasoning, verbal)
- **UNVERIFIED:** How much of the coding question bank is free vs Premium
- **UNVERIFIED:** Whether free users can access all topic practice or if some topics are Premium-locked

**Reasons for not registering:**
- Wants to try practice without creating an account
- Landing page topic cards link to `/register` — barrier if he wants to browse first

**Reasons for not practicing:**
- If free content feels limited after 1–2 tests
- No clear path from free practice to improvement without Premium

**Reasons for not returning:**
- Exhausted free content and doesn't want to pay
- No clear free-tier progression path

**Reasons for not purchasing Premium:**
- ₹49 one-time may still be too much if he's unsure of value
- Manual UPI verification (up to 24 hours) adds friction — he may abandon if he wants instant access
- No trial or sample of Premium features before paying

**Product opportunities:**
- Show a preview of Premium features (sample hard-mode question, sample analytics chart) before asking for payment
- Clear "Free forever" vs "Premium" feature comparison table
- Reduce payment verification time or provide instant provisional access

**Research questions for MiroFish:**
- How many free tests does Amit take before deciding whether to pay?
- Does the ₹49 price feel like "impulse purchase" territory or "need to think about it"?
- Does the manual UPI verification cause him to abandon?

---

### Persona 4: Sneha — Free-resource-focused student

**SIMULATED PERSONA — HYPOTHESIS**

**Background:**
- B.Sc (Mathematics), 2027 batch
- From Kolkata (GA4 city: 47 active users)
- Prefers free educational resources; avoids paid platforms

**Goals:**
- Practice aptitude, reasoning, and verbal for placement exams
- Build confidence without any financial commitment

**Needs:**
- Unlimited free practice questions
- Answer explanations for learning
- Mobile-friendly practice (she studies on her phone)

**Potential friction:**
- **Verified feature:** Topic-wise practice cards on landing page (Quantitative Aptitude, Logical Reasoning, Verbal Ability, Programming, DBMS, Operating Systems, Computer Networks, OOPs, SQL Queries) — each links to `/register`
- **UNVERIFIED:** Whether topic practice requires registration or works for guests
- **UNVERIFIED:** Whether answer explanations are shown for free users (Question type has `explanation?: string` field — optional)
- **UNVERIFIED:** Mobile responsiveness of practice flow

**Reasons for not registering:**
- Doesn't want to create accounts on multiple platforms
- Wants to practice anonymously first

**Reasons for not practicing:**
- If registration is required before the first question
- If explanations are locked behind Premium

**Reasons for not returning:**
- Found enough free practice elsewhere
- No compelling reason to return without new free content

**Reasons for not purchasing Premium:**
- Ideologically opposed to paying for exam prep
- Believes free resources (YouTube, official company portals) are sufficient

**Product opportunities:**
- Guest practice mode (unregistered) with limited daily questions
- Show answer explanations for free users to build trust
- Clear free-tier limits (e.g., "5 free practice tests per day")

**Research questions for MiroFish:**
- Does Sneha attempt to practice without registering and bounce when blocked?
- Does she value answer explanations enough to consider paying?
- What is her device preference (mobile vs desktop)?

---

### Persona 5: Vikram — Multi-exam preparation student

**SIMULATED PERSONA — HYPOTHESIS**

**Background:**
- B.E (Electronics), 2027 batch
- From Bengaluru (GA4 city: 41 active users)
- Applying to multiple companies: TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini

**Goals:**
- Clear multiple placement exams
- Company-specific preparation for each
- Track progress across all exams in one place

**Needs:**
- Company-specific test pages (verified: landing page has company cards for TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, Tech Mahindra, HCL — each links to `/register`)
- Company-specific mock tests
- Unified progress dashboard

**Potential friction:**
- **Verified feature:** Company selection cards exist on landing page but all link to `/register` — **UNVERIFIED whether they lead to company-specific content or generic registration**
- **Verified feature:** Dashboard shows overall progress but **UNVERIFIED** if it breaks down progress by company
- **Verified feature:** Infosys-specific info page and mock catalog exist; other companies do not have dedicated pages
- **UNVERIFIED:** Whether Wipro, Accenture, Cognizant mock tests exist in backend

**Reasons for not registering:**
- If company cards don't deliver company-specific content after registration
- Wants to see company-specific tests before creating an account

**Reasons for not practicing:**
- If he has to navigate to different pages for each company
- If progress isn't consolidated

**Reasons for not returning:**
- Prepared for TCS and moved on; didn't see value in staying for other companies
- No cross-exam progress tracking

**Reasons for not purchasing Premium:**
- Premium claims "50 Mock Tests" but **UNVERIFIED** how many are company-specific vs generic
- If Premium doesn't clearly map to his multi-company needs

**Product opportunities:**
- Company-specific landing pages with dedicated mock tests (beyond Infosys)
- Dashboard breakdown by company/exam type
- Cross-exam analytics: "You're strong in reasoning across TCS and Infosys but weak in verbal"

**Research questions for MiroFish:**
- Does Vikram try the TCS mock, then look for Infosys mock, then Wipro, etc.?
- Does he register once and use the platform for all companies, or register separately?
- Does he find the company cards on the landing page useful or misleading?

---

### Persona 6: Kavita — Consistency-struggling student

**SIMULATED PERSONA — HYPOTHESIS**

**Background:**
- B.Tech (Electronics & Communication), 2027 batch
- From Lucknow (GA4 city: 36 active users)
- Starts preparation with enthusiasm but loses momentum after a week

**Goals:**
- Build a daily practice habit
- Clear TCS NQT
- See measurable improvement over time

**Needs:**
- Streaks, reminders, or daily goals
- Visible progress over time (not just one-time stats)
- Bite-sized practice sessions

**Potential friction:**
- **Verified feature:** Dashboard shows total tests, avg score, questions solved, time practiced — but **UNVERIFIED** if it shows trends over time
- **Verified feature:** Practice tests exist by topic — good for short sessions
- **UNVERIFIED:** No streaks, daily goals, or reminders visible in code
- **GA4 observed:** Nth day data shows returning users dropping from 47 (day 0) to 3 (day 89) — consistency is a real problem across the user base

**Reasons for not registering:**
- May register with enthusiasm but not return if there's no habit-forming mechanism

**Reasons for not practicing:**
- Practice sessions feel too long (full mock is 120 minutes)
- No daily reminder or streak to maintain momentum

**Reasons for not returning:**
- Missed a few days, feels behind, gives up
- No "welcome back" or "you missed X days" messaging

**Reasons for not purchasing Premium:**
- Doesn't trust herself to use Premium enough to justify ₹49
- Wants to build the habit first before paying

**Product opportunities:**
- Daily practice streak (unverified — would be a new feature)
- Short practice sessions (10–15 questions) for busy days
- Weekly progress email or notification
- "Come back" messaging after inactivity

**Research questions for MiroFish:**
- How many days does Kavita practice before stopping?
- Does a short (10-question) practice session feel more achievable than a full 120-minute mock?
- Would a streak or daily goal motivate her to return?

---

### Persona 7: Arun — Registered but inactive

**SIMULATED PERSONA — HYPOTHESIS**

**Background:**
- B.Tech (Mechanical), 2027 batch
- From Chennai (GA4 city: 59 active users)
- Registered on CrackNQT but hasn't taken a test in weeks

**Goals:**
- Eventually prepare for placement exams
- Currently busy with college projects/exams

**Needs:**
- A reason to return
- Low-effort re-entry (not a full 120-minute mock)
- Progress that isn't lost

**Potential friction:**
- **Verified feature:** localStorage backup for exam progress (4-hour expiry) — if he abandons mid-test, progress is saved temporarily
- **Verified feature:** Attempt history exists (`fetchHistory`) — he can see past attempts
- **UNVERIFIED:** Whether his registered account data persists if he returns after months
- **GA4 observed:** 1,083 active users over 90 days; Nth day data shows return rates dropping — Arun represents the large group that registered but didn't become a regular

**Reasons for not practicing:**
- College workload took priority
- Forgot about CrackNQT
- No email/reminder to return (**UNVERIFIED** if email reminders exist in code — no email service found in frontend source)

**Reasons for not returning:**
- Feels he's "behind" and doesn't know where to restart
- Dashboard may show empty or stale data if he hasn't practiced recently

**Reasons for not purchasing Premium:**
- Doesn't see value in paying for a service he's not actively using
- Would need to re-engage first before considering payment

**Product opportunities:**
- "Welcome back" message showing last test date and score
- Suggested next step: "You last practiced Numerical Ability — here are 5 questions"
- Reactivation campaign (email/push — **UNVERIFIED** if implemented)
- Short "diagnostic" test (10 questions) to ease back in

**Research questions for MiroFish:**
- How long was Arun inactive before returning (or not returning)?
- What would make him open the app again?
- Does seeing his past test history motivate him to take a new test?

---

### Persona 8: Meena — One test, never returned

**SIMULATED PERSONA — HYPOTHESIS**

**Background:**
- BCA graduate, 2027 batch
- From Sultanpur (GA4 city: 31 active users)
- Took one mock test on CrackNQT and never came back

**Goals:**
- Wanted to check her level quickly
- Not committed to long-term preparation

**Needs:**
- Quick assessment (not a full 120-minute mock)
- Immediate feedback on score
- No commitment

**Potential friction:**
- **Verified feature:** Full Mock Test is 120 minutes — long for a quick check
- **Verified feature:** Topic practice exists but may require registration
- **UNVERIFIED:** Whether there's a short diagnostic test option
- **GA4 observed:** Nth day data shows many users take action on day 0 but few return — Meena represents this pattern

**Reasons for not registering:**
- Only wanted a quick test; registration felt like too much commitment

**Reasons for not practicing:**
- Took one test, got a score, felt she knew her level
- Didn't see a reason to take another test immediately

**Reasons for not returning:**
- Achieved her immediate goal (check her level)
- No follow-up or personalized recommendation to return

**Reasons for not purchasing Premium:**
- Didn't see enough value from one free test to justify payment
- Not actively preparing at the moment

**Product opportunities:**
- Short diagnostic test (10–15 questions, 15–20 minutes) for quick self-assessment
- Immediate post-test recommendation: "You scored X% — here are 3 topics to improve"
- "Take another test" CTA on results page
- Low-commitment re-engagement: "Try a new topic in 5 minutes"

**Research questions for MiroFish:**
- Did Meena complete the full 120-minute mock or drop off partway?
- Did she look at her answer review after the test?
- What single change would have made her take a second test?

---

### Cross-validation summary (Personas)

- All persona scenarios connect only to verified features (routes, components, API clients, Zustand stores, types) or GA4-observed data.
- Unverified features are explicitly marked.
- All personas are labeled `SIMULATED PERSONA` and `HYPOTHESIS`.
- No persona is presented as a real customer or actual feedback.
- No numbers are fabricated; GA4 values come directly from `Reports_snapshot.csv`.

---

## Premium Experiment Research

**Source of truth:** Frontend source code under `src/` (verified).  
**All experiments, hypotheses, and conversion rates are `HYPOTHESIS` — not actual results.**  
**No deceptive pricing, fake scarcity, fake testimonials, or manipulative sales tactics are proposed.**

---

### 1. Verified Premium offering

#### 1.1 Price

**₹49 one-time, lifetime access.** Verified in multiple locations:
- `src/lib/constants/pricing.ts` line 1: `export const PREMIUM_PRICE = 49`
- `src/components/premium/PremiumHero.tsx` line 172: "just ₹49 — one payment, lifetime access"
- `src/components/premium/PremiumHero.tsx` line 208: "₹49 one-time · No subscription · Lifetime access"
- `src/components/premium/PricingCard.tsx` line 70: `<span className="text-6xl font-bold">₹49</span>`
- `src/app/(main)/dashboard/page.tsx` line 417: "₹49 one-time · No subscription • Lifetime access"

#### 1.2 Premium features (verified in source code)

| Feature | Source | Verification status |
|---------|--------|---------------------|
| 50 Mock Tests | `src/components/premium/PricingCard.tsx` line 15 | UI claim only — **UNVERIFIED** whether 50 distinct mock tests exist in backend |
| Coding Challenges | `src/components/premium/PricingCard.tsx` line 16 | UI claim only — **UNVERIFIED** |
| Prime Prep | `src/components/premium/PricingCard.tsx` line 17 | UI claim only — **UNVERIFIED** |
| AI Analytics | `src/components/premium/PricingCard.tsx` line 18 | UI claim only — **UNVERIFIED** |
| Lifetime Updates | `src/components/premium/PricingCard.tsx` line 19 | UI claim only — **UNVERIFIED** |
| Hard Mode Mock Tests | `src/app/(main)/dashboard/page.tsx` line 398 | UI claim — **UNVERIFIED** what "Hard Mode" means technically |
| Advanced Analytics | `src/app/(main)/dashboard/page.tsx` line 402 | UI claim — **UNVERIFIED** what advanced analytics include |
| Performance Intelligence | `src/app/(main)/dashboard/page.tsx` line 406 | UI claim — **UNVERIFIED** |

#### 1.3 Free vs Premium comparison (verified restrictions)

| Feature | Free users | Premium users | Verification |
|---------|-----------|-----------------|--------------|
| Topic practice | ✅ Available | ✅ Available | Verified in `src/lib/api/practice.ts` |
| Section tests (numerical/reasoning/verbal) | ✅ Available | ✅ Available | Verified in `src/lib/api/tests.ts` |
| Full Mock Test (Easy Mode, 79Q, 120 min) | ✅ Available | ✅ Available | Verified in dashboard |
| Hard Mode Mock Tests | ❌ Not available | ✅ Available | UI claim in dashboard Premium card — **UNVERIFIED** enforcement |
| Advanced Analytics | ❌ Not available | ✅ Available | UI claim — **UNVERIFIED** enforcement |
| Performance Intelligence | ❌ Not available | ✅ Available | UI claim — **UNVERIFIED** enforcement |
| Coding question bank | ✅ Available (PYQ) | ✅ Available | Verified in `src/lib/api/coding.ts` |
| Premium coding challenges | ❌ Not clearly available | ✅ Claimed | UI claim only — **UNVERIFIED** |
| Ad-free experience | Claimed "No Ads During Practice" in landing FAQ | Claimed | **UNVERIFIED** whether ads are served anywhere |
| Results & answer review | ✅ Available | ✅ Available | Verified in `src/lib/api/results.ts` |
| Dashboard basic analytics | ✅ Available | ✅ Available | Verified in dashboard |

#### 1.4 Premium access checks (verified in code)

- Navbar: Analytics link shows Lock icon when `!user?.isPremium` — **visual gating only**
- `user.isPremium` from Zustand auth store controls Premium UI visibility
- `isPremium?: boolean` on `Test` interface — **UNVERIFIED** if backend enforces Premium test access

---

### 2. Premium purchase flow (verified)

#### 2.1 Payment page (`/premium/payment`)

Verified in `src/app/(main)/premium/payment/page.tsx`:
- **Payment method:** UPI only
- **UPI ID:** `aakashshah0707@okicici` (code comment: "Placeholder UPI ID")
- **Amount:** ₹49
- **User flow:**
  1. User lands on payment page (must be authenticated, not already Premium)
  2. Scans QR code or copies UPI ID
  3. Pays via any UPI app
  4. Enters 12-digit UTR/Transaction ID (validated: no spaces, exactly 12 alphanumeric characters)
  5. Submits via POST `/payment/submit` with `utr` and `productId: "premium-lifetime"`
  6. Receives "Payment submitted for verification!" toast
  7. Redirected to `/premium`
- **Verification:** Manual — "Payment verification may take up to 24 hours. Your Premium access will be activated after verification." — **not automatic**
- **Analytics:** `BEGIN_CHECKOUT` (value: 49, currency: INR), `PAYMENT_INITIATED`, `PAYMENT_FAILED`

#### 2.2 Alternative upgrade path (UNVERIFIED)

- `PricingCard.tsx` calls `PUT /admin/users/${user._id}/premium` with `isPremium: true, subscriptionType: "monthly"` — **UNVERIFIED whether this is a working production path or a dev/test backdoor**

#### 2.3 Post-purchase

- `PricingCard.tsx` calls `window.location.reload()` on success
- `PaymentPage.tsx` redirects to `/premium`
- Premium page shows "Your Premium Tests" if `user?.isPremium` — **UNVERIFIED** what premium tests are shown

---

### 3. Possible purchase barriers (verified from code)

| Barrier | Evidence |
|---------|----------|
| **Manual UPI verification (up to 24 hours)** | Payment page explicitly states: "Payment verification may take up to 24 hours. Your Premium access will be activated after verification." |
| **Registration required before payment** | Payment page redirects to `/login` if not authenticated |
| **12-digit UTR validation** | Strict regex: `/^[a-zA-Z0-9]{12}$/` — no spaces allowed |
| **No instant Premium activation** | User must wait for manual verification |
| **No card/wallet payment option** | UPI only (no credit/debit card, net banking, or wallet integration visible in code) |
| **Uncertainty about what ₹49 buys** | Premium features are UI claims ("50 Mock Tests", "AI Analytics") — **UNVERIFIED** if users can confirm what they're buying |
| **No free trial of Premium features** | No sample hard-mode question or preview analytics visible in code |
| **Placeholder UPI ID** | Code comment labels UPI ID as "Placeholder UPI ID" — **UNVERIFIED if this is a real merchant UPI ID** |

---

### 4. Value perception hypotheses (HYPOTHESIS — not verified)

1. **₹49 one-time may feel low-risk** — one-time payment, lifetime access, no subscription is psychologically easier than recurring payments.
2. **Manual verification creates abandonment** — users who pay may abandon if they don't get instant Premium access.
3. **Unclear Premium value** — users can't verify what "50 Mock Tests" or "AI Analytics" actually means before paying.
4. **Registration-before-payment drops off** — users who want to pay immediately may bounce at the login requirement.
5. **Android/UPI users convert better** — UPI is native to Indian users; the flow matches local payment behavior.

---

### 5. Experiments (8 experiments, HYPOTHESIS)

#### Experiment 1: Instant provisional Premium access

**Hypothesis:** Reducing the time between payment and Premium access increases conversion because users don't abandon during the 24-hour manual verification wait.

**Target segment:** All users reaching `/premium/payment`

**Proposed change:** Grant provisional Premium access (`isPremium: true` in local state) immediately after UTR submission, with a "pending verification" badge. Revoke if verification fails within 24 hours.

**Success metrics:**
- Payment completion rate (UTR submitted / payment page load)
- Support tickets related to "premium not activated"
- Premium-to-paid conversion rate

**Secondary metrics:**
- Time from payment page load to Premium content access
- Refund/request rate

**Risks:**
- Users could access Premium content without paying if verification fails and revocation isn't enforced
- Backend support needed for revocation logic

**Implementation effort:** Medium (requires backend changes for provisional access + revocation)

**Prioritization:** High — removes the largest identified friction point (24-hour wait)

---

#### Experiment 2: Guest Premium preview

**Hypothesis:** Letting free users see one sample Premium feature (e.g., one hard-mode question or one analytics chart) before paying increases perceived value and conversion.

**Target segment:** Free users visiting `/dashboard` or `/premium`

**Proposed change:** Show a locked Premium feature with a "Preview this feature" button that unlocks one sample item (e.g., a single hard-mode mock question, or a sample analytics insight) without payment. CTA: "Unlock all Premium features for ₹49."

**Success metrics:**
- Preview click-through rate
- Premium conversion rate among users who previewed vs. didn't
- Time on Premium page

**Secondary metrics:**
- Bounce rate from Premium page
- Repeat preview attempts

**Risks:**
- Preview content could satisfy curiosity without conversion
- Development effort to create sample content

**Implementation effort:** Medium

**Prioritization:** Medium

---

#### Experiment 3: Payment method expansion

**Hypothesis:** Adding non-UPI payment options (cards, wallets) increases conversion for users who don't use UPI or don't have a UPI app configured.

**Target segment:** Users reaching payment page who abandon at UPI entry

**Proposed change:** Add Razorpay or similar payment gateway integration alongside existing UPI flow. Offer card, net banking, and wallet options.

**Success metrics:**
- Payment completion rate by payment method
- Overall Premium conversion rate
- Average time to complete payment

**Secondary metrics:**
- Payment failure rate by method
- Support tickets related to payment

**Risks:**
- Additional integration complexity
- Transaction fees for card payments
- May not be necessary if UPI covers most Indian users

**Implementation effort:** High (requires payment gateway integration)

**Prioritization:** Low-Medium — UPI is well-suited to the Indian market

---

#### Experiment 4: Short diagnostic test before Premium upsell

**Hypothesis:** Users who take a short diagnostic test (10–15 questions, 15 minutes) and see their weak areas are more likely to purchase Premium because they perceive a specific need.

**Target segment:** Free users who have taken 1–2 free tests

**Proposed change:** After a free test, show results with a Premium upsell: "Your weak topic is Geometry — unlock Premium hard-mode tests and advanced analytics to improve." Link to `/premium/payment`.

**Success metrics:**
- Premium CTA click rate after diagnostic test
- Premium conversion rate among diagnostic-takers vs. non-takers
- Diagnostic test completion rate

**Secondary metrics:**
- Free test completion rate
- Time from test completion to Premium page visit

**Risks:**
- Diagnostic test may satisfy the user's need without conversion
- Requires creating diagnostic test content

**Implementation effort:** Medium

**Prioritization:** Medium

---

#### Experiment 5: Simplified registration-before-payment

**Hypothesis:** Reducing friction between "I want to pay" and "I can pay" increases conversion. Currently users must register/login before reaching payment.

**Target segment:** Unauthenticated users clicking Premium CTA

**Proposed change:** Allow payment-first flow: user enters email/phone on payment page, completes UPI payment, then registers/activates account after payment verification.

**Success metrics:**
- Payment page load to payment completion rate
- Registration completion rate post-payment
- Overall Premium conversion rate

**Secondary metrics:**
- Drop-off at registration step
- Abandoned payments with email captured (for follow-up)

**Risks:**
- Complexity of associating payment with account after the fact
- Potential for duplicate accounts

**Implementation effort:** High

**Prioritization:** Low

---

#### Experiment 6: Premium feature transparency

**Hypothesis:** Users don't purchase because they don't know what "50 Mock Tests" or "AI Analytics" means. Showing specific examples increases trust and conversion.

**Target segment:** Users visiting `/premium`

**Proposed change:** Replace generic benefit list with specific examples: "Hard Mode Mock Test: 80 questions, 100 minutes, advanced reasoning" + "Advanced Analytics: section-wise accuracy trends over time" + screenshot or mockup of Premium dashboard.

**Success metrics:**
- Premium page engagement (time on page, scroll depth)
- Premium CTA click rate
- Conversion rate

**Secondary metrics:**
- Bounce rate from Premium page
- Return visits to Premium page

**Risks:**
- If actual Premium features don't match examples, trust decreases
- Requires creating sample content/mockups

**Implementation effort:** Low-Medium

**Prioritization:** High — addresses unclear value proposition

---

#### Experiment 7: Limited-time introductory price framing (non-deceptive)

**Hypothesis:** Framing ₹49 as a clear, honest one-time price with no hidden costs increases trust compared to ambiguous pricing.

**Target segment:** All users viewing `/premium`

**Proposed change:** Explicitly state: "₹49 one-time. No subscription. No renewal. Lifetime access. Cancel anytime — no recurring charges." Add a clear comparison: "Equivalent to less than ₹4.10/month over one year" (mathematically true, not deceptive).

**Success metrics:**
- Premium page conversion rate
- Trust-related support tickets
- Payment initiation rate

**Secondary metrics:**
- Time spent on Premium page
- FAQ clicks related to pricing

**Risks:**
- Price anchoring may not change behavior if ₹49 is already perceived as the right price
- Must avoid implying scarcity or urgency that doesn't exist

**Implementation effort:** Low

**Prioritization:** High — low effort, addresses trust

---

#### Experiment 8: Post-test Premium recommendation

**Hypothesis:** Recommending Premium immediately after a test when the user sees their weak areas increases conversion because the need is fresh.

**Target segment:** Users on `/results/[testId]` or `/results/[testId]/review`

**Proposed change:** On results page, add: "You scored 65% — your weak area is Verbal Ability. Unlock Premium hard-mode tests and advanced analytics to target weak topics." with CTA to `/premium/payment`.

**Success metrics:**
- Premium CTA click rate from results page
- Premium conversion rate among results-page visitors
- Test completion rate (ensure upsell doesn't discourage completion)

**Secondary metrics:**
- Results page bounce rate
- Repeat test rate

**Risks:**
- Upsell may feel pushy immediately after a test
- Must be tasteful and genuinely helpful, not manipulative

**Implementation effort:** Medium

**Prioritization:** Medium

---

### 6. Experiment prioritization summary

| Priority | Experiment | Effort | Expected impact | Rationale |
|----------|-----------|--------|-----------------|-----------|
| 1 | Instant provisional Premium access | Medium | High | Removes 24-hour verification wait — largest identified friction |
| 2 | Premium feature transparency | Low | High | Addresses unclear value proposition |
| 3 | Limited-time pricing framing | Low | Medium | Low effort, builds trust |
| 4 | Short diagnostic test before upsell | Medium | Medium | Connects user need to Premium value |
| 5 | Guest Premium preview | Medium | Medium | Lets users experience value before paying |
| 6 | Post-test Premium recommendation | Medium | Medium | Captures intent at moment of need |
| 7 | Payment method expansion | High | Low-Medium | UPI already suits Indian market |
| 8 | Simplified registration-before-payment | High | Low | Complex, uncertain benefit |

---

### 7. Risks and ethical considerations

- **No fake scarcity:** Do not use "Only 3 spots left!" or countdown timers that aren't real.
- **No fake testimonials:** The "1,243 students improved", "4.9 rating", "50+ mock tests" claims in PremiumHero are UI claims — experiments must not amplify unverified claims.
- **No deceptive pricing:** ₹49 is the actual price; do not show crossed-out "original prices" or fake discounts.
- **No manipulable urgency:** Do not create artificial deadlines for the ₹49 price.
- **Manual verification transparency:** The 24-hour verification window must be clearly communicated; do not imply instant activation when it isn't.
- **Placeholder UPI ID:** The code comments the UPI ID as placeholder — experiments must not proceed until a real merchant UPI ID is confirmed.

---

### 8. Cross-validation summary

- Premium price (₹49) verified in 4 source files — consistent across the codebase.
- Premium features are UI claims; backend enforcement is **UNVERIFIED** for most features.
- Payment flow uses manual UPI verification — verified in code with explicit 24-hour disclosure.
- All experiments are labeled as hypotheses; none claim guaranteed results.
- No deceptive or manipulative tactics proposed.

---

## End of Combined Report
