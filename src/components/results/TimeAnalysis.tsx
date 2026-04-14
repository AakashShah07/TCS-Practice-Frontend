"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { QuestionDetail } from "@/lib/api/types";

interface Props {
  questionDetails: QuestionDetail[];
}

export default function TimeAnalysis({ questionDetails }: Props) {
  if (questionDetails.length === 0) return null;

  const avgTime =
    questionDetails.reduce((sum, q) => sum + q.timeSpent, 0) /
    questionDetails.length;

  const overthinking = questionDetails.filter(
    (q) => q.timeSpent > avgTime * 2 && !q.isCorrect
  );
  const guessing = questionDetails.filter(
    (q) =>
      q.timeSpent < avgTime * 0.3 && !q.isCorrect && q.selectedAnswer !== null
  );
  const slowCorrect = questionDetails.filter(
    (q) => q.timeSpent > avgTime * 2 && q.isCorrect
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Analysis</CardTitle>
        <CardDescription>
          Average time per question: {avgTime.toFixed(1)}s
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-red-50 border border-red-100">
            <p className="text-sm font-medium text-red-800">Overthinking</p>
            <p className="text-2xl font-bold text-red-600">
              {overthinking.length}
            </p>
            <p className="text-xs text-red-600/70">
              Slow + wrong answers
            </p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
            <p className="text-sm font-medium text-amber-800">
              Likely Guessing
            </p>
            <p className="text-2xl font-bold text-amber-600">
              {guessing.length}
            </p>
            <p className="text-xs text-amber-600/70">
              Too fast + wrong answers
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-sm font-medium text-blue-800">Slow but Correct</p>
            <p className="text-2xl font-bold text-blue-600">
              {slowCorrect.length}
            </p>
            <p className="text-xs text-blue-600/70">
              Needs speed improvement
            </p>
          </div>
        </div>

        {/* Time Distribution */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Time per Question</p>
          <div className="flex flex-wrap gap-1">
            {questionDetails.map((q, i) => {
              const ratio = q.timeSpent / avgTime;
              let color = "bg-green-400";
              if (ratio > 2) color = q.isCorrect ? "bg-blue-400" : "bg-red-400";
              else if (ratio < 0.3 && !q.isCorrect && q.selectedAnswer !== null)
                color = "bg-amber-400";
              else if (!q.isCorrect) color = "bg-red-300";

              return (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-sm ${color} cursor-default`}
                  title={`Q${i + 1}: ${q.timeSpent.toFixed(0)}s -- ${q.isCorrect ? "Correct" : q.selectedAnswer === null ? "Skipped" : "Wrong"}`}
                />
              );
            })}
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-green-400" /> Correct
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-red-400" /> Slow+Wrong
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-amber-400" /> Guessing
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-blue-400" /> Slow+Correct
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
