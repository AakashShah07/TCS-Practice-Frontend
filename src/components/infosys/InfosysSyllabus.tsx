"use client";

import { useState } from "react";
import InfosysSectionHeading from "./InfosysSectionHeading";
import { syllabusCategories } from "@/lib/infosys-2027-data";
import { cn } from "@/lib/utils";

/** Compact tabbed topic overview — not a textbook syllabus. */
export default function InfosysSyllabus() {
  const [activeId, setActiveId] = useState<string>(syllabusCategories[0].id);
  const active =
    syllabusCategories.find((c) => c.id === activeId) ?? syllabusCategories[0];

  return (
    <section id="syllabus" aria-labelledby="syllabus-overview-heading" className="scroll-mt-24">
      <InfosysSectionHeading
        eyebrow="What to study"
        title="Syllabus Overview"
        sub="High-yield topics per category — enough to plan your preparation, not a textbook."
      />

      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Syllabus categories"
        className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap snap-x"
      >
        {syllabusCategories.map((category) => {
          const isActive = category.id === activeId;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`syllabus-panel-${category.id}`}
              id={`syllabus-tab-${category.id}`}
              onClick={() => setActiveId(category.id)}
              className={cn(
                "snap-start inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border/60 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
              )}
            >
              <category.icon className="h-4 w-4" aria-hidden="true" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Topics panel */}
      <div
        role="tabpanel"
        id={`syllabus-panel-${active.id}`}
        aria-labelledby={`syllabus-tab-${active.id}`}
        className="mt-4 rounded-2xl border border-border/60 bg-card p-5 sm:p-6"
      >
        <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
          <active.icon className="h-5 w-5 text-primary" aria-hidden="true" />
          {active.label}
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {active.topics.map((topic) => (
            <li
              key={topic}
              className="rounded-lg border border-border/60 bg-muted/60 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-foreground"
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
}
