# Premium Experiment Research

**Source of truth:** Frontend source code under `src/` (verified).  
**All experiments, hypotheses, and conversion rates are `HYPOTHESIS` — not actual results.**  
**No deceptive pricing, fake scarcity, fake testimonials, or manipulative sales tactics are proposed.**

---

## 1. Verified Premium offering

### 1.1 Price
**₹49 one-time, lifetime access.** Verified in three locations:
- `src/lib/constants/pricing.ts` line 1: `export const PREMIUM_PRICE = 49`
- `src/components/premium/PremiumHero.tsx` line 172: "just ₹49 — one payment, lifetime access"
- `src/components/premium/PremiumHero.tsx` line 208: "₹49 one-time · No subscription · Lifetime access"
- `src/components/premium/PricingCard.tsx` line 70: `<span className="text-6xl font-bold">₹49</span>`
- `src/app/(main)/dashboard/page.tsx` line 417: "₹49 one-time · No subscription • Lifetime access"

### 1.2 Premium features (verified in source code)

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

### 1.3 Free vs Premium comparison (verified restrictions)

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

### 1.4 Premium access checks (verified in code)

- Navbar: Analytics link shows Lock icon when `!user?.isPremium` (line 73–74 of Navbar.tsx) — **visual gating only**
- `user.isPremium` from Zustand auth store controls Premium UI visibility
- `isPremium?: boolean` on `Test` interface — **UNVERIFIED** if backend enforces Premium test access

---

## 2. Premium purchase flow (verified)

### 2.1 Payment page (`/premium/payment`)
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

### 2.2 Alternative upgrade path (UNVERIFIED)
- `PricingCard.tsx` calls `PUT /admin/users/${user._id}/premium` with `isPremium: true, subscriptionType: "monthly"` — **UNVERIFIED whether this is a working production path or a dev/test backdoor**

### 2.3 Post-purchase
- `PricingCard.tsx` calls `window.location.reload()` on success
- `PaymentPage.tsx` redirects to `/premium`
- Premium page shows "Your Premium Tests" if `user?.isPremium` — **UNVERIFIED** what premium tests are shown

---

## 3. Possible purchase barriers (verified from code)

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

## 4. Value perception hypotheses (HYPOTHESIS — not verified)

1. **₹49 one-time may feel low-risk** — one-time payment, lifetime access, no subscription is psychologically easier than recurring payments.
2. **Manual verification creates abandonment** — users who pay may abandon if they don't get instant Premium access.
3. **Unclear Premium value** — users can't verify what "50 Mock Tests" or "AI Analytics" actually means before paying.
4. **Registration-before-payment drops off** — users who want to pay immediately may bounce at the login requirement.
5. **Android/UPI users convert better** — UPI is native to Indian users; the flow matches local payment behavior.

---

## 5. Experiments (8 experiments, HYPOTHESIS)

### Experiment 1: Instant provisional Premium access

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

### Experiment 2: Guest Premium preview

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

### Experiment 3: Payment method expansion

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

### Experiment 4: Short diagnostic test before Premium upsell

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

### Experiment 5: Simplified registration-before-payment

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

### Experiment 6: Premium feature transparency

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

### Experiment 7: Limited-time introductory price framing (non-deceptive)

**Hypothesis:** Framing ₹49 as a clear, honest one-time price with no hidden costs increases trust compared to ambiguous pricing.

**Target segment:** All users viewing Premium page

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

### Experiment 8: Post-test Premium recommendation

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

## 6. Experiment prioritization summary

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

## 7. Risks and ethical considerations

- **No fake scarcity:** Do not use "Only 3 spots left!" or countdown timers that aren't real.
- **No fake testimonials:** The "1,243 students improved", "4.9 rating", "50+ mock tests" claims in PremiumHero are UI claims — experiments must not amplify unverified claims.
- **No deceptive pricing:** ₹49 is the actual price; do not show crossed-out "original prices" or fake discounts.
- **No manipulable urgency:** Do not create artificial deadlines for the ₹49 price.
- **Manual verification transparency:** The 24-hour verification window must be clearly communicated; do not imply instant activation when it isn't.
- **Placeholder UPI ID:** The code comments the UPI ID as placeholder — experiments must not proceed until a real merchant UPI ID is confirmed.

---

## 8. Cross-validation summary

- Premium price (₹49) verified in 4 source files — consistent across the codebase.
- Premium features are UI claims; backend enforcement is **UNVERIFIED** for most features.
- Payment flow uses manual UPI verification — verified in code with explicit 24-hour disclosure.
- All experiments are labeled as hypotheses; none claim guaranteed results.
- No deceptive or manipulative tactics proposed.
