"use client";

import { usePreventCopy } from "@/hooks/usePreventCopy";

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  usePreventCopy();
  return <div className="min-h-screen bg-background">{children}</div>;
}
