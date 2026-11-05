"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { isProtectedPath } from "@/lib/auth/session";
import SessionRevokedScreen from "./SessionRevokedScreen";

/**
 * Reads the global `sessionEnded` flag (set by the centralized session
 * handler) and renders the session-ended screen above everything else.
 * Authentication state is already cleared by the time this renders.
 */
export default function SessionRevokedHost() {
  const sessionEnded = useAuthStore((s) => s.sessionEnded);
  const clearSessionEnded = useAuthStore((s) => s.clearSessionEnded);
  const router = useRouter();
  const pathname = usePathname();

  const handleSignInAgain = useCallback(() => {
    const from = pathname && isProtectedPath(pathname) ? pathname : "/dashboard";
    clearSessionEnded();
    router.push(`/login?from=${encodeURIComponent(from)}`);
  }, [pathname, clearSessionEnded, router]);

  const handleBackToHome = useCallback(() => {
    clearSessionEnded();
    router.push("/");
  }, [clearSessionEnded, router]);

  if (!sessionEnded) return null;

  return (
    <SessionRevokedScreen
      reason={sessionEnded}
      onSignInAgain={handleSignInAgain}
      onBackToHome={handleBackToHome}
    />
  );
}
