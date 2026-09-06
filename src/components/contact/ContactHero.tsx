"use client"

import { motion } from "framer-motion"
import { MessageSquareText } from "lucide-react"

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              CONTACT CRACKNQT
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Have a Question? We&apos;re Here to Help.
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Whether you have a question, found an issue, need help with the platform, or want to share feedback, we&apos;d love to hear from you.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <MessageSquareText className="size-64 text-primary/20" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
