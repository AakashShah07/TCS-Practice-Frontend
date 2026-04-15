import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "View your TCS NQT preparation analytics — scores, accuracy, time management, and personalized recommendations.",
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
