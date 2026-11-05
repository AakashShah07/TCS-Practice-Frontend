"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import InfosysSectionHeading from "./InfosysSectionHeading";
import { infosysFaq } from "@/lib/infosys-2027-data";

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
    </section>
  );
}
