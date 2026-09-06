import { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactOptions } from "@/components/contact/ContactOptions";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { ContactTrustSection, PrivacyNotice } from "@/components/contact/ContactExtra";

export const metadata: Metadata = {
  title: "Contact CrackNQT",
  description: "Contact CrackNQT for questions, technical support, feedback, content issues, and help with the platform.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <ContactHero />
      <ContactOptions />
      <ContactForm />
      <PrivacyNotice />
      <ContactFAQ />
      <ContactTrustSection />
    </main>
  );
}
