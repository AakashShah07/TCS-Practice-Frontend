"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { SectionResult } from "@/lib/api/types";

const sectionLabels: Record<string, string> = {
  numerical: "Numerical Ability",
  reasoning: "Reasoning Ability",
  verbal: "Verbal Ability",
  advanced: "Advanced",
};

interface Props {
  sections: SectionResult[];
}

export default function SectionAnalysis({ sections }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section-wise Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section) => (
          <div key={section.section} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {sectionLabels[section.section] || section.section}
              </h4>
              <Badge
                variant={section.accuracy >= 70 ? "default" : "secondary"}
              >
                {Math.round(section.accuracy)}% accuracy
              </Badge>
            </div>

            <Progress value={section.accuracy} className="h-2" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Correct</p>
                <p className="font-medium text-green-600 dark:text-green-400">{section.correct}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Wrong</p>
                <p className="font-medium text-red-600 dark:text-red-400">{section.wrong}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Skipped</p>
                <p className="font-medium text-gray-500 dark:text-gray-400">{section.skipped}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Time/Q</p>
                <p className="font-medium">
                  {section.avgTimePerQuestion.toFixed(1)}s
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
