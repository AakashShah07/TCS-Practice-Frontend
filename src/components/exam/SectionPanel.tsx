"use client";

import { useTestStore } from "@/stores/test-store";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/api/types";

const sectionLabels: Record<string, string> = {
  numerical: "Numerical",
  logical: "Logical",
  verbal: "Verbal",
  advanced: "Advanced",
};

export default function SectionPanel() {
  const { sections, currentSection, setSection, questions, answers } =
    useTestStore();

  if (sections.length <= 1) return null;

  return (
    <div className="border-b bg-muted/30">
      <div className="flex overflow-x-auto">
        {sections.map((sec) => {
          const isActive = sec.name === currentSection;
          const sectionQuestions = questions.slice(
            sec.startIndex,
            sec.endIndex + 1
          );
          const answered = sectionQuestions.filter(
            (q) =>
              answers[q.id]?.selectedOption !== null &&
              answers[q.id]?.selectedOption !== undefined
          ).length;

          return (
            <button
              key={sec.name}
              onClick={() => setSection(sec.name)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              )}
            >
              {sectionLabels[sec.name] || sec.name}
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  isActive ? "bg-primary/10" : "bg-muted"
                )}
              >
                {answered}/{sectionQuestions.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
