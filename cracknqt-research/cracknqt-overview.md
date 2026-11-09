# CrackNQT Product Overview

**Source of truth:** Frontend source code under `src/` (Next.js 16.2.3, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, Axios).  
**Production URL:** https://cracknqt.vercel.app (observed in `next.config.ts` metadata, `src/app/sitemap.ts`, and Open Graph tags).  
**GA4 measurement ID:** G-XF4D0X8KBZ (observed in `src/app/layout.tsx`).  
**GA4 export:** `Reports_snapshot.csv` (no file named `report.csv` exists; this CSV was used instead).

---

## 1. Product purpose

CrackNQT is a free-to-start online exam preparation platform for Indian placement-exam candidates, with a primary focus on the **TCS NQT (National Qualifier Test)**. It offers topic-wise practice, full-length timed mock tests, coding question practice (previous-year questions), results review, progress analytics, and an optional one-time Premium upgrade.

Positioning from the landing page: "Free to start. No ads. Built for NQT." and "Prepare for TCS NQT with topic-wise practice, exam-style mock tests and performance tracking. Start free and unlock advanced preparation with Premium."

---

## 2. Target audience

Verified from landing page copy and syllabus data: Indian students and freshers preparing for placement exams, specifically TCS NQT (2026 batch referenced in syllabus content), with secondary company-specific pages for Infosys, Wipro, Accenture, Cognizant, Capgemini, Tech Mahindra, and HCL. GA4 city data shows users concentrated in Indian cities (Hyderabad, Chennai, Pune, Kolkata, Bengaluru, Lucknow, etc.).

---

## 3. Routes and page structure

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

## 4. Actual features (verified in source code)

### 4.1 Landing page (`/`)
Verified in `src/app/page.tsx`:
- Company selection cards: TCS NQT, Infosys, Wipro, Accenture, Cognizant, Capgemini, Tech Mahindra, HCL (each links to `/register` — **UNVERIFIED whether this leads to company-specific content or generic registration**)
- TCS NQT syllabus breakdown (Foundation: ~65 questions / 75 mins; Advanced: 16–18 questions / 115 mins) — **verified in code**
- "Choose How You Prepare": Free (₹0) vs Premium (₹49) cards — **verified**
- Popular tests section (static mock data in component, not fetched from API) — **UNVERIFIED whether these are real backend tests**
- Topic practice cards (Quantitative Aptitude, Logical Reasoning, Verbal Ability, Programming, DBMS, Operating Systems, Computer Networks, OOPs, SQL Queries) — each links to `/register` — **UNVERIFIED backend behavior**
- FAQ section (5 questions) with JSON-LD FAQPage schema — **verified**
- FAQ answers state Premium is ₹49 one-time, lifetime access, not a subscription — **verified**

### 4.2 Authentication
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

### 4.3 Dashboard (`/dashboard`)
Verified in `src/app/(main)/dashboard/page.tsx`, `src/stores/progress-store.ts`, `src/lib/api/analytics.ts`:
- **Stats cards:** Tests Completed, Average Score, Questions Solved, Time Practiced — fetched from `fetchDashboardAnalytics()` (GET `/analytics/dashboard` — **UNVERIFIED exact endpoint path; code references analytics module**).
- **Recent tests:** history list fetched from `fetchHistory(1, 5)` (GET `/results/user/history?page=1&limit=5`).
- **Exam pattern overview:** Foundation Section (65 Qs, 75 mins), Advanced Section (14 Qs, 25 mins) — static display, no negative marking, total 79 questions / 120 minutes.
- **Quick Start:** Numerical Ability, Reasoning Ability, Verbal Ability, Advanced Reasoning — links to `/tests/foundation?section=...` and `/tests/advanced`.
- **Full Mock Test:** 79 Questions, 120 Minutes, Easy Mode — links to `/tests/mock`.
- **Premium Unlock CTA:** "Unlock Premium Access" — ₹49 one-time, lifetime access — links to `/premium`.
- **Company Preparation section:** Infosys Hiring 2027 featured card — links to `/infosys-se-2027`.

**Free vs Premium on dashboard:** Premium features listed as "Hard Mode Mock Tests", "Advanced Analytics", "Performance Intelligence". Free users see the CTA but cannot access Premium content without purchasing.

### 4.4 Tests (`/tests`, `/tests/foundation`, `/tests/advanced`, `/tests/mock`)
Verified in `src/app/(main)/tests/page.tsx`, `src/lib/api/tests.ts`:
- **fetchTests(type?, section?)** — GET `/tests` with optional query params. Returns Test[].
- **fetchTestById(testId)** — GET `/tests/:id`.
- **Test types:** `section_test`, `full_mock`, `topic_practice` (from `src/lib/api/types.ts`).
- **Sections:** numerical, reasoning, verbal, advanced, technical.
- **Full Mock Test:** 79 questions, 120 minutes — static card on dashboard and tests page.
- **Section tests:** foundation (numerical, reasoning, verbal), advanced.

