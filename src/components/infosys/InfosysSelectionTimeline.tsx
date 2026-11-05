"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import InfosysSectionHeading from "./InfosysSectionHeading";
import { selectionStages } from "@/lib/infosys-2027-data";

/** Horizontal timeline on desktop, vertical on mobile. Each stage expands on click. */
export default function InfosysSelectionTimeline() {
  const [openId, setOpenId] = useState<string | null>("assessment");

  const toggle = (id: string) => {
    setOpenId((prev) => {
      const next = prev === id ? null : id;
      if (next) {
        trackEvent(AnalyticsEvents.INFOSYS_SELECTION_STAGE_INTERACTION, {
          campaign_id: "infosys_se_2027",
          stage: id,
        });
      }
      return next;
    });
  };

  return (
    <section id="selection-process" aria-labelledby="selection-process-heading" className="scroll-mt-24">
      <InfosysSectionHeading
        eyebrow="What happens next"
        title="Selection Process"
        sub="Reported stages for this drive — the exact flow can vary between campuses."
      />

      {/* Desktop: horizontal spine */}
      <ol className="hidden md:grid grid-cols-5 gap-0 relative">
        <div
          aria-hidden="true"
          className="absolute left-[10%] right-[10%] top-7 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />
        {selectionStages.map((stage, i) => {
          const isOpen = openId === stage.id;
          return (
            <li key={stage.id} className="relative flex flex-col items-center text-center px-2">
              <button
                type="button"
                onClick={() => toggle(stage.id)}
                aria-expanded={isOpen}
                aria-controls={`stage-detail-${stage.id}`}
                className={cn(
                  "relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isOpen
                    ? "border-primary/60 bg-primary/15 text-primary shadow-[0_0_0_4px_hsl(var(--background))]"
                    : "border-border/70 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
                )}
              >
                <stage.icon className="h-6 w-6" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground">
                  {i + 1}
                </span>
              </button>
              <button
                type="button"
                onClick={() => toggle(stage.id)}
                aria-expanded={isOpen}
                aria-controls={`stage-detail-${stage.id}`}
                className="mt-3 focus-visible:outline-none focus-visible:underline rounded"
              >
                <span className="block text-xs font-bold text-foreground">{stage.title}</span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground">{stage.short}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Expanded detail (desktop — shared panel) */}
      {openId && (
        <div
          id="stage-detail-desktop"
          className="hidden md:block mt-6 rounded-2xl border border-border/60 bg-card p-5"
          role="region"
          aria-live="polite"
        >
          {(() => {
            const stage = selectionStages.find((s) => s.id === openId)!;
            return (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <stage.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{stage.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {stage.detail}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Mobile: vertical timeline with inline expansion */}
      <ol className="md:hidden relative border-l border-border/70 ml-3 space-y-3">
        {selectionStages.map((stage, i) => {
          const isOpen = openId === stage.id;
          return (
            <li key={stage.id} className="relative pl-8">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-4 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border text-[10px] font-black",
                  isOpen
                    ? "border-primary/60 bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                )}
              >
                {i + 1}
              </span>
              <button
                type="button"
                onClick={() => toggle(stage.id)}
                aria-expanded={isOpen}
                aria-controls={`stage-detail-${stage.id}`}
                className="w-full rounded-xl border border-border/60 bg-card px-4 py-3 text-left transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    <stage.icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-bold text-foreground">{stage.title}</span>
                      <span className="block text-[10px] text-muted-foreground">{stage.short}</span>
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </span>
                {isOpen && (
                  <span
                    id={`stage-detail-${stage.id}`}
                    className="mt-3 block border-t border-border/60 pt-3 text-xs text-muted-foreground leading-relaxed"
                  >
                    {stage.detail}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-[10px] sm:text-[11px] text-muted-foreground">
        Not every candidate follows an identical process — rounds, mode and criteria
        depend on the specific drive. No interview rounds or durations are publicly confirmed.
      </p>
    </section>
  );
}
