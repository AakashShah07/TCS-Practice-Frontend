"use client";

import { useEffect } from "react";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import InfosysHero from "./InfosysHero";
import InfosysSectionNav from "./InfosysSectionNav";
import InfosysJobOverview from "./InfosysJobOverview";
import InfosysEligibility from "./InfosysEligibility";
import InfosysExamPattern from "./InfosysExamPattern";
import InfosysSelectionTimeline from "./InfosysSelectionTimeline";
import InfosysSyllabus from "./InfosysSyllabus";
import InfosysFAQ from "./InfosysFAQ";
import InfosysResources from "./InfosysResources";
import InfosysFinalCTA from "./InfosysFinalCTA";

export default function InfosysSE2027Content() {
  useEffect(() => {
    trackEvent(AnalyticsEvents.INFOSYS_INFO_PAGE_VIEW, {
      campaign_id: "infosys_se_2027",
      placement: "info_page",
    });
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) root.classList.add("scroll-smooth");
    return () => root.classList.remove("scroll-smooth");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <InfosysHero />
      <InfosysSectionNav />
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14 space-y-14 sm:space-y-20">
        <InfosysJobOverview />
        <InfosysEligibility />
        <InfosysExamPattern />
        <InfosysSelectionTimeline />
        <InfosysSyllabus />
        <InfosysFAQ />
        <InfosysResources />
      </main>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-20">
        <InfosysFinalCTA />
      </div>
    </div>
  );
}
