# Student Personas (Simulated)

**All personas in this document are `SIMULATED PERSONA` / `HYPOTHESIS`.** They are not real customers, not actual feedback, and not derived from any user research. They are research hypotheses designed for MiroFish simulation, grounded in verified CrackNQT features and GA4 analytics findings.

**Connection rule:** Each persona's scenario connects only to features verified in the source code (routes, components, API clients, Zustand stores, types) or observed in `Reports_snapshot.csv`. Where a feature connection is uncertain, it is marked `UNVERIFIED`.

---

## Persona 1: Rajesh — TCS NQT-focused final-year student

**SIMULATED PERSONA — HYPOTHESIS**

### Background
- Final-year B.Tech (Computer Science) student, graduating 2027
- From Hyderabad (top GA4 city: 103 active users)
- Preparing for TCS NQT 2026/2027
- Has heard of CrackNQT through Google search (top traffic source: google/organic, 447 first users)

### Goals
- Clear the TCS NQT Foundation and Advanced sections
- Get a Ninja or Digital role at TCS
- Practice section-wise: numerical ability, reasoning ability, verbal ability

### Needs
- Timed, section-locked mock tests that mirror the real TCS NQT format
- Progress tracking to know if he's improving
- Free resources first; willing to pay ₹49 only if value is clear

### Potential friction
- **Verified feature:** Section-locked exams exist (`sectionLocked: boolean` in `Test` type; sequential submission enforced in `test-store.ts`). Rajesh would find this useful.
- **Verified feature:** Dashboard shows Tests Completed, Average Score, Questions Solved, Time Practiced — useful for tracking.
- **UNVERIFIED:** Whether the full mock test (79 questions, 120 minutes) accurately reflects the real TCS NQT timing and difficulty.
- **UNVERIFIED:** Whether coding questions (Python/Java/C++ options) are sufficient for the Advanced coding round.

### Reasons for not registering
- May not see value in creating an account before trying a test
- Landing page shows "Start Free Mock Test" button linking to `/register` — if he expects to practice without registering, this is a barrier

### Reasons for not practicing
- If the first test feels too hard or too easy, may not return
- No immediate feedback on whether his TCS NQT readiness is improving (dashboard analytics exist but **UNVERIFIED** if they are actionable enough)

### Reasons for not returning
- Took one mock test, got a score, didn't see a clear next step
- Weak long-term return pattern observed in GA4 (only 3 returning users at day 30 and day 89)

### Reasons for not purchasing Premium
- ₹49 one-time may be acceptable, but only if he believes hard-mode mocks and advanced analytics will improve his score
- Manual UPI verification (up to 24 hours) may deter immediate purchase

### Product opportunities
- Clear "Start with a free mock test without registering" option (currently topic cards on landing page link to `/register` — **UNVERIFIED backend behavior**)
- Post-test recommendation: "Your weak topic is Geometry — here are 5 practice questions" (recommendation types exist in types.ts: `revise`, `focus`, `strength`, `speed`)

### Research questions for MiroFish
- Does Rajesh complete the full 120-minute mock test or drop off mid-way?
- Does seeing the dashboard analytics (avg score, questions solved) motivate him to take another test?
- Does the section-locked format feel authentic to the real TCS NQT?

---

## Persona 2: Priya — Infosys-focused final-year student

**SIMULATED PERSONA — HYPOTHESIS**

### Background
- Final-year B.Tech (Information Technology), graduating 2027
- From Pune (GA4 city: 49 active users)
- Targeting Infosys SE 2027 campus drive
- Discovered CrackNQT through the Infosys campaign or Google search for "Infosys System Engineer exam pattern"

### Goals
- Understand Infosys SE eligibility and exam pattern
- Practice reasoning, verbal, and pseudocode questions
- Take Infosys-style mock tests

### Needs
- Reliable information on Infosys exam pattern (reported: 60 questions, 7 sections, 120 minutes)
- Practice questions for pseudocode, data sufficiency, reading comprehension
- Free mock tests specific to Infosys

### Potential friction
- **Verified feature:** Infosys info page (`/infosys-se-2027`) exists with exam pattern, eligibility (labeled "reported"), syllabus, FAQ, and official registration link
- **Verified feature:** Infosys mock catalog (`/exams/infosys-2027/mocks`) with 4 configured mock tests (Data Interpretation Fair Stalls, Mixed Reasoning & Verbal, Advanced Reasoning & Verbal Hard, Hard Mixed Set) — live counts fetched from backend
- **GA4 observed:** Infosys pages have very low traffic (18 views / 14 users for main page; 9 views / 8 users for preparation; 2 views / 2 users for recruitment) — Priya may not find the page easily
- **UNVERIFIED:** Whether the Infosys mock tests in the backend match the actual Infosys SE exam format

