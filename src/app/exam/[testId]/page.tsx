"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Monitor, AlertTriangle, Clock, Eye, Pause, Play, Send } from "lucide-react";
import ExamTopBar from "@/components/exam/ExamTopBar";
import QuestionPanel from "@/components/exam/QuestionPanel";
import QuestionPalette from "@/components/exam/QuestionPalette";
import SectionPanel from "@/components/exam/SectionPanel";
import { Button } from "@/components/ui/button";
import { useTestStore } from "@/stores/test-store";
import {
  startAttempt,
  getAttemptState,
  submitAttempt,
  recordTabSwitch,
} from "@/lib/api/exam";
import type { Section } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const {
    attemptId,
    questions,
    timer,
    currentQuestionIndex,
    isSubmitted,
    isPaused,
    tabSwitchCount,
    testTitle,
    initTest,
    decrementTimer,
    togglePause,
    setSubmitted,
    incrementTabSwitch,
    resetTest,
  } = useTestStore();

  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const handleSubmit = useCallback(async () => {
    if (isSubmitted || !attemptId) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);

    try {
      await submitAttempt(attemptId);
      setSubmitted();
      // Small delay so the user sees the success state of the animation
      await new Promise((r) => setTimeout(r, 1800));
      // Navigate to results — if opened in new window, open results in opener and close
      if (window.opener && !window.opener.closed) {
        window.opener.location.href = `/results/${attemptId}`;
        window.close();
      } else {
        router.push(`/results/${attemptId}`);
      }
    } catch (err) {
      setSubmitting(false);
      // Restart timer if submit failed so user can retry
      if (!isPaused && questions.length > 0) {
        timerRef.current = setInterval(() => {
          decrementTimer();
        }, 1000);
      }
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        toast.error(
          "Session expired. Your answers are saved locally. Please login in a new tab and come back to retry.",
          { duration: 10000 }
        );
      } else {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || "Failed to submit test. Please try again.";
        toast.error(message);
      }
    }
  }, [isSubmitted, attemptId, setSubmitted, router, isPaused, questions.length, decrementTimer]);

  // Called on "Start Test" button click (user gesture → fullscreen works)
  const handleStartTest = async () => {
    // Enter fullscreen immediately on user click
    const el = document.documentElement;
    if (el.requestFullscreen && !document.fullscreenElement) {
      try {
        await el.requestFullscreen();
      } catch {
        // Fullscreen denied — continue anyway
      }
    }

    setStarted(true);
    setLoading(true);
    resetTest();

    try {
      // Always start a fresh attempt
      const attempt = await startAttempt(testId, true);

      // Get the full attempt state with populated questions
      const state = await getAttemptState(attempt._id);

      // Build sections from questions
      const sectionMap = new Map<
        Section,
        { startIndex: number; endIndex: number }
      >();
      const questions = state.responses.map((r) => r.question);
      questions.forEach((q, i) => {
        const existing = sectionMap.get(q.section);
        if (!existing) {
          sectionMap.set(q.section, { startIndex: i, endIndex: i });
        } else {
          existing.endIndex = i;
        }
      });
      const sections = Array.from(sectionMap.entries()).map(
        ([name, range]) => ({
          name,
          ...range,
        })
      );

      initTest({
        attemptId: attempt._id,
        testId: state.test._id,
        testTitle: state.test.title,
        questions,
        duration: state.duration,
        sections,
        sectionLocked: state.test.sectionLocked ?? false,
      });
    } catch {
      setError("Failed to load test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Timer — pauses when isPaused is true
  useEffect(() => {
    if (loading || !started || isSubmitted || isPaused || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, started, isSubmitted, isPaused, questions.length, decrementTimer]);

  // Auto-submit and warnings
  useEffect(() => {
    if (timer === 0 && questions.length > 0 && !isSubmitted) {
      toast.error("Time is up! Auto-submitting your test.");
      handleSubmit();
    }
    if (timer === 300 && !isSubmitted) {
      toast.warning("5 minutes remaining!", { duration: 5000 });
    }
    if (timer === 60 && !isSubmitted) {
      toast.error("1 minute remaining!", { duration: 5000 });
    }
  }, [timer, questions.length, isSubmitted, handleSubmit]);

  // Tab switch detection
  useEffect(() => {
    if (!started || !attemptId) return;

    function handleVisibilityChange() {
      if (document.hidden && !isSubmitted && attemptId) {
        incrementTabSwitch();
        recordTabSwitch(attemptId).catch(() => {});
        toast.warning(
          `Tab switch detected! (${tabSwitchCount + 1} time${tabSwitchCount > 0 ? "s" : ""})`,
          { duration: 3000 }
        );
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [started, isSubmitted, incrementTabSwitch, tabSwitchCount, attemptId]);

  // Wake Lock — prevent screen from sleeping during the test
  useEffect(() => {
    if (!started || isSubmitted) return;

    let active = true;

    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Wake Lock request failed (e.g. low battery) — continue without it
      }
    }

    requestWakeLock();

    // Re-acquire wake lock when tab becomes visible again (browsers release it on hide)
    function handleVisibilityForWakeLock() {
      if (document.visibilityState === "visible" && active) {
        requestWakeLock();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityForWakeLock);

    return () => {
      active = false;
      document.removeEventListener("visibilitychange", handleVisibilityForWakeLock);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [started, isSubmitted]);

  // Exit fullscreen on submit or unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // ---------- Pre-start screen ----------
  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-950">
        <div className="max-w-lg w-full mx-4 p-8 rounded-2xl border border-border bg-white dark:bg-gray-900 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <Monitor className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold">Ready to Begin?</h1>
            <p className="text-muted-foreground text-sm">
              The test will start in fullscreen mode
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-300">Do not switch tabs</p>
                <p className="text-amber-700 dark:text-amber-400/80">Tab switches will be recorded and flagged.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-300">Timer starts immediately</p>
                <p className="text-blue-700 dark:text-blue-400/80">The countdown begins as soon as you start.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-purple-800 dark:text-purple-300">Fullscreen required</p>
                <p className="text-purple-700 dark:text-purple-400/80">The test will enter fullscreen mode automatically.</p>
              </div>
            </div>
          </div>

          <Button
            className="w-full h-12 text-base font-semibold cursor-pointer"
            onClick={handleStartTest}
          >
            Start Test
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => router.push("/tests")}>Back to Tests</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-gray-950 relative">
      <ExamTopBar testTitle={testTitle || "TCS NQT Test"} onSubmit={handleSubmit} />
      <SectionPanel />
      <div className="flex flex-1 min-h-0">
        {/* Question area — takes remaining space */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <QuestionPanel onSubmitTest={handleSubmit} />
        </div>

        {/* Toggle palette on mobile */}
        <button
          onClick={() => setShowPalette(!showPalette)}
          className="md:hidden fixed bottom-20 right-4 z-40 bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900 text-xs font-bold transition-all active:scale-90 hover:bg-indigo-700"
        >
          {showPalette ? "\u2715" : "#"}
        </button>

        {/* Palette — fixed width, no overlap */}
        <div
          className={cn(
            "shrink-0",
            showPalette ? "block" : "hidden",
            "md:block",
            "max-md:fixed max-md:right-0 max-md:top-0 max-md:h-full max-md:z-30 max-md:shadow-xl"
          )}
        >
          <QuestionPalette />
        </div>
      </div>

      {/* Submitting overlay */}
      {submitting && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
          <div className="text-center space-y-8 animate-[fadeIn_0.3s_ease-out]">
            {/* Animated rings */}
            <div className="relative mx-auto w-28 h-28">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-900/50" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 dark:border-t-indigo-400 animate-spin" />
              {/* Middle ring */}
              <div className="absolute inset-3 rounded-full border-4 border-indigo-50 dark:border-indigo-900/30" />
              <div
                className="absolute inset-3 rounded-full border-4 border-transparent border-t-blue-500 dark:border-t-blue-400"
                style={{ animation: "spin 1.2s linear infinite reverse" }}
              />
              {/* Inner ring */}
              <div className="absolute inset-6 rounded-full border-4 border-indigo-50 dark:border-indigo-900/20" />
              <div
                className="absolute inset-6 rounded-full border-4 border-transparent border-t-violet-500 dark:border-t-violet-400"
                style={{ animation: "spin 0.8s linear infinite" }}
              />
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Send className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Submitting Your Test</h2>
              <p className="text-muted-foreground text-sm">Calculating your results...</p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-indigo-500 dark:bg-indigo-400"
                  style={{
                    animation: "pulse 1.4s ease-in-out infinite",
                    animationDelay: `${i * 0.15}s`,
                    opacity: 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pause overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/90 backdrop-blur-md">
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <Pause className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Test Paused</h2>
              <p className="text-muted-foreground">The timer has been paused. Your progress is saved.</p>
            </div>
            <Button
              size="lg"
              onClick={togglePause}
              className="px-8 font-semibold cursor-pointer"
            >
              <Play className="h-4 w-4 mr-2" />
              Resume Test
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
