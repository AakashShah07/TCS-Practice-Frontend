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
  reasoning: "Reasoning",
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tick={{ fill: "#475569", fontSize: 11 }}
                    axisLine={{ stroke: "#94a3b8" }}
                    tickLine={{ stroke: "#94a3b8" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    fontSize={12}
                    tick={{ fill: "#475569", fontSize: 11 }}
                    axisLine={{ stroke: "#94a3b8" }}
                    tickLine={{ stroke: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #d8b4fe",
                      color: "#334155",
                      backgroundColor: "#ffffff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    strokeLinecap="round"
                    connectNulls
                    dot={{ r: 4, strokeWidth: 2, fill: "#ffffff", stroke: "#7c3aed" }}
                    activeDot={{ r: 6, fill: "#7c3aed", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="accuracy">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tick={{ fill: "#475569", fontSize: 11 }}
                    axisLine={{ stroke: "#94a3b8" }}
                    tickLine={{ stroke: "#94a3b8" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    fontSize={12}
                    tick={{ fill: "#475569", fontSize: 11 }}
                    axisLine={{ stroke: "#94a3b8" }}
                    tickLine={{ stroke: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #86efac",
                      color: "#334155",
                      backgroundColor: "#ffffff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#16a34a"
                    strokeWidth={3}
                    strokeLinecap="round"
                    connectNulls
                    dot={{ r: 4, strokeWidth: 2, fill: "#ffffff", stroke: "#16a34a" }}
                    activeDot={{ r: 6, fill: "#16a34a", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="sections">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tick={{ fill: "#475569", fontSize: 11 }}
                    axisLine={{ stroke: "#94a3b8" }}
                    tickLine={{ stroke: "#94a3b8" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    fontSize={12}
                    tick={{ fill: "#475569", fontSize: 11 }}
                    axisLine={{ stroke: "#94a3b8" }}
                    tickLine={{ stroke: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #cbd5e1",
                      color: "#334155",
                      backgroundColor: "#ffffff",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="accuracy"
                    fill="#7c3aed"
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
