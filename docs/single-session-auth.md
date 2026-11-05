# Single Active Session — Integration Report

## Backend contract integrated (exact)

Login/register response gains `sessionId` (persisted, never displayed, never sent anywhere except localStorage).
Revoked-session response (HTTP 401) is detected by `code === "SESSION_REVOKED"`.

| Code | Status | Frontend behavior (implemented) |
|---|---|---|
| SESSION_REVOKED | 401 | Auth cleared immediately (no refresh attempted) → animated session-ended screen → login |
| TOKEN_INVALID | 401 | Auth cleared, no refresh → session-ended screen (copy: "session is no longer valid") |
| TOKEN_EXPIRED | 401 | Silent refresh → retry original request with rotated token |
| REFRESH_TOKEN_INVALID | 401 | Storage re-check (adopt another tab's rotated pair if present); else session-ended screen ("couldn't renew") |
| REFRESH_TOKEN_EXPIRED | 401 | Auth cleared → session-ended screen (copy: "session expired") |
| PREMIUM_REQUIRED | 403 | Deduped toast ("available with Premium"); **never** logs out |
| ADMIN_REQUIRED | 403 | Deduped toast ("Admin access required"); **never** logs out |

Precedence: SESSION_REVOKED is checked first everywhere (including inside the refresh path).

## Files changed

New:
- `src/lib/api/errors.ts` — typed `getErrorCode`/`getErrorStatus`/`isNetworkError`, `SessionEndReason`
- `src/lib/api/exam-sync.ts` — `isSessionRevokedError()` (exam stops syncing silently)
- `src/lib/auth/session.ts` — centralized, idempotent `endSession()`, `manualLogout()`, `initSessionChannel()` (cross-tab), route classification
- `src/lib/auth/broadcast.ts` — BroadcastChannel wrapper; never carries token material
- `src/components/auth/SessionRevokedScreen.tsx` — presentational, animated, accessible
- `src/components/auth/SessionRevokedHost.tsx` — reads store, renders overlay, safe `?from=` return URL
- `vitest.config.mts`, `tests/**` — 51 tests (6 files)

Modified:
- `src/lib/api/client.ts` — response interceptor rewritten: exact code switch, single-flight `refreshPromise` (replaced broken flag+queue), stale-response guard, logout-during-refresh guard, no 401-refresh for revoked/invalid tokens, 403 restriction toasts
- `src/lib/api/types.ts` — `AuthResponse.sessionId?`
- `src/stores/auth-store.ts` — stores `sessionId`; new `sessionEnded` state; `setTokens` (never resurrects a cleared session); `hydrate()` discards partial/stale state; `setSessionEnded`/`clearSessionEnded`
- `src/stores/progress-store.ts` — `resetProgress()` clears user-specific analytics cache
- `src/components/providers.tsx` — mounts `SessionRevokedHost`, subscribes to cross-tab events, `inert` background while revoked
- `src/components/layout/Navbar.tsx` — manual logout now calls backend `/auth/logout` (best-effort) + `manualLogout()` (clears auth, broadcasts to tabs) — no revoked screen for normal logout
- `src/app/(auth)/login/page.tsx`, `register/page.tsx` — persist `sessionId`, honor safe `?from=` return URL
- `src/components/exam/QuestionPanel.tsx`, `src/app/exam/[testId]/page.tsx` — SESSION_REVOKED → `setAttemptDead()` (stop all authenticated sync); submit failure no longer toasts redundantly; attempt is never auto-submitted
- `src/lib/analytics.ts` — `session_revoked` event (see below)
- `src/lib/auth/session.ts` + `CLAUDE.md` docs, `project.init` (corrected duplicate-`/` note)

## How SESSION_REVOKED is detected

`error.response.status === 401 && error.response.data?.code === "SESSION_REVOKED"`
→ `endSession("revoked")` — synchronous, before any other handling:
1. Clear `accessToken`/`refreshToken`/`sessionId`/`user` (localStorage + store) → premium state gone (derived from `user.isPremium`).
2. `resetProgress()` clears cached dashboard/analytics/history.
3. `sessionEnded: "revoked"` → `SessionRevokedHost` renders the full-screen experience above everything (z-100).
4. One `session_revoked` analytics event: `{ reason_category, route_category, in_exam }` — no tokens, no session id, no email.
5. Broadcast `session-ended` to other tabs (same browser) — they clear auth and show the screen too.
6. Idempotent: concurrent 401s run cleanup once (`sessionEnded` guard + store check); analytics fires once.

## Refresh coordination / race handling

- All concurrent 401s await **one** `refreshPromise` (single-flight) — no flag+queue, no duplicate refreshes.
- Refresh endpoint is called with the refresh token **current at call time** (never re-sent stale).
- **Stale-response guard**: after the refresh HTTP call resolves, if `localStorage.refreshToken` changed underneath us (another tab rotated), our response is discarded and the stored pair is adopted (store synced to storage).
- **REFRESH_TOKEN_INVALID**: one storage re-read; if a newer pair exists → adopt & retry original request. Otherwise → `refresh_failed` end (re-auth required).
- **Logout-during-refresh**: if auth was cleared while the request was in flight, the response is discarded and nothing is written back (reason `aborted` — no session-ended screen for deliberate sign-outs).
- **SESSION_REVOKED from the refresh endpoint** ends the session immediately (precedence over recovery).
- Tokens are **never** broadcast — cross-tab sync uses coarse event types only (`logout` / `session-ended` / `tokens-rotated`), relying on shared localStorage for actual token state.

## Cross-tab synchronization

`BroadcastChannel("cracknqt-session")` (gracefully no-ops where unavailable):
- `logout` → other tabs clear auth; if on a protected path → `window.location.assign("/login")`. No revoked screen.
- `session-ended` → other tabs run `endSession(reason, {broadcast:false})` → screen appears there too.
- `tokens-rotated` → no-op notification (storage is the source of truth).

## Session-ended UX

- Full-screen, opaque gradient (`bg-gradient-to-br`, blue/indigo glows — same visual language as the auth pages); centered card, `max-w-md sm:max-w-lg`, no horizontal overflow; `overflow-y-auto` + `100dvh` for small/landscape screens.
- Copy: "Your session has ended" / "Your CrackNQT account was signed in on another device…" — never says banned/suspended/hacked/blocked. Progress-reassurance line included.
- Framer Motion (already in project): 350 ms card rise+fade, icon pop (80 ms delay), copy (140 ms), actions (220 ms); `prefers-reduced-motion` → simple 150 ms fade.
- Accessibility: `role="alertdialog"` + `aria-modal`, labelled/described; focus moved to **Sign in again** on mount; full Tab navigation; visible focus rings; contrast in both themes; background made `inert` during the screen (React 19).
- No Sonner toast is shown for revocation (screen is the message). PREMIUM_REQUIRED/ADMIN_REQUIRED use a single deduped toast (5 s cooldown) instead.
- Buttons: **Sign in again** → `/login?from=<current-path>` (validated: must start with `/`, no `//`) → after login, user lands back where they were. **Back to home** → `/`. Intermediate "cleared but unmounted protected page" state is impossible because `router.push` unmounts it.

## Exam attempt behavior

- If revocation happens mid-exam: next failed authenticated call flips `attemptDead` → all further save/navigate/mark/quit calls are skipped (existing exam machinery, now also triggered by SESSION_REVOKED explicitly in `QuestionPanel.handleApiError` and the submit catch).
- The session-ended screen covers the exam UI (z-100); timer/state remain untouched — **never auto-submitted, never marked complete**.
- `exam_backup` localStorage entry is preserved (attempt-resume behavior unchanged). Backend attempt remains authoritative.
- Local answers are kept; user can sign back in and continue the attempt per existing resume flow.

## Premium behavior

- Premium UI derives from `user.isPremium` — clearing the user clears premium everywhere (nav badge, locks, banners).
- PREMIUM_REQUIRED → toast only, user stays logged in; ADMIN_REQUIRED likewise.
- Payment flow (Razorpay) untouched. Premium pages/endpoints gain no new behavior beyond the interceptor handling.

## Automated tests (all executed — 51 passed)

`npm run test` → **6 files, 51 tests, all passing** (vitest 3.2.7 + jsdom + Testing Library).
- `tests/client.test.ts` (16) — real Axios interceptor chain with mocked adapter: SESSION_REVOKED (no refresh, cleared, idempotent, premium/cache cleared), TOKEN_INVALID, TOKEN_EXPIRED (refresh+retry, single-flight, no loop), REFRESH_TOKEN_INVALID recovery vs. clean fail, REFRESH_TOKEN_EXPIRED, refresh-time SESSION_REVOKED precedence, logout-during-refresh not resurrected, stale refresh never overwrites newer pair, 403 restrictions don't log out, network failure never revokes.
- `tests/session.test.ts` (9) — endSession cleanup/idempotency/analytics payload (no secrets), manualLogout semantics, cross-tab logout & session-ended propagation.
- `tests/SessionRevokedScreen.test.tsx` (10) — rendering, copy per reason, no banned/hacked wording, alertdialog aria wiring, focus on primary action, keyboard navigation, reduced motion, light/dark, responsive class assertions.
- `tests/SessionRevokedHost.test.tsx` (4), `tests/auth-store.test.tsx` (6 → `tests/auth-store.test.ts`), `tests/errors.test.ts` (5).

## Verification executed

- `npm run test` → 51/51 passed ✅
- `npx tsc --noEmit` → clean ✅
- `npm run lint` → 8 errors / 42 warnings, **all pre-existing** (files I did not touch; verified one by one). My files: 0 errors, 3 warnings pre-existing in exam page (exhaustive-deps/unused var, unchanged behavior).
- `npm run build` → **succeeds**; `/` serves the landing page. (Note: the suspected duplicate-`/` build break does not occur on Next.js 16.2.3 — the `(public)/page.tsx` is silently shadowed; still dead code to remove.)
- Prod server smoke test: `/`, `/login`, `/dashboard`, `/tcs-nqt-syllabus` → 200; login page renders ✅

## Manual end-to-end (two browsers) — for the reviewer to run

1. Log in on Browser A (premium account) → open Dashboard.
2. (Optional) Start a mock test in Browser A.
3. Log in with the same account on Browser B → B is authenticated.
4. In Browser A, trigger any authenticated request (navigate / refresh dashboard).
5. Browser A receives SESSION_REVOKED → auth cleared instantly → full-screen "Your session has ended" appears (no toast spam, no blank login page).
6. Check: "Sign in again" → /login?from=… → after login you land back on the page you came from. "Back to home" → landing page.
7. Browser A cannot load /dashboard data, premium content, or refresh its token (401 → screen again); Browser B keeps working, premium included.
8. Repeat with: expired access token (silent refresh restores A), invalid refresh token (screen after refresh fails), manually logging out in B (A signs out too, plain /login redirect, no revoked screen), during an active exam (screen covers exam; answers preserved in localStorage; not submitted), multiple A-tabs open (all get the screen), reduced-motion + keyboard-only + dark/light + mobile viewport.
9. Premium check in A: premium UI hidden (user cleared); PREMIUM_REQUIRED shows a toast, does not kick you out.

## Remaining limitations

- Cross-tab refresh coordination = shared localStorage + re-check (covers refresh races). It cannot hard-serialize two literally simultaneous refreshes without a backend grace window or Web Locks; the loser recovers by adoption, or re-authenticates — no data loss, no wrongful logout.
- Cross-tab delivery uses BroadcastChannel (same-origin, same-browser tabs). Different browsers/machines/devices authenticate independently — revocation propagates on **their next API call** (by design; backend is source of truth).
- jsdom cannot prove real layout/overflow or visuals; responsive/reduced-motion checks are class/hook-level in tests; the two-browser E2E above is manual.
- `inert` on the background wrapper needs React 19 (we have it); older browsers ignore it (focus is still moved into the dialog).
- Exam attempt is preserved locally but the server-side attempt can only be resumed via the existing backend flow — unchanged by this work.
