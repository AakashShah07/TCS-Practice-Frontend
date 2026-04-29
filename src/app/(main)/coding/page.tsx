"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Filter,
  ChevronRight,
  Tag,
  Clock,
  Search,
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
import {
  fetchCodingQuestions,
  fetchCodingTopics,
} from "@/lib/api/coding";
import type { CodingQuestionSummary, CodingTopicCount } from "@/lib/api/types";

const difficultyConfig = {
  easy: {
    label: "Easy",
    color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700",
    dot: "bg-green-500",
  },
  medium: {
    label: "Medium",
    color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700",
    dot: "bg-amber-500",
  },
  hard: {
    label: "Hard",
    color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700",
    dot: "bg-red-500",
  },
};

export default function CodingQuestionsPage() {
  const [questions, setQuestions] = useState<CodingQuestionSummary[]>([]);
  const [topics, setTopics] = useState<CodingTopicCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  useEffect(() => {
    fetchCodingTopics().then(setTopics).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: { difficulty?: string; topic?: string } = {};
    if (selectedDifficulty) params.difficulty = selectedDifficulty;
    if (selectedTopic) params.topic = selectedTopic;
    fetchCodingQuestions(params)
      .then(setQuestions)
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [selectedDifficulty, selectedTopic]);

  const difficulties = ["easy", "medium", "hard"] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Coding Questions
            </h1>
            <p className="text-muted-foreground mt-0.5">
              TCS NQT Previous Year Coding Questions with step-by-step solutions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
              <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{loading ? "-" : questions.length}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
              <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{topics.length}</p>
              <p className="text-xs text-muted-foreground">Topics</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
              <Search className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">PYQ</p>
              <p className="text-xs text-muted-foreground">Source</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
              <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">2x</p>
              <p className="text-xs text-muted-foreground">Solutions Each</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4 px-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Difficulty Filter */}
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">Difficulty</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSelectedDifficulty("")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    selectedDifficulty === ""
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-accent"
                  }`}
                >
                  All
                </button>
                {difficulties.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d === selectedDifficulty ? "" : d)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      selectedDifficulty === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-accent"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${difficultyConfig[d].dot}`} />
                    {difficultyConfig[d].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Filter */}
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">Topic</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedTopic("")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    selectedTopic === ""
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-accent"
                  }`}
                >
                  All
                </button>
                {topics.map((t) => (
                  <button
                    key={t.topic}
                    onClick={() => setSelectedTopic(t.topic === selectedTopic ? "" : t.topic)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      selectedTopic === t.topic
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-accent"
                    }`}
                  >
                    {t.topic}
                    <span className="ml-1 opacity-60">({t.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-4 px-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-64 bg-muted rounded" />
                  <div className="h-3.5 w-40 bg-muted rounded" />
                </div>
                <div className="h-6 w-16 bg-muted rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((q, index) => {
            const diff = difficultyConfig[q.difficulty];
            return (
              <Link key={q._id} href={`/coding/${q._id}`}>
                <Card className="hover:shadow-md transition-all cursor-pointer group hover:border-primary/30">
                  <CardContent className="py-4 px-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                        {q.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{q.topic}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{q.source}</span>
                      </div>
                    </div>
                    <Badge className={diff.color}>{diff.label}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Code2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No questions found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
