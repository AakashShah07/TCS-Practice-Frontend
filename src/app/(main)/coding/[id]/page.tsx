"use client";

import { useEffect, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";
import type { CodingQuestion, CodingSolution } from "@/lib/api/types";
import { usePreventCopy } from "@/hooks/usePreventCopy";

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
  return (
    <div className="relative group rounded-lg overflow-hidden border bg-slate-950 dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 dark:bg-slate-800 border-b border-slate-700">
        <span className="text-xs text-slate-400 font-mono">{language}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-base leading-relaxed">
        <code className="text-slate-200 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function getComplexityInfo(complexity: string): {
  label: string;
  description: string;
} {
  const n = complexity.trim().toLowerCase().replace(/\s/g, "");

  if (n === "o(1)") {
    return {
      label: "Constant",
      description: "Execution time stays the same regardless of input size.",
    };
  }
  if (n === "o(logn)") {
    return {
      label: "Logarithmic",
      description: "Grows logarithmically with input size.",
    };
  }
  if (n === "o(n)") {
    return { label: "Linear", description: "Grows linearly with input size." };
  }
  if (n === "o(nlogn)") {
    return {
      label: "Linearithmic",
      description: "Grows in proportion to n log n.",
    };
  }
  if (n === "o(n²)" || n === "o(n^2)" || n === "o(n2)") {
    return {
      label: "Quadratic",
      description: "Grows quadratically with input size.",
    };
  }
  if (n === "o(2^n)") {
    return {
      label: "Exponential",
      description: "Grows exponentially with input size.",
    };
  }
  if (n === "o(n!)") {
    return {
      label: "Factorial",
      description: "Grows factorially with input size.",
    };
  }

  return {
    label: "Varies",
    description: "Complexity depends on input size and implementation.",
  };
}

function ComplexityCard({
  label,
  value,
  classification,
  description,
  Icon,
  accentColor,
}: {
  label: string;
  value: string;
  classification: string;
  description: string;
  Icon: React.FC<{ className?: string }>;
  accentColor: "amber" | "blue";
}) {
  const isAmber = accentColor === "amber";

  return (
    <div className={cn(
      "rounded-lg border p-4 flex flex-col",
      isAmber
        ? "border-amber-200/50 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-900/20"
        : "border-blue-200/50 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-900/20"
    )}>
      <div className="flex items-start gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${isAmber ? "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" : "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            {label}
          </div>
          <div className="text-lg font-bold text-foreground">{value}</div>
          <div className="text-xs font-medium text-foreground">{classification}</div>
        </div>
      </div>
      <div className="mt-3 text-[10px] text-muted-foreground leading-tight">
        {description}
      </div>
    </div>
  );
}

function ComplexityIndicator({
  timeComplexity,
  spaceComplexity,
}: {
  timeComplexity: string;
  spaceComplexity: string;
}) {
  const timeInfo = getComplexityInfo(timeComplexity);
  const spaceInfo = getComplexityInfo(spaceComplexity);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <ComplexityCard
        label="Time Complexity"
        value={timeComplexity || "N/A"}
        classification={timeInfo.label}
        description={timeInfo.description}
        Icon={Clock}
        accentColor="amber"
      />
      <ComplexityCard
        label="Space Complexity"
        value={spaceComplexity || "N/A"}
        classification={spaceInfo.label}
        description={spaceInfo.description}
        Icon={HardDrive}
        accentColor="blue"
      />
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
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (expanded && contentRef.current) {
      const el = contentRef.current;
      requestAnimationFrame(() => {
        setContentHeight(el.scrollHeight);
      });
    }
  }, [expanded, contentRef]);

  const isBrute = type === "bruteForce";
  const icon = isBrute ? (
    <Lightbulb className="h-5 w-5 text-amber-500" />
  ) : (
    <Zap className="h-5 w-5 text-emerald-500" />
  );
  const title = isBrute ? "Brute Force / Naive Approach" : "Optimal Solution";
  const headerBg = isBrute
    ? "bg-amber-50 dark:bg-amber-950/30"
    : "bg-emerald-50 dark:bg-emerald-950/30";
  const headerBorder = isBrute
    ? "border-amber-200 dark:border-amber-800"
    : "border-emerald-200 dark:border-emerald-800";

  const contentId = `solution-content-${type}`;
  const headerId = `solution-header-${type}`;

  const reducedMotion = prefersReducedMotion;

  const contentStyle = {
    maxHeight: expanded ? contentHeight : 0,
    opacity: expanded ? 1 : 0,
    transform: expanded ? "translateY(0)" : "translateY(-4px)",
    transition: reducedMotion
      ? "none"
      : "max-height 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease-out, transform 200ms ease-out",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border border-border/60 bg-card dark:border-border/40 transition-all duration-200 ease-out",
        expanded
          ? "border-primary/60 shadow-sm dark:border-primary/40 dark:shadow-amber-900/10"
          : "hover:border-primary/50 dark:hover:border-primary/30 hover:bg-accent/50 dark:hover:bg-accent/10"
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className={cn(
          "w-full flex items-center justify-between px-5 py-4 cursor-pointer transition-colors duration-200",
          expanded
            ? "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-800/50 shadow-sm dark:shadow-amber-900/10"
            : "bg-transparent hover:bg-accent/50 dark:hover:bg-accent/10"
        )}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-lg font-bold">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200 ease-out",
            expanded ? "rotate-180" : ""
          )}
        />
      </button>

      <div
        ref={contentRef}
        id={contentId}
        className="overflow-hidden"
        style={contentStyle}
      >
        <div className="px-5 py-4">
          {/* Complexity indicators - staggered entrance */}
          <ComplexityIndicator
            timeComplexity={solution.timeComplexity}
            spaceComplexity={solution.spaceComplexity}
          />

          {/* Approach */}
          <div className="prose prose-sm dark:prose-invert max-w-none mt-4">
            <div className="text-base leading-7 whitespace-pre-wrap">
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
        </div>
      </div>
    </Card>
  );
}

