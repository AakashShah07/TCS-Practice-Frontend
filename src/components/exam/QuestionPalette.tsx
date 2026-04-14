"use client";

import { useTestStore } from "@/stores/test-store";
import { cn } from "@/lib/utils";

export default function QuestionPalette() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    visited,
    markedForReview,
    goToQuestion,
  } = useTestStore();

  function getStatus(index: number) {
    const q = questions[index];
    if (!q) return "not-visited";
    const answer = answers[q.id];
    const isVisited = visited[q.id];
    const isMarked = markedForReview[q.id];
    const isAnswered = answer?.selectedOption !== null && answer?.selectedOption !== undefined;

    if (isMarked && isAnswered) return "marked-answered";
    if (isMarked) return "marked";
    if (isAnswered) return "answered";
    if (isVisited) return "not-answered";
    return "not-visited";
  }

  const statusStyles: Record<string, string> = {
    answered: "bg-green-500 text-white hover:bg-green-600",
    "not-answered": "bg-red-500 text-white hover:bg-red-600",
    "not-visited": "bg-gray-200 text-gray-700 hover:bg-gray-300",
    marked: "bg-yellow-400 text-yellow-900 hover:bg-yellow-500",
    "marked-answered":
      "bg-yellow-400 text-yellow-900 ring-2 ring-green-500 hover:bg-yellow-500",
  };

  const answeredCount = questions.filter(
    (q) => answers[q.id]?.selectedOption !== null && answers[q.id]?.selectedOption !== undefined
  ).length;
  const notAnsweredCount = questions.filter(
    (q) => visited[q.id] && (answers[q.id]?.selectedOption === null || answers[q.id]?.selectedOption === undefined)
  ).length;
  const notVisitedCount = questions.filter((q) => !visited[q.id]).length;
  const markedCount = Object.keys(markedForReview).length;

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
                onClick={() => goToQuestion(index)}
                className={cn(
                  "w-9 h-9 rounded text-xs font-medium transition-all",
                  statusStyles[status],
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
