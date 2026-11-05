"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Info,
  Megaphone,
  IndianRupee,
  GraduationCap,
  Users,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { infosysHeroBadges, infosysPrepUrl } from "@/lib/infosys-2027-data";

const badgeIcons = [Briefcase, GraduationCap, IndianRupee, Users];

export default function InfosysHero() {
  const reduceMotion = useReducedMotion();

  const motionProps = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" as const },
      };

  return (
    <section className="relative overflow-hidden bg-[#0D0D21] text-white border-b border-white/5">
      {/* Subtle radial accent glows — restrained, not decorative noise */}
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[42rem] rounded-full bg-purple-600/15 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="absolute top-24 -right-24 h-72 w-72 rounded-full bg-amber-400/10 blur-[120px]"
      />

      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 text-center">
        <motion.div {...motionProps}>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">
            <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
            Infosys · Campus Hiring 2027
          </div>

          <h1 className="mt-6 text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            Infosys Software Engineer{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-purple-300 to-purple-500">
              (SE)
            </span>
          </h1>

          <p className="mt-4 text-lg sm:text-2xl font-semibold text-white/90">
            Your next career opportunity starts here.
          </p>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-white/60 leading-relaxed">
            Explore the reported Infosys 2027 hiring details, understand the
            selection process, and discover what to prepare for the assessment.
          </p>

          {/* Compact info chips */}
          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-3xl mx-auto">
            {infosysHeroBadges.map((badge, i) => {
              const Icon = badgeIcons[i] ?? Briefcase;
              return (
                <div
                  key={badge.label}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center"
                >
                  <Icon
                    className="mx-auto mb-1.5 h-4 w-4 text-amber-300"
                    aria-hidden="true"
                  />
                  <dt className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    {badge.label}
                  </dt>
                  <dd className="mt-0.5 text-[11px] sm:text-xs font-bold text-white/95 leading-snug">
                    {badge.value}
                  </dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              size="lg"
              className="h-12 rounded-xl px-8 text-sm sm:text-base font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              render={
                <Link
                  href={infosysPrepUrl}
                  onClick={() =>
                    trackEvent(AnalyticsEvents.INFOSYS_PREPARATION_CTA_CLICK, {
                      campaign_id: "infosys_se_2027",
                      placement: "hero",
                    })
                  }
                />
              }
            >
              Start Your Preparation
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl px-8 text-sm sm:text-base font-semibold border-white/15 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white"
              render={<a href="#exam-pattern" />}
            >
              Explore Exam Pattern
            </Button>
          </div>

          <p className="mt-8 flex items-start justify-center gap-2 max-w-2xl mx-auto text-[10px] sm:text-[11px] text-white/40 leading-snug">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Recruitment information is based on currently available reports.
            Candidates should verify the latest details through Infosys and their
            placement cell.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
