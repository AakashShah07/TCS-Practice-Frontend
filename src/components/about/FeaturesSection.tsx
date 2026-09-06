"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Code, BarChart, FileText } from "lucide-react"

const features = [
  { icon: BookOpen, title: "Mock Tests", description: "Simulate real exam conditions." },
  { icon: FileText, title: "Practice Questions", description: "Topic-wise practice sets." },
  { icon: Code, title: "Programming", description: "Strengthen coding fundamentals." },
  { icon: BarChart, title: "Performance Analysis", description: "Track your improvement." },
]

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Everything You Need to Practice With Purpose
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                  <feature.icon className="size-8 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {feature.description}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
