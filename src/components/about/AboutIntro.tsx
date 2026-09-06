"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AboutIntro() {
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              What is CrackNQT?
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                CrackNQT is a dedicated educational platform built to bring clarity and structure to the preparation process for competitive exams and technical assessments. We understand that preparing for opportunities can often feel overwhelming, and our mission is to simplify that experience.
              </p>
              <p>
                We provide a centralized hub for learners to access practice questions, engage with mock tests, and explore curated resources. By focusing on practical application, we help aspirants build the necessary skills and confidence to perform their best when it matters most.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Focused Preparation</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Whether you are improving your aptitude, refining your reasoning skills, or mastering technical concepts, CrackNQT offers tools tailored to make your practice sessions more purposeful.
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
