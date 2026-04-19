"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Zap, Flame, Leaf } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  fetchTopicsWithCounts,
  generatePracticeTest,
  type TopicInfo,
} from "@/lib/api/practice";
import { startAttempt } from "@/lib/api/exam";

const questionOptions = [5, 10, 15, 20];

export default function TopicPracticePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = decodeURIComponent(params.topic as string);
  const section = searchParams.get("section") || "numerical";

  const [topicInfo, setTopicInfo] = useState<TopicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCount, setSelectedCount] = useState(10);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const topics = await fetchTopicsWithCounts(section);
        const found = topics.find(
          (t) => t.topic.toLowerCase() === topic.toLowerCase()
        );
        setTopicInfo(found || null);
        if (found) {
          // Auto-select count based on available questions
          const max = selectedDifficulty === "all"
            ? found.totalQuestions
            : found[selectedDifficulty as "easy" | "medium" | "hard"] || 0;
          if (selectedCount > max && max > 0) {
            setSelectedCount(Math.min(max, 10));
          }
        }
      } catch {
        // API not ready
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [topic, section]);

  const maxQuestions =
    topicInfo
      ? selectedDifficulty === "all"
        ? topicInfo.totalQuestions
        : topicInfo[selectedDifficulty as "easy" | "medium" | "hard"] || 0
      : 0;

  async function handleStartPractice() {
    setGenerating(true);
    try {
      const practiceParams: {
        section: string;
        topic: string;
        difficulty?: string;
        numberOfQuestions: number;
      } = {
        section,
        topic,
        numberOfQuestions: Math.min(selectedCount, maxQuestions),
      };
      if (selectedDifficulty !== "all") {
        practiceParams.difficulty = selectedDifficulty;
      }

      const test = await generatePracticeTest(practiceParams);
      // Start attempt for the generated test
      const attempt = await startAttempt(test.testId);
      window.open(`/exam/${test.testId}`, "_blank");
    } catch {
      toast.error("Failed to generate practice test. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => router.push(`/practice?section=${section}`)}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Practice
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{topic}</h1>
            <p className="text-muted-foreground text-sm capitalize">
              {section} &middot;{" "}
              {topicInfo
                ? `${topicInfo.totalQuestions} questions available`
                : "Topic not found"}
            </p>
          </div>
        </div>
      </div>

      {!topicInfo ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No questions found for {topic}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push(`/practice?section=${section}`)}
            >
              Back to Topics
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Question count breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Available Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-green-50 dark:bg-green-950 p-3">
                  <Leaf className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{topicInfo.easy}</p>
                  <p className="text-[10px] text-green-600/70 dark:text-green-400/70">Easy</p>
                </div>
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950 p-3">
                  <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{topicInfo.medium}</p>
                  <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70">Medium</p>
                </div>
                <div className="rounded-xl bg-red-50 dark:bg-red-950 p-3">
                  <Flame className="h-4 w-4 text-red-600 dark:text-red-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">{topicInfo.hard}</p>
                  <p className="text-[10px] text-red-600/70 dark:text-red-400/70">Hard</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configure practice */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configure Practice</CardTitle>
              <CardDescription>
                Choose difficulty and number of questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Difficulty */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Difficulty</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "All", count: topicInfo.totalQuestions },
                    { key: "easy", label: "Easy", count: topicInfo.easy },
                    { key: "medium", label: "Medium", count: topicInfo.medium },
                    { key: "hard", label: "Hard", count: topicInfo.hard },
                  ].map((d) => (
                    <button
                      key={d.key}
                      onClick={() => {
                        setSelectedDifficulty(d.key);
                        if (selectedCount > d.count && d.count > 0) {
                          setSelectedCount(Math.min(d.count, 10));
                        }
                      }}
                      disabled={d.count === 0 && d.key !== "all"}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        selectedDifficulty === d.key
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                          : d.count === 0 && d.key !== "all"
                          ? "border-slate-100 text-slate-300 cursor-not-allowed"
                          : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {d.label}
                      <span className="ml-1.5 text-xs opacity-60">({d.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of questions */}
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Number of Questions{" "}
                  <span className="text-muted-foreground font-normal">
                    (max {maxQuestions})
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {questionOptions
                    .filter((n) => n <= maxQuestions)
                    .map((n) => (
                      <button
                        key={n}
                        onClick={() => setSelectedCount(n)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          selectedCount === n
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                            : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  {/* Show max option if not in presets */}
                  {maxQuestions > 0 &&
                    !questionOptions.includes(maxQuestions) &&
                    maxQuestions > 5 && (
                      <button
                        onClick={() => setSelectedCount(maxQuestions)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          selectedCount === maxQuestions
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                            : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        All ({maxQuestions})
                      </button>
                    )}
                </div>
              </div>

              {/* Start button */}
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-5 rounded-xl text-base transition-all active:scale-[0.98]"
                onClick={handleStartPractice}
                disabled={generating || maxQuestions === 0}
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    Start Practice
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
