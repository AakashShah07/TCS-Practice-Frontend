"use client"

import { motion } from "framer-motion"

export function PrivacyHero() {
  return (
    <section className="bg-background py-16 lg:py-24 border-b border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we handle your information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last Updated: September 6, 2026
          </p>
        </motion.div>
      </div>
    </section>
  )
}
