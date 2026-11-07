"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpenCheck,
  Map,
  ClipboardCheck,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import { INFOSYS_SE_2027_CAMPAIGN } from "@/lib/constants/campaigns";
import { cn } from "@/lib/utils";

const featureChips = [
  { icon: BookOpenCheck, label: "Exam Guide" },
  { icon: Map, label: "Preparation Roadmap" },
  { icon: ClipboardCheck, label: "Free Mock Tests" },
];

/**
 * Company Preparation — featured Infosys Hiring 2027 card.
 * Awareness → preparation funnel entry. Navigates to the Infosys 2027 page.
 */
export default function CompanyPreparation() {
  return (
    <section aria-labelledby="company-preparation-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 id="company-preparation-heading" className="text-xl font-semibold">
          Company Preparation
        </h2>
      </div>

      <div
        className={cn(
          "group relative isolate overflow-hidden rounded-2xl border border-[#E8E5E0] bg-[#FFFCF7] text-[#171717] shadow-[0_8px_24px_rgba(23,23,23,0.06)]",
          "p-4 pl-5 sm:p-6 sm:pl-7 lg:p-7 lg:pl-8 transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none",
          "hover:border-violet-300 hover:shadow-[0_14px_34px_rgba(23,23,23,0.10)]",
          "dark:border-[#262D45] dark:bg-[#10172A] dark:text-[#F8FAFC] dark:shadow-[0_12px_30px_rgba(0,0,0,0.24)] dark:hover:border-violet-500/60 dark:hover:shadow-[0_16px_38px_rgba(0,0,0,0.32)]"
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-1 flex-col"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-1 flex-col"
        >
          <span className="h-1/4 bg-[#6C42F5] dark:bg-[#7028FF]" />
          <span className="h-1/4 bg-[#FF6B45] dark:bg-[#FF6B35]" />
          <span className="h-1/4 bg-[#F6C94D] dark:bg-[#00C8FF]" />
          <span className="h-1/4 bg-[#2BBF9B] dark:bg-[#7028FF]" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] sm:block"
        >
          <div className="absolute inset-y-0 right-0 w-full bg-[repeating-linear-gradient(135deg,transparent_0_17px,rgba(108,66,245,0.075)_17px_19px,transparent_19px_34px)] dark:hidden" />
          <div className="absolute -right-12 -top-12 h-56 w-20 rotate-[35deg] bg-[#7028FF]/[0.10] dark:bg-[#7028FF]/20" />
          <div className="absolute -right-1 top-1/3 h-56 w-12 rotate-[35deg] bg-[#00C8FF]/[0.12] dark:bg-[#00C8FF]/20" />
          <div className="absolute right-16 -bottom-24 h-56 w-10 rotate-[35deg] bg-[#FF6B35]/[0.12] dark:bg-[#FF6B35]/20" />
        </div>

        <div className="relative z-20 grid min-w-0 gap-4 sm:gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:gap-x-5 md:gap-y-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-7">
          <div className="flex min-w-0 items-center gap-3 md:contents">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E8E5E0] bg-white p-1.5 dark:border-[#262D45] dark:shadow-[0_0_0_3px_rgba(112,40,255,0.10)] sm:h-14 sm:w-14 lg:row-span-2 lg:h-16 lg:w-16">
              <Image
                src="/logos/infosys.webp"
                alt="Infosys logo"
                width={64}
                height={64}
                className="h-full w-full object-contain"
              />
            </div>

            <span className="inline-flex min-h-8 items-center gap-1.5 whitespace-nowrap rounded-md border border-[#F6C94D]/60 bg-[#F6C94D]/15 px-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6A4B00] dark:border-[#F6C94D]/30 dark:bg-[#F6C94D]/10 dark:text-[#F6D878] md:hidden">
              <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
              New · 2027 Batch
            </span>
          </div>

          <div className="min-w-0 md:col-start-2 md:row-start-1 lg:col-start-2 lg:row-start-1">
            <span className="hidden min-h-7 w-fit items-center gap-1.5 rounded-md border border-[#F6C94D]/60 bg-[#F6C94D]/15 px-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6A4B00] dark:border-[#F6C94D]/30 dark:bg-[#F6C94D]/10 dark:text-[#F6D878] md:inline-flex">
              <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
              New · 2027 Batch
            </span>
            <h3 className="mt-1.5 text-[clamp(1.25rem,3vw,1.75rem)] font-extrabold leading-tight tracking-tight">
              Infosys Hiring 2027
            </h3>
            <p className="mt-1 text-[13px] font-semibold text-[#6C42F5] dark:text-[#A98BFF] sm:text-sm">
              Software Engineer (SE) · 2027 Batch
            </p>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#646464] dark:text-[#A5B4CC] sm:text-sm">
              Get ready for Infosys recruitment with the exam guide, preparation
              roadmap, and practice tests.
            </p>
            <ul className="mt-3 flex min-w-0 flex-wrap gap-2">
              {featureChips.map(({ icon: Icon, label }, index) => (
                <li
                  key={label}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-[#E8E5E0] bg-white/80 px-2.5 text-[11px] font-medium text-[#454545] dark:border-[#303951] dark:bg-[#151E34] dark:text-[#D3DCEE] sm:px-3 sm:text-xs"
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      index === 0 && "text-[#6C42F5] dark:text-[#A98BFF]",
                      index === 1 && "text-[#D65435] dark:text-[#FF8C67]",
                      index === 2 && "text-[#178B70] dark:text-[#43D5B0]"
                    )}
                    aria-hidden="true"
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col gap-2 md:col-start-2 md:row-start-2 md:flex-row md:items-center lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:flex-col lg:items-end lg:justify-center">
            <Button
              size="lg"
              className="h-12 w-full whitespace-nowrap rounded-lg bg-[#6C42F5] px-5 text-sm font-bold text-white shadow-[0_5px_14px_rgba(108,66,245,0.22)] transition-colors hover:bg-[#5730D8] focus-visible:ring-2 focus-visible:ring-[#6C42F5] focus-visible:ring-offset-2 dark:bg-[#7028FF] dark:shadow-[0_0_18px_rgba(112,40,255,0.18)] dark:hover:bg-[#833EFF] dark:focus-visible:ring-[#00C8FF] md:w-auto md:px-6 sm:text-base"
              render={
                <Link
                  href={INFOSYS_SE_2027_CAMPAIGN.mocksUrl}
                  onClick={() =>
                    trackEvent(AnalyticsEvents.INFOSYS_MOCK_CATALOG_CLICK, {
                      campaign_id: "infosys_se_2027",
                      placement: "dashboard",
                    })
                  }
                />
              }
            >
              Mock Tests & Prep
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/button:translate-x-0.5" aria-hidden="true" />
            </Button>
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777] dark:text-[#8492AD] md:ml-1 lg:text-right">
              Free · 2027 Batch
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
