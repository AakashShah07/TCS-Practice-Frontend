import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cutoffData } from "@/lib/cutoff-data";

export default function CutoffFAQ() {
  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
      <div className="max-w-2xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {cutoffData.faq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
