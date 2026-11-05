"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import InfosysSectionHeading from "./InfosysSectionHeading";
import { infosysFaq } from "@/lib/infosys-2027-data";

const relatedSearches: { label: string; href: string }[] = [
  { label: "Infosys previous year questions", href: "/practice" },
  { label: "Infosys free mock test", href: "/tests/mock" },
  { label: "Infosys aptitude test practice", href: "/practice" },
  { label: "Infosys reasoning questions", href: "/tests/foundation?section=reasoning" },
  { label: "Infosys verbal ability practice", href: "/tests/foundation?section=verbal" },
  { label: "Infosys coding questions", href: "/coding" },
  { label: "Infosys exam pattern", href: "#exam-pattern" },
  { label: "Infosys eligibility criteria", href: "#eligibility" },
  { label: "Infosys selection process", href: "#selection-process" },
];

export default function InfosysFAQ() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24">
      <InfosysSectionHeading
        eyebrow="Good to know"
        title="Frequently Asked Questions"
        sub="Straight answers — anything reported above is a report, not a guarantee."
      />
      <div className="max-w-3xl">
        <Accordion
          className="w-full"
          onValueChange={(value: string | string[]) => {
            const v = Array.isArray(value) ? value : [value];
            v.filter(Boolean).forEach((item) => {
              const index = Number(item.replace("item-", ""));
              trackEvent(AnalyticsEvents.INFOSYS_FAQ_EXPAND, {
                campaign_id: "infosys_se_2027",
                question_index: Number.isFinite(index) ? index : -1,
              });
            });
          }}
        >
          {infosysFaq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm sm:text-base font-semibold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Keyword-rich internal links */}
      <div className="mt-6 max-w-3xl">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          People also search for
        </h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {relatedSearches.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="inline-block rounded-full border border-border/60 bg-muted/60 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
