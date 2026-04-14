"use client";

import { useEffect, useState } from "react";
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
import { fetchTopics } from "@/lib/api/practice";
import type { Topic, Section } from "@/lib/api/types";

const sectionMeta: Record<
  Section,
  { icon: typeof Calculator; color: string; bg: string }
> = {
  numerical: { icon: Calculator, color: "text-blue-600", bg: "bg-blue-50" },
  logical: { icon: Brain, color: "text-purple-600", bg: "bg-purple-50" },
  verbal: { icon: BookOpen, color: "text-green-600", bg: "bg-green-50" },
  advanced: { icon: Target, color: "text-orange-600", bg: "bg-orange-50" },
};

const defaultTopics: Record<string, { name: string; section: Section }[]> = {
  numerical: [
    { name: "Percentages", section: "numerical" },
    { name: "Ratios", section: "numerical" },
    { name: "Time-Speed-Distance", section: "numerical" },
    { name: "Algebra", section: "numerical" },
    { name: "Geometry", section: "numerical" },
    { name: "Averages", section: "numerical" },
    { name: "Profit-Loss", section: "numerical" },
    { name: "Number Systems", section: "numerical" },
  ],
  logical: [
    { name: "Series", section: "logical" },
    { name: "Blood Relations", section: "logical" },
    { name: "Coding-Decoding", section: "logical" },
    { name: "Syllogisms", section: "logical" },
    { name: "Puzzles", section: "logical" },
    { name: "Data Interpretation", section: "logical" },
  ],
  verbal: [
    { name: "Reading Comprehension", section: "verbal" },
    { name: "Grammar", section: "verbal" },
    { name: "Vocabulary", section: "verbal" },
    { name: "Sentence Correction", section: "verbal" },
  ],
};

function difficultyColor(d: string) {
  if (d === "easy") return "text-green-600 bg-green-50";
  if (d === "medium") return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
}

export default function PracticePage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("section") || "numerical";
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchTopics();
        setTopics(data);
      } catch {
        // API not ready — will show default topics
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function getTopicsForSection(section: string) {
    const apiTopics = topics.filter((t) => t.section === section);
    if (apiTopics.length > 0) return apiTopics;
    return (defaultTopics[section] || []).map((t, i) => ({
      id: `${t.section}-${i}`,
      name: t.name,
      section: t.section,
      questionCount: 0,
      difficulty: "medium" as const,
    }));
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
          <TabsTrigger value="logical">
            <Brain className="h-4 w-4 mr-1.5 hidden sm:block" />
            Logical
          </TabsTrigger>
          <TabsTrigger value="verbal">
            <BookOpen className="h-4 w-4 mr-1.5 hidden sm:block" />
            Verbal
          </TabsTrigger>
        </TabsList>

        {(["numerical", "logical", "verbal"] as const).map((section) => {
          const meta = sectionMeta[section];
          const SectionIcon = meta.icon;
          const sectionTopics = getTopicsForSection(section);

          return (
            <TabsContent key={section} value={section}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sectionTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/practice/${topic.id}`}
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
                          {topic.difficulty && (
                            <Badge
                              variant="outline"
                              className={difficultyColor(topic.difficulty)}
                            >
                              {topic.difficulty}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-base mt-2">
                          {topic.name}
                        </CardTitle>
                        <CardDescription>
                          {topic.questionCount > 0
                            ? `${topic.questionCount} questions available`
                            : "Questions coming soon"}
                        </CardDescription>
                      </CardHeader>
                      {topic.accuracy !== undefined && (
                        <CardContent>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Accuracy</span>
                              <span>{Math.round(topic.accuracy)}%</span>
                            </div>
                            <Progress value={topic.accuracy} className="h-1.5" />
                          </div>
                        </CardContent>
                      )}
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
