"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchTests } from "@/lib/api/tests";
import type { Test } from "@/lib/api/types";

const examRules = [
  "Total 79 questions across Foundation (65) and Advanced (14) sections",
  "Total duration: 120 minutes",
  "Foundation section has NO negative marking",
  "Advanced section has negative marking",
  "You can navigate between questions freely within a section",
  "Timer will auto-submit your test when time runs out",
  "Do not switch tabs during the exam",
];

export default function MockTestPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchTests({ type: "full_mock" });
        setTests(data);
      } catch {
        // API not ready
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Full Mock Test</h1>
        <p className="text-muted-foreground mt-1">
          Complete TCS NQT exam simulation
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 justify-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-7 w-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-xl">
            TCS NQT Mock Exam
          </CardTitle>
          <CardDescription className="text-center">
            Simulates the actual exam environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">79</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold">120</p>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
            <div>
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm text-muted-foreground">Sections</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Badge>Numerical (20 Qs)</Badge>
            <Badge>Reasoning (20 Qs)</Badge>
            <Badge>Verbal (25 Qs)</Badge>
            <Badge variant="secondary">Advanced (14 Qs)</Badge>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              Exam Rules & Instructions
            </div>
            <ul className="space-y-2">
              {examRules.map((rule) => (
                <li key={rule} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400 mt-0.5 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {loading ? (
            <p className="text-center text-sm text-muted-foreground">
              Loading available tests...
            </p>
          ) : tests.length > 0 ? (
            <div className="space-y-3">
              {tests.map((test) => (
                <Button key={test._id} className="w-full" size="lg" render={<Link href={`/exam/${test._id}`} target="_blank" />}>
                    Start {test.title}{" "}
                    <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                No mock tests available yet. Connect the backend to load tests.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Tests will appear here once the backend is connected
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
