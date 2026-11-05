"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import SessionRevokedHost from "@/components/auth/SessionRevokedHost";
import { useAuthStore } from "@/stores/auth-store";
import { initSessionChannel } from "@/lib/auth/session";

export default function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const sessionEnded = useAuthStore((s) => s.sessionEnded);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Cross-tab coordination: logout/session-ended in another tab clears us too.
  useEffect(() => initSessionChannel(), []);

  // Hide background from tab order + hit-testing while the session-ended
  // screen is up. `contents` keeps the wrapper out of the layout tree.
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="contents" inert={sessionEnded ? true : undefined}>
        {children}
      </div>
      <SessionRevokedHost />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
