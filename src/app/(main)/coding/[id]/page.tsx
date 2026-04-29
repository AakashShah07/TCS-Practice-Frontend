"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  Zap,
  Lightbulb,
  Clock,
  HardDrive,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchCodingQuestion } from "@/lib/api/coding";
import type { CodingQuestion, CodingSolution } from "@/lib/api/types";

const difficultyConfig = {
  easy: {
    label: "Easy",
    color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700",
  },
  medium: {
    label: "Medium",
    color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700",
  },
  hard: {
    label: "Hard",
    color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700",
  },
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border bg-slate-950 dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 dark:bg-slate-800 border-b border-slate-700">
        <span className="text-xs text-slate-400 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-slate-200 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function SolutionSection({
  solution,
  type,
}: {
  solution: CodingSolution;
  type: "bruteForce" | "optimal";
}) {
  const [expanded, setExpanded] = useState(type === "optimal");

  const isBrute = type === "bruteForce";
  const icon = isBrute ? (
    <Lightbulb className="h-5 w-5 text-amber-500" />
  ) : (
    <Zap className="h-5 w-5 text-emerald-500" />
  );
  const title = isBrute ? "Brute Force / Naive Approach" : "Optimal Solution";
  const borderColor = isBrute
    ? "border-amber-200 dark:border-amber-800"
    : "border-emerald-200 dark:border-emerald-800";
  const headerBg = isBrute
    ? "bg-amber-50 dark:bg-amber-950/30"
    : "bg-emerald-50 dark:bg-emerald-950/30";

  return (
    <Card className={`overflow-hidden border-2 ${borderColor}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between px-5 py-4 ${headerBg} cursor-pointer`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline" className="text-xs gap-1">
              <Clock className="h-3 w-3" />
              {solution.timeComplexity}
            </Badge>
            <Badge variant="outline" className="text-xs gap-1">
              <HardDrive className="h-3 w-3" />
              {solution.spaceComplexity}
            </Badge>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      {expanded && (
        <CardContent className="pt-5 space-y-4">
          {/* Complexity on mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <Badge variant="outline" className="text-xs gap-1">
              <Clock className="h-3 w-3" />
              {solution.timeComplexity}
            </Badge>
            <Badge variant="outline" className="text-xs gap-1">
              <HardDrive className="h-3 w-3" />
              {solution.spaceComplexity}
            </Badge>
          </div>

          {/* Approach */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {solution.approach.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i}>{part}</strong>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </div>
          </div>

          {/* Code */}
          <CodeBlock code={solution.code} language={solution.language} />
        </CardContent>
      )}
    </Card>
  );
}

export default function CodingQuestionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [question, setQuestion] = useState<CodingQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCodingQuestion(id)
      .then(setQuestion)
      .catch(() => setError("Question not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-6 w-96 bg-muted rounded" />
        <Card>
          <CardContent className="py-8 space-y-4">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
          </CardContent>
        </Card>
        <div className="h-64 bg-muted rounded-lg" />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="text-center py-20">
        <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
        <h2 className="text-xl font-semibold mb-2">Question Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The coding question you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button render={<Link href="/coding" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Questions
        </Button>
      </div>
    );
  }

  const diff = difficultyConfig[question.difficulty];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/coding"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All Questions
      </Link>

      {/* Title Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {question.title}
          </h1>
          <Badge className={diff.color}>{diff.label}</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Code2 className="h-3 w-3" />
            {question.topic}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <BookOpen className="h-3 w-3" />
            {question.source}
          </Badge>
        </div>
      </div>

      {/* Problem Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Problem Statement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {question.description}
          </div>

          {/* Constraints */}
          {question.constraints.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Constraints</h4>
              <ul className="space-y-1">
                {question.constraints.map((c, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-1.5 rounded"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Examples */}
      {question.examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.examples.map((ex, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 space-y-3 bg-muted/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Example {i + 1}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Input
                    </p>
                    <pre className="text-sm font-mono bg-slate-950 dark:bg-slate-900 text-slate-200 p-3 rounded-md overflow-x-auto">
                      {ex.input}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Output
                    </p>
                    <pre className="text-sm font-mono bg-slate-950 dark:bg-slate-900 text-slate-200 p-3 rounded-md overflow-x-auto">
                      {ex.output}
                    </pre>
                  </div>
                </div>
                {ex.explanation && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Explanation
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ex.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Solutions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Solutions</h2>
        <SolutionSection solution={question.bruteForce} type="bruteForce" />
        <SolutionSection solution={question.optimal} type="optimal" />
      </div>
    </div>
  );
}
