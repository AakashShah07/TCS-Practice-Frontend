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

/**
 * Formats question text so that coded-relation definitions, multi-line setups,
 * and the final question each appear on their own line.
 */
function QuestionText({ text }: { text: string }) {
  // 1. "Given:" or "In a code/coded language:" prefix
  const hasGivenPrefix = /^(Given|In a code[d]? language|In a coded relation)\s*:/i.test(text);

  // 2. Symbol-means definitions: "A + B means ...; A - B means ..." or "% means mother, & means father"
  const hasSymbolMeans = /\bmeans\b/i.test(text) && (
    /[+\-*×÷/@#$%&★●■▲←→↔]\s*[A-Z]\s+means\b/i.test(text) ||
    /[A-Z]\s*[+\-*×÷/@#$%&★●■▲←→↔]\s*[A-Z]\s+means\b/i.test(text) ||
    /^(?:If\s+)?[A-Z]\s*[+\-*×÷/@#$%&★●■▲←→↔]/i.test(text) ||
    /[%&#@$#★●■▲]\s+means\b/i.test(text)
  );

  // 3. Arrow-based definitions: "A → B means ..." or "P − Q → P is father"
  const hasArrowDefs = /[→←↔]\s*[A-Z]\s+(?:is|means)\s+/i.test(text);

  // 4. Relation chain: "A is father of B. B is mother of C."
  const hasRelationChain = /\b[A-Z]\s+is\s+(father|mother|brother|sister|son|daughter|husband|wife|parent|spouse|married|sibling)\b/i.test(text);

  if (hasGivenPrefix || hasSymbolMeans || hasArrowDefs) {
    return <FormattedCodedQuestion text={text} />;
  }

  if (hasRelationChain) {
    return <FormattedRelationChain text={text} />;
  }

  // Default: render as-is
  return (
    <p className="text-[17px] leading-[1.8] text-foreground font-medium whitespace-pre-wrap">
      {text}
    </p>
  );
}

/** Handles coded/symbol definition questions */
function FormattedCodedQuestion({ text }: { text: string }) {
  // Try to extract a prefix like "Given:", "In a coded language:", "In a coded relation:"
  const prefixMatch = text.match(/^(Given|In a code[d]? language|In a coded relation)\s*:\s*/i);

  // Also handle "If A + B means ... " — strip leading "If " for definitions
  const ifPrefixMatch = !prefixMatch ? text.match(/^If\s+/i) : null;

  const prefix = prefixMatch
    ? prefixMatch[0].trim().replace(/:$/, "")
    : "Coded Relations";
  const rest = prefixMatch
    ? text.slice(prefixMatch[0].length)
    : ifPrefixMatch
      ? text.slice(ifPrefixMatch[0].length)
      : text;

  // Find the question part — the last sentence that asks something
  // Look for patterns like "How is", "What is", "If P + Q", "which of the following", etc.
  // We want to find the LAST definition separator before the actual question
  let definitions = "";
  let questionPart = "";

  // Strategy: find the question by looking for known question starters after a ". " or "; "
  const questionPatterns = [
    /[.;]\s*((?:Question\s*:\s*)?How is\b[\s\S]*)/i,
    /[.;]\s*((?:Question\s*:\s*)?What is\b[\s\S]*)/i,
    /[.;]\s*((?:Question\s*:\s*)?Who is\b[\s\S]*)/i,
    /[.;]\s*((?:Question\s*:\s*)?Which of\b[\s\S]*)/i,
    /[.;]\s*((?:Question\s*:\s*)?Find\b[\s\S]*)/i,
    /[.;]\s*((?:Question\s*:\s*)?Determine\b[\s\S]*)/i,
    /[.;]\s*(If\s+[A-Z]\s*[+\-*×÷/@#$%&★●■▲←→↔][\s\S]*\?[\s\S]*)/i,
  ];

  let splitIndex = -1;
  let matchedQuestion = "";
  for (const pattern of questionPatterns) {
    const m = rest.match(pattern);
    if (m && m.index !== undefined) {
      const idx = m.index;
      if (splitIndex === -1 || idx > splitIndex) {
        // We want the last match that's a natural split
      }
      // Actually take the first match — it separates defs from question
      if (splitIndex === -1) {
        splitIndex = idx;
        matchedQuestion = m[1];
      }
    }
  }

  if (splitIndex > 0) {
    definitions = rest.substring(0, splitIndex).trim();
    questionPart = matchedQuestion.trim();
  } else {
    // Fallback: split on last ". " before "?"
    const lastQMark = rest.lastIndexOf("?");
    if (lastQMark > 0) {
      const beforeQ = rest.substring(0, lastQMark);
      const lastPeriod = Math.max(beforeQ.lastIndexOf(". "), beforeQ.lastIndexOf("; "));
      if (lastPeriod > 0) {
        definitions = rest.substring(0, lastPeriod).trim();
        questionPart = rest.substring(lastPeriod + 2).trim();
      } else {
        definitions = rest;
        questionPart = "";
      }
    } else {
      definitions = rest;
      questionPart = "";
    }
  }

  // Split definitions into individual rules
  // Try splitting by ". " first (period-separated), then by "; ", then by ", "
  let defLines: string[];

  // Try period-separated first: "A + B means X. A - B means Y."
  const periodSplit = definitions
    .split(/\.\s+/)
    .map((d) => d.replace(/\.$/, "").trim())
    .filter(Boolean);

  if (periodSplit.length > 1) {
    defLines = periodSplit;
  } else {
    // Try semicolon-separated: "A + B means X; A - B means Y"
    const semiSplit = definitions
      .split(/;\s*/)
      .map((d) => d.trim())
      .filter(Boolean);

    if (semiSplit.length > 1) {
      defLines = semiSplit;
    } else {
      // Try comma-separated: "% means mother, & means father"
      const commaSplit = definitions
        .split(/,\s*/)
        .map((d) => d.trim())
        .filter(Boolean);

      defLines = commaSplit.length > 1 ? commaSplit : [definitions];
    }
  }

  return (
    <div className="text-[17px] leading-[1.8] text-foreground font-medium space-y-3">
      <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-wide">
        {prefix}
      </p>
      <div className="space-y-1.5 pl-1">
        {defLines.map((line, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
            <span>{line}</span>
          </div>
        ))}
      </div>
      {questionPart && (
        <p className="pt-2 border-t border-slate-200 dark:border-slate-700 text-foreground font-semibold">
          {questionPart}
        </p>
      )}
    </div>
  );
}

/** Handles "A is father of B. B is mother of C. How is A related to C?" style */
function FormattedRelationChain({ text }: { text: string }) {
  // Split into statement sentences and question
  // Find the question sentence (starts with How/What/Who or contains ?)
  const questionPatterns = /(?:How is|What is|Who is|How are|Find |Determine |What relation)/i;
  const match = text.match(questionPatterns);

  if (!match || match.index === undefined) {
    return <p className="text-[17px] leading-[1.8] text-foreground font-medium whitespace-pre-wrap">{text}</p>;
  }

  // Find the start of the question sentence
  const beforeQuestion = text.substring(0, match.index);
  const questionPart = text.substring(match.index);

  // Split the setup statements by ". " (each relation statement)
  const statements = beforeQuestion
    .split(/\.\s+/)
    .map((s) => s.replace(/\.$/, "").trim())
    .filter((s) => s.length > 0);

  // Check for a "Pointing to" or context intro
  const introPattern = /^(Pointing to|Looking at|Showing|Introducing|A man said|A woman said|.*?\bsays?\b\s*:)/i;
  const hasIntro = statements.length > 0 && introPattern.test(statements[0]);

  return (
    <div className="text-[17px] leading-[1.8] text-foreground font-medium space-y-3">
      {hasIntro && statements.length === 1 ? (
        <p>{statements[0]}.</p>
      ) : (
        <div className="space-y-1.5">
          {statements.map((stmt, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
              <span>{stmt}</span>
            </div>
          ))}
        </div>
      )}
      <p className="pt-2 border-t border-slate-200 dark:border-slate-700 text-foreground font-semibold">
        {questionPart}
      </p>
    </div>
  );
}

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
              <QuestionText text={question.text} />
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
      <div className="sticky bottom-0 border-t bg-white dark:bg-gray-950 px-6 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClearResponse}
              disabled={selectedOption === null}
              className="rounded-xl text-slate-600 gap-2 h-11 px-5 text-sm font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.03] active:scale-95 disabled:opacity-40"
            >
              <Eraser className="h-4 w-4" />
              Clear
            </Button>
            <Button
              variant="outline"
              onClick={handleMarkAndNext}
              className={cn(
                "rounded-xl gap-2 h-11 px-5 text-sm font-medium transition-all hover:scale-[1.03] active:scale-95",
                isMarked
                  ? "border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:border-amber-600 dark:text-amber-400"
                  : "text-slate-600 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50"
              )}
            >
              {isMarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {isMarked ? "Flagged" : "Flag"} & Next
            </Button>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentQuestionIndex === (sectionInfo?.startIndex ?? 0) && sectionLocked}
              className="rounded-xl gap-1.5 h-11 px-5 text-sm font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.03] active:scale-95 disabled:opacity-40"
            >
              <ChevronLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-0.5" />
              Prev
            </Button>

            {/* Submit Section / Submit Test button when at last question */}
            {isLastInSection ? (
              <Button
                onClick={() => setShowSectionSubmit(true)}
                className={cn(
                  "rounded-xl gap-2 text-white font-semibold h-11 px-6 text-sm transition-all hover:scale-[1.03] active:scale-95",
                  isLastSection
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                <CheckCircle className="h-4 w-4" />
                {isLastSection ? "Submit Test" : `Submit ${sectionLabels[currentSection] || "Section"}`}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="group rounded-xl gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 px-6 text-sm transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5 group-hover:animate-[nudge-right_0.6s_ease-in-out_infinite]" />
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
