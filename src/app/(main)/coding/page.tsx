"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Filter,
  ChevronRight,
  Tag,
  FileText,
  Layers,
  Search,
  Crown,
  Lock,
  ArrowRight,
  X,
} from "lucide-react";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import {
  fetchCodingQuestions,
  fetchCodingTopics,
} from "@/lib/api/coding";
import type { CodingQuestionSummary, CodingTopicCount } from "@/lib/api/types";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const difficultyConfig = {
  easy: {
    label: "Easy",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500 dark:bg-emerald-400",
    selected:
      "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-200",
  },
  medium: {
    label: "Medium",
    badge:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300",
    dot: "bg-amber-500 dark:bg-amber-400",
    selected:
      "border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-200",
  },
  hard: {
    label: "Hard",
    badge:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-300",
    dot: "bg-rose-500 dark:bg-rose-400",
    selected:
      "border-rose-300 bg-rose-100 text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-200",
  },
} as const;

const difficulties = ["easy", "medium", "hard"] as const;

const statCards = [
  {
    key: "questions",
    label: "Questions",
    icon: Code2,
    iconClasses:
      "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    key: "topics",
    label: "Topics",
    icon: Tag,
    iconClasses:
      "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    key: "source",
    label: "Source",
    icon: FileText,
    iconClasses:
      "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    key: "solutions",
    label: "Solutions Each",
    icon: Layers,
    iconClasses:
      "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/25 dark:bg-orange-500/10 dark:text-orange-400",
  },
] as const;

