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
      const result = await submitAttempt(attemptId);
      router.push(`/results/${attemptId}`);
    } catch {
      toast.error("Failed to submit test. Please try again.");
    }
  }, [isSubmitted, attemptId, setSubmitted, router]);

  // Load test
  useEffect(() => {
    async function load() {
      setLoading(true);
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

  // Fullscreen suggestion
  useEffect(() => {
    if (!loading && questions.length > 0) {
      toast.info("For the best experience, press F11 for fullscreen", {
        duration: 5000,
      });
    }
  }, [loading, questions.length]);

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
    <div className="flex flex-col h-screen">
      <ExamTopBar testTitle={testTitle || "TCS NQT Test"} onSubmit={handleSubmit} />
      <SectionPanel />
      <div className="flex flex-1 overflow-hidden">
        <QuestionPanel />
        {/* Toggle palette on mobile */}
        <button
          onClick={() => setShowPalette(!showPalette)}
          className="md:hidden fixed bottom-20 right-4 z-40 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center shadow-lg text-xs font-bold"
        >
          {showPalette ? "X" : "#"}
        </button>
        <div
          className={`${showPalette ? "block" : "hidden"} md:block fixed md:relative right-0 top-0 md:top-auto h-full z-30 md:z-auto`}
        >
          <QuestionPalette />
        </div>
      </div>
    </div>
  );
}
