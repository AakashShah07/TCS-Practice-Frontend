"use client"

import { motion } from "framer-motion"

const steps = [
  { title: "Learn", description: "Understand the concepts and fundamentals." },
  { title: "Practice", description: "Solve questions and build familiarity." },
  { title: "Analyze", description: "Review performance and identify weak areas." },
  { title: "Improve", description: "Focus your preparation where it matters most." },
]

export function PreparationApproach() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-3xl font-bold tracking-tight sm:text-4xl">
          Our Approach to Preparation
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex flex-col gap-2"
            >
              <div className="text-4xl font-extrabold text-primary/20">{`0${index + 1}`}</div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
