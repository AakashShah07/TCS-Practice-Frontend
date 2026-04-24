"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import SectionAnalysis from "@/components/results/SectionAnalysis";
import { fetchResult } from "@/lib/api/results";
import type { TestResult } from "@/lib/api/types";

function getPerformanceMessage(percentage: number) {
  if (percentage >= 90) return "Outstanding! You aced it!";
  if (percentage >= 75) return "Great job! Strong performance.";
  if (percentage >= 60) return "Good effort! Keep practicing.";
  if (percentage >= 40) return "Fair attempt. Focus on weak areas.";
  return "Needs improvement. Don't give up!";
}

function getPerformanceColor(percentage: number) {
  if (percentage >= 75) return "text-green-600 dark:text-green-400";
  if (percentage >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function ResultPage() {
  const params = useParams();
  const resultId = params.testId as string;
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchResult(resultId);
        setResult(data);
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
      <div className="space-y-8 max-w-4xl mx-auto animate-pulse">
        {/* Score Card Skeleton */}
        <Card>
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted mb-2" />
            <div className="h-6 w-48 bg-muted rounded mx-auto" />
            <div className="h-4 w-28 bg-muted rounded mx-auto mt-2" />
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="h-12 w-24 bg-muted rounded mx-auto" />
            <div className="h-3 w-64 bg-muted rounded mx-auto" />
            <div className="h-4 w-36 bg-muted rounded mx-auto" />
          </CardContent>
        </Card>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6 text-center space-y-2">
                <div className="h-6 w-6 bg-muted rounded-full mx-auto" />
                <div className="h-7 w-10 bg-muted rounded mx-auto" />
                <div className="h-3 w-14 bg-muted rounded mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section Analysis Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-5 w-40 bg-muted rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-3 flex-1 bg-muted rounded" />
                <div className="h-4 w-10 bg-muted rounded" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-wrap gap-3 justify-center">
          <div className="h-10 w-36 bg-muted rounded-md" />
          <div className="h-10 w-32 bg-muted rounded-md" />
          <div className="h-10 w-36 bg-muted rounded-md" />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted-foreground">Result not found.</p>
        <Button render={<Link href="/dashboard" />}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Score Card */}
      <Card>
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{result.test.title}</CardTitle>
          <CardDescription>Test completed</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div>
            <p
              className={`text-5xl font-bold ${getPerformanceColor(result.percentage)}`}
            >
              {Math.round(result.percentage)}%
            </p>
            <p className="text-muted-foreground mt-1">
              {getPerformanceMessage(result.percentage)}
            </p>
          </div>

          <div className="flex justify-center">
            <Progress
              value={result.percentage}
              className="w-64 h-3"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {result.score} out of {result.totalQuestions} correct
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.correct}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <XCircle className="h-6 w-6 text-red-500 dark:text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{result.wrong}</p>
            <p className="text-xs text-muted-foreground">Wrong</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <MinusCircle className="h-6 w-6 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">{result.skipped}</p>
            <p className="text-xs text-muted-foreground">Skipped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-6 w-6 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatTime(result.timeTaken)}
            </p>
            <p className="text-xs text-muted-foreground">Time Taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Section Analysis */}
      {result.sectionWise && result.sectionWise.length > 0 && (
        <SectionAnalysis sections={result.sectionWise} />
      )}

      <Separator />

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button render={<Link href={`/results/${resultId}/review`} />}>
            Review Answers <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
        <Button variant="outline" render={<Link href="/analytics" />}>View Analytics</Button>
        <Button variant="outline" render={<Link href="/tests" />}>Take Another Test</Button>
      </div>
    </div>
  );
}
