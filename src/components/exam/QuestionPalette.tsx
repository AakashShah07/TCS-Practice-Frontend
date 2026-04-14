"use client";

import { Bookmark } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTestStore } from "@/stores/test-store";
import { navigate } from "@/lib/api/exam";
import { cn } from "@/lib/utils";

const sectionLabels: Record<string, string> = {
  numerical: "Numerical",
  reasoning: "Reasoning",
  verbal: "Verbal",
  advanced: "Advanced",
};

export default function QuestionPalette() {
  const {
    attemptId,
    questions,
    currentQuestionIndex,
    currentSection,
    responses,
    sections,
    goToQuestion,
    getStatus,
  } = useTestStore();

  // Get current section range
  const currentSectionInfo = sections.find((s) => s.name === currentSection);
  const sectionStart = currentSectionInfo?.startIndex ?? 0;
  const sectionEnd = currentSectionInfo?.endIndex ?? questions.length - 1;

  // Only show questions for the current section
  const sectionIndices: number[] = [];
  for (let i = sectionStart; i <= sectionEnd; i++) {
    sectionIndices.push(i);
  }

  const sectionResponses = responses.slice(sectionStart, sectionEnd + 1);
  const sectionAnswered = sectionResponses.filter((r) => r.status === "answered").length;
  const sectionNotAnswered = sectionResponses.filter((r) => r.status === "not_answered").length;
  const sectionNotVisited = sectionResponses.filter((r) => r.status === "not_visited").length;
  const sectionMarked = sectionResponses.filter((r) => r.status === "marked_for_review").length;
  const sectionTotal = sectionIndices.length;

  const progressPercent = sectionTotal > 0 ? (sectionAnswered / sectionTotal) * 100 : 0;

  const statusStyles: Record<string, string> = {
    answered: "bg-emerald-500 text-white hover:bg-emerald-600",
    not_answered: "bg-rose-500 text-white hover:bg-rose-600",
    not_visited: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700",
    marked_for_review: "bg-amber-400 text-amber-950 hover:bg-amber-500",
  };

  function handleGoToQuestion(index: number) {
    const timeSpent = goToQuestion(index);
    if (attemptId) {
      navigate(attemptId, index, currentQuestionIndex, timeSpent, questions[index]?.section).catch(() => {});
    }
  }

  return (
    <div className="w-60 flex flex-col h-full overflow-hidden border-l bg-white dark:bg-slate-950">
      {/* Header with section name + progress */}
      <div className="px-3 pt-3 pb-2 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">
            {sectionLabels[currentSection] || currentSection}
          </h3>
          <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
            {sectionAnswered}/{sectionTotal}
          </span>
        </div>
        <Progress value={progressPercent} className="h-1 [&>div]:bg-indigo-500" />
      </div>

      {/* Legend — single row */}
      <div className="px-3 py-2 border-b flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
          {sectionAnswered}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
          {sectionNotAnswered}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-slate-700" />
          {sectionNotVisited}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
          {sectionMarked}
        </span>
      </div>

      {/* Flagged in this section */}
      {sectionMarked > 0 && (
        <div className="px-3 py-2 border-b bg-amber-50/60 dark:bg-amber-950/20">
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-1.5">
            <Bookmark className="h-3 w-3" />
            Flagged ({sectionMarked})
          </div>
          <div className="flex flex-wrap gap-1">
            {sectionIndices
              .filter((i) => responses[i]?.status === "marked_for_review")
              .map((i) => (
                <button
                  key={i}
                  onClick={() => handleGoToQuestion(i)}
                  className={cn(
                    "w-7 h-7 rounded-md text-[10px] font-bold bg-amber-400 text-amber-950 hover:bg-amber-500 transition-all active:scale-90",
                    i === currentQuestionIndex && "ring-2 ring-indigo-600 ring-offset-1"
                  )}
                >
                  {i - sectionStart + 1}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Question Grid — only current section */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-5 gap-1.5">
          {sectionIndices.map((globalIndex) => {
            const status = getStatus(globalIndex);
            const isCurrent = globalIndex === currentQuestionIndex;
            const displayNum = globalIndex - sectionStart + 1;

            return (
              <button
                key={globalIndex}
                onClick={() => handleGoToQuestion(globalIndex)}
                className={cn(
                  "w-full aspect-square rounded-md text-[11px] font-bold transition-all duration-150",
                  "hover:scale-105 active:scale-95",
                  statusStyles[status] || statusStyles.not_visited,
                  isCurrent && "ring-2 ring-indigo-600 dark:ring-indigo-400 ring-offset-1 scale-110"
                )}
              >
                {displayNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer legend */}
      <div className="px-3 py-2 border-t bg-slate-50 dark:bg-slate-900 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-emerald-500" /> Answered
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-rose-500" /> Not Answered
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-slate-200 dark:bg-slate-700" /> Not Visited
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-amber-400" /> Flagged
        </span>
      </div>
    </div>
  );
}
