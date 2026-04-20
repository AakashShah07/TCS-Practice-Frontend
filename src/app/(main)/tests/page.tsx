"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Calculator,
  Brain,
  BookOpen,
  Zap,
  FileText,
  ArrowRight,
  Users,
  Flame,
  Sigma,
  Target,
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
import { fetchTests } from "@/lib/api/tests";
import type { Test } from "@/lib/api/types";

const testCategories = [
  {
    title: "Foundation Section",
    description: "Core aptitude tests covering numerical, reasoning, and verbal abilities",
    badge: "25 Questions • 30 Minutes per test",
    tests: [
      {
        title: "Numerical Ability",
        description:
          "Percentages, Ratios, Time-Speed-Distance, Algebra, Geometry, Averages, Profit-Loss, Number Systems",
        questions: 25,
        duration: 30,
        icon: Calculator,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950",
        href: "/tests/foundation?section=numerical",
      },
      {
        title: "Logical Reasoning",
        description:
          "Series, Blood Relations, Coding-Decoding, Syllogisms, Puzzles, Data Interpretation",
        questions: 25,
        duration: 30,
        icon: Brain,
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-950",
        href: "/tests/foundation?section=reasoning",
      },
      {
        title: "Verbal Ability",
        description:
          "Reading Comprehension, Grammar, Vocabulary, Sentence Correction",
        questions: 25,
        duration: 30,
        icon: BookOpen,
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-950",
        href: "/tests/foundation?section=verbal",
      },
    ],
  },
  {
    title: "Advanced Section",
    description: "Higher-level quantitative and reasoning problems",
    badge: "25 Questions • 30 Minutes",
    tests: [
      {
        title: "Advanced Quantitative & Reasoning",
        description:
          "Advanced level questions combining quantitative aptitude with complex reasoning",
        questions: 25,
        duration: 30,
        icon: Zap,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-950",
        href: "/tests/advanced",
      },
    ],
  },
];

export default function TestsPage() {
  const [bloodRelationTest, setBloodRelationTest] = useState<Test | null>(null);
  const [simplificationTest, setSimplificationTest] = useState<Test | null>(null);
  const [approximationTest, setApproximationTest] = useState<Test | null>(null);

  useEffect(() => {
    async function loadSpecialTests() {
      try {
        const data = await fetchTests({ type: "topic_practice" });
        const brTest = data.find((t) => t.topic === "Blood Relations");
        if (brTest) setBloodRelationTest(brTest);
        const simpTest = data.find((t) => t.topic === "Simplification");
        if (simpTest) setSimplificationTest(simpTest);
        const approxTest = data.find((t) => t.topic === "Approximation");
        if (approxTest) setApproximationTest(approxTest);
      } catch {
        // API not ready
      }
    }
    loadSpecialTests();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
        <p className="text-muted-foreground mt-1">
          Choose a section to practice or take a full mock test
        </p>
      </div>

      {/* Full Mock Test */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Full Mock Test</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Complete TCS NQT exam simulation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex gap-3">
            <Badge variant="secondary">79 Questions</Badge>
            <Badge variant="secondary">120 Minutes</Badge>
            <Badge variant="secondary">All Sections</Badge>
          </div>
          <Button variant="secondary" render={<Link href="/tests/mock" />}>
              Start Test <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Blood Relations Special Card */}
      {bloodRelationTest && (
        <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 dark:from-red-950/30 dark:via-orange-950/20 dark:to-amber-950/20 dark:border-red-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-100/40 dark:bg-red-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100/40 dark:bg-orange-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-red-900 dark:text-red-100">
                    Blood Relations Challenge
                  </CardTitle>
                  <Flame className="h-5 w-5 text-orange-500 dark:text-orange-400 animate-pulse" />
                </div>
                <CardDescription className="text-red-700/80 dark:text-red-300/80">
                  Master family tree puzzles — coded relations, generation chains, gender traps & more
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700">
                {bloodRelationTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-700">
                {Math.round(bloodRelationTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700">
                {bloodRelationTest.section ? bloodRelationTest.section.charAt(0).toUpperCase() + bloodRelationTest.section.slice(1) : "Reasoning"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              render={<Link href={`/exam/${bloodRelationTest._id}`} target="_blank" />}
            >
              Take Challenge <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Simplification Practice Card */}
      {simplificationTest && (
        <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-cyan-950/20 dark:border-blue-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/40 dark:bg-blue-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Sigma className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                    Simplification Practice
                  </CardTitle>
                  <Calculator className="h-5 w-5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                </div>
                <CardDescription className="text-blue-700/80 dark:text-blue-300/80">
                  BODMAS, fractions, roots, exponents, percentages & algebraic identities
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700">
                {simplificationTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-700">
                {Math.round(simplificationTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-200 dark:border-cyan-700">
                {simplificationTest.section ? simplificationTest.section.charAt(0).toUpperCase() + simplificationTest.section.slice(1) : "Numerical"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              render={<Link href={`/exam/${simplificationTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Approximation Challenge Card */}
      {approximationTest && (
        <Card className="relative overflow-hidden border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-green-950/20 dark:border-emerald-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-100/40 dark:bg-emerald-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-100/40 dark:bg-teal-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-emerald-900 dark:text-emerald-100">
                    Approximation Challenge
                  </CardTitle>
                  <Flame className="h-5 w-5 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                </div>
                <CardDescription className="text-emerald-700/80 dark:text-emerald-300/80">
                  Square roots, cube roots, percentages & complex mixed operations — round smartly!
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700">
                {approximationTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700">
                {Math.round(approximationTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700">
                {approximationTest.section ? approximationTest.section.charAt(0).toUpperCase() + approximationTest.section.slice(1) : "Numerical"}
              </Badge>
              <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700">
                Hard Only
              </Badge>
            </div>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              render={<Link href={`/exam/${approximationTest._id}`} target="_blank" />}
            >
              Take Challenge <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Test Categories */}
      {testCategories.map((category) => (
        <div key={category.title} className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{category.title}</h2>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.tests.map((test) => {
              const Icon = test.icon;
              return (
                <Link key={test.title} href={test.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div
                        className={`w-10 h-10 rounded-lg ${test.bg} flex items-center justify-center mb-2`}
                      >
                        <Icon className={`h-5 w-5 ${test.color}`} />
                      </div>
                      <CardTitle className="text-base">{test.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {test.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Badge variant="outline">{test.questions} Qs</Badge>
                        <Badge variant="outline">{test.duration} mins</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