### 4.5 Practice (`/practice`, `/practice/[topic]`)
Verified in `src/lib/api/practice.ts`, `src/app/(main)/practice/page.tsx`:
- **fetchTopicsWithCounts(section)** — GET `/tests/topics/${section}` returns topic counts (easy/medium/hard).
- **fetchPracticeQuestions(section, topic, params?)** — GET `/tests/practice/${section}/${topic}` with optional difficulty and limit.
- **generatePracticeTest(params)** — POST `/tests/generate-practice` returns a generated test with questions.
- Topics verified in landing page: Quantitative Aptitude, Logical Reasoning, Verbal Ability, Programming, DBMS, Operating Systems, Computer Networks, OOPs Concepts, SQL Queries.

### 4.6 Coding (`/coding`, `/coding/[id]`)
Verified in `src/lib/api/coding.ts`, `src/app/(main)/coding/page.tsx`:
- **fetchCodingQuestions(params?)** — GET `/coding` with optional difficulty/topic filters.
- **fetchCodingTopics()** — GET `/coding/topics`.
- **fetchCodingQuestion(id)** — GET `/coding/:id`.
- **Coding question type:** problem statement, constraints, examples, brute force solution, optimal solution, time/space complexity.
- Languages listed in landing page: C, C++, Java, Python, Perl.

### 4.7 Exam interface (`/exam/[testId]`)
Verified in `src/app/exam/[testId]/page.tsx`, `src/lib/api/exam.ts`, `src/stores/test-store.ts`:
- **Full-screen exam** (requestFullscreen on start).
- **Section-locked exams** (numerical → reasoning → verbal → advanced; sections must be submitted sequentially).
- **Question status tracking:** not_visited, not_answered, answered, marked_for_review.
- **Per-question time tracking.**
- **Tab-switch detection** for exam integrity (records tab switches via API).
- **Pause functionality** (frontend-only; backend counts wall-clock from startedAt — documented in CLAUDE.md).
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

### 4.8 Results (`/results/[testId]`, `/results/[testId]/review`)
Verified in `src/lib/api/results.ts`, `src/app/(main)/results/[testId]/page.tsx`:
- **fetchResult(attemptId)** — GET `/results/${attemptId}` returns TestResult (score, percentage, correct, wrong, skipped, timeTaken, sectionWise, topicWise, questionDetails).
- **fetchReview(attemptId)** — GET `/results/${attemptId}/review` returns ReviewResponse with correct answers and per-question details.
- **fetchHistory(page, limit)** — GET `/results/user/history?page=1&limit=10` returns paginated attempt history.

### 4.9 Analytics page (`/analytics`)
Verified in `src/app/(main)/analytics/page.tsx`, `src/components/analytics/`:
- Performance charts, topic strengths, topic intelligence components — **UI verified; exact API endpoints for analytics data not individually inspected beyond dashboard analytics**.

### 4.10 Premium system
Verified in `src/lib/constants/pricing.ts`, `src/components/premium/PremiumHero.tsx`, `src/components/premium/PricingCard.tsx`, `src/components/premium/FeatureGrid.tsx`, `src/app/(main)/premium/page.tsx`, `src/app/(main)/premium/payment/page.tsx`:

**Premium price:** ₹49 (verified in 3 files: `src/lib/constants/pricing.ts` line 1, `PricingCard.tsx` line 70, `PremiumHero.tsx` line 172 and 208).

**Premium plan:** One-time payment, lifetime access, no subscription (verified in pricing.ts, PremiumHero, PricingCard, dashboard).

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
- Premium gating: `user.isPremium` from auth store controls UI (e.g., Analytics link shows lock icon if not premium — verified in Navbar).
- Payment flow: UPI-based manual verification.

**Payment flow (verified in `src/app/(main)/premium/payment/page.tsx`):**
- UPI ID: `aakashshah0707@okicici` (labeled "Placeholder UPI ID" in code comment).
- Amount: ₹49.
- User enters 12-digit UTR/Transaction ID.
- POST `/payment/submit` with utr and productId.
- **Manual verification:** "Payment verification may take up to 24 hours. Your Premium access will be activated after verification." — **manual process, not automatic.**
- Analytics events: `BEGIN_CHECKOUT` (value: 49, currency: INR), `PAYMENT_INITIATED`, `PAYMENT_FAILED`.
- **Alternative direct upgrade:** `PricingCard.tsx` calls `PUT /admin/users/${user._id}/premium` with `isPremium: true, subscriptionType: "monthly"` — **UNVERIFIED whether this is a working production path or a dev/test path.**

