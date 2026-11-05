"use client";

import { ExternalLink, FileText, ClipboardCheck, BookOpenCheck } from "lucide-react";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import InfosysSectionHeading from "./InfosysSectionHeading";
import {
  INFOSYS_REGISTRATION_URL,
  INFOSYS_SAMPLE_PAPER_URL,
} from "@/lib/infosys-2027-data";

/** Official Infosys resources — clearly distinguished from CrackNQT prep. */
export default function InfosysResources() {
  const openLink = (link: "registration" | "sample_paper") => () =>
    trackEvent(AnalyticsEvents.INFOSYS_REGISTRATION_LINK_CLICK, {
      campaign_id: "infosys_se_2027",
      link,
    });

  return (
    <section aria-labelledby="resources-heading">
      <InfosysSectionHeading
        eyebrow="Official links"
        title="Registration & Resources"
        sub="Official Infosys resources for this drive — registration and the official sample paper."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href={INFOSYS_REGISTRATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={openLink("registration")}
          className="group rounded-2xl border border-primary/30 bg-primary/5 p-5 transition-all hover:border-primary/60 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-primary">
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              Official Registration
            </span>
            <ExternalLink
              className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
          <p className="mt-3 text-base font-bold text-foreground">
            Infosys SE Campus Registration 2027
          </p>
          <p className="mt-1 break-all text-[10px] text-muted-foreground">
            surveys.infosysapps.com/r/a/SEcampusregistration2027batch
          </p>
        </a>

        <a
          href={INFOSYS_SAMPLE_PAPER_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={openLink("sample_paper")}
          className="group rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Official Sample Paper
            </span>
            <ExternalLink
              className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
          <p className="mt-3 text-base font-bold text-foreground">
            Infosys Campus Recruitment Sample Test (PDF)
          </p>
          <p className="mt-1 break-all text-[10px] text-muted-foreground">
            infytq.onwingspan.com — SystemsEngineer sample paper
          </p>
        </a>
      </div>

      {/* CrackNQT prep resources — clearly distinguished */}
      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
        <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
          CrackNQT (unofficial preparation)
        </p>
        <p className="mt-2 text-xs sm:text-sm text-foreground/85 leading-relaxed">
          Practice resources on CrackNQT are independent study material — they are not
          endorsed by or affiliated with Infosys. Use them alongside the official
          notification and your placement cell.
        </p>
      </div>
    </section>
  );
}
