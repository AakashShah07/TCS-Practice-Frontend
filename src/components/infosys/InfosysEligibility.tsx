"use client";

import { useState } from "react";
import { Check, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import InfosysSectionHeading from "./InfosysSectionHeading";
import {
  reportedEligibility,
  eligibilityChecklistItems,
} from "@/lib/infosys-2027-data";

/** Reported academic criteria — verify officially. Client-side only; nothing stored or sent. */
export default function InfosysEligibility() {
  const [checked, setChecked] = useState<boolean[]>(() =>
    eligibilityChecklistItems.map(() => false)
  );
  const done = checked.filter(Boolean).length;
  const total = checked.length;
  const percent = Math.round((done / total) * 100);

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      trackEvent(AnalyticsEvents.INFOSYS_ELIGIBILITY_CHECKLIST_INTERACTION, {
        campaign_id: "infosys_se_2027",
        item_index: index,
        checked_count: next.filter(Boolean).length,
      });
      return next;
    });
  };

  return (
    <section id="eligibility" aria-labelledby="eligibility-heading" className="scroll-mt-24">
      <InfosysSectionHeading
        eyebrow="Who can apply"
        title="Eligibility"
        sub="Reported academic requirements for this drive — always verify officially."
      />

      {/* Reported academic bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {reportedEligibility.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border/60 bg-card px-4 py-4 text-center"
          >
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-tight min-h-[2.5rem] flex items-center justify-center">
              {item.label}
            </p>
            <p className="mt-1 text-2xl sm:text-3xl font-black text-foreground">
              {item.value}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-wide text-muted-foreground/70">
              {item.note}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 flex items-start gap-2 text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 leading-snug">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Reported eligibility — verify against the official registration form and your
        campus placement notice. These reported figures are from a college-specific
        placement notice and are not universal Infosys eligibility criteria.
      </p>

      {/* Interactive checklist */}
      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Quick eligibility self-check
          </h3>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-bold",
              done === total
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            )}
            aria-live="polite"
          >
            {done === total ? (
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : null}
            {done}/{total} checked · {percent}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          aria-label="Eligibility checklist progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ul className="mt-4 divide-y divide-border/60">
          {eligibilityChecklistItems.map((item, i) => {
            const isChecked = checked[i];
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={isChecked}
                  className="flex w-full items-start gap-3 py-3 text-left rounded-lg px-2 -mx-2 transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                      isChecked
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-input bg-background"
                    )}
                    aria-hidden="true"
                  >
                    {isChecked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                  <span
                    className={cn(
                      "text-xs sm:text-sm leading-snug transition-colors",
                      isChecked
                        ? "text-muted-foreground line-through decoration-muted-foreground/50"
                        : "text-foreground"
                    )}
                  >
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-[10px] text-muted-foreground">
          Checked items are kept only in this browser tab and are never sent anywhere.
          This self-check is a preparation aid — it is not an eligibility decision.
        </p>
      </div>
    </section>
  );
}
