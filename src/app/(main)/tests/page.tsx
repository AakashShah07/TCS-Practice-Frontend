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
  Percent,
  Clock,
  Divide,
  Ruler,
  Gauge,
  Dices,
  Shuffle,
  BookOpenText,
  PenLine,
  AlertTriangle,
  ScrollText,
  BarChart3,
  IndianRupee,
  Hourglass,
  KeyRound,
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
  const [percentageTest, setPercentageTest] = useState<Test | null>(null);
  const [timeWorkTest, setTimeWorkTest] = useState<Test | null>(null);
  const [lcmHcfTest, setLcmHcfTest] = useState<Test | null>(null);
  const [mensurationTest, setMensurationTest] = useState<Test | null>(null);
  const [stdTest, setStdTest] = useState<Test | null>(null);
  const [probabilityTest, setProbabilityTest] = useState<Test | null>(null);
  const [paraJumbleTest, setParaJumbleTest] = useState<Test | null>(null);
  const [rcTest, setRcTest] = useState<Test | null>(null);
  const [vocabTest, setVocabTest] = useState<Test | null>(null);
  const [errorDetectionTest, setErrorDetectionTest] = useState<Test | null>(null);
  const [passageFillBlankTest, setPassageFillBlankTest] = useState<Test | null>(null);
  const [averageTest, setAverageTest] = useState<Test | null>(null);
  const [profitLossTest, setProfitLossTest] = useState<Test | null>(null);
  const [agesTest, setAgesTest] = useState<Test | null>(null);
  const [codingDecodingTest, setCodingDecodingTest] = useState<Test | null>(null);
  const [specialLoading, setSpecialLoading] = useState(true);

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
        const pctTest = data.find((t) => t.topic === "Ratio & Percentage");
        if (pctTest) setPercentageTest(pctTest);
        const twTest = data.find((t) => t.topic === "Time & Work");
        if (twTest) setTimeWorkTest(twTest);
        const lhTest = data.find((t) => t.topic === "LCM & HCF");
        if (lhTest) setLcmHcfTest(lhTest);
        const menTest = data.find((t) => t.topic === "Mensuration");
        if (menTest) setMensurationTest(menTest);
        const stdData = data.find((t) => t.topic === "Speed, Time & Distance");
        if (stdData) setStdTest(stdData);
        const probTest = data.find((t) => t.topic === "Probability, Permutation & Combination");
        if (probTest) setProbabilityTest(probTest);
        const pjTest = data.find((t) => t.topic === "Para Jumble");
        if (pjTest) setParaJumbleTest(pjTest);
        const rcData = data.find((t) => t.topic === "Reading Comprehension");
        if (rcData) setRcTest(rcData);
        const vocData = data.find((t) => t.topic === "Vocabulary Fill in the Blank");
        if (vocData) setVocabTest(vocData);
        const edTest = data.find((t) => t.topic === "Error Detection");
        if (edTest) setErrorDetectionTest(edTest);
        const pfbTest = data.find((t) => t.topic === "Passage Fill in the Blank");
        if (pfbTest) setPassageFillBlankTest(pfbTest);
        const avgTest = data.find((t) => t.topic === "Average");
        if (avgTest) setAverageTest(avgTest);
        const plTest = data.find((t) => t.topic === "Profit & Loss");
        if (plTest) setProfitLossTest(plTest);
        const ageTest = data.find((t) => t.topic === "Problems on Ages");
        if (ageTest) setAgesTest(ageTest);
        const cdTest = data.find((t) => t.topic === "Coding Decoding");
        if (cdTest) setCodingDecodingTest(cdTest);
      } catch {
        // API not ready
      } finally {
        setSpecialLoading(false);
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

      {/* Loading skeletons for special test cards */}
      {specialLoading && (
        <div className="space-y-6">
          {[
            { border: "border-red-200 dark:border-red-800", from: "from-red-50 dark:from-red-950/30", via: "via-orange-50 dark:via-orange-950/20", to: "to-amber-50 dark:to-amber-950/20", shimmer: "bg-red-200/60 dark:bg-red-800/40" },
            { border: "border-blue-200 dark:border-blue-800", from: "from-blue-50 dark:from-blue-950/30", via: "via-indigo-50 dark:via-indigo-950/20", to: "to-cyan-50 dark:to-cyan-950/20", shimmer: "bg-blue-200/60 dark:bg-blue-800/40" },
            { border: "border-emerald-200 dark:border-emerald-800", from: "from-emerald-50 dark:from-emerald-950/30", via: "via-teal-50 dark:via-teal-950/20", to: "to-green-50 dark:to-green-950/20", shimmer: "bg-emerald-200/60 dark:bg-emerald-800/40" },
            { border: "border-amber-200 dark:border-amber-800", from: "from-amber-50 dark:from-amber-950/30", via: "via-yellow-50 dark:via-yellow-950/20", to: "to-orange-50 dark:to-orange-950/20", shimmer: "bg-amber-200/60 dark:bg-amber-800/40" },
            { border: "border-violet-200 dark:border-violet-800", from: "from-violet-50 dark:from-violet-950/30", via: "via-purple-50 dark:via-purple-950/20", to: "to-fuchsia-50 dark:to-fuchsia-950/20", shimmer: "bg-violet-200/60 dark:bg-violet-800/40" },
            { border: "border-cyan-200 dark:border-cyan-800", from: "from-cyan-50 dark:from-cyan-950/30", via: "via-sky-50 dark:via-sky-950/20", to: "to-teal-50 dark:to-teal-950/20", shimmer: "bg-cyan-200/60 dark:bg-cyan-800/40" },
            { border: "border-rose-200 dark:border-rose-800", from: "from-rose-50 dark:from-rose-950/30", via: "via-pink-50 dark:via-pink-950/20", to: "to-red-50 dark:to-red-950/20", shimmer: "bg-rose-200/60 dark:bg-rose-800/40" },
            { border: "border-teal-200 dark:border-teal-800", from: "from-teal-50 dark:from-teal-950/30", via: "via-cyan-50 dark:via-cyan-950/20", to: "to-sky-50 dark:to-sky-950/20", shimmer: "bg-teal-200/60 dark:bg-teal-800/40" },
            { border: "border-lime-200 dark:border-lime-800", from: "from-lime-50 dark:from-lime-950/30", via: "via-green-50 dark:via-green-950/20", to: "to-emerald-50 dark:to-emerald-950/20", shimmer: "bg-lime-200/60 dark:bg-lime-800/40" },
            { border: "border-fuchsia-200 dark:border-fuchsia-800", from: "from-fuchsia-50 dark:from-fuchsia-950/30", via: "via-pink-50 dark:via-pink-950/20", to: "to-purple-50 dark:to-purple-950/20", shimmer: "bg-fuchsia-200/60 dark:bg-fuchsia-800/40" },
            { border: "border-orange-200 dark:border-orange-800", from: "from-orange-50 dark:from-orange-950/30", via: "via-amber-50 dark:via-amber-950/20", to: "to-yellow-50 dark:to-yellow-950/20", shimmer: "bg-orange-200/60 dark:bg-orange-800/40" },
            { border: "border-sky-200 dark:border-sky-800", from: "from-sky-50 dark:from-sky-950/30", via: "via-blue-50 dark:via-blue-950/20", to: "to-indigo-50 dark:to-indigo-950/20", shimmer: "bg-sky-200/60 dark:bg-sky-800/40" },
            { border: "border-pink-200 dark:border-pink-800", from: "from-pink-50 dark:from-pink-950/30", via: "via-red-50 dark:via-red-950/20", to: "to-rose-50 dark:to-rose-950/20", shimmer: "bg-pink-200/60 dark:bg-pink-800/40" },
            { border: "border-indigo-200 dark:border-indigo-800", from: "from-indigo-50 dark:from-indigo-950/30", via: "via-violet-50 dark:via-violet-950/20", to: "to-blue-50 dark:to-blue-950/20", shimmer: "bg-indigo-200/60 dark:bg-indigo-800/40" },
            { border: "border-yellow-200 dark:border-yellow-800", from: "from-yellow-50 dark:from-yellow-950/30", via: "via-amber-50 dark:via-amber-950/20", to: "to-lime-50 dark:to-lime-950/20", shimmer: "bg-yellow-200/60 dark:bg-yellow-800/40" },
            { border: "border-green-200 dark:border-green-800", from: "from-green-50 dark:from-green-950/30", via: "via-emerald-50 dark:via-emerald-950/20", to: "to-teal-50 dark:to-teal-950/20", shimmer: "bg-green-200/60 dark:bg-green-800/40" },
            { border: "border-purple-200 dark:border-purple-800", from: "from-purple-50 dark:from-purple-950/30", via: "via-blue-50 dark:via-blue-950/20", to: "to-violet-50 dark:to-violet-950/20", shimmer: "bg-purple-200/60 dark:bg-purple-800/40" },
            { border: "border-slate-200 dark:border-slate-700", from: "from-slate-50 dark:from-slate-950/30", via: "via-zinc-50 dark:via-zinc-950/20", to: "to-stone-50 dark:to-stone-950/20", shimmer: "bg-slate-200/60 dark:bg-slate-700/40" },
          ].map((s, i) => (
            <Card
              key={i}
              className={`relative overflow-hidden border-2 ${s.border} bg-gradient-to-r ${s.from} ${s.via} ${s.to}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Shimmer sweep */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" style={{ animationDelay: `${i * 200}ms` }} />
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${s.shimmer} animate-pulse`} />
                  <div className="flex-1 space-y-2.5">
                    <div className={`h-5 w-48 rounded-md ${s.shimmer} animate-pulse`} />
                    <div className={`h-3.5 w-72 rounded-md ${s.shimmer} animate-pulse opacity-60`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {[20, 24, 22, 20].map((w, j) => (
                    <div key={j} className={`h-6 rounded-full ${s.shimmer} animate-pulse`} style={{ width: `${w * 4}px`, animationDelay: `${j * 100}ms` }} />
                  ))}
                </div>
                <div className={`h-9 w-32 rounded-lg ${s.shimmer} animate-pulse`} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Blood Relations Special Card */}
      {!specialLoading && bloodRelationTest && (
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
      {!specialLoading && simplificationTest && (
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
      {!specialLoading && approximationTest && (
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

      {/* Percentage Practice Card */}
      {!specialLoading && percentageTest && (
        <Card className="relative overflow-hidden border-2 border-amber-200 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/20 dark:border-amber-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-100/40 dark:bg-amber-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-100/40 dark:bg-yellow-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Percent className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-amber-900 dark:text-amber-100">
                    Ratio & Percentage Practice
                  </CardTitle>
                  <Flame className="h-5 w-5 text-yellow-500 dark:text-yellow-400 animate-pulse" />
                </div>
                <CardDescription className="text-amber-700/80 dark:text-amber-300/80">
                  Ratios, proportions, profit & loss, discounts, successive percentage changes & more
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700">
                {percentageTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700">
                {Math.round(percentageTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-700">
                {percentageTest.section ? percentageTest.section.charAt(0).toUpperCase() + percentageTest.section.slice(1) : "Numerical"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white"
              render={<Link href={`/exam/${percentageTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Time & Work Practice Card */}
      {!specialLoading && timeWorkTest && (
        <Card className="relative overflow-hidden border-2 border-violet-200 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/30 dark:via-purple-950/20 dark:to-fuchsia-950/20 dark:border-violet-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-violet-100/40 dark:bg-violet-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100/40 dark:bg-purple-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Clock className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-violet-900 dark:text-violet-100">
                    Time & Work Practice
                  </CardTitle>
                  <Flame className="h-5 w-5 text-purple-500 dark:text-purple-400 animate-pulse" />
                </div>
                <CardDescription className="text-violet-700/80 dark:text-violet-300/80">
                  Pipes & cisterns, work efficiency, alternate days, combined work rates & more
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:border-violet-700">
                {timeWorkTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                {Math.round(timeWorkTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/40 dark:text-fuchsia-200 dark:border-fuchsia-700">
                {timeWorkTest.section ? timeWorkTest.section.charAt(0).toUpperCase() + timeWorkTest.section.slice(1) : "Numerical"}
              </Badge>
              <Badge className="bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-violet-600 hover:bg-violet-700 text-white"
              render={<Link href={`/exam/${timeWorkTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* LCM & HCF Practice Card */}
      {!specialLoading && lcmHcfTest && (
        <Card className="relative overflow-hidden border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 via-sky-50 to-teal-50 dark:from-cyan-950/30 dark:via-sky-950/20 dark:to-teal-950/20 dark:border-cyan-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-100/40 dark:bg-cyan-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-sky-100/40 dark:bg-sky-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center">
                <Divide className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-cyan-900 dark:text-cyan-100">
                    LCM & HCF Practice
                  </CardTitle>
                  <Flame className="h-5 w-5 text-sky-500 dark:text-sky-400 animate-pulse" />
                </div>
                <CardDescription className="text-cyan-700/80 dark:text-cyan-300/80">
                  Least common multiples, highest common factors, prime factorization & word problems
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-200 dark:border-cyan-700">
                {lcmHcfTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-700">
                {Math.round(lcmHcfTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700">
                {lcmHcfTest.section ? lcmHcfTest.section.charAt(0).toUpperCase() + lcmHcfTest.section.slice(1) : "Numerical"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              render={<Link href={`/exam/${lcmHcfTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mensuration Practice Card */}
      {!specialLoading && mensurationTest && (
        <Card className="relative overflow-hidden border-2 border-rose-200 bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 dark:from-rose-950/30 dark:via-pink-950/20 dark:to-red-950/20 dark:border-rose-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-rose-100/40 dark:bg-rose-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100/40 dark:bg-pink-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                <Ruler className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-rose-900 dark:text-rose-100">
                    Mensuration Practice
                  </CardTitle>
                  <Flame className="h-5 w-5 text-pink-500 dark:text-pink-400 animate-pulse" />
                </div>
                <CardDescription className="text-rose-700/80 dark:text-rose-300/80">
                  Area, perimeter, volume, surface area — circles, triangles, cylinders, cones & more
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700">
                {mensurationTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700">
                {Math.round(mensurationTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700">
                {mensurationTest.section ? mensurationTest.section.charAt(0).toUpperCase() + mensurationTest.section.slice(1) : "Numerical"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              render={<Link href={`/exam/${mensurationTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Speed, Time & Distance Practice Card */}
      {!specialLoading && stdTest && (
        <Card className="relative overflow-hidden border-2 border-teal-200 bg-gradient-to-r from-teal-50 via-cyan-50 to-sky-50 dark:from-teal-950/30 dark:via-cyan-950/20 dark:to-sky-950/20 dark:border-teal-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-teal-100/40 dark:bg-teal-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100/40 dark:bg-cyan-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                <Gauge className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-teal-900 dark:text-teal-100">
                    Speed, Time & Distance Practice
                  </CardTitle>
                  <Flame className="h-5 w-5 text-cyan-500 dark:text-cyan-400 animate-pulse" />
                </div>
                <CardDescription className="text-teal-700/80 dark:text-teal-300/80">
                  Relative speed, trains, boats & streams, average speed, circular tracks & more
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700">
                {stdTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-200 dark:border-cyan-700">
                {Math.round(stdTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-700">
                {stdTest.section ? stdTest.section.charAt(0).toUpperCase() + stdTest.section.slice(1) : "Numerical"}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white"
              render={<Link href={`/exam/${stdTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Probability, Permutation & Combination Practice Card */}
      {!specialLoading && probabilityTest && (
        <Card className="relative overflow-hidden border-2 border-lime-200 bg-gradient-to-r from-lime-50 via-green-50 to-emerald-50 dark:from-lime-950/30 dark:via-green-950/20 dark:to-emerald-950/20 dark:border-lime-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-lime-100/40 dark:bg-lime-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100/40 dark:bg-green-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-lime-100 dark:bg-lime-900/40 flex items-center justify-center">
                <Dices className="h-6 w-6 text-lime-600 dark:text-lime-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-lime-900 dark:text-lime-100">
                    Probability, Permutation & Combination
                  </CardTitle>
                  <Flame className="h-5 w-5 text-green-500 dark:text-green-400 animate-pulse" />
                </div>
                <CardDescription className="text-lime-700/80 dark:text-lime-300/80">
                  Classical probability, conditional probability, arrangements, selections, factorial problems & more
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/40 dark:text-lime-200 dark:border-lime-700">
                {probabilityTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700">
                {Math.round(probabilityTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700">
                {probabilityTest.section ? probabilityTest.section.charAt(0).toUpperCase() + probabilityTest.section.slice(1) : "Numerical"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-lime-600 hover:bg-lime-700 text-white"
              render={<Link href={`/exam/${probabilityTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Para Jumble Practice Card */}
      {!specialLoading && paraJumbleTest && (
        <Card className="relative overflow-hidden border-2 border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 via-pink-50 to-purple-50 dark:from-fuchsia-950/30 dark:via-pink-950/20 dark:to-purple-950/20 dark:border-fuchsia-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-fuchsia-100/40 dark:bg-fuchsia-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100/40 dark:bg-pink-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/40 flex items-center justify-center">
                <Shuffle className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-fuchsia-900 dark:text-fuchsia-100">
                    Para Jumble Practice
                  </CardTitle>
                  <Flame className="h-5 w-5 text-pink-500 dark:text-pink-400 animate-pulse" />
                </div>
                <CardDescription className="text-fuchsia-700/80 dark:text-fuchsia-300/80">
                  Sentence rearrangement, logical sequencing, paragraph coherence & transition clues
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/40 dark:text-fuchsia-200 dark:border-fuchsia-700">
                {paraJumbleTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700">
                {Math.round(paraJumbleTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                {paraJumbleTest.section ? paraJumbleTest.section.charAt(0).toUpperCase() + paraJumbleTest.section.slice(1) : "Verbal"}
              </Badge>
              <Badge className="bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:border-violet-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
              render={<Link href={`/exam/${paraJumbleTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reading Comprehension Practice Card */}
      {!specialLoading && rcTest && (
        <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-yellow-950/20 dark:border-orange-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100/40 dark:bg-orange-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-100/40 dark:bg-amber-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <BookOpenText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-orange-900 dark:text-orange-100">
                    Reading Comprehension Practice
                  </CardTitle>
                  <Flame className="h-5 w-5 text-amber-500 dark:text-amber-400 animate-pulse" />
                </div>
                <CardDescription className="text-orange-700/80 dark:text-orange-300/80">
                  Passage-based questions, inference, main idea, tone, vocabulary in context & critical reasoning
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-700">
                {rcTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700">
                {Math.round(rcTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700">
                {rcTest.section ? rcTest.section.charAt(0).toUpperCase() + rcTest.section.slice(1) : "Verbal"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              render={<Link href={`/exam/${rcTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Vocabulary Fill in the Blank Practice Card */}
      {!specialLoading && vocabTest && (
        <Card className="relative overflow-hidden border-2 border-sky-200 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 dark:from-sky-950/30 dark:via-blue-950/20 dark:to-indigo-950/20 dark:border-sky-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-sky-100/40 dark:bg-sky-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100/40 dark:bg-blue-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
                <PenLine className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-sky-900 dark:text-sky-100">
                    Vocabulary Fill in the Blank
                  </CardTitle>
                  <Flame className="h-5 w-5 text-blue-500 dark:text-blue-400 animate-pulse" />
                </div>
                <CardDescription className="text-sky-700/80 dark:text-sky-300/80">
                  Contextual word usage, idioms, phrasal verbs, synonyms, antonyms & sentence completion
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-700">
                {vocabTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700">
                {Math.round(vocabTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-700">
                {vocabTest.section ? vocabTest.section.charAt(0).toUpperCase() + vocabTest.section.slice(1) : "Verbal"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-sky-600 hover:bg-sky-700 text-white"
              render={<Link href={`/exam/${vocabTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error Detection Practice Card */}
      {!specialLoading && errorDetectionTest && (
        <Card className="relative overflow-hidden border-2 border-pink-200 bg-gradient-to-r from-pink-50 via-red-50 to-rose-50 dark:from-pink-950/30 dark:via-red-950/20 dark:to-rose-950/20 dark:border-pink-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-pink-100/40 dark:bg-pink-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-100/40 dark:bg-red-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-pink-900 dark:text-pink-100">
                    Error Detection Practice
                  </CardTitle>
                  <Flame className="h-5 w-5 text-red-500 dark:text-red-400 animate-pulse" />
                </div>
                <CardDescription className="text-pink-700/80 dark:text-pink-300/80">
                  Spot grammatical errors — subject-verb agreement, tense, prepositions, articles & sentence structure
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700">
                {errorDetectionTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700">
                {Math.round(errorDetectionTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-700">
                {errorDetectionTest.section ? errorDetectionTest.section.charAt(0).toUpperCase() + errorDetectionTest.section.slice(1) : "Verbal"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white"
              render={<Link href={`/exam/${errorDetectionTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Passage Fill in the Blank Practice Card */}
      {!specialLoading && passageFillBlankTest && (
        <Card className="relative overflow-hidden border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 via-violet-50 to-blue-50 dark:from-indigo-950/30 dark:via-violet-950/20 dark:to-blue-950/20 dark:border-indigo-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-100/40 dark:bg-violet-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <ScrollText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100">
                    Passage Fill in the Blank
                  </CardTitle>
                  <Flame className="h-5 w-5 text-violet-500 dark:text-violet-400 animate-pulse" />
                </div>
                <CardDescription className="text-indigo-700/80 dark:text-indigo-300/80">
                  Read a passage with numbered blanks and choose the correct word for each blank from the options
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {/* Mini passage preview */}
            <div className="rounded-lg border border-indigo-200 dark:border-indigo-700/50 bg-white/80 dark:bg-indigo-950/40 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Left: Passage */}
              <div className="text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed">
                <p>
                  Once two friends were passing through a{" "}
                  <span className="text-indigo-500 dark:text-indigo-400 font-bold">...(1)...</span>{" "}
                  forest. A bear came out of its cave. It began to{" "}
                  <span className="text-indigo-500 dark:text-indigo-400 font-bold">...(2)...</span>{" "}
                  Both felt terrified. The fair-weather friend ran{" "}
                  <span className="text-indigo-500 dark:text-indigo-400 font-bold">...(3)...</span>{" "}
                  and climbed up a tall tree. The other laid himself on the ground and{" "}
                  <span className="text-indigo-500 dark:text-indigo-400 font-bold">...(4)...</span>{" "}
                  to be dead.
                </p>
              </div>
              {/* Right: Options */}
              <div className="space-y-1.5 text-indigo-800/90 dark:text-indigo-200/90 text-xs">
                <p><span className="font-semibold">1.</span> (A) volatile (B) precarious (C) dense (D) pugnacious</p>
                <p><span className="font-semibold">2.</span> (A) shout (B) roar (C) chirp (D) bleat</p>
                <p><span className="font-semibold">3.</span> (A) quick (B) hard (C) toward (D) for</p>
                <p><span className="font-semibold">4.</span> (A) alarmed (B) positioned (C) frightened (D) pretended</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-700">
                  {passageFillBlankTest.totalQuestions} Questions
                </Badge>
                <Badge className="bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:border-violet-700">
                  {Math.round(passageFillBlankTest.duration / 60)} Minutes
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700">
                  {passageFillBlankTest.section ? passageFillBlankTest.section.charAt(0).toUpperCase() + passageFillBlankTest.section.slice(1) : "Verbal"}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                  Easy to Hard
                </Badge>
              </div>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                render={<Link href={`/exam/${passageFillBlankTest._id}`} target="_blank" />}
              >
                Start Practice <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Average Practice Card */}
      {!specialLoading && averageTest && (
        <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 via-amber-50 to-lime-50 dark:from-yellow-950/30 dark:via-amber-950/20 dark:to-lime-950/20 dark:border-yellow-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-100/40 dark:bg-yellow-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-100/40 dark:bg-amber-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-yellow-900 dark:text-yellow-100">
                    Average Practice
                  </CardTitle>
                  <Flame className="h-5 w-5 text-amber-500 dark:text-amber-400 animate-pulse" />
                </div>
                <CardDescription className="text-yellow-700/80 dark:text-yellow-300/80">
                  Simple average, weighted average, age-based problems, runs & innings, mixtures & more
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700">
                {averageTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700">
                {Math.round(averageTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-900/40 dark:text-lime-200 dark:border-lime-700">
                {averageTest.section ? averageTest.section.charAt(0).toUpperCase() + averageTest.section.slice(1) : "Numerical"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              render={<Link href={`/exam/${averageTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Profit & Loss Practice Card */}
      {!specialLoading && profitLossTest && (
        <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-teal-950/20 dark:border-green-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-100/40 dark:bg-green-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-100/40 dark:bg-emerald-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-green-900 dark:text-green-100">
                    Profit & Loss Practice
                  </CardTitle>
                  <Flame className="h-5 w-5 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                </div>
                <CardDescription className="text-green-700/80 dark:text-green-300/80">
                  Cost price, selling price, markup, discount, successive discounts, partnership & more
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700">
                {profitLossTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700">
                {Math.round(profitLossTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700">
                {profitLossTest.section ? profitLossTest.section.charAt(0).toUpperCase() + profitLossTest.section.slice(1) : "Numerical"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              render={<Link href={`/exam/${profitLossTest._id}`} target="_blank" />}
            >
              Start Practice <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Problems on Ages Challenge Card */}
      {!specialLoading && agesTest && (
        <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-violet-50 dark:from-purple-950/30 dark:via-blue-950/20 dark:to-violet-950/20 dark:border-purple-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100/40 dark:bg-purple-900/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100/40 dark:bg-blue-900/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Hourglass className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-purple-900 dark:text-purple-100">
                    Problems on Ages Challenge
                  </CardTitle>
                  <Flame className="h-5 w-5 text-blue-500 dark:text-blue-400 animate-pulse" />
                </div>
                <CardDescription className="text-purple-700/80 dark:text-purple-300/80">
                  Present age, age ratios, age differences, past & future age equations & family age puzzles
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                {agesTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700">
                {Math.round(agesTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:border-violet-700">
                {agesTest.section ? agesTest.section.charAt(0).toUpperCase() + agesTest.section.slice(1) : "Numerical"}
              </Badge>
              <Badge className="bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              render={<Link href={`/exam/${agesTest._id}`} target="_blank" />}
            >
              Take Challenge <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Coding Decoding Challenge Card */}
      {!specialLoading && codingDecodingTest && (
        <Card className="relative overflow-hidden border-2 border-slate-200 bg-gradient-to-r from-slate-50 via-zinc-50 to-stone-50 dark:from-slate-950/30 dark:via-zinc-950/20 dark:to-stone-950/20 dark:border-slate-700">
          <div className="absolute top-0 right-0 w-40 h-40 bg-slate-100/40 dark:bg-slate-800/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-zinc-100/40 dark:bg-zinc-800/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                    Coding Decoding Challenge
                  </CardTitle>
                  <Flame className="h-5 w-5 text-zinc-500 dark:text-zinc-400 animate-pulse" />
                </div>
                <CardDescription className="text-slate-700/80 dark:text-slate-300/80">
                  Letter shifting, number coding, symbol substitution, word coding, condition-based coding & more
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800/40 dark:text-slate-200 dark:border-slate-600">
                {codingDecodingTest.totalQuestions} Questions
              </Badge>
              <Badge className="bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-200 dark:border-zinc-600">
                {Math.round(codingDecodingTest.duration / 60)} Minutes
              </Badge>
              <Badge className="bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800/40 dark:text-stone-200 dark:border-stone-600">
                {codingDecodingTest.section ? codingDecodingTest.section.charAt(0).toUpperCase() + codingDecodingTest.section.slice(1) : "Reasoning"}
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700">
                Easy to Hard
              </Badge>
            </div>
            <Button
              className="bg-slate-700 hover:bg-slate-800 text-white"
              render={<Link href={`/exam/${codingDecodingTest._id}`} target="_blank" />}
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
