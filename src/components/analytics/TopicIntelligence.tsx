"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { TopicStat } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface Props {
  topicStats: TopicStat[];
}

const confidenceStyles: Record<string, string> = {
  strong: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  weak: "bg-red-50 text-red-700 border-red-200",
};

export default function TopicIntelligence({ topicStats }: Props) {
  const sorted = [...topicStats].sort((a, b) => b.accuracy - a.accuracy);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Intelligence</CardTitle>
        <CardDescription>
          Per-topic performance breakdown with confidence levels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">Topic</th>
                <th className="text-left py-2 font-medium">Accuracy</th>
                <th className="text-center py-2 font-medium">Correct/Total</th>
                <th className="text-center py-2 font-medium">Attempts</th>
                <th className="text-center py-2 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((topic) => (
                <tr key={topic.topic} className="border-b last:border-0">
                  <td className="py-3">
                    <p className="font-medium">{topic.topic}</p>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 min-w-32">
                      <Progress
                        value={topic.accuracy}
                        className="h-2 flex-1"
                      />
                      <span className="text-xs font-medium w-10 text-right">
                        {Math.round(topic.accuracy)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    {topic.correct}/{topic.total}
                  </td>
                  <td className="py-3 text-center">{topic.attempts}</td>
                  <td className="py-3 text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize text-xs",
                        confidenceStyles[topic.confidence] || confidenceStyles.medium
                      )}
                    >
                      {topic.confidence}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
