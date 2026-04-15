import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Tests",
  description:
    "Take free TCS NQT practice tests — Numerical Ability, Logical Reasoning, Verbal Ability, and Advanced sections. 25 questions per test, new questions every attempt.",
  alternates: { canonical: "/tests" },
};

export default function TestsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