### Reasons for not registering
- Wants to read the exam pattern first without creating an account
- Infosys page links to official registration (`https://surveys.infosysapps.com/r/a/SEcampusregistration2027batch`) — she may go there instead of CrackNQT registration

### Reasons for not practicing
- If the Infosys mock catalog shows only 1 free test, she may feel there isn't enough content
- Pseudocode practice questions exist in coding bank (**verified** in `src/lib/api/coding.ts`) but may not be clearly labeled as Infosys-relevant

### Reasons for not returning
- Took the one free Infosys mock, didn't see more upcoming
- Preparation roadmap page is a placeholder ("Coming Soon") — no actionable next step

### Reasons for not purchasing Premium
- Premium claims "50 Mock Tests" (**verified** in PricingCard benefits) but Priya can't verify if any are Infosys-specific
- ₹49 for lifetime access may seem low-value if she only needs Infosys prep for one cycle

### Product opportunities
- Make the Infosys mock catalog more prominent from the info page (currently a teaser strip — **verified** in `InfosysMockTeaser.tsx`)
- Add a clear "Start free Infosys mock" button on the info page hero
- Show how many Infosys mock tests are free vs Premium before asking for registration

### Research questions for MiroFish
- Does Priya trust the "reported" eligibility and salary figures, or does she go straight to the official registration link?
- Does she take the Infosys mock test on mobile or desktop?
- Does she return after taking one Infosys mock?

---

## Persona 3: Amit — Budget-conscious student

**SIMULATED PERSONA — HYPOTHESIS**

### Background
- B.Com graduate, 2027 batch
- From a tier-2 city (GA4 data shows users from Sultanpur, Bhopal, Bhubaneswar, etc.)
- Limited disposable income; carefully evaluates every paid product

### Goals
- Prepare for placement exams without spending money
- Find the best free resources before considering any payment

### Needs
- Free practice questions and mock tests
- Clear statement of what is free vs. Premium
- No hidden costs

### Potential friction
- **Verified feature:** Landing page FAQ states "No. You can start with the free resources and practice available on CrackNQT. Premium is optional."
- **Verified feature:** Full Mock Test (Easy Mode) is free — 79 questions, 120 minutes
- **Verified feature:** Topic practice is available by section (numerical, reasoning, verbal)
- **UNVERIFIED:** How much of the coding question bank is free vs Premium
- **UNVERIFIED:** Whether free users can access all topic practice or if some topics are Premium-locked

### Reasons for not registering
- Wants to try practice without creating an account
- Landing page topic cards link to `/register` — barrier if he wants to browse first

### Reasons for not practicing
- If free content feels limited after 1–2 tests
- No clear path from free practice to improvement without Premium

### Reasons for not returning
- Exhausted free content and doesn't want to pay
- No clear free-tier progression path

### Reasons for not purchasing Premium
- ₹49 one-time may still be too much if he's unsure of value
- Manual UPI verification (up to 24 hours) adds friction — he may abandon if he wants instant access
- No trial or sample of Premium features before paying

### Product opportunities
- Show a preview of Premium features (sample hard-mode question, sample analytics chart) before asking for payment
- Clear "Free forever" vs "Premium" feature comparison table
- Reduce payment verification time or provide instant provisional access

### Research questions for MiroFish
- How many free tests does Amit take before deciding whether to pay?
- Does the ₹49 price feel like "impulse purchase" territory or "need to think about it"?
- Does the manual UPI verification cause him to abandon?

---

## Persona 4: Sneha — Free-resource-focused student

**SIMULATED PERSONA — HYPOTHESIS**

### Background
- B.Sc (Mathematics), 2027 batch
- From Kolkata (GA4 city: 47 active users)
- Prefers free educational resources; avoids paid platforms

### Goals
- Practice aptitude, reasoning, and verbal for placement exams
- Build confidence without any financial commitment

### Needs
- Unlimited free practice questions
- Answer explanations for learning
- Mobile-friendly practice (she studies on her phone)

