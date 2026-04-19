"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calculator, Brain, BookOpen, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTests } from "@/lib/api/tests";
import type { Test } from "@/lib/api/types";

const sectionInfo = {
  numerical: {
    title: "Numerical Ability",
    icon: Calculator,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
    topics: [
      "Percentages",
      "Ratios",
      "Time-Speed-Distance",
      "Algebra",
      "Geometry",
      "Averages",
      "Profit-Loss",
      "Number Systems",
    ],
  },
  reasoning: {
    title: "Reasoning Ability",
    icon: Brain,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950",
    topics: [
      "Series",
      "Blood Relations",
      "Coding-Decoding",
      "Syllogisms",
      "Puzzles",
      "Data Interpretation",
    ],
  },
  verbal: {
    title: "Verbal Ability",
    icon: BookOpen,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950",
    topics: [
      "Reading Comprehension",
      "Grammar",
      "Vocabulary",
      "Sentence Correction",
    ],
  },
};

export default function FoundationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
      <FoundationContent />
    </Suspense>
  );
}

function FoundationContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section") || "numerical";
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchTests({ type: "section_test" });
        setTests(data);
      } catch {
        // API not ready
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentSection =
    sectionInfo[section as keyof typeof sectionInfo] || sectionInfo.numerical;
  const Icon = currentSection.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Foundation Section
        </h1>
        <p className="text-muted-foreground mt-1">
          Core aptitude tests — 25 Questions • 30 Minutes per test
        </p>
      </div>

      <Tabs defaultValue={section} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="numerical">Numerical</TabsTrigger>
          <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
          <TabsTrigger value="verbal">Verbal</TabsTrigger>
        </TabsList>

        {Object.entries(sectionInfo).map(([key, info]) => {
          const SectionIcon = info.icon;
          const sectionTests = tests.filter((t) => t.section === key);
          return (
            <TabsContent key={key} value={key} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg ${info.bg} flex items-center justify-center`}
                    >
                      <SectionIcon className={`h-6 w-6 ${info.color}`} />
                    </div>
                    <div>
                      <CardTitle>{info.title}</CardTitle>
                      <CardDescription>
                        Topics covered in this section
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {info.topics.map((topic) => (
                      <Badge key={topic} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Available Tests */}
              <div className="space-y-3">
                <h3 className="font-semibold">Available Tests</h3>
                {loading ? (
                  <p className="text-sm text-muted-foreground">
                    Loading tests...
                  </p>
                ) : sectionTests.length > 0 ? (
                  <div className="grid gap-3">
                    {sectionTests.map((test) => (
                      <Card key={test._id}>
                        <CardContent className="flex items-center justify-between py-4">
                          <div>
                            <p className="font-medium">{test.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {test.totalQuestions} Questions • {Math.floor(test.duration / 60)} Minutes
                            </p>
                          </div>
                          <Button render={<Link href={`/exam/${test._id}`} target="_blank" />}>
                              Start <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <p>
                        No tests available yet. Connect the backend to load
                        tests.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Practice Link */}
              <Button variant="outline" render={<Link href={`/practice?section=${key}`} />}>
                  Practice {info.title} topics{" "}
                  <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
