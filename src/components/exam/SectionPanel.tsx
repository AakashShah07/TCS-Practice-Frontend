"use client";

import { Lock, Check } from "lucide-react";
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
  const {
    attemptId,
    sections,
    currentSection,
    setSection,
    responses,
    currentQuestionIndex,
    sectionLocked,
    submittedSections,
    isSectionAccessible,
  } = useTestStore();

  if (sections.length <= 1) return null;

  function handleSetSection(name: Section) {
    if (sectionLocked && !isSectionAccessible(name)) return;

    const timeSpent = setSection(name);
    const sectionInfo = sections.find((s) => s.name === name);
    if (attemptId && sectionInfo) {
      navigate(
        attemptId,
        sectionInfo.startIndex,
        currentQuestionIndex,
        timeSpent,
        name
      ).catch(() => {});
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 border-b">
      <div className="flex px-4 gap-1 overflow-x-auto">
        {sections.map((sec) => {
          const isActive = sec.name === currentSection;
          const isSubmitted = submittedSections.includes(sec.name);
          const isAccessible = isSectionAccessible(sec.name);
          const isLocked = sectionLocked && !isAccessible;
          const sectionResponses = responses.slice(sec.startIndex, sec.endIndex + 1);
          const answered = sectionResponses.filter((r) => r.status === "answered").length;
          const total = sectionResponses.length;

          return (
            <button
              key={sec.name}
              onClick={() => handleSetSection(sec.name)}
              disabled={isLocked}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all",
                isActive
                  ? "text-indigo-700 dark:text-indigo-400"
                  : isSubmitted
                  ? "text-emerald-600 dark:text-emerald-400"
                  : isLocked
                  ? "text-muted-foreground/40 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Lock / Check icon */}
              {isSubmitted && <Check className="h-3.5 w-3.5 text-emerald-500" />}
              {isLocked && <Lock className="h-3 w-3" />}

              {sectionLabels[sec.name] || sec.name}

              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-semibold tabular-nums",
                  isActive
                    ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                    : isSubmitted
                    ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {answered}/{total}
              </span>

              {/* Active indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
              {isSubmitted && !isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
