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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTopicsBySection } from "@/lib/api/tests";
import type { Section } from "@/lib/api/types";

const sectionMeta: Record<
  Section,
  { icon: typeof Calculator; color: string; bg: string; label: string }
> = {
  numerical: { icon: Calculator, color: "text-blue-600", bg: "bg-blue-50", label: "Numerical" },
  reasoning: { icon: Brain, color: "text-purple-600", bg: "bg-purple-50", label: "Reasoning" },
  verbal: { icon: BookOpen, color: "text-green-600", bg: "bg-green-50", label: "Verbal" },
  advanced: { icon: Target, color: "text-orange-600", bg: "bg-orange-50", label: "Advanced" },
};

const defaultTopics: Record<string, string[]> = {
  numerical: [
    "Percentages",
    "Ratios",
    "Time-Speed-Distance",
    "Algebra",
    "Geometry",
    "Averages",
    "Profit-Loss",
    "Number Systems",
  ],
  reasoning: [
    "Series",
    "Blood Relations",
    "Coding-Decoding",
    "Syllogisms",
    "Puzzles",
    "Data Interpretation",
  ],
  verbal: [
    "Reading Comprehension",
    "Grammar",
    "Vocabulary",
    "Sentence Correction",
  ],
};

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
      <PracticeContent />
    </Suspense>
  );
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("section") || "numerical";
  const [topicsBySection, setTopicsBySection] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [numerical, reasoning, verbal] = await Promise.all([
          fetchTopicsBySection("numerical"),
          fetchTopicsBySection("reasoning"),
          fetchTopicsBySection("verbal"),
        ]);
        setTopicsBySection({ numerical, reasoning, verbal });
      } catch {
        // API not ready — will show default topics
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function getTopicsForSection(section: string): string[] {
    const apiTopics = topicsBySection[section];
    if (apiTopics && apiTopics.length > 0) return apiTopics;
    return defaultTopics[section] || [];
  }

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
          const topics = getTopicsForSection(section);

          return (
            <TabsContent key={section} value={section}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                  <Link
                    key={topic}
                    href={`/practice?section=${section}&topic=${encodeURIComponent(topic)}`}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center`}
                          >
                            <SectionIcon
                              className={`h-4 w-4 ${meta.color}`}
                            />
                          </div>
                        </div>
                        <CardTitle className="text-base mt-2">
                          {topic}
                        </CardTitle>
                        <CardDescription>
                          Practice questions on {topic}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
