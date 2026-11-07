"use client";

import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { INFOSYS_SE_2027_CAMPAIGN } from "@/lib/constants/campaigns";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";

/** Slim bridge strip — links the info page to the mock catalog. */
export default function InfosysMockTeaser() {
  return (
    <Link
      href={INFOSYS_SE_2027_CAMPAIGN.mocksUrl}
      onClick={() =>
        trackEvent(AnalyticsEvents.INFOSYS_MOCK_CATALOG_CLICK, {
          campaign_id: "infosys_se_2027",
          placement: "info_page_teaser",
        })
      }
      className="group flex items-center justify-between gap-4 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10 px-4 sm:px-6 py-4 transition-all hover:border-blue-400/50 hover:shadow-[0_12px_35px_rgba(59,130,246,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <span className="flex items-center gap-3 sm:gap-4">
        <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
          <ClipboardCheck className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-xs sm:text-sm font-extrabold tracking-tight text-foreground">
            Infosys 2027 Mock Tests are live
          </span>
          <span className="mt-0.5 block text-[9px] sm:text-[11px] text-muted-foreground">
            Start with the Data Interpretation — Fair Stalls Logic Set (54 questions · 45 min · Free)
          </span>
        </span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
        Open catalog
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}
