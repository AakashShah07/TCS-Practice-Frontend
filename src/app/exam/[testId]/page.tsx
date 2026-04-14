"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ExamTopBar from "@/components/exam/ExamTopBar";
import QuestionPanel from "@/components/exam/QuestionPanel";
import QuestionPalette from "@/components/exam/QuestionPalette";
import SectionPanel from "@/components/exam/SectionPanel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTestStore } from "@/stores/test-store";
import { startExam, submitExam } from "@/lib/api/exam";
import type { Section } from "@/lib/api/types";

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const {
    questions,
    timer,
    answers,
    startedAt,
    currentQuestionIndex,
    isSubmitted,
    tabSwitchCount,
    initTest,
    decrementTimer,
    setSubmitted,
    incrementTabSwitch,
    updateTimeSpent,
    loadFromLocalStorage,
    resetTest,
  } = useTestStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [showPalette, setShowPalette] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionTimeRef = useRef<number>(Date.now());

  const handleSubmit = useCallback(async () => {
    if (isSubmitted) return;

    // Track time on current question
    const currentQ = questions[currentQuestionIndex];
    if (currentQ) {
      const elapsed = Math.floor((Date.now() - questionTimeRef.current) / 1000);
      updateTimeSpent(currentQ.id, elapsed);
    }

    setSubmitted();
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const currentAnswers = useTestStore.getState().answers;
      const result = await submitExam({
        testId,
        answers: currentAnswers,
        totalTimeTaken:
          useTestStore.getState().totalDuration -
          useTestStore.getState().timer,
        startedAt: startedAt || new Date().toISOString(),
        submittedAt: new Date().toISOString(),
      });
      router.push(`/results/${result.id}`);
    } catch {
      toast.error("Failed to submit test. Please try again.");
    }
  }, [
    isSubmitted,
    questions,
    currentQuestionIndex,
    testId,
    startedAt,
    setSubmitted,
    updateTimeSpent,
    router,
  ]);

  // Load test
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Check for saved state
        const hasSaved = loadFromLocalStorage(testId);
        if (hasSaved) {
          setShowResume(true);
          setLoading(false);
          return;
        }

        const test = await startExam(testId);

        // Build sections
        const sectionMap = new Map<
          Section,
          { startIndex: number; endIndex: number }
        >();
        test.questions.forEach((q, i) => {
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

        initTest(testId, test.questions, test.duration, sections);
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
    if (loading || showResume || isSubmitted || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, showResume, isSubmitted, questions.length, decrementTimer]);

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

  // Track time per question
  useEffect(() => {
    const prevTime = questionTimeRef.current;
    questionTimeRef.current = Date.now();

    return () => {
      const currentQ = questions[currentQuestionIndex];
      if (currentQ) {
        const elapsed = Math.floor((Date.now() - prevTime) / 1000);
        if (elapsed > 0) updateTimeSpent(currentQ.id, elapsed);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  // Tab switch detection
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden && !isSubmitted) {
        incrementTabSwitch();
        toast.warning(
          `Tab switch detected! (${tabSwitchCount + 1} time${tabSwitchCount > 0 ? "s" : ""})`,
          { duration: 3000 }
        );
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isSubmitted, incrementTabSwitch, tabSwitchCount]);

  // Fullscreen suggestion
  useEffect(() => {
    if (!loading && !showResume && questions.length > 0) {
      toast.info("For the best experience, press F11 for fullscreen", {
        duration: 5000,
      });
    }
  }, [loading, showResume, questions.length]);

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

  // Resume dialog
  if (showResume) {
    return (
      <Dialog open onOpenChange={() => {}}>
        <DialogContent className="[&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Resume Test?</DialogTitle>
            <DialogDescription>
              You have a previously saved test session. Would you like to resume
              or start fresh?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetTest();
                localStorage.removeItem(`test_state_${testId}`);
                setShowResume(false);
                setLoading(true);
                // Re-trigger load
                window.location.reload();
              }}
            >
              Start Fresh
            </Button>
            <Button
              onClick={async () => {
                // Need to load questions from API but keep saved state
                try {
                  const test = await startExam(testId);
                  const sectionMap = new Map<
                    Section,
                    { startIndex: number; endIndex: number }
                  >();
                  test.questions.forEach((q, i) => {
                    const existing = sectionMap.get(q.section);
                    if (!existing) {
                      sectionMap.set(q.section, {
                        startIndex: i,
                        endIndex: i,
                      });
                    } else {
                      existing.endIndex = i;
                    }
                  });
                  const sections = Array.from(sectionMap.entries()).map(
                    ([name, range]) => ({ name, ...range })
                  );

                  // Set questions and sections but keep saved progress
                  useTestStore.setState({
                    testId,
                    questions: test.questions,
                    sections,
                  });
                  loadFromLocalStorage(testId);
                } catch {
                  toast.error("Failed to load test questions.");
                }
                setShowResume(false);
              }}
            >
              Resume Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <ExamTopBar testTitle="TCS NQT Test" onSubmit={handleSubmit} />
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
