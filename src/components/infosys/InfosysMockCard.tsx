"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, BarChart3, Lock, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { startAttempt } from "@/lib/api/exam";
import { getErrorStatus, getErrorCode } from "@/lib/api/errors";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import type { Test } from "@/lib/api/types";
import type { InfosysMockTestConfig } from "@/lib/infosys-2027-mocks";

const ICONS = {
  "bar-chart-3": BarChart3,
} as const;

interface InfosysMockCardProps {
  test: Test;
  config: InfosysMockTestConfig;
  locked?: boolean;
}

function questionsOf(test: Test): number {
  if (typeof test.totalQuestions === "number" && test.totalQuestions > 0) {
    return test.totalQuestions;
  }
  return Array.isArray(test.questions) ? test.questions.length : 0;
}

function minutesOf(test: Test): number {
  return Math.max(1, Math.round((test.duration ?? 0) / 60));
}

/** Infosys-branded mock card — metadata always derived from live backend data. */
export default function InfosysMockCard({ test, config, locked = false }: InfosysMockCardProps) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const Icon = ICONS[config.icon] ?? BarChart3;
  const questions = questionsOf(test);
  const minutes = minutesOf(test);

  // Creates (or resumes) the attempt through the existing API client, then
  // hands off to the existing /exam/[testId] test-taking interface.
  // Idempotent: an in-progress attempt is resumed server-side instead of duplicated.
  const handleStart = async () => {
    if (starting) return;
    setStarting(true);
    try {
      const attempt = await startAttempt(test._id);
      trackEvent(AnalyticsEvents.INFOSYS_MOCK_START, {
        campaign_id: "infosys_se_2027",
        test_id: test._id,
        attempt_id: attempt._id,
      });
      router.push(`/exam/${test._id}`);
      // Keep the CTA disabled while the navigation completes.
    } catch (err) {
      const status = getErrorStatus(err);
      const code = getErrorCode(err);
      if (status === 403 || code === "PREMIUM_REQUIRED") {
        toast.error("This mock test is available with Premium membership.");
        router.push("/premium/payment");
        return;
      }
      if (status !== 401) {
        // 401 is handled globally by the axios interceptor (silent refresh / login redirect).
        toast.error("Couldn't start the test. Please try again.");
      }
      setStarting(false);
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border",
        "border-[#E8E5E0] bg-white text-[#171717] shadow-[0_8px_24px_rgba(23,23,23,0.06)]",
        "p-5 pl-6 sm:p-6 sm:pl-7 transition-[border-color,box-shadow,transform] duration-300 ease-out motion-reduce:transition-none",
        "hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-[0_14px_34px_rgba(23,23,23,0.10)]",
        "dark:border-[#262D45] dark:bg-[#10172A] dark:text-[#F8FAFC] dark:shadow-[0_12px_30px_rgba(0,0,0,0.24)] dark:hover:border-violet-500/60 dark:hover:shadow-[0_16px_38px_rgba(0,0,0,0.32)]"
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-1.5 flex-col"
      >
        <span className="h-1/3 bg-[#6C42F5] dark:bg-[#7028FF]" />
        <span className="h-1/3 bg-[#06B6D4] dark:bg-[#00C8FF]" />
        <span className="h-1/3 bg-[#FF6B45] dark:bg-[#FF6B35]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] sm:block"
      >
        <div className="absolute inset-y-0 right-0 w-full bg-[repeating-linear-gradient(135deg,transparent_0_16px,rgba(108,66,245,0.07)_16px_18px,transparent_18px_32px)] dark:hidden" />
        <div className="absolute -right-10 -top-20 h-56 w-16 rotate-35 bg-[#7028FF]/10 dark:bg-[#7028FF]/20" />
        <div className="absolute right-8 top-1/4 h-56 w-10 rotate-35 bg-[#00C8FF]/12 dark:bg-[#00C8FF]/20" />
        <div className="absolute right-20 -bottom-24 h-56 w-9 rotate-35 bg-[#FF6B35]/12 dark:bg-[#FF6B35]/20" />
      </div>

      {/* Header: icon + free/premium badge */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border border-[#E8E1FF] bg-[#F5F3FF] text-[#6C42F5] dark:border-[#3B3159] dark:bg-[#211A36] dark:text-[#B79CFF]">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
        </div>
        {locked ? (
          <Badge className="inline-flex items-center gap-1 border border-[#F6C94D]/50 bg-[#FFF8DF] text-[#795A00] dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300">
            <Lock className="h-3 w-3" aria-hidden="true" /> Premium
          </Badge>
        ) : test.isPremium ? (
          <Badge className="inline-flex items-center gap-1 border border-[#F6C94D]/50 bg-[#FFF8DF] text-[#795A00] dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300">
            <Crown className="h-3 w-3" aria-hidden="true" /> Premium
          </Badge>
        ) : (
          <Badge className="border border-[#2BBF9B]/35 bg-[#E9F8F3] text-[#16785F] dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300">
            Free
          </Badge>
        )}
      </div>

      {/* Title + description */}
      <h2 className="relative mt-4 text-base sm:text-lg font-extrabold leading-snug tracking-tight text-[#171717] dark:text-[#F8FAFC]">
        {config.displayTitle}
      </h2>
      <p className="relative mt-1.5 text-[11px] sm:text-xs leading-relaxed text-[#646464] dark:text-[#A5B4CC]">
        {config.description}
      </p>

      {/* Metadata badges */}
      <div className="relative mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        {[
          `${questions} Questions`,
          `${minutes} Minutes`,
          ...config.tags,
        ].map((label) => (
          <span
            key={label}
            className="rounded-md border border-[#E8E5E0] bg-[#FAFAFA] px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-[#454545] dark:border-[#303951] dark:bg-[#151E34] dark:text-[#D3DCEE]"
          >
            {label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="relative mt-5 flex-1" />
      {locked ? (
        <Button
          size="lg"
          className={cn(
            "relative h-11 min-h-11 sm:h-12 w-full sm:w-auto rounded-lg font-bold text-white transition-colors",
            "bg-[#D97706] hover:bg-[#B45309] dark:bg-linear-to-r dark:from-amber-500 dark:to-orange-600 dark:hover:from-amber-600 dark:hover:to-orange-700",
            "focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-amber-400"
          )}
          render={<Link href="/premium/payment" />}
        >
          Unlock Premium Test
          <ArrowRight
            className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Button>
      ) : (
        <Button
          size="lg"
          disabled={starting}
          onClick={handleStart}
          aria-busy={starting}
          className={cn(
            "relative h-11 min-h-11 sm:h-12 w-full sm:w-auto rounded-lg font-bold text-white transition-colors",
            "bg-[#6C42F5] hover:bg-[#5730D8] dark:bg-linear-to-r dark:from-[#7028FF] dark:to-[#4C58E8] dark:hover:from-[#833EFF] dark:hover:to-[#5868FF]",
            "dark:hover:shadow-[0_0_18px_rgba(112,40,255,0.22)]",
            "disabled:opacity-80 disabled:hover:translate-y-0",
            "focus-visible:ring-2 focus-visible:ring-[#6C42F5] focus-visible:ring-offset-2 dark:focus-visible:ring-[#00C8FF]"
          )}
        >
          {starting ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" />
              Starting…
            </>
          ) : (
            <>
              {test.isPremium ? "Start Premium Test" : "Start Free Test"}
              <ArrowRight
                className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </Button>
      )}
    </article>
  );
}
