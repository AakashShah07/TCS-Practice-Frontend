# CrackNQT Research Seed Materials

This folder contains research documents prepared as seed materials for the **MiroFish AI simulation platform**. The documents describe the CrackNQT product, its actual GA4 analytics, hypothetical student personas, and potential experiments to improve engagement, retention, and Premium conversion.

## Purpose

The goal is to simulate a diverse group of Indian placement-exam preparation students interacting with the actual CrackNQT product. Product features are grounded in the source code. Analytics findings are grounded in GA4 export data. Student motivations are treated as hypotheses, not factual customer feedback.

## Documents in this folder

| File | Description |
|------|-------------|
| `cracknqt-overview.md` | Complete factual overview of CrackNQT: product purpose, routes, features, free vs. Premium functionality, user journey, evidence limitations. |
| `cracknqt-analytics.md` | Data-grounded analysis of the GA4 export (`Reports_snapshot.csv`). Traffic, page performance, engagement, traffic sources, data gaps, and recommended additional events. |
| `student-personas.md` | Seven simulated student personas (TCS-focused, Infosys-focused, budget-conscious, free-resource-focused, multi-exam, consistency-struggling, registered-but-inactive, one-test-and-done). All explicitly labeled as hypotheses. |
| `premium-experiment.md` | Verified Premium offering (price, features, purchase flow), free-vs-Premium comparison, purchase barriers, and 8 realistic experiments with hypotheses, metrics, risks, and effort estimates. |
| `README.md` | This file. |

## Data sources

| Source | What it contains | Status |
|--------|------------------|--------|
| `src/` (frontend source code) | All React components, API clients, Zustand stores, TypeScript types, configuration | Verified against actual files |
| `Reports_snapshot.csv` | GA4 export for property "Crack NQT" (account: Aakash Shah), date range 2026-08-10 to 2026-11-07 | Used as `report.csv` equivalent; note: filename differs from requested `report.csv` |
| `src/lib/analytics.ts` | GA4 instrumentation wrapper and event name constants | Verified |
| `src/app/layout.tsx` | GA4 gtag script with measurement ID `G-XF4D0X8KBZ` | Verified |

**Note:** No file named `report.csv` exists in the workspace. The GA4 export found is `Reports_snapshot.csv` (7,239 bytes). All analytics findings in this folder reference `Reports_snapshot.csv`.

## Evidence guidelines

1. **Verified features** — Described only where confirmed in source code (routes, components, API clients, Zustand stores, or types).
2. **UNVERIFIED** — Features or behaviors that exist in UI but whose backend/API behavior could not be confirmed from source alone are marked `UNVERIFIED`.
3. **OBSERVED DATA / INTERPRETATION / HYPOTHESIS / DATA GAP** — Analytics sections explicitly separate what the CSV shows from what is inferred.
4. **SIMULATED PERSONA / HYPOTHESIS** — All student personas and motivations are explicitly labeled as simulated. They are not real customers or actual feedback.
5. **No secrets** — No environment variables, API keys, tokens, passwords, or private user data are exposed. The file `rzp-key.csv` exists on disk but is gitignored and was not read or included.
6. **No modification** — No application source code was modified during this research.

## Suggested simulation objective (for MiroFish)

> "Simulate a diverse group of Indian placement-exam preparation students interacting with the actual CrackNQT product. Explore their potential needs, concerns, study behavior, registration decisions, practice behavior, return behavior, and perceptions of the verified Premium offering. Ground product features in the source code and analytics findings in GA4 data. Treat student motivations as hypotheses, not factual customer feedback. Identify realistic product improvements and experiments that could improve engagement, retention, and Premium conversion without deceptive or manipulative tactics."

## Cross-validation summary

- All product features in `cracknqt-overview.md` were verified against source code files under `src/`.
- All analytics values in `cracknqt-analytics.md` were read directly from `Reports_snapshot.csv`.
- Premium price (₹49 one-time, lifetime access) was verified in `src/lib/constants/pricing.ts`, `src/components/premium/PricingCard.tsx`, `src/components/premium/PremiumHero.tsx`, and `src/app/(main)/premium/payment/page.tsx`.
- All personas are explicitly labeled `SIMULATED PERSONA` and `HYPOTHESIS`.
- Documents were cross-checked for internal consistency.
- Features or metrics that could not be verified are listed in each document's limitations section.
- No application source code was modified.