export default function CodingQuestionsPage() {
  const [questions, setQuestions] = useState<CodingQuestionSummary[]>([]);
  const [topics, setTopics] = useState<CodingTopicCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [query, setQuery] = useState("");
  const [premiumFiltersOpen, setPremiumFiltersOpen] = useState(false);
  const { user } = useAuthStore();
  const isPremium = user?.isPremium;

  useEffect(() => {
    fetchCodingTopics()
      .then(setTopics)
      .catch((err) => console.error("Failed to fetch topics:", err));
  }, []);

  useEffect(() => {
    // Keep showing the current list while refetching — no synchronous loading flip.
    const params: { difficulty?: string; topic?: string } = {};
    if (selectedDifficulty) params.difficulty = selectedDifficulty;
    if (selectedTopic) params.topic = selectedTopic;
    fetchCodingQuestions(params)
      .then(setQuestions)
      .catch((err) => {
        console.error("Failed to fetch questions:", err);
        setQuestions([]);
      })
      .finally(() => setLoading(false));
  }, [selectedDifficulty, selectedTopic]);

  // Frontend-only search over the already-fetched questions — no backend involved.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        (item.source ?? "").toLowerCase().includes(q)
    );
  }, [questions, query]);

  const activeFilterCount =
    (selectedDifficulty ? 1 : 0) +
    (selectedTopic ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const clearFilters = () => {
    setSelectedDifficulty("");
    setSelectedTopic("");
    setQuery("");
  };

  const statValues: Record<(typeof statCards)[number]["key"], string> = {
    questions: loading ? "–" : String(questions.length),
    topics: String(topics.length),
    source: "PYQ",
    solutions: "2x",
  };

  const filtersDisabled = !isPremium;
  const shown = isPremium ? visible : visible.slice(0, 6);

  return (
    <div className="coding-page">
      <div className="mx-auto w-full max-w-6xl space-y-5 sm:space-y-6">
        <Dialog open={premiumFiltersOpen} onOpenChange={setPremiumFiltersOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unlock Advanced Filters</DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                Filter coding questions by difficulty and topic with Premium access.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose
                render={
                  <Button variant="outline" className="min-h-11">
                    Maybe Later
                  </Button>
                }
              />
              <Button
                className="min-h-11 bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500"
                render={<Link href="/premium">Unlock Premium</Link>}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="flex items-center gap-4 sm:gap-5">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-700 shadow-[0_6px_16px_rgba(37,99,235,0.28)] dark:shadow-[0_6px_20px_rgba(109,40,217,0.35)]"
          >
            <Code2 className="h-7 w-7 sm:h-8 sm:w-8 text-white" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--coding-violet)]">
              TCS NQT · Previous Year
            </p>
            <h1 className="mt-1 text-2xl sm:text-[2.25rem] leading-[1.15] font-bold tracking-tight text-[var(--coding-text-primary)]">
              Coding Questions
            </h1>
            <p className="mt-1 text-sm sm:text-[15px] text-[var(--coding-text-secondary)]">
              Real TCS NQT coding questions with step-by-step solutions
            </p>
          </div>
        </header>

        {/* ── Statistics ─────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4"
          aria-label="Coding question statistics"
        >
          {statCards.map(({ key, label, icon: Icon, iconClasses }) => (
            <div
              key={key}
              className="flex items-center gap-3 sm:gap-4 rounded-xl border border-[var(--coding-card-border)] bg-[var(--coding-card-background)] p-3.5 sm:p-4 shadow-[var(--coding-card-shadow)]"
            >
              <div
                aria-hidden="true"
                className={cn(
                  "flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border",
                  iconClasses
                )}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl sm:text-[1.75rem] leading-none font-bold tabular-nums text-[var(--coding-text-primary)]">
                  {statValues[key]}
                </p>
                <p className="mt-1.5 text-[11px] sm:text-[13px] font-medium text-[var(--coding-text-secondary)]">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search & filters ───────────────────────────────────── */}
        <section
          aria-label="Filter questions"
          className="rounded-2xl border border-[var(--coding-card-border)] bg-[var(--coding-card-background)] shadow-[var(--coding-card-shadow)] p-3.5 sm:p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <div
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--coding-card-border)] bg-[var(--coding-card-secondary)] text-[var(--coding-text-secondary)]"
              >
                <Filter className="h-4 w-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--coding-text-primary)]">
                Filter Questions
              </h2>
              {filtersDisabled && (
                <span className="inline-flex h-7 items-center gap-1.5 rounded-md border border-amber-300/70 bg-amber-50 px-2.5 text-xs font-bold text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  Premium
                </span>
              )}
              {activeFilterCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--coding-selected-background)] border border-[var(--coding-selected-border)] px-1.5 text-[11px] font-bold text-[var(--coding-selected-foreground)]">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--coding-text-secondary)] hover:text-[var(--coding-text-primary)] hover:bg-[var(--coding-card-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Clear filters
              </button>
            )}
          </div>

          {filtersDisabled && (
            <p className="mt-2.5 flex flex-wrap items-center gap-x-2 text-sm text-[var(--coding-text-secondary)]">
              Advanced filtering is a Premium feature.
              <Link
                href="/premium"
                className="inline-flex min-h-9 items-center gap-1 rounded-sm font-semibold text-amber-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-amber-300"
              >
                Unlock Premium
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </p>
          )}

          {/* Search — filters the already-fetched list on the client */}
          <div className="relative mt-3 sm:mt-4">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--coding-text-secondary)]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search coding questions..."
              aria-label="Search coding questions"
              className="h-11 sm:h-12 w-full rounded-xl border border-[var(--coding-card-border)] bg-[var(--coding-card-secondary)] pl-11 pr-4 text-sm sm:text-[15px] font-medium text-[var(--coding-text-primary)] placeholder:text-[var(--coding-text-secondary)] outline-none transition-shadow focus:border-[var(--coding-violet)] focus:ring-2 focus:ring-[var(--coding-violet)]/25"
            />
          </div>

          <div className="mt-3 sm:mt-4 flex flex-col gap-3 lg:flex-row lg:gap-6">
            {/* Difficulty segmented control */}
            <div className={cn("group/filter-lock relative w-fit max-w-full", filtersDisabled && "cursor-pointer")}>
            <fieldset className="shrink-0">
              <legend className="text-[11px] font-bold uppercase tracking-wider text-[var(--coding-text-secondary)]">
                Difficulty
              </legend>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedDifficulty("")}
                  disabled={filtersDisabled}
                  aria-pressed={selectedDifficulty === ""}
                  className={cn(
                    "h-9 sm:h-10 px-4 rounded-lg border text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    filtersDisabled && "opacity-65 cursor-not-allowed",
                    selectedDifficulty === ""
                      ? "border-[var(--coding-selected-border)] bg-[var(--coding-selected-background)] text-[var(--coding-selected-foreground)] shadow-sm"
                      : "border-[var(--coding-card-border)] bg-[var(--coding-card-secondary)] text-[var(--coding-text-secondary)] hover:text-[var(--coding-text-primary)] hover:border-[var(--coding-violet)]/40"
                  )}
                >
                  All
                </button>
                {difficulties.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setSelectedDifficulty(d === selectedDifficulty ? "" : d)
                    }
                    disabled={filtersDisabled}
                    aria-pressed={selectedDifficulty === d}
                    className={cn(
                      "h-9 sm:h-10 px-3 sm:px-4 rounded-lg border text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      filtersDisabled && "opacity-65 cursor-not-allowed",
                      selectedDifficulty === d
                        ? difficultyConfig[d].selected
                        : "border-[var(--coding-card-border)] bg-[var(--coding-card-secondary)] text-[var(--coding-text-secondary)] hover:text-[var(--coding-text-primary)] hover:border-[var(--coding-violet)]/40"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-2 w-2 rounded-full",
                        difficultyConfig[d].dot
                      )}
                    />
                    {difficultyConfig[d].label}
                  </button>
                ))}
              </div>
            </fieldset>
            {filtersDisabled && (
              <>
                <button
                  type="button"
                  aria-label="Difficulty filters require Premium"
                  aria-describedby="difficulty-premium-tooltip"
                  onClick={() => setPremiumFiltersOpen(true)}
                  className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
                />
                <span
                  id="difficulty-premium-tooltip"
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 top-0 z-20 inline-flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-[calc(100%+0.4rem)] items-center gap-1.5 whitespace-normal rounded-md border border-[var(--coding-card-border)] bg-[var(--coding-card-background)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--coding-text-primary)] opacity-0 shadow-sm transition-opacity group-hover/filter-lock:opacity-100 group-focus-within/filter-lock:opacity-100"
                >
                  <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  Difficulty and topic filters are available with Premium.
                </span>
              </>
            )}
            </div>

            {/* Topic chips */}
            <div className={cn("group/filter-lock relative min-w-0", filtersDisabled && "cursor-pointer")}>
            <fieldset className="min-w-0 lg:border-l lg:border-[var(--coding-card-border)] lg:pl-6">
              <legend className="text-[11px] font-bold uppercase tracking-wider text-[var(--coding-text-secondary)]">
                Topic
              </legend>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedTopic("")}
                  disabled={filtersDisabled}
                  aria-pressed={selectedTopic === ""}
                  className={cn(
                    "h-9 px-3.5 rounded-lg border text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    filtersDisabled && "opacity-65 cursor-not-allowed",
                    selectedTopic === ""
                      ? "border-[var(--coding-selected-border)] bg-[var(--coding-selected-background)] text-[var(--coding-selected-foreground)] shadow-sm"
                      : "border-[var(--coding-card-border)] bg-[var(--coding-card-secondary)] text-[var(--coding-text-secondary)] hover:text-[var(--coding-text-primary)] hover:border-[var(--coding-violet)]/40"
                  )}
                >
                  All
                </button>
                {topics.map((t) => (
                  <button
                    key={t.topic}
                    type="button"
                    onClick={() =>
                      setSelectedTopic(t.topic === selectedTopic ? "" : t.topic)
                    }
                    disabled={filtersDisabled}
                    aria-pressed={selectedTopic === t.topic}
                    className={cn(
                      "h-9 px-3 sm:px-3.5 rounded-lg border text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer inline-flex items-center",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      filtersDisabled && "opacity-65 cursor-not-allowed",
                      selectedTopic === t.topic
                        ? "border-[var(--coding-selected-border)] bg-[var(--coding-selected-background)] text-[var(--coding-selected-foreground)] shadow-sm"
                        : "border-[var(--coding-card-border)] bg-[var(--coding-card-secondary)] text-[var(--coding-text-secondary)] hover:text-[var(--coding-text-primary)] hover:border-[var(--coding-violet)]/40"
                    )}
                  >
                    {t.topic}
                    <span className="ml-1.5 text-[10px] sm:text-[11px] opacity-70 tabular-nums">
                      {t.count}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
            {filtersDisabled && (
              <>
                <button
                  type="button"
                  aria-label="Topic filters require Premium"
                  aria-describedby="topic-premium-tooltip"
                  onClick={() => setPremiumFiltersOpen(true)}
                  className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
                />
                <span
                  id="topic-premium-tooltip"
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 top-0 z-20 inline-flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-[calc(100%+0.4rem)] items-center gap-1.5 whitespace-normal rounded-md border border-[var(--coding-card-border)] bg-[var(--coding-card-background)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--coding-text-primary)] opacity-0 shadow-sm transition-opacity group-hover/filter-lock:opacity-100 group-focus-within/filter-lock:opacity-100"
                >
                  <Lock className="h-3 w-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  Difficulty and topic filters are available with Premium.
                </span>
              </>
            )}
            </div>
          </div>
        </section>

        {/* ── Question list ──────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-2.5 sm:space-y-3" aria-busy="true" aria-label="Loading questions">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-[var(--coding-card-border)] bg-[var(--coding-card-background)] p-4 sm:p-5 flex items-center gap-4"
              >
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-lg bg-[var(--coding-card-secondary)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-2/3 rounded bg-[var(--coding-card-secondary)]" />
                  <div className="h-3.5 w-40 rounded bg-[var(--coding-card-secondary)]" />
                </div>
                <div className="h-6 w-16 rounded-md bg-[var(--coding-card-secondary)]" />
              </div>
            ))}
          </div>
        ) : shown.length > 0 ? (
          <ol className="space-y-2.5 sm:space-y-3">
            {shown.map((q, index) => {
              const diff = difficultyConfig[q.difficulty];
              return (
                <li key={q._id}>
                  <Link
                    href={`/coding/${q._id}`}
                    className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-[var(--coding-card-border)] bg-[var(--coding-card-background)] p-3.5 sm:p-4 shadow-[var(--coding-card-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--coding-violet)]/50 hover:shadow-[var(--coding-card-shadow-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coding-violet)]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--coding-number-background)] border border-[var(--coding-card-border)] text-sm sm:text-[15px] font-bold tabular-nums text-[var(--coding-number-foreground)]"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] sm:text-base leading-snug font-semibold text-[var(--coding-text-primary)] group-hover:text-[var(--coding-violet)] transition-colors">
                        {q.title}
                      </span>
                      <span className="mt-1 sm:mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-[13px] text-[var(--coding-text-secondary)]">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                          {q.topic}
                        </span>
                        <span aria-hidden="true" className="opacity-50">•</span>
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                          {q.source}
                        </span>
                      </span>
                    </span>
                    <span
                      className={cn(
                        "inline-flex h-6 sm:h-7 min-w-[4.25rem] shrink-0 items-center justify-center rounded-md border px-2 sm:px-2.5 text-[11px] sm:text-xs font-semibold",
                        diff.badge
                      )}
                    >
                      {diff.label}
                    </span>
                    <ChevronRight
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-[var(--coding-text-secondary)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--coding-violet)]"
                    />
                  </Link>
                </li>
              );
            })}

            {/* Premium unlock — integration point preserved */}
            {!isPremium && visible.length > 6 && (
              <li>
                <Link
                  href="/premium/payment"
                  onClick={() => {
                    trackEvent(AnalyticsEvents.PREMIUM_CTA_CLICK, {
                      source_page: "/coding",
                      cta_location: "content_list",
                      cta_text: "Upgrade to Premium",
                    });
                  }}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-2xl border border-violet-200 dark:border-violet-500/30 bg-[#FAF7FF] dark:bg-[#16122B] p-5 sm:p-6 transition-all duration-200 hover:border-violet-300 dark:hover:border-violet-500/50 hover:shadow-[0_10px_30px_rgba(109,40,217,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
                    <div
                      aria-hidden="true"
                      className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400"
                    >
                      <Crown className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300">
                        Premium
                      </p>
                      <h3 className="mt-0.5 text-base sm:text-lg font-bold text-[#1F1B2E] dark:text-[#F5F3FF]">
                        Unlock All Questions
                      </h3>
                      <p className="mt-0.5 text-xs sm:text-sm text-[#5B5470] dark:text-[#B9B3D6]">
                        Upgrade to Premium to access all coding questions and solutions.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex h-12 w-full sm:w-auto sm:min-w-44 items-center justify-center gap-2 rounded-xl bg-violet-600 dark:bg-violet-600 px-6 text-sm sm:text-[15px] font-bold text-white shadow-[0_6px_16px_rgba(109,40,217,0.35)] transition-colors group-hover:bg-violet-700 dark:group-hover:bg-violet-500">
                    Upgrade Now
                    <ChevronRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            )}
          </ol>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--coding-card-border)] bg-[var(--coding-card-background)] py-12 sm:py-16 px-6 text-center">
            <Code2
              aria-hidden="true"
              className="mx-auto h-12 w-12 text-[var(--coding-text-secondary)] opacity-50"
            />
            <h2 className="mt-4 text-base sm:text-lg font-bold text-[var(--coding-text-primary)]">
              No questions found
            </h2>
            <p className="mt-1 text-sm text-[var(--coding-text-secondary)]">
              {query.trim()
                ? `Nothing matches “${query.trim()}”. Try a different search.`
                : "Try adjusting your filters."}
            </p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[var(--coding-card-border)] bg-[var(--coding-card-secondary)] px-4 py-2.5 text-sm font-semibold text-[var(--coding-text-primary)] transition-colors hover:border-[var(--coding-violet)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
