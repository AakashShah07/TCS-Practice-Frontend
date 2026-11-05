import type { Metadata } from "next";
import InfosysSE2027Content from "@/components/infosys/InfosysSE2027Content";
import { infosysFaq } from "@/lib/infosys-2027-data";

export const metadata: Metadata = {
  title: "Infosys SE 2027 Recruitment | Eligibility, Exam Pattern & Preparation",
  description:
    "Explore Infosys System Engineer hiring 2026 for freshers — reported exam pattern (60Q, 7 sections, 120 min), eligibility criteria, salary CTC ₹3.6 LPA, selection process, syllabus, online assessment and free mock tests on CrackNQT.",
  keywords: [
    "Infosys System Engineer Exam 2026",
    "Infosys System Engineer Hiring 2026",
    "Infosys Exam 2026",
    "Infosys November Hiring",
    "Infosys System Engineer Recruitment",
    "Infosys Fresher Hiring",
    "Infosys Off Campus Drive 2026",
    "Infosys Graduate Hiring",
    "Infosys System Engineer Online Assessment",
    "Infosys exam pattern",
    "Infosys System Engineer syllabus",
    "Infosys aptitude test",
    "Infosys online test questions",
    "Infosys assessment duration",
    "Infosys selection process",
    "Infosys System Engineer Salary 2026",
    "Infosys System Engineer package",
    "Infosys System Engineer CTC",
    "Infosys eligibility criteria",
    "Infosys qualification requirements",
    "Infosys fresher salary",
    "Infosys System Engineer Mock Test",
    "Infosys previous year questions",
    "Infosys reasoning questions",
    "Infosys verbal ability practice",
    "Infosys numerical ability test",
    "Infosys coding questions",
    "Infosys free mock test",
  ],
  alternates: { canonical: "/infosys-se-2027" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    title: "Infosys SE 2027 Recruitment | Eligibility, Exam Pattern & Preparation",
    description:
      "Infosys System Engineer hiring 2026: reported salary ₹3.6 LPA, 60Q/120-min online assessment, eligibility criteria, selection process and preparation on CrackNQT.",
    url: "/infosys-se-2027",
    siteName: "CrackNQT",
    type: "website",
    images: [
      {
        url: "/images/infosysBanner/PC_size_Banner.png",
        width: 1728,
        height: 910,
        alt: "Infosys Software Engineer 2027 campus hiring — recruitment information page on CrackNQT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infosys SE 2027 Recruitment | Eligibility, Exam Pattern & Preparation",
    description:
      "Infosys System Engineer hiring 2026: salary, exam pattern, eligibility and selection process — plus free practice on CrackNQT.",
    images: ["/images/infosysBanner/PC_size_Banner.png"],
  },
};

export default function InfosysSE2027Page() {
  // Rich results — FAQPage content mirrors the visible accordion exactly.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: infosysFaq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "CrackNQT", item: "https://cracknqt.vercel.app/" },
      { "@type": "ListItem", position: 2, name: "Infosys SE 2027", item: "https://cracknqt.vercel.app/infosys-se-2027" },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Infosys SE 2027 Recruitment | Eligibility, Exam Pattern & Preparation",
    url: "https://cracknqt.vercel.app/infosys-se-2027",
    description:
      "Reported Infosys Software Engineer 2027 campus hiring: salary ₹3.6 LPA, exam pattern, eligibility, selection process and syllabus, with free preparation on CrackNQT.",
    isPartOf: { "@type": "WebSite", name: "CrackNQT", url: "https://cracknqt.vercel.app/" },
  };

  return (
    <>
      {[faqJsonLd, breadcrumbJsonLd, webPageJsonLd].map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <InfosysSE2027Content />
    </>
  );
}
