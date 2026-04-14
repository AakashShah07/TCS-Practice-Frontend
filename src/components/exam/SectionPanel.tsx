"use client";

import { useTestStore } from "@/stores/test-store";
import { navigate } from "@/lib/api/exam";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/api/types";

const sectionLabels: Record<string, string> = {
  numerical: "Numerical",
  reasoning: "Reasoning",
  verbal: "Verbal",
  advanced: "Advanced",
};

export default function SectionPanel() {
  const { attemptId, sections, currentSection, setSection, questions, responses, currentQuestionIndex } =
    useTestStore();

  if (sections.length <= 1) return null;

  function handleSetSection(name: Section) {
    const timeSpent = setSection(name);
    const sectionInfo = sections.find((s) => s.name === name);
    if (attemptId && sectionInfo) {
      navigate(attemptId, sectionInfo.startIndex, currentQuestionIndex, timeSpent, name).catch(() => {});
    }
  }

  return (
    <div className="border-b bg-muted/30">
      <div className="flex overflow-x-auto">
        {sections.map((sec) => {
          const isActive = sec.name === currentSection;
          const sectionResponses = responses.slice(
            sec.startIndex,
            sec.endIndex + 1
          );
          const answered = sectionResponses.filter(
            (r) => r.status === "answered"
          ).length;

          return (
            <button
              key={sec.name}
              onClick={() => handleSetSection(sec.name)}
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
                {answered}/{sectionResponses.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
