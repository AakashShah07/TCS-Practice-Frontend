import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TCS NQT Coding Questions (PYQ)",
  description:
    "Practice TCS NQT previous year coding questions with brute force and optimal solutions. Arrays, strings, sorting, searching, and more.",
  alternates: { canonical: "/coding" },
};

export default function CodingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
