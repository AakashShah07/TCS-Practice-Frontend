"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  FileText,
  Target,
  Clock,
  Lightbulb,
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
import PerformanceCharts from "@/components/analytics/PerformanceCharts";
import TopicIntelligence from "@/components/analytics/TopicIntelligence";
import TopicStrengths from "@/components/analytics/TopicStrengths";
import {
  fetchDashboardAnalytics,
  fetchTopicStats,
  fetchRecommendations,
  fetchTrends,
} from "@/lib/api/analytics";
import type {
  DashboardAnalytics,
  TopicStat,
  Recommendation,
  TrendData,
} from "@/lib/api/types";

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

const priorityColors: Record<string, string> = {
  high: "border-red-200 bg-red-50",
  medium: "border-amber-200 bg-amber-50",
  low: "border-blue-200 bg-blue-50",
};

const typeLabels: Record<string, string> = {
  revise: "Revise",
  focus: "Focus",
  strength: "Strength",
  speed: "Speed",
};

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState<DashboardAnalytics | null>(null);
  const [topicStats, setTopicStats] = useState<TopicStat[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [dashData, topics, recs, trendData] = await Promise.all([
          fetchDashboardAnalytics(),
          fetchTopicStats(),
          fetchRecommendations(),
          fetchTrends(),
        ]);
        setDashboard(dashData);
        setTopicStats(topics);
        setRecommendations(recs);
        setTrends(trendData);
      } catch {
        // API not ready
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-20 space-y-4">
        <Trophy className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-semibold">No Analytics Yet</h2>
        <p className="text-muted-foreground">
          Complete some tests to see your performance analytics
        </p>
        <Button render={<Link href="/tests" />}>
          Take a Test <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Derive strong/weak topics from topicStats
  const strongTopics = topicStats
    .filter((t) => t.confidence === "strong")
    .map((t) => t.topic);
  const weakTopics = topicStats
    .filter((t) => t.confidence === "weak")
    .map((t) => t.topic);

  // Build chart data from trends
  const scoreHistory = (trends?.scoreHistory || []).map((h) => ({
    date: new Date(h.date).toLocaleDateString(),
    score: h.percentage,
  }));
  const accuracyHistory = scoreHistory.map((h) => ({
    date: h.date,
    accuracy: h.score,
  }));

  // Build section performance from dashboard
  const sectionPerformance = Object.entries(dashboard.sectionPerformance).map(
    ([section, perf]) => ({
      section,
      accuracy:
        perf.totalQuestions > 0
          ? Math.round((perf.totalCorrect / perf.totalQuestions) * 100)
          : 0,
      testsCount: perf.attempts,
      improvement: 0,
    })
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed performance analysis and recommendations
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(dashboard.avgScore)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totalTests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(dashboard.avgAccuracy)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Time Practiced
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(dashboard.totalTimeSpent)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <PerformanceCharts
        scoreHistory={scoreHistory}
        accuracyHistory={accuracyHistory}
        sectionPerformance={sectionPerformance}
      />

      {/* Topic Intelligence */}
      {topicStats.length > 0 && (
        <TopicIntelligence topicStats={topicStats} />
      )}

      {/* Strengths & Weaknesses */}
      <TopicStrengths strongTopics={strongTopics} weakTopics={weakTopics} />

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <CardTitle>Smart Recommendations</CardTitle>
            </div>
            <CardDescription>
              Personalized suggestions to improve your performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${priorityColors[rec.priority]}`}
              >
                <Badge variant="outline" className="shrink-0 text-xs mt-0.5">
                  {typeLabels[rec.type] || rec.type}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm">{rec.message}</p>
                  {rec.topic && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 mt-1"
                      render={
                        <Link
                          href={`/practice?section=${rec.section || "numerical"}`}
                        />
                      }
                    >
                      Practice {rec.topic}{" "}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Badge
                  variant={
                    rec.priority === "high" ? "destructive" : "secondary"
                  }
                  className="text-xs shrink-0"
                >
                  {rec.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
