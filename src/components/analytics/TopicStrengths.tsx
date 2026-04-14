"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  strongTopics: string[];
  weakTopics: string[];
}

export default function TopicStrengths({ strongTopics, weakTopics }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <CardTitle className="text-base">Strongest Topics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {strongTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {strongTopics.map((topic) => (
                <Badge
                  key={topic}
                  className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Take more tests to identify your strengths
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <CardTitle className="text-base">Needs Improvement</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {weakTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {weakTopics.map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Take more tests to identify weak areas
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
