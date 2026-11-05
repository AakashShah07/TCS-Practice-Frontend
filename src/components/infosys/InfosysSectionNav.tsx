"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "job-overview", label: "Overview" },
  { id: "eligibility", label: "Eligibility" },
  { id: "exam-pattern", label: "Exam Pattern" },
  { id: "selection-process", label: "Process" },
  { id: "syllabus", label: "Syllabus" },
  { id: "faq", label: "FAQ" },
] as const;

/** Compact sticky section navigation scoped to this page. */
export default function InfosysSectionNav() {
  const [activeId, setActiveId] = useState<string>(sections[0].id);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      // Section becomes "active" when its top third crosses the sticky bar
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-16 z-40 -mx-4 sm:-mx-6 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Page sections"
        className="container mx-auto max-w-6xl px-4 sm:px-6 overflow-x-auto"
      >
        <ul className="flex items-center gap-1 py-2 min-w-max">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
