"use client";

import CutoffHero from "@/components/cutoff/CutoffHero";
import CutoffSummary from "@/components/cutoff/CutoffSummary";
import SectionAnalysis from "@/components/cutoff/SectionAnalysis";
import CutoffFactors from "@/components/cutoff/CutoffFactors";
import CutoffFAQ from "@/components/cutoff/CutoffFAQ";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CutoffPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CutoffHero />
      <div className="container mx-auto space-y-12 pb-20">
        <CutoffSummary />
        <SectionAnalysis />
        <CutoffFactors />
        <CutoffFAQ />
        <section className="py-12 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Don't Prepare for the Cutoff. Prepare Above It.</h2>
          <div className="flex gap-4 justify-center">
            <Button render={<Link href="/tests">Take a Mock Test</Link>} />
            <Button variant="outline" render={<Link href="/practice">Practice Questions</Link>} />
          </div>
        </section>
      </div>
    </div>
  );
}