export default function CodingQuestionDetailPage() {
  usePreventCopy();
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
          <h1 className="border-l-4 border-primary pl-3 text-3xl sm:text-4xl leading-tight font-extrabold tracking-tight text-primary">
            {question.title}
          </h1>
          <Badge className={`${diff.color} px-3 py-1 text-base font-bold`}>
            {diff.label}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-base font-semibold">
            <Code2 className="h-4 w-4" />
            {question.topic}
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-base font-semibold">
            <BookOpen className="h-4 w-4" />
            {question.source}
          </Badge>
        </div>
      </div>

      {/* Problem Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Problem Statement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-base leading-7 whitespace-pre-wrap">
            {question.description}
          </div>

          {/* Constraints */}
          {question.constraints.length > 0 && (
            <div>
              <h4 className="text-base font-semibold mb-2">Constraints</h4>
              <ul className="space-y-1">
                {question.constraints.map((c, i) => (
                  <li
                    key={i}
                    className="text-sm sm:text-base text-muted-foreground font-mono bg-muted/50 px-3 py-1.5 rounded"
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
            <CardTitle className="text-lg">Examples</CardTitle>
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
                    <pre className="text-base font-mono bg-slate-950 dark:bg-slate-900 text-slate-200 p-3 rounded-md overflow-x-auto">
                      {ex.input}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Output
                    </p>
                    <pre className="text-base font-mono bg-slate-950 dark:bg-slate-900 text-slate-200 p-3 rounded-md overflow-x-auto">
                      {ex.output}
                    </pre>
                  </div>
                </div>
                {ex.explanation && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Explanation
                    </p>
                    <p className="text-base leading-7 text-muted-foreground">
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
        <h2 className="text-2xl font-bold">Solutions</h2>
        <SolutionSection solution={question.bruteForce} type="bruteForce" />
        <SolutionSection solution={question.optimal} type="optimal" />
      </div>
    </div>
  );
}
