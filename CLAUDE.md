@AGENTS.md

# CrackNQT Frontend

TCS NQT exam preparation platform built with Next.js 16, React 19, and TypeScript.

## Tech Stack

- **Framework:** Next.js 16.2.3 (App Router)
- **UI:** React 19.2.4, Tailwind CSS v4, shadcn/ui, Base UI, Lucide icons
- **State:** Zustand 5
- **Data:** Axios (HTTP), Recharts (charts)
- **Tests:** Vitest + Testing Library (jsdom)
- **Notifications:** Sonner
- **Theme:** next-themes with oklch color system (light/dark)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run Vitest suite
npm run typecheck # tsc --noEmit
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    (auth)/               # Login, Register (unauthenticated)
    (main)/               # Dashboard, Tests, Practice, Coding, Analytics, Results (authenticated)
    exam/[testId]/        # Full exam interface with timer and section locking
    page.tsx              # Public landing page
  components/
    ui/                   # shadcn/ui primitives (button, card, dialog, etc.)
    layout/               # Navbar, Footer
    auth/                 # AuthParticles (login/register visual effects)
    exam/                 # ExamTopBar, QuestionPanel, QuestionPalette, SectionPanel
    analytics/            # PerformanceCharts, TopicStrengths, TopicIntelligence
    results/              # SectionAnalysis, TimeAnalysis
    providers.tsx         # Client providers (auth hydration, Toaster, SessionRevokedHost)
  stores/
    auth-store.ts         # User auth state, login/logout, token persistence
    test-store.ts         # Active exam session (questions, timer, responses, sections)
    progress-store.ts     # Analytics data (dashboard, topics, trends, recommendations)
  lib/
    api/
      client.ts           # Axios instance with auth interceptor and token refresh
      auth.ts             # login, register, getMe, refreshToken, logout
      tests.ts            # fetchTests, fetchTestById
      exam.ts             # startAttempt, saveAnswer, submitAttempt, recordTabSwitch
      analytics.ts        # dashboard, section, topic, time, recommendations, trends
      practice.ts         # fetchTopics, fetchPracticeQuestions, generatePracticeTest
      coding.ts           # fetchCodingQuestions, fetchCodingTopics, fetchCodingQuestion
      results.ts          # fetchResult, fetchReview, fetchHistory
      types.ts            # All TypeScript interfaces (User, Test, Question, Attempt, etc.)
    utils.ts              # Utility helpers (cn for class merging)
      errors.ts           # Backend auth error codes + helpers (lib/api/)
      exam-sync.ts        # isSessionRevokedError() (lib/api/)
    auth/
      session.ts          # Centralized session cleanup, cross-tab sync
      broadcast.ts        # BroadcastChannel wrapper (never carries tokens)
tests/                      # Vitest + Testing Library suite
```

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api   # Backend API base URL
```

## Architecture Notes

### Authentication
- Tokens (access + refresh) stored in localStorage; `sessionId` stored too (never displayed)
- Auth store hydrates on app load via `providers.tsx`
- Axios request interceptor auto-attaches Bearer token
- 401 handling is **code-aware**: `SESSION_REVOKED`/`TOKEN_INVALID` clear auth immediately (no refresh attempted); `TOKEN_EXPIRED` triggers a **single-flight shared refresh** with retry; `REFRESH_TOKEN_INVALID` re-reads storage to adopt another tab's rotated pair before giving up; network failures never log out; 403 `PREMIUM_REQUIRED`/`ADMIN_REQUIRED` show a deduped toast without logging out
- Refreshed pairs are never allowed to overwrite a newer pair written by another tab (stale-response guard); localStorage is shared across tabs
- Cross-tab coordination via `BroadcastChannel` (`logout` → other tabs clear + go to /login; `session-ended` → other tabs show the revoked screen) — never broadcasts token material
- `SESSION_REVOKED` → immediate cleanup (tokens/sessionId/user/premium/progress cache) → idempotent full-screen "Your session has ended" experience (`SessionRevokedScreen` + `SessionRevokedHost`) → sign in again via `/login?from=<path>` (validated return URL) or back to home
- Manual logout calls the backend `/auth/logout` (best-effort) and never shows the revoked screen

### Exam System
- Section-locked exams mimic real TCS NQT format
- Question status tracking: not_visited, not_answered, answered, marked_for_review
- Tab-switch detection for exam integrity
- Per-question time tracking
- Sections must be submitted sequentially
- localStorage backup for exam progress on auth failure (prevents data loss on session expiry)
- **Dead attempt handling:** If the backend returns 400 (attempt no longer active), the `attemptDead` flag in `test-store` is set. All further API calls (save, navigate, clear, mark-review, tab-switch) are skipped, and a single error toast is shown instead of spamming per-action toasts.
- **Pause is frontend-only:** The pause button stops the client timer but the backend has no pause concept — it was counting wall-clock time from `startedAt`. The server-side time-expiry check was removed from `saveAnswer` to prevent the backend from killing attempts during frontend pause.
- **Duplicate question prevention:** Backend deduplicates questions by text before selecting for an attempt. A unique index on `(text, topic)` prevents duplicate questions in the DB. Run `node seeds/cleanup_duplicates.js` if duplicates are suspected.

### API Layer
- All API modules use the shared Axios client from `lib/api/client.ts`
- Standard response wrapper: `ApiResponse<T>` with success, data, message fields
- Section type: `"numerical" | "reasoning" | "verbal" | "advanced"`
- Test type: `"section_test" | "full_mock" | "topic_practice"`

### Coding Questions (PYQ)
- `/coding` lists all PYQ coding questions with difficulty/topic filters
- `/coding/[id]` shows full problem statement, constraints, examples, and two solutions (brute force + optimal)
- API: `GET /api/coding`, `GET /api/coding/topics`, `GET /api/coding/:id`
- Types: `CodingQuestion`, `CodingQuestionSummary`, `CodingSolution`, `CodingTopicCount`

### Styling
- Tailwind v4 with `@tailwindcss/postcss` plugin
- shadcn/ui components in `src/components/ui/`
- Path alias: `@/*` maps to `./src/*`
- Custom scroll-triggered animations defined in `globals.css`

## Code Conventions

- Use `"use client"` directive for interactive components
- Prefer shadcn/ui components over custom UI
- Use Zustand stores for shared state; avoid prop drilling
- API calls go through `src/lib/api/` modules, never raw axios
- Use `@/` path alias for all imports

## Development Workflow

### Getting Started
1. Clone the repo and run `npm install`
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`
3. Ensure the backend API server is running on the configured port
4. Run `npm run dev` to start the development server

### Adding New Pages
- Create route files under `src/app/` using the App Router conventions
- Authenticated pages go in `(main)/`, unauthenticated in `(auth)/`
- Always add skeleton loading states for pages that fetch data

### Adding New API Endpoints
1. Define TypeScript interfaces in `lib/api/types.ts`
2. Create or extend a module in `lib/api/` using the shared Axios client
3. Wrap responses with `ApiResponse<T>` for consistency
4. Consume from Zustand stores or directly in components

### Testing Checklist
- Run `npm run test`, `npm run typecheck` and `npm run build` before pushing
- For session/auth changes: run `tests/client.test.ts` and `tests/session.test.ts` — they cover the exact backend contract
- Verify both light and dark theme appearance
- Test auth flows: login, token refresh, session revocation (two browsers), and session expiry handling
- For exam features: test section locking, timer, and tab-switch detection
