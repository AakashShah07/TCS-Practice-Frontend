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
                  <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0" />
                      <span className="font-semibold text-amber-800 dark:text-amber-300">Solution</span>
                    </div>
                    <div className="space-y-1.5 text-amber-900/90 dark:text-amber-100/85 leading-relaxed">
                      {item.question.explanation
                        .split(/(?<=\.)\s+/)
                        .filter((s: string) => s.trim())
                        .map((sentence: string, i: number) => (
                          <p key={i}>{sentence.trim()}</p>
                        ))}
                    </div>
                  </div>
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
