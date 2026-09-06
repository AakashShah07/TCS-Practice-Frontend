"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "01 — Structured Practice",
    description: "Practice in a focused environment instead of jumping between scattered resources.",
  },
  {
    title: "02 — Practical Preparation",
    description: "Build familiarity with the types of questions, concepts, and skills that matter.",
  },
  {
    title: "03 — Performance Awareness",
    description: "Use practice and results to understand where you are improving and where you need more work.",
  },
  {
    title: "04 — Accessible Learning",
    description: "Keep useful preparation resources easy to discover and use.",
  },
]

export function WhyCrackNQT() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why We Built CrackNQT
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Many learners face challenges with scattered resources and a lack of structured guidance. CrackNQT was built to address these problems.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
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
