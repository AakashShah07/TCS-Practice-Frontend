import { Metadata } from "next";
import { PrivacyHero } from "@/components/privacy/PrivacyHero";
import { PrivacyContent } from "@/components/privacy/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | CrackNQT",
  description: "Read CrackNQT's Privacy Policy to understand how information, cookies, analytics, advertising, and third-party services may be used on our website.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <PrivacyHero />
      <PrivacyContent />
    </main>
  );
}
