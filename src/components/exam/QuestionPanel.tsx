"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Eraser,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTestStore } from "@/stores/test-store";
import {
  saveAnswer,
  clearResponse,
  markForReview,
  navigate,
} from "@/lib/api/exam";
import { cn } from "@/lib/utils";

const sectionLabels: Record<string, string> = {
  numerical: "Numerical",
  reasoning: "Reasoning",
  verbal: "Verbal",
  advanced: "Advanced",
};

interface QuestionPanelProps {
  onSubmitTest: () => void;
}

export default function QuestionPanel({ onSubmitTest }: QuestionPanelProps) {
  const {
    attemptId,
    questions,
    currentQuestionIndex,
    currentSection,
    responses,
    sections,
    sectionLocked,
    submittedSections,
    setAnswer,
    clearAnswer,
    markForReview: storeMarkForReview,
    nextQuestion,
    prevQuestion,
    isLastQuestionInSection,
    getNextSection,
    submitSection,
  } = useTestStore();

  const [showSectionSubmit, setShowSectionSubmit] = useState(false);

  const question = questions[currentQuestionIndex];
  if (!question) return null;

  const currentResponse = responses[currentQuestionIndex];
  const selectedOption = currentResponse?.selectedAnswer ?? null;
  const isMarked = currentResponse?.status === "marked_for_review";

  const isLastInSection = sectionLocked && isLastQuestionInSection();
  const nextSec = getNextSection();
  const isLastSection = !nextSec;

  // Section stats for submit dialog
  const sectionInfo = sections.find((s) => s.name === currentSection);
  const sectionStart = sectionInfo?.startIndex ?? 0;
  const sectionEnd = sectionInfo?.endIndex ?? 0;
  const sectionResponses = responses.slice(sectionStart, sectionEnd + 1);
  const sectionAnswered = sectionResponses.filter((r) => r.status === "answered").length;
  const sectionUnanswered = sectionResponses.length - sectionAnswered;

  async function handleOptionClick(optionIndex: number) {
    setAnswer(currentQuestionIndex, optionIndex);
    if (attemptId) {
      saveAnswer(attemptId, currentQuestionIndex, optionIndex, currentResponse?.timeSpent ?? 0).catch(() => {});
    }
  }

  async function handleClearResponse() {
    clearAnswer(currentQuestionIndex);
    if (attemptId) {
      clearResponse(attemptId, currentQuestionIndex).catch(() => {});
    }
  }

  async function handleMarkAndNext() {
    if (!isMarked) {
      storeMarkForReview(currentQuestionIndex);
      if (attemptId) {
        markForReview(attemptId, currentQuestionIndex).catch(() => {});
      }
    }
    const timeSpent = nextQuestion();
    if (attemptId && timeSpent >= 0) {
      navigate(attemptId, currentQuestionIndex + 1, currentQuestionIndex, timeSpent, question.section).catch(() => {});
    }
  }

  function handlePrev() {
    const timeSpent = prevQuestion();
    if (attemptId) {
      navigate(attemptId, currentQuestionIndex - 1, currentQuestionIndex, timeSpent, question.section).catch(() => {});
    }
  }

  function handleNext() {
    // If last question in section (locked mode), show submit dialog
    if (isLastInSection) {
      setShowSectionSubmit(true);
      return;
    }
    const timeSpent = nextQuestion();
    if (attemptId) {
      navigate(attemptId, currentQuestionIndex + 1, currentQuestionIndex, timeSpent, question.section).catch(() => {});
    }
  }

  function handleSectionSubmit() {
    setShowSectionSubmit(false);
    if (isLastSection) {
      // Last section — submit the entire test
      onSubmitTest();
    } else {
      submitSection(currentSection);
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950">
      <div className="flex-1 min-h-0 p-5 sm:p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Question Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
                Q{currentQuestionIndex + 1}
              </span>
              <Badge variant="outline" className="text-xs font-medium bg-slate-50 dark:bg-slate-800">
                {question.topic}
              </Badge>
              {question.difficulty && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] capitalize",
                    question.difficulty === "easy" && "border-green-200 text-green-700 bg-green-50",
                    question.difficulty === "medium" && "border-amber-200 text-amber-700 bg-amber-50",
                    question.difficulty === "hard" && "border-red-200 text-red-700 bg-red-50"
                  )}
                >
                  {question.difficulty}
                </Badge>
              )}
            </div>
            {isMarked && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100 gap-1">
                <BookmarkCheck className="h-3 w-3" />
                Flagged
              </Badge>
            )}
          </div>

          {/* Question Text */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full" />
            <div className="pl-5 py-1">
              <p className="text-[17px] leading-[1.8] text-foreground font-medium whitespace-pre-wrap">
                {question.text}
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const optionLabel = String.fromCharCode(65 + index);

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className={cn(
                    "group w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all duration-200",
                    "hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 shadow-md shadow-indigo-100 dark:shadow-indigo-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-slate-900"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200",
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
                    )}
                  >
                    {optionLabel}
                  </span>
                  <span
                    className={cn(
                      "text-[15px] leading-relaxed transition-colors",
                      isSelected ? "text-indigo-900 dark:text-indigo-100 font-medium" : "text-slate-700 dark:text-slate-300"
                    )}
                  >
                    {option}
                  </span>
                  {isSelected && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shrink-0">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="sticky bottom-0 border-t bg-white dark:bg-gray-950 px-5 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearResponse}
              disabled={selectedOption === null}
              className="rounded-lg text-slate-600 gap-1.5 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              <Eraser className="h-3.5 w-3.5" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAndNext}
              className={cn(
                "rounded-lg gap-1.5 transition-all",
                isMarked
                  ? "border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:border-amber-600 dark:text-amber-400"
                  : "text-slate-600 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50"
              )}
            >
              {isMarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
              {isMarked ? "Flagged" : "Flag"} & Next
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentQuestionIndex === (sectionInfo?.startIndex ?? 0) && sectionLocked}
              className="rounded-lg gap-1 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>

            {/* Submit Section / Submit Test button when at last question */}
            {isLastInSection ? (
              <Button
                size="sm"
                onClick={() => setShowSectionSubmit(true)}
                className={cn(
                  "rounded-lg gap-1.5 text-white font-semibold px-4 transition-all active:scale-95",
                  isLastSection
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {isLastSection ? "Submit Test" : `Submit ${sectionLabels[currentSection] || "Section"}`}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="rounded-lg gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 transition-all active:scale-95 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Section / Test Submit Dialog */}
      <Dialog open={showSectionSubmit} onOpenChange={setShowSectionSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isLastSection
                ? "Submit Test?"
                : `Submit ${sectionLabels[currentSection] || "Section"}?`}
            </DialogTitle>
            <DialogDescription>
              {isLastSection
                ? "This is the last section. Submitting will end the entire test. You cannot change any answers after."
                : `Once submitted, you cannot go back to this section. You will move to ${sectionLabels[nextSec!] || nextSec}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950 p-3">
                <p className="text-2xl font-bold text-emerald-600">{sectionAnswered}</p>
                <p className="text-xs text-emerald-600/70">Answered</p>
              </div>
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950 p-3">
                <p className="text-2xl font-bold text-rose-600">{sectionUnanswered}</p>
                <p className="text-xs text-rose-600/70">Unanswered</p>
              </div>
            </div>
            {sectionUnanswered > 0 && (
              <div className="flex items-center gap-2 text-amber-700 text-sm bg-amber-50 dark:bg-amber-950 p-3 rounded-xl">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                You have {sectionUnanswered} unanswered question{sectionUnanswered !== 1 ? "s" : ""} in this section.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSectionSubmit(false)} className="rounded-lg">
              Review Section
            </Button>
            <Button
              onClick={handleSectionSubmit}
              className={cn(
                "text-white rounded-lg",
                isLastSection
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              )}
            >
              {isLastSection ? "Submit Test" : "Submit & Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
