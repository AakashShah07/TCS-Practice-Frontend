"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  scoreHistory: { date: string; score: number }[];
  accuracyHistory: { date: string; accuracy: number }[];
  sectionPerformance: {
    section: string;
    accuracy: number;
    testsCount: number;
    improvement: number;
  }[];
}

const sectionLabels: Record<string, string> = {
  numerical: "Numerical",
  logical: "Logical",
  verbal: "Verbal",
  advanced: "Advanced",
};

export default function PerformanceCharts({
  scoreHistory,
  accuracyHistory,
  sectionPerformance,
}: Props) {
  const sectionData = sectionPerformance.map((s) => ({
    ...s,
    name: sectionLabels[s.section] || s.section,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>Track your improvement over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="score">
          <TabsList className="mb-4">
            <TabsTrigger value="score">Score Trend</TabsTrigger>
            <TabsTrigger value="accuracy">Accuracy Trend</TabsTrigger>
            <TabsTrigger value="sections">By Section</TabsTrigger>
          </TabsList>

          <TabsContent value="score">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis domain={[0, 100]} fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="accuracy">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis domain={[0, 100]} fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="sections">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis domain={[0, 100]} fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="accuracy"
                    fill="hsl(var(--primary))"
                    name="Accuracy %"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="improvement"
                    fill="#16a34a"
                    name="Improvement %"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
