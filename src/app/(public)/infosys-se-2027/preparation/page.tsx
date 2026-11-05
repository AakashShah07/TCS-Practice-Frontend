import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Map } from "lucide-react";

export const metadata: Metadata = {
  title: "Infosys SE 2027 Preparation Roadmap — Coming Soon",
  description:
    "The Infosys 2027 Software Engineer preparation roadmap — topic sequence, assessment strategy and official-pattern-aligned mock tests — is being prepared. Meanwhile, start practicing on CrackNQT.",
  keywords: [
    "Infosys System Engineer Mock Test",
    "Infosys previous year questions",
    "Infosys free mock test",
    "Infosys exam preparation",
    "Infosys 2027 preparation",
  ],
  alternates: { canonical: "/infosys-se-2027/preparation" },
  robots: { index: true, follow: true },
};

export default function InfosysPreparationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center">
      <div className="container mx-auto max-w-3xl px-4 py-16 sm:py-24 text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Map className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-3xl sm:text-5xl font-black tracking-tight">
          Preparation Roadmap
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Coming Soon
          </span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          The Infosys SE 2027 preparation roadmap — topic sequence, assessment
          strategy and official-pattern-aligned practice — is being put together.
          Meanwhile, start practicing today with CrackNQT&apos;s existing resources.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/practice"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-8 text-sm sm:text-base font-semibold text-white transition-colors"
          >
            Practice on CrackNQT
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            href="/infosys-se-2027"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-border px-8 text-sm sm:text-base font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Back to recruitment details
          </Link>
        </div>
      </div>
    </div>
  );
}
