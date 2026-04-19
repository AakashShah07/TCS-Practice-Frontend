"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calculator, Brain, BookOpen, Target } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTopicsWithCounts, type TopicInfo } from "@/lib/api/practice";
import type { Section } from "@/lib/api/types";

const sectionMeta: Record<
  string,
  { icon: typeof Calculator; color: string; bg: string; label: string }
> = {
  numerical: { icon: Calculator, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950", label: "Numerical" },
  reasoning: { icon: Brain, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950", label: "Reasoning" },
  verbal: { icon: BookOpen, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950", label: "Verbal" },
  advanced: { icon: Target, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950", label: "Advanced" },
};

function difficultyBar(easy: number, medium: number, hard: number, total: number) {
  if (total === 0) return null;
  const easyPct = (easy / total) * 100;
  const medPct = (medium / total) * 100;
  const hardPct = (hard / total) * 100;
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
      {easyPct > 0 && <div className="bg-green-500" style={{ width: `${easyPct}%` }} />}
      {medPct > 0 && <div className="bg-amber-500" style={{ width: `${medPct}%` }} />}
      {hardPct > 0 && <div className="bg-red-500" style={{ width: `${hardPct}%` }} />}
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("section") || "numerical";
  const [topicsBySection, setTopicsBySection] = useState<
    Record<string, TopicInfo[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [numerical, reasoning, verbal] = await Promise.all([
          fetchTopicsWithCounts("numerical"),
          fetchTopicsWithCounts("reasoning"),
          fetchTopicsWithCounts("verbal"),
        ]);
        setTopicsBySection({ numerical, reasoning, verbal });
      } catch {
        // API not ready
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Topic-Based Practice
        </h1>
        <p className="text-muted-foreground mt-1">
          Focus on specific topics to strengthen weak areas
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="numerical">
            <Calculator className="h-4 w-4 mr-1.5 hidden sm:block" />
            Numerical
          </TabsTrigger>
          <TabsTrigger value="reasoning">
            <Brain className="h-4 w-4 mr-1.5 hidden sm:block" />
            Reasoning
          </TabsTrigger>
          <TabsTrigger value="verbal">
            <BookOpen className="h-4 w-4 mr-1.5 hidden sm:block" />
            Verbal
          </TabsTrigger>
        </TabsList>

        {(["numerical", "reasoning", "verbal"] as const).map((section) => {
          const meta = sectionMeta[section];
          const SectionIcon = meta.icon;
          const topics = topicsBySection[section] || [];

          return (
            <TabsContent key={section} value={section}>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : topics.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {topics.map((t) => (
                    <Link
                      key={t.topic}
                      href={`/practice/${encodeURIComponent(t.topic)}?section=${section}`}
                    >
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center`}
                            >
                              <SectionIcon className={`h-4 w-4 ${meta.color}`} />
                            </div>
                            <Badge variant="outline" className="text-xs tabular-nums">
                              {t.totalQuestions} Qs
                            </Badge>
                          </div>
                          <CardTitle className="text-base mt-2">
                            {t.topic}
                          </CardTitle>
                          <CardDescription>
                            {t.totalQuestions} questions available
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          {difficultyBar(t.easy, t.medium, t.hard, t.totalQuestions)}
                          <div className="flex gap-3 text-[10px] text-muted-foreground">
                            {t.easy > 0 && (
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                Easy {t.easy}
                              </span>
                            )}
                            {t.medium > 0 && (
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                Medium {t.medium}
                              </span>
                            )}
                            {t.hard > 0 && (
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                Hard {t.hard}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No topics found for this section.
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
