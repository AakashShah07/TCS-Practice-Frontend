"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, MinusCircle, ArrowLeft, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchReview } from "@/lib/api/results";
import type { ReviewResponse, ReviewItem } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function StatusIcon({ item }: { item: ReviewItem }) {
  if (item.selectedAnswer === null)
    return <MinusCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />;
  if (item.selectedAnswer === item.correctAnswer)
    return <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />;
  return <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />;
}

/**
 * Splits an explanation into logical steps.
 * Splits on " → " (arrow steps) first, then on ". " but only when
 * NOT inside a math expression like √(...) or parenthesized groups.
 */
function splitIntoSteps(text: string): string[] {
  // If the explanation uses → as step separators (e.g. "a + b = 34 → ab = 240 → Area = 120")
  // split on → only when preceded by a result (digit, unit, or closing paren)
  if ((text.match(/→/g) || []).length >= 2) {
    return text.split(/\s*→\s*/).filter((s) => s.trim());
  }

  // Otherwise split on ". " but preserve math like "√(36−4) = √32 = 4√2 cm."
  // Split on period+space where the next char is uppercase (start of new sentence)
  const parts = text.split(/\.\s+(?=[A-Z])/).map((s) => s.replace(/\.$/, "").trim()).filter(Boolean);
  return parts;
}

/** Highlights math expressions within a text string */
function formatMath(text: string) {
  // Match equations: sequences containing = with digits/math symbols around them
  // Allow decimals (e.g. 8164.5) by including \. in the character class
  const parts = text.split(/((?:[^=]+=\s*)?[\d√π(][\d√π×÷²³()a-zr+\-*/=≈,.\s]*(?:cm[²³]?|m[²³]?|π|%))/gi);

  if (parts.length <= 1) return text;

  return parts.map((part, i) => {
    const isMath = /[=√π×÷²³≈]/.test(part) && /\d/.test(part);
    if (isMath) {
      return (
        <span key={i} className="font-mono text-[13px] bg-amber-100/60 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-md">
          {part}
        </span>
      );
    }
    return part;
  });
}

function SolutionCard({ explanation }: { explanation: string }) {
  const steps = splitIntoSteps(explanation);
  const isMultiStep = steps.length > 1;

  return (
    <div className="rounded-xl border border-amber-200/80 dark:border-amber-800/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100/70 dark:bg-amber-900/30 border-b border-amber-200/60 dark:border-amber-800/30">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/20 dark:bg-amber-500/20">
          <Lightbulb className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        </div>
        <span className="font-semibold text-sm text-amber-800 dark:text-amber-300">Solution</span>
        {isMultiStep && (
          <span className="ml-auto text-[11px] text-amber-600/70 dark:text-amber-400/50 font-medium">
            {steps.length} steps
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3 bg-amber-50/50 dark:bg-amber-950/20">
        {isMultiStep ? (
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-200/70 dark:bg-amber-800/40 shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">{i + 1}</span>
                </div>
                <p className="text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/85">
                  {formatMath(step)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/85">
            {formatMath(steps[0])}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const params = useParams();
  const resultId = params.testId as string;
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "correct" | "wrong" | "skipped">("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchReview(resultId);
        setReviewData(data);
      } catch {
        // API not ready
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resultId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Result not found.</p>
      </div>
    );
  }

  const filtered = reviewData.review.filter((item) => {
    if (filter === "correct")
      return item.selectedAnswer !== null && item.selectedAnswer === item.correctAnswer;
    if (filter === "wrong")
      return item.selectedAnswer !== null && item.selectedAnswer !== item.correctAnswer;
    if (filter === "skipped") return item.selectedAnswer === null;
    return true;
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-2" render={<Link href={`/results/${resultId}`} />}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Results
          </Button>
          <h1 className="text-2xl font-bold">Answer Review</h1>
          <p className="text-muted-foreground text-sm">
            Score: {reviewData.score}/{reviewData.totalQuestions} ({Math.round(reviewData.percentage)}%) -- {reviewData.review.length} questions
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "correct", "wrong", "skipped"] as const).map((f) => {
          const count =
            f === "all"
              ? reviewData.review.length
              : f === "correct"
              ? reviewData.review.filter((item) => item.selectedAnswer !== null && item.selectedAnswer === item.correctAnswer).length
              : f === "wrong"
              ? reviewData.review.filter((item) => item.selectedAnswer !== null && item.selectedAnswer !== item.correctAnswer).length
              : reviewData.review.filter((item) => item.selectedAnswer === null).length;
          return (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({count})
            </Button>
          );
        })}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {filtered.map((item, index) => {
          const optionLabels = "ABCD";
          const globalIndex = reviewData.review.indexOf(item);
          return (
            <Card key={item.question._id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon item={item} />
                    <CardTitle className="text-sm">
                      Question {globalIndex + 1}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge variant="outline" className="text-xs">
                      {item.question.topic}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(item.timeSpent)}s
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm whitespace-pre-wrap">{item.question.text}</p>
                <div className="space-y-2">
                  {item.question.options.map((opt, i) => {
                    const isCorrect = i === item.correctAnswer;
                    const isSelected = i === item.selectedAnswer;
                    const isWrongSelected = isSelected && !isCorrect;

                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-start gap-2 p-2.5 rounded-lg text-sm border",
                          isCorrect &&
                            "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200",
                          isWrongSelected &&
                            "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
                          !isCorrect &&
                            !isWrongSelected &&
                            "border-transparent"
                        )}
                      >
                        <span className="font-medium shrink-0">
                          {optionLabels[i]}.
                        </span>
                        <span>{opt}</span>
                        {isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 ml-auto shrink-0" />
                        )}
                        {isWrongSelected && (
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 ml-auto shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {item.question.explanation && (
                  <SolutionCard explanation={item.question.explanation} />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No questions match this filter.
        </div>
      )}
    </div>
  );
}
