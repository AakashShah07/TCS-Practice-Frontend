"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { QuestionResult } from "@/lib/api/types";

interface Props {
  questionResults: QuestionResult[];
}

function getTimeInsight(q: QuestionResult, avgTime: number): string | null {
  if (q.timeSpent > avgTime * 2 && !q.isCorrect) {
    return "Overthinking — spent too long and still got it wrong";
  }
  if (q.timeSpent < avgTime * 0.3 && !q.isCorrect && q.selectedAnswer !== null) {
    return "Likely guessing — too fast and incorrect";
  }
  if (q.timeSpent > avgTime * 2 && q.isCorrect) {
    return "Correct but slow — practice for speed";
  }
  return null;
}

export default function TimeAnalysis({ questionResults }: Props) {
  const avgTime =
    questionResults.reduce((sum, q) => sum + q.timeSpent, 0) /
    questionResults.length;

  const overthinking = questionResults.filter(
    (q) => q.timeSpent > avgTime * 2 && !q.isCorrect
  );
  const guessing = questionResults.filter(
    (q) =>
      q.timeSpent < avgTime * 0.3 && !q.isCorrect && q.selectedAnswer !== null
  );
  const slowCorrect = questionResults.filter(
    (q) => q.timeSpent > avgTime * 2 && q.isCorrect
  );

  // Group by topic for insights
  const topicTimeMap = new Map<
    string,
    { totalTime: number; count: number; correct: number }
  >();
  questionResults.forEach((q) => {
    const existing = topicTimeMap.get(q.topic) || {
      totalTime: 0,
      count: 0,
      correct: 0,
    };
    existing.totalTime += q.timeSpent;
    existing.count += 1;
    if (q.isCorrect) existing.correct += 1;
    topicTimeMap.set(q.topic, existing);
  });

  const topicInsights = Array.from(topicTimeMap.entries())
    .map(([topic, data]) => ({
      topic,
      avgTime: data.totalTime / data.count,
      accuracy: (data.correct / data.count) * 100,
    }))
    .filter((t) => t.avgTime > avgTime * 1.5 && t.accuracy < 50)
    .sort((a, b) => a.accuracy - b.accuracy);

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

        {/* Topic Insights */}
        {topicInsights.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Key Insights</p>
            {topicInsights.map((t) => (
              <div
                key={t.topic}
                className="flex items-center gap-2 p-2 rounded bg-amber-50 text-sm text-amber-800"
              >
                <span>
                  You spend too much time on{" "}
                  <strong>{t.topic}</strong> (avg {t.avgTime.toFixed(1)}s) but
                  accuracy is only {Math.round(t.accuracy)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Time Distribution */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Time per Question</p>
          <div className="flex flex-wrap gap-1">
            {questionResults.map((q, i) => {
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
                  title={`Q${i + 1}: ${q.timeSpent.toFixed(0)}s — ${q.isCorrect ? "Correct" : q.selectedAnswer === null ? "Skipped" : "Wrong"}`}
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
