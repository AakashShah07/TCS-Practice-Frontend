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
    <section className="relative overflow-hidden border-b border-[#DCE5EF] bg-[#F1F5F9] text-[#172033] dark:border-white/5 dark:bg-[#0D0D21] dark:text-white">
      {/* Subtle radial accent glows — restrained, not decorative noise */}
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 hidden h-80 w-2xl -translate-x-1/2 rounded-full bg-purple-600/15 blur-[140px] dark:block"
      />
      <div
        aria-hidden="true"
        className="absolute top-24 -right-24 hidden h-72 w-72 rounded-full bg-amber-400/10 blur-[120px] dark:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[7%] hidden w-24 bg-[repeating-linear-gradient(135deg,transparent_0_13px,rgba(52,120,246,0.07)_13px_15px,transparent_15px_28px)] sm:block dark:hidden"
      />

      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 text-center">
        <motion.div {...motionProps}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#3478F6]/20 bg-white/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#285DB5] shadow-sm sm:text-[11px] dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300">
            <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
            Infosys · Campus Hiring 2027
          </div>

          <h1 className="mt-6 text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            Infosys Software Engineer{" "}
            <span className="bg-linear-to-r from-[#3478F6] to-[#8247FF] bg-clip-text text-transparent dark:from-amber-300 dark:via-purple-300 dark:to-purple-500">
              (SE)
            </span>
          </h1>

          <p className="mt-4 text-lg font-semibold text-[#334155] sm:text-2xl dark:text-white/90">
            Your next career opportunity starts here.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#52627A] sm:text-base dark:text-white/70">
            Explore the reported Infosys 2027 hiring details, understand the
            selection process, and discover what to prepare for the assessment.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-[11px] leading-relaxed text-[#718096] sm:text-xs dark:text-white/45">
            Searching for the Infosys System Engineer online assessment, Infosys
            exam pattern or Infosys fresher hiring? This page covers the reported
            Software Engineer (SE) campus drive for the 2027 batch — salary,
            eligibility, syllabus and selection process — based on current reports.
          </p>

          {/* Overview shortcuts */}
          <nav aria-label="Infosys hiring overview" className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {infosysHeroBadges.map((badge, i) => {
              const Icon = badgeIcons[i] ?? Briefcase;
              return (
                <Link
                  key={badge.label}
                  href="#job-overview"
                  className="group min-w-0 rounded-xl border border-[#DCE5EF] border-t-2 border-t-[#3478F6] bg-white px-3 py-3 text-center shadow-[0_2px_8px_rgba(23,32,51,0.05)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#B8CBE3] hover:shadow-[0_8px_18px_rgba(23,32,51,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3478F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1F5F9] dark:border-white/10 dark:border-t-[#A98BFF] dark:bg-white/4 dark:shadow-none dark:hover:border-white/20 dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.2)] dark:focus-visible:ring-offset-[#0D0D21]"
                >
                  <Icon
                    className="mx-auto mb-1.5 h-4 w-4 text-[#3478F6] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-[#8247FF] dark:text-amber-300 dark:group-hover:text-amber-200"
                    aria-hidden="true"
                  />
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-[#64748B] sm:text-[10px] dark:text-white/55">
                    {badge.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-bold leading-snug text-[#172033] sm:text-xs dark:text-white/95">
                    {badge.value}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              size="lg"
              className="h-12 rounded-xl bg-[#2563EB] px-8 text-sm font-semibold text-white transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-[#1D4ED8] hover:shadow-[0_8px_18px_rgba(37,99,235,0.22)] focus-visible:ring-2 focus-visible:ring-[#3478F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1F5F9] active:translate-y-0 sm:text-base dark:focus-visible:ring-offset-[#0D0D21]"
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
              className="h-12 rounded-xl border-[#CBD7E6] bg-white px-8 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#EAF1F8] hover:text-[#172033] focus-visible:ring-2 focus-visible:ring-[#3478F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1F5F9] sm:text-base dark:border-white/15 dark:bg-white/5 dark:text-white/85 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-offset-[#0D0D21]"
              render={<a href="#exam-pattern" />}
            >
              Explore Exam Pattern
            </Button>
          </div>

          <p className="mx-auto mt-8 flex max-w-2xl items-start justify-center gap-2 text-[10px] leading-snug text-[#718096] sm:text-[11px] dark:text-white/45">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3478F6] dark:text-[#A98BFF]" aria-hidden="true" />
            Recruitment information is based on currently available reports.
            Candidates should verify the latest details through Infosys and their
            placement cell.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
