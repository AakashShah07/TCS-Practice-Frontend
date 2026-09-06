"use client"

import { motion } from "framer-motion"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export function AboutHero() {
  return (
    <section className="relative flex min-h-[500px] items-center overflow-hidden bg-background py-16 lg:py-24">
      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              ABOUT CRACKNQT
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Helping You Prepare Smarter. Practice Better. Crack Your Next Opportunity.
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              CrackNQT is an educational platform designed to help students, job seekers, and competitive-exam aspirants prepare more effectively through structured practice, useful resources, and realistic preparation tools.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/practice" className={buttonVariants({ variant: "default", size: "lg" })}>Explore Resources</Link>
              <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>Contact Us</Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-border bg-muted/50 shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                {/* Decorative element - simple icon or shape */}
                <svg
                  className="size-32 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
