"use client";

import { useState } from "react";
import { Clock, ListChecks, Target, AlertCircle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import InfosysSectionHeading from "./InfosysSectionHeading";
import { examSections, examPatternSummary, examPatternDisclaimer } from "@/lib/infosys-2027-data";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Interactive reported exam-pattern explorer. Data-driven — update infosys-2027-data.ts to change it. */
export default function InfosysExamPattern() {
  const [activeId, setActiveId] = useState(examSections[0].id);
  const active = examSections.find((s) => s.id === activeId) ?? examSections[0];

  const select = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    trackEvent(AnalyticsEvents.INFOSYS_EXAM_PATTERN_INTERACTION, {
      campaign_id: "infosys_se_2027",
      section: id,
    });
  };

  return (
    <section id="exam-pattern" aria-labelledby="exam-pattern-heading" className="scroll-mt-24">
      <InfosysSectionHeading
        eyebrow="Reported assessment"
        title="Exam Pattern"
        sub="Tap a section to see questions, marks, duration and how to prepare for it."
      />

      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-amber-400/10 px-4 py-4 sm:px-6">
        {[
          { icon: ListChecks, text: `${examPatternSummary.totalQuestions} Questions` },
          { icon: Target, text: `${examPatternSummary.sections} Sections` },
          { icon: Clock, text: `${examPatternSummary.totalMinutes} Minutes` },
          { icon: Target, text: `${examPatternSummary.totalMarks} Objective Marks` },
        ].map(({ icon: Icon, text }, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-foreground"
          >
            <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
            {text}
          </span>
        ))}
      </div>

      {/* Selector — horizontal chips on mobile, list + detail on desktop */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div
          className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x"
          role="tablist"
          aria-label="Exam sections"
        >
          {examSections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`section-panel-${section.id}`}
                id={`section-tab-${section.id}`}
                onClick={() => select(section.id)}
                className={cn(
                  "snap-start shrink-0 lg:shrink lg:w-full text-left rounded-xl border px-4 py-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "border-primary/60 bg-primary/10 shadow-sm"
                    : "border-border/60 bg-card hover:border-primary/40 hover:bg-accent/40"
                )}
              >
                <span className="block text-xs sm:text-sm font-bold text-foreground whitespace-nowrap lg:whitespace-normal">
                  {section.name}
                </span>
                <span className="mt-0.5 block text-[10px] sm:text-[11px] text-muted-foreground">
                  {section.questions !== null ? `${section.questions}Q` : "1 Essay"} ·{" "}
                  {section.marks !== null ? `${section.marks} marks` : "Marks — n/s"} ·{" "}
                  {section.durationMinutes} min
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div
          role="tabpanel"
          id={`section-panel-${active.id}`}
          aria-labelledby={`section-tab-${active.id}`}
          className="lg:col-span-8 rounded-2xl border border-border/60 bg-card p-5 sm:p-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              {active.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {active.questions !== null ? `${active.questions} questions` : "Essay"}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {active.marks !== null ? `${active.marks} marks` : "Marks not specified"}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {active.durationMinutes} minutes
              </Badge>
            </div>
          </div>

          <h4 className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            High-yield topics
          </h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {active.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-lg border border-border/60 bg-muted/60 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-foreground"
              >
                {topic}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/5 p-4">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Preparation tip
              </p>
              <p className="mt-1 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {active.tip}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 text-[10px] sm:text-[11px] text-muted-foreground leading-snug">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {examPatternDisclaimer}
      </p>
    </section>
  );
}