### 4.11 Infosys 2027 campaign
Verified in `src/lib/constants/campaigns.ts`, `src/lib/infosys-2027-data.ts`, `src/lib/infosys-2027-mocks.ts`, `src/app/(public)/infosys-se-2027/page.tsx`, `src/app/(main)/exams/infosys-2027/mocks/page.tsx`:

**Infosys info page (`/infosys-se-2027`):**
- Hero, job overview, eligibility (reported criteria: Class 10 60%, Class 12 60%, Diploma 65%, BTech 65% — labeled as reported from college-specific notice), exam pattern (60 questions, 7 sections, 120 minutes, 75 objective marks), selection process timeline, syllabus overview, FAQ (10 questions), official registration link (`https://surveys.infosysapps.com/r/a/SEcampusregistration2027batch`), official sample paper (`https://infytq.onwingspan.com/public-assets/InfosysCampusRecruitmentSampleTest-SystemsEngineer.pdf`).
- All infosys data explicitly labeled as "reported" — not confirmed as universal Infosys criteria.

**Infosys mock catalog (`/exams/infosys-2027/mocks`):**
- 4 mock tests configured in `src/lib/infosys-2027-mocks.ts` (Data Interpretation Fair Stalls Logic Set, Mixed Reasoning & Verbal Set, Advanced Reasoning & Verbal Set Hard, Hard Mixed Set).
- Live counts fetched from backend via `fetchTestById`.
- Only active tests shown; locked if premium and user not premium.

### 4.12 Theme and UI
- Tailwind CSS v4 with oklch color system.
- Light/dark/system theme via `next-themes`.
- shadcn/ui components (button, card, dialog, accordion, etc.).
- Framer Motion for animations.
- Lucide React for icons.
- Sonner for toasts.
- next/font (Geist font).

---

## 5. Free-user functionality (verified)

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

## 6. Premium functionality (verified)

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

## 7. User journey (landing → practice → test → Premium)

1. **Landing page (`/`)**: User sees TCS NQT focus, company cards, syllabus, pricing (₹49), FAQ.
2. **Registration/Login** (`/register`, `/login`): User creates account or signs in. Tokens stored in localStorage.
3. **Dashboard (`/dashboard`)**: User sees progress stats, Quick Start section, Full Mock Test CTA, Premium upsell.
4. **Practice or Test** (`/practice/[topic]`, `/tests/foundation`, `/exam/[testId]`): User takes a timed test with section locking, tab-switch detection, answer tracking.
5. **Results** (`/results/[testId]`, `/results/[testId]/review`): User sees score, section-wise breakdown, correct answers.
6. **Premium upsell**: Dashboard Premium card or Premium page → `/premium/payment` → UPI payment → manual verification → Premium activated.

---

## 8. Current product goals (inferred from code and content)

- **Primary:** Convert free users to Premium at ₹49 one-time (lifetime access).
- **Secondary:** Drive TCS NQT preparation usage (mock tests, practice, analytics).
- **Tertiary:** Expand to other company exams (Infosys, Wipro, Accenture, Cognizant, Capgemini, Tech Mahindra, HCL) with company-specific pages and mock tests.

---

## 9. Research objectives

1. Understand why users register but don't practice (GA4 shows Create Account: 762 views / 436 users; Dashboard: 1,211 views / 368 users — gap between registration and dashboard usage).
2. Understand why users take one test but don't return (GA4 Nth day data shows new vs returning users; day 0: 38 new / 47 returning).
3. Identify barriers to Premium conversion at ₹49 (GA4 shows Premium page: 1,247 views / 277 users; payment flow exists but no conversion data in CSV).
4. Evaluate Infosys 2027 campaign traction (GA4 shows Infosys pages: 18 views / 14 users for main page, 9 views / 8 users for preparation — very low traffic).
5. Identify friction in the UPI manual verification payment flow.

---

## 10. Evidence limitations

- **No `report.csv` exists** — used `Reports_snapshot.csv` instead. Filename discrepancy noted.
- **CSV lacks custom event breakdown** — only aggregate page views, active users, event counts, bounce rates. Cannot see `login`, `mock_started`, `payment_initiated`, etc. as individual event rows.
- **CSV lacks funnel data** — no user_id-level data, so registration→practice→test completion→Premium funnels cannot be calculated from the CSV alone.
- **CSV lacks revenue/conversion data** — no purchase events, revenue, or Premium conversion metrics visible in the export.
- **Some features marked UNVERIFIED** where UI exists but backend behavior couldn't be confirmed from frontend source alone.
- **Backend code not inspected** — server-side logic, database schemas, and actual API responses not available in frontend repo.
- **GA4 property ID G-XF4D0X8KBZ** verified in code, but actual GA4 dashboard access not available to confirm real-time data.
