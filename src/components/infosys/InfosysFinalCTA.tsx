"use client";

import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { infosysPrepUrl } from "@/lib/infosys-2027-data";

export default function InfosysFinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-purple-500/25 bg-gradient-to-br from-[#171730] via-[#1B1533] to-[#0D0D21] px-6 py-10 sm:px-12 sm:py-14 text-center relative"
    >
      {/* Restrained accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[36rem] rounded-full bg-purple-600/20 blur-[120px]"
      />
      <div className="relative">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-purple-950 shadow-lg shadow-amber-400/25">
          <Rocket className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2
          id="final-cta-heading"
          className="mt-5 text-2xl sm:text-4xl font-black tracking-tight text-white"
        >
          Ready to Start Your Infosys Preparation?
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-white/70">
          Build your preparation step by step with topic-wise practice, assessment
          strategies, and mock tests on CrackNQT.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button
            size="lg"
            className="h-12 rounded-xl px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold"
            render={
              <Link
                href={infosysPrepUrl}
                onClick={() =>
                  trackEvent(AnalyticsEvents.INFOSYS_PREPARATION_CTA_CLICK, {
                    campaign_id: "infosys_se_2027",
                    placement: "final_cta",
                  })
                }
              />
            }
          >
            Start Preparation
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-12 rounded-xl px-8 text-white/70 hover:text-white hover:bg-white/10"
            render={<a href="#exam-pattern" />}
          >
            Back to Exam Overview
          </Button>
        </div>
      </div>
    </section>
  );
}
