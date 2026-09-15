import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your CrackNQT account. Practice TCS NQT with 1000+ questions, real exam simulation, and detailed analytics. Free to start, with advanced Premium features.",
  alternates: { canonical: "/register" },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