### Potential friction
- **Verified feature:** Topic-wise practice cards on landing page (Quantitative Aptitude, Logical Reasoning, Verbal Ability, Programming, DBMS, Operating Systems, Computer Networks, OOPs, SQL Queries) — each links to `/register`
- **UNVERIFIED:** Whether topic practice requires registration or works for guests
- **UNVERIFIED:** Whether answer explanations are shown for free users (Question type has `explanation?: string` field — optional)
- **UNVERIFIED:** Mobile responsiveness of practice flow

### Reasons for not registering
- Doesn't want to create accounts on multiple platforms
- Wants to practice anonymously first

### Reasons for not practicing
- If registration is required before the first question
- If explanations are locked behind Premium

### Reasons for not returning
- Found enough free practice elsewhere
- No compelling reason to return without new free content

### Reasons for not purchasing Premium
- Ideologically opposed to paying for exam prep
- Believes free resources (YouTube, official company portals) are sufficient

### Product opportunities
- Guest practice mode (unregistered) with limited daily questions
- Show answer explanations for free users to build trust
- Clear free-tier limits (e.g., "5 free practice tests per day")

### Research questions for MiroFish
- Does Sneha attempt to practice without registering and bounce when blocked?
- Does she value answer explanations enough to consider paying?
- What is her device preference (mobile vs desktop)?

---

## Persona 5: Vikram — Multi-exam preparation student

**SIMULATED PERSONA — HYPOTHESIS**

### Background
- B.E (Electronics), 2027 batch
- From Bengaluru (GA4 city: 41 active users)
- Applying to multiple companies: TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini

### Goals
- Clear multiple placement exams
- Company-specific preparation for each
- Track progress across all exams in one place

### Needs
- Company-specific test pages (verified: landing page has company cards for TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, Tech Mahindra, HCL — each links to `/register`)
- Company-specific mock tests
- Unified progress dashboard

### Potential friction
- **Verified feature:** Company selection cards exist on landing page but all link to `/register` — **UNVERIFIED whether they lead to company-specific content or generic registration**
- **Verified feature:** Dashboard shows overall progress but **UNVERIFIED** if it breaks down progress by company
- **Verified feature:** Infosys-specific info page and mock catalog exist; other companies do not have dedicated pages
- **UNVERIFIED:** Whether Wipro, Accenture, Cognizant mock tests exist in backend

### Reasons for not registering
- If company cards don't deliver company-specific content after registration
- Wants to see company-specific tests before creating an account

### Reasons for not practicing
- If he has to navigate to different pages for each company
- If progress isn't consolidated

### Reasons for not returning
- Prepared for TCS and moved on; didn't see value in staying for other companies
- No cross-exam progress tracking

### Reasons for not purchasing Premium
- Premium claims "50 Mock Tests" but **UNVERIFIED** how many are company-specific vs generic
- If Premium doesn't clearly map to his multi-company needs

### Product opportunities
- Company-specific landing pages with dedicated mock tests (beyond Infosys)
- Dashboard breakdown by company/exam type
- Cross-exam analytics: "You're strong in reasoning across TCS and Infosys but weak in verbal"

### Research questions for MiroFish
- Does Vikram try the TCS mock, then look for Infosys mock, then Wipro, etc.?
- Does he register once and use the platform for all companies, or register separately?
- Does he find the company cards on the landing page useful or misleading?

---

## Persona 6: Kavita — Consistency-struggling student

**SIMULATED PERSONA — HYPOTHESIS**

### Background
- B.Tech (Electronics & Communication), 2027 batch
- From Lucknow (GA4 city: 36 active users)
- Starts preparation with enthusiasm but loses momentum after a week

### Goals
- Build a daily practice habit
- Clear TCS NQT
- See measurable improvement over time

### Needs
- Streaks, reminders, or daily goals
- Visible progress over time (not just one-time stats)
- Bite-sized practice sessions

