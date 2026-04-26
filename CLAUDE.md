@AGENTS.md

# CrackNQT Frontend

TCS NQT exam preparation platform built with Next.js 16, React 19, and TypeScript.

## Tech Stack

- **Framework:** Next.js 16.2.3 (App Router)
- **UI:** React 19.2.4, Tailwind CSS v4, shadcn/ui, Base UI, Lucide icons
- **State:** Zustand 5
- **Data:** Axios (HTTP), Recharts (charts)
- **Notifications:** Sonner
- **Theme:** next-themes with oklch color system (light/dark)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    (auth)/               # Login, Register (unauthenticated)
    (main)/               # Dashboard, Tests, Practice, Analytics, Results (authenticated)
    exam/[testId]/        # Full exam interface with timer and section locking
    page.tsx              # Public landing page
  components/
    ui/                   # shadcn/ui primitives (button, card, dialog, etc.)
    layout/               # Navbar, Footer
    auth/                 # AuthParticles (login/register visual effects)
    exam/                 # ExamTopBar, QuestionPanel, QuestionPalette, SectionPanel
    analytics/            # PerformanceCharts, TopicStrengths, TopicIntelligence
    results/              # SectionAnalysis, TimeAnalysis
    providers.tsx         # Client providers (auth hydration, Toaster)
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
      results.ts          # fetchResult, fetchReview, fetchHistory
      types.ts            # All TypeScript interfaces (User, Test, Question, Attempt, etc.)
    utils.ts              # Utility helpers (cn for class merging)
```

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api   # Backend API base URL
```

## Architecture Notes

### Authentication
- Tokens (access + refresh) stored in localStorage
- Auth store hydrates on app load via `providers.tsx`
- Axios request interceptor auto-attaches Bearer token
- 401 responses trigger silent token refresh; failed refresh redirects to /login

### Exam System
- Section-locked exams mimic real TCS NQT format
- Question status tracking: not_visited, not_answered, answered, marked_for_review
- Tab-switch detection for exam integrity
- Per-question time tracking
- Sections must be submitted sequentially
- localStorage backup for exam progress on auth failure (prevents data loss on session expiry)

### API Layer
- All API modules use the shared Axios client from `lib/api/client.ts`
- Standard response wrapper: `ApiResponse<T>` with success, data, message fields
- Section type: `"numerical" | "reasoning" | "verbal" | "advanced"`
- Test type: `"section_test" | "full_mock" | "topic_practice"`

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
