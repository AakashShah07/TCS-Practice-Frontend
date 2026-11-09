# CrackNQT — Product Overview (Short Version)

**Source of truth:** Frontend source code under `src/` (Next.js 16.2.3, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, Axios).  
**Production URL:** https://cracknqt.vercel.app  
**GA4 measurement ID:** G-XF4D0X8KBZ  
**GA4 export:** `Reports_snapshot.csv` (no file named `report.csv` exists in workspace; this CSV was used instead).

---

## 1. Product purpose

CrackNQT is a free-to-start online exam preparation platform for Indian placement-exam candidates, with a primary focus on the **TCS NQT (National Qualifier Test)**. It offers topic-wise practice, full-length timed mock tests, coding question practice (previous-year questions), results review, progress analytics, and an optional one-time Premium upgrade.

Positioning from the landing page: "Free to start. No ads. Built for NQT." and "Prepare for TCS NQT with topic-wise practice, exam-style mock tests and performance tracking. Start free and unlock advanced preparation with Premium."

---

## 2. Target audience

Verified from landing page copy and syllabus data: Indian students and freshers preparing for placement exams, specifically TCS NQT (2026 batch referenced in syllabus content), with secondary company-specific pages for Infosys, Wipro, Accenture, Cognizant, Capgemini, Tech Mahindra, and HCL. GA4 city data shows users concentrated in Indian cities (Hyderabad, Chennai, Pune, Kolkata, Bengaluru, Lucknow, etc.).

---

## 3. Key features

### Free features (verified)
- Register / login
- Topic-wise practice tests (Quantitative Aptitude, Logical Reasoning, Verbal Ability, Programming, DBMS, Operating Systems, Computer Networks, OOPs, SQL Queries)
- Full Mock Test (Easy Mode, 79 questions, 120 minutes)
- Section tests (Numerical Ability, Reasoning Ability, Verbal Ability, Advanced Reasoning)
- View results and answer review (score, percentage, correct/wrong/skipped, section-wise and topic-wise breakdown)
- View dashboard with basic analytics (tests completed, average score, questions solved, time practiced)
- View attempt history
- Access coding question bank (previous-year questions with brute force + optimal solutions)
- Access Infosys info page and mock catalog (free tests)
- Light/dark theme

### Premium features (₹49 one-time, lifetime access — verified)
- Hard Mode Mock Tests
- Advanced Analytics
- Performance Intelligence
- Coding Challenges / Prime Prep
- AI-powered analytics
- 50 Mock Tests (claimed in PricingCard — **UNVERIFIED** whether this maps to a specific backend filter)

**Premium price verified** in 4 source files:
- `src/lib/constants/pricing.ts` line 1: `export const PREMIUM_PRICE = 49`
- `src/components/premium/PremiumHero.tsx` lines 172 & 208
- `src/components/premium/PricingCard.tsx` line 70
- `src/app/(main)/dashboard/page.tsx` line 417

**Premium features are UI claims** — backend enforcement is **UNVERIFIED** for most features. Free users see Premium CTAs but cannot access Premium content without purchasing. Premium gating uses `user.isPremium` from the Zustand auth store (e.g., Analytics link shows lock icon if not premium).

---

### Payment flow (verified)

**Payment page:** `/premium/payment`
- **Payment method:** UPI only
- **UPI ID:** `aakashshah0707@okicici` (labeled "Placeholder UPI ID" in code comment — **UNVERIFIED if this is a real merchant UPI ID**)
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
- **Analytics events:** `BEGIN_CHECKOUT` (value: 49, currency: INR), `PAYMENT_INITIATED`, `PAYMENT_FAILED`

**Alternative upgrade path (UNVERIFIED):**
- `PricingCard.tsx` calls `PUT /admin/users/${user._id}/premium` with `isPremium: true, subscriptionType: "monthly"` — **UNVERIFIED whether this is a working production path or a dev/test path**

---

### User journey (landing → practice → test → Premium)

1. **Landing page (`/`)**: User sees TCS NQT focus, company cards, syllabus, pricing (₹49), FAQ.
2. **Registration/Login** (`/register`, `/login`): User creates account or signs in. Tokens (accessToken, refreshToken, sessionId) stored in localStorage.
3. **Dashboard (`/dashboard`)**: User sees progress stats, Quick Start section, Full Mock Test CTA, Premium upsell.
4. **Practice or Test** (`/practice/[topic]`, `/tests/foundation`, `/exam/[testId]`): User takes a timed test with section locking, tab-switch detection, answer tracking.
5. **Results** (`/results/[testId]`, `/results/[testId]/review`): User sees score, section-wise breakdown, correct answers.
6. **Premium upsell**: Dashboard Premium card or Premium page → `/premium/payment` → UPI payment → manual verification → Premium activated.

---

## 4. Premium system details

### Premium price
**₹49 one-time payment, lifetime access, no subscription.** Verified consistently across `src/lib/constants/pricing.ts`, `src/components/premium/PremiumHero.tsx`, `src/components/premium/PricingCard.tsx`, and `src/app/(main)/dashboard/page.tsx`.

### Premium vs Free access matrix

| Feature | Free users | Premium users |
|---------|-----------|---------------|
| Topic practice | ✅ Available | ✅ Available |
| Section tests | ✅ Available | ✅ Available |
| Full Mock Test (Easy Mode, 79Q, 120 min) | ✅ Available | ✅ Available |
| Hard Mode Mock Tests | ❌ Not available | ✅ Available (UI claim — enforcement **UNVERIFIED**) |
| Advanced Analytics | ❌ Not available | ✅ Available (UI claim — enforcement **UNVERIFIED**) |
| Performance Intelligence | ❌ Not available | ✅ Available (UI claim — enforcement **UNVERIFIED**) |
| Coding question bank | ✅ Available (PYQ) | ✅ Available |
| Results & answer review | ✅ Available | ✅ Available |
| Dashboard basic analytics | ✅ Available | ✅ Available |

### Premium access mechanism
- `user.isPremium` boolean from the Zustand auth store controls Premium UI visibility.
- Navbar shows lock icon on Analytics link when `!user?.isPremium`.
- `isPremium?: boolean` field exists on the `Test` interface — **UNVERIFIED** if backend enforces Premium test access.
- Payment is UPI-based with manual UTR verification (up to 24 hours). No automatic instant activation.
- After successful payment verification, user is redirected to `/premium` which shows "Your Premium Tests" if `user?.isPremium`.

### Evidence limitations
- Premium features listed in PricingCard (50 Mock Tests, Coding Challenges, Prime Prep, AI Analytics, Lifetime Updates) are UI claims — backend enforcement cannot be confirmed from frontend source alone.
- No purchase/revenue data is visible in the GA4 export (`Reports_snapshot.csv`), so Premium conversion rate cannot be calculated.
- The file `rzp-key.csv` exists on disk but is gitignored and was not read — no Razorpay credentials are included in this document.
