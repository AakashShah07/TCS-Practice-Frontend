import type { Metadata } from "next";
import InfosysSE2027Content from "@/components/infosys/InfosysSE2027Content";

export const metadata: Metadata = {
  title: "Infosys SE 2027 Recruitment | Eligibility, Exam Pattern & Preparation",
  description:
    "Explore Infosys SE 2027 recruitment details, reported eligibility, salary, exam pattern, selection process, syllabus, and preparation resources on CrackNQT.",
  alternates: { canonical: "/infosys-se-2027" },
  openGraph: {
    title: "Infosys SE 2027 Recruitment | Eligibility, Exam Pattern & Preparation",
    description:
      "Explore Infosys SE 2027 recruitment details, reported eligibility, salary, exam pattern, selection process, syllabus, and preparation resources on CrackNQT.",
    url: "/infosys-se-2027",
    type: "website",
  },
};

export default function InfosysSE2027Page() {
  return <InfosysSE2027Content />;
}
