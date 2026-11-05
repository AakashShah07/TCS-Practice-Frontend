import type { Metadata } from "next";
import InfosysSE2027Content from "@/components/infosys/InfosysSE2027Content";
import { infosysFaq } from "@/lib/infosys-2027-data";

export const metadata: Metadata = {
  title: "Infosys System Engineer Exam 2027 | Pattern, Syllabus & Mock Test",
  description:
    "Infosys System Engineer exam and hiring — 2027 recruitment details: exam pattern (60Q, 7 sections, 120 min), eligibility criteria, ₹3.6 LPA salary CTC, selection process, syllabus, online assessment and free mock tests on CrackNQT.",
  alternates: {
    canonical: "https://cracknqt.vercel.app/infosys-se-2027",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "Infosys System Engineer Exam 2027 | Pattern, Syllabus & Mock Test",
    description:
      "Infosys System Engineer hiring: reported ₹3.6 LPA salary CTC, 60Q/120-min online assessment for freshers, eligibility criteria, selection process and free preparation on CrackNQT.",
    url: "https://cracknqt.vercel.app/infosys-se-2027",
    siteName: "CrackNQT",
    type: "website",
    images: [
      {
        url: "/images/infosysBanner/PC_size_Banner.png",
        width: 1728,
        height: 910,
        alt: "Infosys System Engineer Exam 2027 — reported exam pattern, eligibility and preparation on CrackNQT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infosys System Engineer Exam 2027 | Pattern, Syllabus & Mock Test",
    description:
      "Infosys System Engineer hiring 2027: salary, exam pattern, eligibility and selection process — plus free mock tests on CrackNQT.",
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
      { "@type": "ListItem", position: 2, name: "Infosys System Engineer Exam 2027", item: "https://cracknqt.vercel.app/infosys-se-2027" },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Infosys System Engineer Exam 2027 | Pattern, Syllabus & Mock Test",
    url: "https://cracknqt.vercel.app/infosys-se-2027",
    description:
      "Reported Infosys Software Engineer 2027 campus hiring: salary CTC, exam pattern, eligibility, selection process and syllabus — with free mock tests on CrackNQT.",
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "CrackNQT", url: "https://cracknqt.vercel.app/" },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://cracknqt.vercel.app/images/infosysBanner/PC_size_Banner.png",
    },
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
