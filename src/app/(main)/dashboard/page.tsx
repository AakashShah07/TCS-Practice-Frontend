"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Target,
  Clock,
  FileText,
  Calculator,
  Brain,
  BookOpen,
  Zap,
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
import { useProgressStore } from "@/stores/progress-store";
import { fetchDashboardAnalytics } from "@/lib/api/analytics";
import { fetchHistory } from "@/lib/api/results";

const testSections = [
  {
    title: "Numerical Ability",
    description: "25 Questions • 30 Minutes",
    icon: Calculator,
    href: "/tests/foundation?section=numerical",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Reasoning Ability",
    description: "25 Questions • 30 Minutes",
    icon: Brain,
    href: "/tests/foundation?section=reasoning",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Verbal Ability",
    description: "25 Questions • 30 Minutes",
    icon: BookOpen,
    href: "/tests/foundation?section=verbal",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Advanced Reasoning",
    description: "25 Questions • 30 Minutes",
    icon: Zap,
    href: "/tests/advanced",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export default function DashboardPage() {
  const { dashboard, history, isLoading, setDashboard, setHistory, setLoading } =
    useProgressStore();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [dashboardData, historyData] = await Promise.all([
          fetchDashboardAnalytics(),
          fetchHistory(1, 5),
        ]);
        setDashboard(dashboardData);
        setHistory(historyData.data);
      } catch {
        // API not ready yet — show empty state
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [setDashboard, setHistory, setLoading]);

  const questionsSolved = dashboard?.sectionPerformance
    ? Object.values(dashboard.sectionPerformance).reduce(
        (sum, s) => sum + s.totalQuestions,
        0
      )
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and start practicing
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "\u2014" : (dashboard?.totalTests ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "\u2014"
                : dashboard?.avgScore
                ? `${Math.round(dashboard.avgScore)}%`
                : "0%"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Questions Solved</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "\u2014" : questionsSolved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Time Practiced</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? "\u2014"
                : formatTime(dashboard?.totalTimeSpent ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Test Sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Start</h2>
          <Button variant="ghost" render={<Link href="/tests" />}>
              View all tests <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.title} href={section.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${section.bg} flex items-center justify-center mb-2`}
                    >
                      <Icon className={`h-5 w-5 ${section.color}`} />
                    </div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Full Mock Test CTA */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-xl">Full Mock Test</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Complete TCS NQT simulation — 25 Questions per section • 30 Minutes each
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" render={<Link href="/tests/mock" />}>Start Mock Test</Button>
        </CardContent>
      </Card>

      {/* Exam Pattern Overview */}
      <Card>
        <CardHeader>
          <CardTitle>TCS NQT Exam Pattern</CardTitle>
          <CardDescription>
            Understanding the exam structure is key to preparation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Foundation Section</span>
                <span className="text-muted-foreground">25 Qs • 30 mins each</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Advanced Section</span>
                <span className="text-muted-foreground">25 Qs • 30 mins</span>
              </div>
              <Progress value={18} className="h-2" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline">No Negative Marking (Foundation)</Badge>
            <Badge variant="outline">25 Questions per test</Badge>
            <Badge variant="outline">Duration: 30 Minutes each</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Tests */}
      {history && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((item) => (
                <Link
                  key={item._id}
                  href={`/results/${item.attempt}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{item.test.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={item.percentage >= 70 ? "default" : "secondary"}
                  >
                    {Math.round(item.percentage)}%
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
