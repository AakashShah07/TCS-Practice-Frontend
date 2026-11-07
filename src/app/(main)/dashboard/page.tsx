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
  Sparkles,
  Crown,
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
import CompanyPreparation from "@/components/dashboard/CompanyPreparation";

const testSections = [
  {
    title: "Numerical Ability",
    description: "25 Questions • 30 Minutes",
    icon: Calculator,
    href: "/tests/foundation?section=numerical",
    color: "text-[#3478F6] dark:text-[#78A8FF]",
    bg: "bg-[#E7F1FF] dark:bg-[#1A2A46]",
    iconBorder: "border-[#D7E8FF] dark:border-[#2A4266]",
  },
  {
    title: "Reasoning Ability",
    description: "25 Questions • 30 Minutes",
    icon: Brain,
    href: "/tests/foundation?section=reasoning",
    color: "text-[#8247FF] dark:text-[#B497FF]",
    bg: "bg-[#F0E9FF] dark:bg-[#2A2145]",
    iconBorder: "border-[#E4D8FF] dark:border-[#443366]",
  },
  {
    title: "Verbal Ability",
    description: "25 Questions • 30 Minutes",
    icon: BookOpen,
    href: "/tests/foundation?section=verbal",
    color: "text-[#0DAB88] dark:text-[#42D2AE]",
    bg: "bg-[#E2F8F0] dark:bg-[#17352F]",
    iconBorder: "border-[#C6ECDD] dark:border-[#285247]",
  },
  {
    title: "Advanced Reasoning",
    description: "25 Questions • 30 Minutes",
    icon: Zap,
    href: "/tests/advanced",
    color: "text-[#E57925] dark:text-[#FFAE68]",
    bg: "bg-[#FFF1E4] dark:bg-[#3A2A20]",
    iconBorder: "border-[#F8DFC8] dark:border-[#5A3D2B]",
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

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header */}
        <div>
          <div className="h-8 w-36 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded mt-2" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 w-28 bg-muted rounded" />
                <div className="h-4 w-4 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-7 w-14 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start Skeleton */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-28 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-muted rounded-lg mb-2" />
                  <div className="h-5 w-32 bg-muted rounded" />
                  <div className="h-4 w-40 bg-muted rounded mt-1" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Mock Test CTA Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-36 bg-muted rounded" />
            <div className="h-4 w-72 bg-muted rounded mt-1" />
          </CardHeader>
          <CardContent>
            <div className="h-10 w-32 bg-muted rounded" />
          </CardContent>
        </Card>

        {/* Exam Pattern Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-5 w-40 bg-muted rounded" />
            <div className="h-4 w-72 bg-muted rounded mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
                <div className="h-2 bg-muted rounded" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
                <div className="h-2 bg-muted rounded" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-44 bg-muted rounded-full" />
              <div className="h-6 w-32 bg-muted rounded-full" />
              <div className="h-6 w-36 bg-muted rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and start practicing
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card className="relative min-w-0 gap-0 overflow-hidden rounded-xl border border-[#DCE5EF] bg-white py-0 text-[#172033] shadow-[0_2px_8px_rgba(23,32,51,0.04)] ring-0 dark:border-[#262D45] dark:bg-[#10172A] dark:text-[#F8FAFC]">
          <CardHeader className="flex flex-row items-center gap-2.5 px-3 pt-3 pb-2 sm:gap-3 sm:px-4 sm:pt-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D7E8FF] bg-[#E7F1FF] text-[#3478F6] dark:border-[#2A4266] dark:bg-[#1A2A46] dark:text-[#78A8FF] sm:h-10 sm:w-10">
              <FileText className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <CardTitle className="min-w-0 text-xs font-medium leading-snug text-[#64748B] dark:text-[#A5B4CC] sm:text-[13px]">
              Tests Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-4 sm:px-4">
            <div className="text-[26px] font-bold leading-none tracking-tight text-[#172033] dark:text-[#F8FAFC] sm:text-[30px]">
              {dashboard?.totalTests ?? 0}
            </div>
          </CardContent>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-[#3478F6]/70 dark:bg-[#78A8FF]/70" />
        </Card>
        <Card className="relative min-w-0 gap-0 overflow-hidden rounded-xl border border-[#DCE5EF] bg-white py-0 text-[#172033] shadow-[0_2px_8px_rgba(23,32,51,0.04)] ring-0 dark:border-[#262D45] dark:bg-[#10172A] dark:text-[#F8FAFC]">
          <CardHeader className="flex flex-row items-center gap-2.5 px-3 pt-3 pb-2 sm:gap-3 sm:px-4 sm:pt-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E4D8FF] bg-[#F0E9FF] text-[#8247FF] dark:border-[#443366] dark:bg-[#2A2145] dark:text-[#B497FF] sm:h-10 sm:w-10">
              <Trophy className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <CardTitle className="min-w-0 text-xs font-medium leading-snug text-[#64748B] dark:text-[#A5B4CC] sm:text-[13px]">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-4 sm:px-4">
            <div className="text-[26px] font-bold leading-none tracking-tight text-[#172033] dark:text-[#F8FAFC] sm:text-[30px]">
              {dashboard?.avgScore
                ? `${Math.round(dashboard.avgScore)}%`
                : "0%"}
            </div>
          </CardContent>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-[#8247FF]/70 dark:bg-[#B497FF]/70" />
        </Card>
        <Card className="relative min-w-0 gap-0 overflow-hidden rounded-xl border border-[#DCE5EF] bg-white py-0 text-[#172033] shadow-[0_2px_8px_rgba(23,32,51,0.04)] ring-0 dark:border-[#262D45] dark:bg-[#10172A] dark:text-[#F8FAFC]">
          <CardHeader className="flex flex-row items-center gap-2.5 px-3 pt-3 pb-2 sm:gap-3 sm:px-4 sm:pt-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#C6ECDD] bg-[#E2F8F0] text-[#0DAB88] dark:border-[#285247] dark:bg-[#17352F] dark:text-[#42D2AE] sm:h-10 sm:w-10">
              <Target className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <CardTitle className="min-w-0 text-xs font-medium leading-snug text-[#64748B] dark:text-[#A5B4CC] sm:text-[13px]">
              Questions Solved
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-4 sm:px-4">
            <div className="text-[26px] font-bold leading-none tracking-tight text-[#172033] dark:text-[#F8FAFC] sm:text-[30px]">
              {questionsSolved}
            </div>
          </CardContent>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-[#0DAB88]/70 dark:bg-[#42D2AE]/70" />
        </Card>
        <Card className="relative min-w-0 gap-0 overflow-hidden rounded-xl border border-[#DCE5EF] bg-white py-0 text-[#172033] shadow-[0_2px_8px_rgba(23,32,51,0.04)] ring-0 dark:border-[#262D45] dark:bg-[#10172A] dark:text-[#F8FAFC]">
          <CardHeader className="flex flex-row items-center gap-2.5 px-3 pt-3 pb-2 sm:gap-3 sm:px-4 sm:pt-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#F8DFC8] bg-[#FFF1E4] text-[#E57925] dark:border-[#5A3D2B] dark:bg-[#3A2A20] dark:text-[#FFAE68] sm:h-10 sm:w-10">
              <Clock className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <CardTitle className="min-w-0 text-xs font-medium leading-snug text-[#64748B] dark:text-[#A5B4CC] sm:text-[13px]">
              Time Practiced
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-4 sm:px-4">
            <div className="text-[26px] font-bold leading-none tracking-tight text-[#172033] dark:text-[#F8FAFC] sm:text-[30px]">
              {formatTime(dashboard?.totalTimeSpent ?? 0)}
            </div>
          </CardContent>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-[#E57925]/70 dark:bg-[#FFAE68]/70" />
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
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {testSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.title}
                href={section.href}
                className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C42F5] focus-visible:ring-offset-2 dark:focus-visible:ring-[#A98BFF] dark:focus-visible:ring-offset-[#080D1C]"
              >
                <Card className="h-full min-h-37 min-w-0 gap-3 rounded-xl border border-[#DCE5EF] bg-white py-4 text-[#172033] ring-0 shadow-[0_2px_8px_rgba(23,32,51,0.04)] transition-[border-color,box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-[#B9C9DD] group-hover:shadow-[0_8px_18px_rgba(23,32,51,0.08)] group-active:translate-y-0 dark:border-[#262D45] dark:bg-[#10172A] dark:text-[#F8FAFC] dark:shadow-none dark:group-hover:border-[#3B4966] dark:group-hover:shadow-[0_8px_18px_rgba(0,0,0,0.18)]">
                  <CardHeader className="min-w-0 gap-2 px-4 py-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border ${section.iconBorder} ${section.bg} ${section.color}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex min-w-0 items-center justify-between gap-2">
                      <CardTitle className="min-w-0 text-[15px] font-semibold leading-snug text-[#172033] dark:text-[#F8FAFC]">
                        {section.title}
                      </CardTitle>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:text-[#3478F6] dark:text-[#8492AD] dark:group-hover:text-[#A5B4CC]" aria-hidden="true" />
                    </div>
                    <CardDescription className="text-[13px] text-[#64748B] dark:text-[#A5B4CC]">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Company Preparation — featured Infosys Hiring 2027 */}
      <CompanyPreparation />

      {/* Full Mock Test CTA */}
      <Card className="relative isolate overflow-hidden rounded-2xl bg-white p-0 text-[#18181B] ring-1 ring-[#E4E4E7] shadow-[0_8px_24px_rgba(24,24,27,0.06)] dark:bg-[#10172A] dark:text-[#F8FAFC] dark:ring-[#262D45] dark:shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-1.5 flex-col">
          <span className="h-1/3 bg-[#6C42F5] dark:bg-[#7028FF]" />
          <span className="h-1/3 bg-[#06B6D4] dark:bg-[#00C8FF]" />
          <span className="h-1/3 bg-[#FF6B45] dark:bg-[#FF6B35]" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] sm:block">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_16px,rgba(108,66,245,0.07)_16px_18px,transparent_18px_32px)] dark:hidden" />
          <div className="absolute -right-10 -top-16 h-64 w-16 rotate-[35deg] bg-[#7028FF]/[0.10] dark:bg-[#7028FF]/20" />
          <div className="absolute right-8 top-1/4 h-64 w-10 rotate-[35deg] bg-[#00C8FF]/[0.12] dark:bg-[#00C8FF]/20" />
          <div className="absolute right-24 -bottom-28 h-64 w-9 rotate-[35deg] bg-[#FF6B35]/[0.12] dark:bg-[#FF6B35]/20" />
        </div>

        <div className="relative z-20 grid min-w-0 gap-5 p-4 pl-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:p-6 sm:pl-7 lg:p-7 lg:pl-8">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E8E1FF] bg-[#F5F3FF] text-[#6C42F5] dark:border-[#3B3159] dark:bg-[#211A36] dark:text-[#B79CFF] sm:h-12 sm:w-12">
              <FileText className="h-5 w-5 sm:h-[22px] sm:w-[22px]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <CardHeader className="gap-1 p-0">
                <CardTitle className="text-[clamp(1.125rem,2.4vw,1.5rem)] font-semibold leading-tight tracking-tight text-[#18181B] dark:text-[#F8FAFC]">
                  Full Mock Test (Easy Mode)
                </CardTitle>
                <CardDescription className="text-[13px] leading-relaxed text-[#71717A] dark:text-[#A5B4CC] sm:text-sm">
                  A complete TCS NQT simulation built for focused practice.
                </CardDescription>
              </CardHeader>
              <div className="mt-3 flex flex-wrap gap-2" aria-label="Mock test details">
                <span className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-[#E4E4E7] bg-[#FAFAFA] px-2.5 text-xs font-medium text-[#3F3F46] dark:border-[#303951] dark:bg-[#151E34] dark:text-[#D3DCEE]">
                  <FileText className="h-3.5 w-3.5 text-[#6C42F5] dark:text-[#A98BFF]" aria-hidden="true" />
                  79 Questions
                </span>
                <span className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-[#E4E4E7] bg-[#FAFAFA] px-2.5 text-xs font-medium text-[#3F3F46] dark:border-[#303951] dark:bg-[#151E34] dark:text-[#D3DCEE]">
                  <Clock className="h-3.5 w-3.5 text-[#07869B] dark:text-[#35D2E8]" aria-hidden="true" />
                  120 Minutes
                </span>
                <span className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-[#E4E4E7] bg-[#FAFAFA] px-2.5 text-xs font-medium text-[#3F3F46] dark:border-[#303951] dark:bg-[#151E34] dark:text-[#D3DCEE]">
                  <Target className="h-3.5 w-3.5 text-[#D65435] dark:text-[#FF8C67]" aria-hidden="true" />
                  Easy Mode
                </span>
              </div>
            </div>
          </div>

          <div className="min-w-0 sm:justify-self-end">
            <Button
              className="h-12 w-full whitespace-nowrap rounded-lg bg-[#6C42F5] px-5 text-sm font-bold text-white shadow-[0_5px_14px_rgba(108,66,245,0.20)] transition-colors hover:bg-[#5730D8] focus-visible:ring-2 focus-visible:ring-[#6C42F5] focus-visible:ring-offset-2 dark:bg-gradient-to-r dark:from-[#7028FF] dark:to-[#4C58E8] dark:shadow-none dark:hover:shadow-[0_0_18px_rgba(112,40,255,0.22)] dark:focus-visible:ring-[#00C8FF] sm:w-auto sm:px-6"
              render={<Link href="/tests/mock" />}
            >
              Start Mock Test
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Premium Unlock CTA */}
      <Card className="overflow-hidden border-[#DDE5F5] bg-[#F3F6FF] shadow-sm dark:border-violet-500/40 dark:bg-[linear-gradient(135deg,rgba(91,33,182,0.55),rgba(28,25,47,0.98))]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7047FF] text-white shadow-md shadow-violet-500/30">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                Unlock Premium Access
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Hard Mode tests, live analytics, and smarter preparation insights
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm dark:bg-white/8 dark:text-slate-100">
              <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-300" />
              Hard Mode Mock Tests
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm dark:bg-white/8 dark:text-slate-100">
              <Trophy className="h-4 w-4 text-violet-600 dark:text-violet-300" />
              Advanced Analytics
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm dark:bg-white/8 dark:text-slate-100">
              <Target className="h-4 w-4 text-violet-600 dark:text-violet-300" />
              Performance Intelligence
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              href="/premium"
              className="relative z-10 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-violet-700 to-purple-600 px-5 py-2.5 font-semibold text-white shadow-[0_8px_28px_rgba(124,58,237,0.26)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(124,58,237,0.40)] text-sm"
            >
              Unlock Lifetime Access
            </Link>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
              <span className="font-bold text-violet-700 dark:text-violet-300">₹49</span> one-time • No subscription • Lifetime access
            </span>
          </div>

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
                <span className="text-muted-foreground">65 Qs • 75 mins</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Advanced Section</span>
                <span className="text-muted-foreground">14 Qs • 25 mins</span>
              </div>
              <Progress value={18} className="h-2" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline">No Negative Marking (Foundation)</Badge>
            <Badge variant="outline">Total: 79 Questions</Badge>
            <Badge variant="outline">Duration: 120 Minutes</Badge>
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
              {history.filter((item) => item.test).map((item) => (
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
