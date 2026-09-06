"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  { q: "How can I report an incorrect question or answer?", a: "Please use the 'Content Feedback' option in the contact form, and provide the question details, including the question ID if available." },
  { q: "How can I report a technical problem?", a: "Select 'Technical Issue' in the form, and describe the problem, including the browser and device you were using." },
  { q: "How can I suggest a feature?", a: "We love feedback! Use 'Suggestion' in the contact form to share your ideas for improving CrackNQT." },
]

export function ContactFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
        <Accordion className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
