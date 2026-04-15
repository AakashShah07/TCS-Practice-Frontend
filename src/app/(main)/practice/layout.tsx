import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topic Practice",
  description:
    "Practice TCS NQT questions by topic — Percentages, Ratios, Algebra, Reasoning, Grammar, and more. Free with detailed solutions.",
  alternates: { canonical: "/practice" },
};

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