### Potential friction
- **Verified feature:** Dashboard shows total tests, avg score, questions solved, time practiced — but **UNVERIFIED** if it shows trends over time (TrendData type exists in types.ts but **UNVERIFIED** if it's populated)
- **Verified feature:** Practice tests exist by topic — good for short sessions
- **UNVERIFIED:** No streaks, daily goals, or reminders visible in code
- **GA4 observed:** Nth day data shows returning users dropping from 47 (day 0) to 3 (day 89) — consistency is a real problem across the user base

### Reasons for not registering
- May register with enthusiasm but not return if there's no habit-forming mechanism

### Reasons for not practicing
- Practice sessions feel too long (full mock is 120 minutes)
- No daily reminder or streak to maintain momentum

### Reasons for not returning
- Missed a few days, feels behind, gives up
- No "welcome back" or "you missed X days" messaging

### Reasons for not purchasing Premium
- Doesn't trust herself to use Premium enough to justify ₹49
- Wants to build the habit first before paying

### Product opportunities
- Daily practice streak (unverified — would be a new feature)
- Short practice sessions (10–15 questions) for busy days
- Weekly progress email or notification
- "Come back" messaging after inactivity

### Research questions for MiroFish
- How many days does Kavita practice before stopping?
- Does a short (10-question) practice session feel more achievable than a full 120-minute mock?
- Would a streak or daily goal motivate her to return?

---

## Persona 7: Arun — Registered but inactive

**SIMULATED PERSONA — HYPOTHESIS**

### Background
- B.Tech (Mechanical), 2027 batch
- From Chennai (GA4 city: 59 active users)
- Registered on CrackNQT but hasn't taken a test in weeks

### Goals
- Eventually prepare for placement exams
- Currently busy with college projects/exams

### Needs
- A reason to return
- Low-effort re-entry (not a full 120-minute mock)
- Progress that isn't lost

### Potential friction
- **Verified feature:** localStorage backup for exam progress (4-hour expiry) — if he abandons mid-test, progress is saved temporarily
- **Verified feature:** Attempt history exists (`fetchHistory`) — he can see past attempts
- **UNVERIFIED:** Whether his registered account data persists if he returns after months
- **GA4 observed:** 1,083 active users over 90 days; Nth day data shows return rates dropping — Arun represents the large group that registered but didn't become a regular

### Reasons for not registering (already registered)
- N/A — already registered

### Reasons for not practicing
- College workload took priority
- Forgot about CrackNQT
- No email/reminder to return (**UNVERIFIED** if email reminders exist in code — no email service found in frontend source)

### Reasons for not returning
- Feels he's "behind" and doesn't know where to restart
- Dashboard may show empty or stale data if he hasn't practiced recently

### Reasons for not purchasing Premium
- Doesn't see value in paying for a service he's not actively using
- Would need to re-engage first before considering payment

### Product opportunities
- "Welcome back" message showing last test date and score
- Suggested next step: "You last practiced Numerical Ability — here are 5 questions"
- Reactivation campaign (email/push — **UNVERIFIED** if implemented)
- Short "diagnostic" test (10 questions) to ease back in

### Research questions for MiroFish
- How long was Arun inactive before returning (or not returning)?
- What would make him open the app again?
- Does seeing his past test history motivate him to take a new test?

---

## Persona 8: Meena — One test, never returned

**SIMULATED PERSONA — HYPOTHESIS**

### Background
- BCA graduate, 2027 batch
- From Sultanpur (GA4 city: 31 active users)
- Took one mock test on CrackNQT and never came back

### Goals
- Wanted to check her level quickly
- Not committed to long-term preparation

### Needs
- Quick assessment (not a full 120-minute mock)
- Immediate feedback on score
- No commitment

### Potential friction
- **Verified feature:** Full Mock Test is 120 minutes — long for a quick check
- **Verified feature:** Topic practice exists but may require registration
- **UNVERIFIED:** Whether there's a short diagnostic test option
- **GA4 observed:** Nth day data shows many users take action on day 0 but few return — Meena represents this pattern

### Reasons for not registering
- Only wanted a quick test; registration felt like too much commitment

### Reasons for not practicing
- Took one test, got a score, felt she knew her level
- Didn't see a reason to take another test immediately

### Reasons for not returning
- Achieved her immediate goal (check her level)
- No follow-up or personalized recommendation to return

### Reasons for not purchasing Premium
- Didn't see enough value from one free test to justify payment
- Not actively preparing at the moment

### Product opportunities
- Short diagnostic test (10–15 questions, 15–20 minutes) for quick self-assessment
- Immediate post-test recommendation: "You scored X% — here are 3 topics to improve"
- "Take another test" CTA on results page
- Low-commitment re-engagement: "Try a new topic in 5 minutes"

### Research questions for MiroFish
- Did Meena complete the full 120-minute mock or drop off partway?
- Did she look at her answer review after the test?
- What single change would have made her take a second test?

---

## Cross-validation summary

- All persona scenarios connect only to verified features (routes, components, API clients, Zustand stores, types) or GA4-observed data.
- Unverified features are explicitly marked.
- All personas are labeled `SIMULATED PERSONA` and `HYPOTHESIS`.
- No persona is presented as a real customer or actual feedback.
- No numbers are fabricated; GA4 values come directly from `Reports_snapshot.csv`.
