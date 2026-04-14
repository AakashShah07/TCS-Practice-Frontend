"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTestStore } from "@/stores/test-store";
import { cn } from "@/lib/utils";

export default function QuestionPanel() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    markedForReview,
    setAnswer,
    clearAnswer,
    markForReview,
    nextQuestion,
    prevQuestion,
  } = useTestStore();

  const question = questions[currentQuestionIndex];
  if (!question) return null;

  const currentAnswer = answers[question.id];
  const selectedOption = currentAnswer?.selectedOption ?? null;
  const isMarked = markedForReview[question.id] || false;

  function handleOptionClick(optionIndex: number) {
    setAnswer(question.id, optionIndex);
  }

  function handleClearResponse() {
    clearAnswer(question.id);
  }

  function handleMarkAndNext() {
    if (!isMarked) markForReview(question.id);
    nextQuestion();
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Question Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestionIndex + 1}
              </span>
              <Badge variant="outline" className="text-xs">
                {question.topic}
              </Badge>
            </div>
            {isMarked && (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                Marked for Review
              </Badge>
            )}
          </div>

          {/* Question Text */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {question.text}
              </p>
            </CardContent>
          </Card>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50 hover:bg-accent"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {optionLabel}
                  </span>
                  <span className="text-sm leading-relaxed pt-0.5">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="sticky bottom-0 border-t bg-background px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearResponse}
              disabled={selectedOption === null}
            >
              Clear Response
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAndNext}
              className={cn(
                isMarked &&
                  "border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              )}
            >
              {isMarked ? "Marked" : "Mark for Review"} & Next
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
