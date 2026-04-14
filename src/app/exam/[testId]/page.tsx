"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
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
    tabSwitchCount,
    testTitle,
    initTest,
    decrementTimer,
    setSubmitted,
    incrementTabSwitch,
    resetTest,
  } = useTestStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleSubmit = useCallback(async () => {
    if (isSubmitted || !attemptId) return;

    setSubmitted();
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      await submitAttempt(attemptId);
      // Navigate to results — if opened in new window, open results in opener and close
      if (window.opener && !window.opener.closed) {
        window.opener.location.href = `/results/${attemptId}`;
        window.close();
      } else {
        router.push(`/results/${attemptId}`);
      }
    } catch {
      toast.error("Failed to submit test. Please try again.");
    }
  }, [isSubmitted, attemptId, setSubmitted, router]);

  // Load test
  useEffect(() => {
    async function load() {
      setLoading(true);
      // Clear any previous test state
      resetTest();
      try {
        // Start a new attempt
        const attempt = await startAttempt(testId);

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

        // Map attempt responses to store response format
        const responses = state.responses.map((r) => ({
          selectedAnswer: r.selectedAnswer,
          status: r.status,
          timeSpent: r.timeSpent,
        }));

        initTest({
          attemptId: attempt._id,
          testId: state.test._id,
          testTitle: state.test.title,
          questions,
          duration: state.duration,
          sections,
          responses,
          currentQuestion: state.currentQuestion,
          tabSwitchCount: state.tabSwitchCount,
          sectionLocked: state.test.sectionLocked ?? false,
        });
      } catch {
        setError("Failed to load test. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  // Timer
  useEffect(() => {
    if (loading || isSubmitted || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, isSubmitted, questions.length, decrementTimer]);

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
  }, [isSubmitted, incrementTabSwitch, tabSwitchCount, attemptId]);

  // Auto fullscreen on test load
  useEffect(() => {
    if (!loading && questions.length > 0 && !isSubmitted) {
      const el = document.documentElement;
      if (el.requestFullscreen && !document.fullscreenElement) {
        el.requestFullscreen().catch(() => {
          // Fullscreen blocked by browser — show fallback
          toast.info("Press F11 for fullscreen mode", { duration: 4000 });
        });
      }
    }

    // Exit fullscreen on cleanup (test submit or unmount)
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [loading, questions.length, isSubmitted]);

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
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-gray-950">
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
          className="md:hidden fixed bottom-20 right-4 z-40 bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg shadow-indigo-200 text-xs font-bold transition-all active:scale-90 hover:bg-indigo-700"
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
    </div>
  );
}
