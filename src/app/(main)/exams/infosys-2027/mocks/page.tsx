"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ListChecks,
  FolderOpen,
  BadgeCheck,
  Crown,
  BarChart3,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { fetchInfosysMocks } from "@/lib/api/tests";
import type { Test } from "@/lib/api/types";
import { useAuthStore } from "@/stores/auth-store";
import { INFOSYS_MOCK_TESTS } from "@/lib/infosys-2027-mocks";
import InfosysMockCard from "@/components/infosys/InfosysMockCard";

interface LoadedMock {
  test: Test;
  configIndex: number;
}

function questionsOf(test: Test): number {
  if (typeof test.totalQuestions === "number" && test.totalQuestions > 0) {
    return test.totalQuestions;
  }
  return Array.isArray(test.questions) ? test.questions.length : 0;
}

export default function InfosysMocksPage() {
  const { user } = useAuthStore();
  const [mocks, setMocks] = useState<LoadedMock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Fetch only the four Infosys SE 2027 mock tests via the dedicated
        // backend endpoint — avoids downloading the full test collection.
        const tests = await fetchInfosysMocks();
        const byId = new Map<string, Test>(tests.map((t) => [t._id, t]));
        const loaded: LoadedMock[] = [];
        INFOSYS_MOCK_TESTS.forEach((config, configIndex) => {
          const test = byId.get(config.id);
          if (test) {
            loaded.push({ test, configIndex });
          }
        });
        if (cancelled) return;
        setMocks(loaded);
        setFailed(loaded.length === 0);
        setIsLoading(false);
      } catch {
        if (cancelled) return;
        setMocks([]);
        setFailed(true);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setFailed(false);
    setReloadKey((k) => k + 1);
  };

  const totalQuestions = mocks.reduce((sum, { test }) => sum + questionsOf(test), 0);
  const freeCount = mocks.filter(({ test }) => !test.isPremium).length;
  const premiumCount = mocks.filter(({ test }) => test.isPremium).length;

  const stats = [
    { icon: BarChart3, label: "Available Mock Tests", value: mocks.length },
    { icon: ListChecks, label: "Total Questions", value: totalQuestions },
    { icon: FolderOpen, label: "Free Tests", value: freeCount },
    { icon: Crown, label: "Premium Tests", value: premiumCount },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              href="/infosys-se-2027"
              className="hover:text-foreground transition-colors"
            >
              Infosys Hiring 2027
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li aria-current="page" className="font-semibold text-foreground">
            Mock Tests
          </li>
        </ol>
      </nav>

      {/* Compact header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Image
          src="/logos/infosys.webp"
          alt="Infosys logo"
          width={44}
          height={44}
          className="h-11 w-11 sm:h-14 sm:w-14 shrink-0 rounded-xl border border-blue-500/25 bg-white object-contain p-1"
          priority
        />
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Infosys 2027 Mock Tests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a mock test and evaluate your preparation.
          </p>
        </div>
      </div>

      {/* Compact stats */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
        aria-label="Catalog statistics"
      >
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-2 sm:gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 sm:px-4 sm:py-3"
          >
            <Icon
              className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-blue-500"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-base sm:text-xl font-extrabold leading-none tabular-nums text-foreground">
                {isLoading ? "–" : value}
              </p>
              <p className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-tight">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Catalog */}
      {isLoading ? (
        <div
          className="grid gap-4 sm:gap-5 md:grid-cols-2"
          aria-busy="true"
          aria-label="Loading mock tests"
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-blue-500/20 bg-card p-5 sm:p-6"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-muted animate-pulse" />
                <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
              </div>
              <div className="mt-4 h-5 w-3/4 rounded-md bg-muted animate-pulse" />
              <div className="mt-2 h-3.5 w-full rounded-md bg-muted/80 animate-pulse" />
              <div className="mt-1.5 h-3.5 w-2/3 rounded-md bg-muted/80 animate-pulse" />
              <div className="mt-4 flex gap-1.5">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="h-6 w-16 rounded-md bg-muted animate-pulse" />
                ))}
              </div>
              <div className="mt-5 h-11 sm:h-12 w-full sm:w-40 rounded-xl bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      ) : mocks.length > 0 ? (
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {mocks.map(({ test, configIndex }) => {
            const config = INFOSYS_MOCK_TESTS[configIndex];
            const locked = !!test.isPremium && !user?.isPremium;
            return (
              <InfosysMockCard
                key={test._id}
                test={test}
                config={config}
                locked={locked}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/70 bg-card p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-3 text-base font-bold">
            {failed ? "Couldn't load mock tests" : "No mock tests available yet"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            {failed
              ? "Please check your connection and try again."
              : "More Infosys 2027 mocks will appear here as they are released."}
          </p>
          {failed && (
            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry
            </button>
          )}
        </div>
      )}

      {/* Footer link — information stays on the dedicated recruitment page */}
      <div className="rounded-2xl border border-border/60 bg-card/60 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-bold text-foreground">
            Looking for eligibility, exam pattern and salary?
          </p>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground">
            Recruitment details live on the Infosys 2027 page — we keep this catalog test-only.
          </p>
        </div>
        <Link
          href="/infosys-se-2027"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-2.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-300 hover:bg-blue-500/15 transition-colors"
        >
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
          Recruitment details
        </Link>
      </div>
    </div>
  );
}
