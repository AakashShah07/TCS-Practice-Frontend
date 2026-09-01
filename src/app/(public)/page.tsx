"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Brain, Calculator, Target } from "lucide-react";

const examSections = [
  {
    title: "Foundation Section",
    description: "The core section testing basic aptitude.",
    icon: Brain,
    details: [
      { topic: "Numerical Ability", questions: 25, time: "30 mins" },
      { topic: "Reasoning Ability", questions: 25, time: "30 mins" },
      { topic: "Verbal Ability", questions: 25, time: "30 mins" },
    ],
    color: "text-blue-600",
  },
  {
    title: "Advanced Section",
    description: "Advanced topics for specific roles.",
    icon: Target,
    details: [
      { topic: "Advanced Quantitative Ability", questions: 20, time: "25 mins" },
      { topic: "Advanced Reasoning Ability", questions: 15, time: "25 mins" },
      { topic: "Advanced Coding", questions: 2, time: "55 mins" },
    ],
    color: "text-purple-600",
  },
];

export default function ExamPatternPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">TCS NQT Exam Pattern 2026</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Master the TCS NQT exam structure to boost your preparation strategy.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {examSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <section.icon className={`h-8 w-8 ${section.color}`} />
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                <div className="space-y-2">
                  {section.details.map((detail) => (
                    <div key={detail.topic} className="flex justify-between items-center bg-muted/50 p-2 rounded">
                      <span className="font-medium">{detail.topic}</span>
                      <span className="text-xs text-muted-foreground">{detail.questions} Qs • {detail.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
