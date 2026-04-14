"use client";

import { useTestStore } from "@/stores/test-store";
import { navigate } from "@/lib/api/exam";
import { cn } from "@/lib/utils";

export default function QuestionPalette() {
  const {
    attemptId,
    questions,
    currentQuestionIndex,
    responses,
    goToQuestion,
    getStatus,
  } = useTestStore();

  const statusStyles: Record<string, string> = {
    answered: "bg-green-500 text-white hover:bg-green-600",
    not_answered: "bg-red-500 text-white hover:bg-red-600",
    not_visited: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    marked_for_review: "bg-yellow-400 text-yellow-900 hover:bg-yellow-500",
  };

  const answeredCount = responses.filter((r) => r.status === "answered").length;
  const notAnsweredCount = responses.filter((r) => r.status === "not_answered").length;
  const notVisitedCount = responses.filter((r) => r.status === "not_visited").length;
  const markedCount = responses.filter((r) => r.status === "marked_for_review").length;

  function handleGoToQuestion(index: number) {
    const timeSpent = goToQuestion(index);
    if (attemptId) {
      navigate(attemptId, index, currentQuestionIndex, timeSpent, questions[index]?.section).catch(() => {});
    }
  }

  return (
    <div className="w-64 border-l bg-background flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">Question Palette</h3>
      </div>

      {/* Legend */}
      <div className="p-3 border-b space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-green-500" />
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-red-500" />
          <span>Not Answered ({notAnsweredCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-gray-200 border" />
          <span>Not Visited ({notVisitedCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-yellow-400" />
          <span>Marked for Review ({markedCount})</span>
        </div>
      </div>

      {/* Question Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-5 gap-1.5">
          {questions.map((_, index) => {
            const status = getStatus(index);
            const isCurrent = index === currentQuestionIndex;

            return (
              <button
                key={index}
                onClick={() => handleGoToQuestion(index)}
                className={cn(
                  "w-9 h-9 rounded text-xs font-medium transition-all",
                  statusStyles[status] || statusStyles.not_visited,
                  isCurrent && "ring-2 ring-primary ring-offset-1"
                )}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
