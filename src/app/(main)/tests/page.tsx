"use client";

import Link from "next/link";
import {
  Calculator,
  Brain,
  BookOpen,
  Zap,
  FileText,
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
        color: "text-blue-600",
        bg: "bg-blue-50",
        href: "/tests/foundation?section=numerical",
      },
      {
        title: "Logical Reasoning",
        description:
          "Series, Blood Relations, Coding-Decoding, Syllogisms, Puzzles, Data Interpretation",
        questions: 25,
        duration: 30,
        icon: Brain,
        color: "text-purple-600",
        bg: "bg-purple-50",
        href: "/tests/foundation?section=reasoning",
      },
      {
        title: "Verbal Ability",
        description:
          "Reading Comprehension, Grammar, Vocabulary, Sentence Correction",
        questions: 25,
        duration: 30,
        icon: BookOpen,
        color: "text-green-600",
        bg: "bg-green-50",
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
        color: "text-orange-600",
        bg: "bg-orange-50",
        href: "/tests/advanced",
      },
    ],
  },
];

export default function TestsPage() {
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
