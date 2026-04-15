"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchTests } from "@/lib/api/tests";
import type { Test } from "@/lib/api/types";

export default function AdvancedPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchTests({ type: "section_test", section: "advanced" });
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced Section</h1>
        <p className="text-muted-foreground mt-1">
          Higher-level quantitative and reasoning problems — 25 Questions • 30 Minutes per test
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <CardTitle>Advanced Quantitative & Reasoning</CardTitle>
              <CardDescription>
                This section tests your advanced problem-solving skills
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Advanced Algebra</Badge>
            <Badge variant="outline">Complex Reasoning</Badge>
            <Badge variant="outline">Data Sufficiency</Badge>
            <Badge variant="outline">Pattern Recognition</Badge>
          </div>
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span>25 Questions</span>
            <span>&bull;</span>
            <span>30 Minutes</span>
            <span>&bull;</span>
            <span>Negative Marking Applies</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold">Available Tests</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading tests...</p>
        ) : tests.length > 0 ? (
          <div className="grid gap-3">
            {tests.map((test) => (
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
              No tests available yet. Connect the backend to load tests.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
