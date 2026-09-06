"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export function AudienceSection() {
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-3xl font-bold tracking-tight sm:text-4xl text-center">Built for Learners With Different Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Students</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">For learners building their fundamentals and preparing for upcoming exams.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Placement Aspirants</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">For candidates preparing for aptitude, reasoning, technical, and placement assessments.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Programming Learners</CardTitle></CardHeader>
            <CardContent className="text-muted-foreground">For learners strengthening their programming and computer science fundamentals.</CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export function QualityCommitment() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">Our Commitment to Quality</h2>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
          We believe preparation becomes more effective when learners can trust the resources they use. We aim to create and organize useful educational content that is relevant, understandable, and practical. We continuously work to improve the platform, refine the learning experience, and keep resources useful for learners.
        </p>
      </div>
    </section>
  )
}

export function TransparencySection() {
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl text-center">Built With Transparency in Mind</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/privacy" className={buttonVariants({ variant: "outline" })}>Privacy Policy</Link>
          <Link href="/terms" className={buttonVariants({ variant: "outline" })}>Terms & Conditions</Link>
          <Link href="/contact" className={buttonVariants({ variant: "outline" })}>Contact Us</Link>
        </div>
      </div>
    </section>
  )
}

export function VisionSection() {
  return (
    <section className="py-16 lg:py-24 text-center">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">Our Vision</h2>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Our vision is to build a reliable preparation platform where learners can find useful practice, understand their progress, and prepare with greater clarity and confidence.
        </p>
      </div>
    </section>
  )
}

export function AboutCTA() {
  return (
    <section className="py-16 bg-primary text-primary-foreground text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Preparing?</h2>
        <p className="mb-8 text-lg opacity-90">Explore CrackNQT&apos;s preparation resources and make your next practice session more focused.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/practice" className={buttonVariants({ variant: "secondary", size: "lg" })}>Explore CrackNQT</Link>
          <Link href="/contact" className={buttonVariants({ variant: "default", size: "lg", className: "bg-primary-foreground text-primary hover:bg-white" })}>Contact Us</Link>
        </div>
      </div>
    </section>
  )
}
