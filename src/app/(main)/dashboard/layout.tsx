import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your TCS NQT preparation dashboard — track progress, view analytics, and start practice tests.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
