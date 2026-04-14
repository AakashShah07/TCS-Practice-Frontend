"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, MinusCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchReview } from "@/lib/api/results";
import type { ReviewResponse, ReviewItem } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function StatusIcon({ item }: { item: ReviewItem }) {
  if (item.selectedAnswer === null)
    return <MinusCircle className="h-5 w-5 text-gray-400" />;
  if (item.selectedAnswer === item.correctAnswer)
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  return <XCircle className="h-5 w-5 text-red-500" />;
}

export default function ReviewPage() {
  const params = useParams();
  const attemptId = params.testId as string;
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "wrong" | "skipped">("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchReview(attemptId);
        setReviewData(data);
      } catch {
        // API not ready
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [attemptId]);

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
    if (filter === "wrong")
      return item.selectedAnswer !== item.correctAnswer && item.selectedAnswer !== null;
    if (filter === "skipped") return item.selectedAnswer === null;
    return true;
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-2" render={<Link href={`/results/${attemptId}`} />}>
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
        {(["all", "wrong", "skipped"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "all"
              ? `All (${reviewData.review.length})`
              : f === "wrong"
              ? `Wrong (${reviewData.review.filter((item) => item.selectedAnswer !== item.correctAnswer && item.selectedAnswer !== null).length})`
              : `Skipped (${reviewData.review.filter((item) => item.selectedAnswer === null).length})`}
          </Button>
        ))}
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
                            "bg-green-50 border-green-200 text-green-800",
                          isWrongSelected &&
                            "bg-red-50 border-red-200 text-red-800",
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
                          <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto shrink-0" />
                        )}
                        {isWrongSelected && (
                          <XCircle className="h-4 w-4 text-red-600 ml-auto shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {item.question.explanation && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
                    <span className="font-medium">Explanation: </span>
                    {item.question.explanation}
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
