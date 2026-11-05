/**
 * Centralized session lifecycle handling.
 *
 * Responsibilities:
 * - Idempotent endSession(): clears auth state, user-specific caches and
 *   localStorage, then flips `sessionEnded` in the auth store so the UI can
 *   render the session-ended screen.
 * - manualLogout(): same cleanup WITHOUT marking the session as revoked, and
 *   tells other tabs to sign out too.
 * - Cross-tab sync via BroadcastChannel (never carries token material).
 *
 * This module never calls the backend. The backend remains the source of
 * truth; we only react to its responses.
 */

import { useAuthStore } from "@/stores/auth-store";
import { useProgressStore } from "@/stores/progress-store";
import { broadcastSessionMessage, subscribeToSessionChannel } from "@/lib/auth/broadcast";
import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import type { SessionEndReason } from "@/lib/api/errors";

export const PUBLIC_PATH_PREFIXES = [
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/privacy-policy",
  "/tcs-nqt-cutoff",
  "/tcs-nqt-preparation",
  "/tcs-nqt-syllabus",
];

export function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => prefix !== "/" && pathname.startsWith(prefix)
  );
}

export function isProtectedPath(pathname: string): boolean {
  return !isPublicPath(pathname);
}

export function getRouteCategory(pathname: string): string {
  if (pathname.startsWith("/exam")) return "exam";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/tests")) return "tests";
  if (pathname.startsWith("/practice")) return "practice";
  if (pathname.startsWith("/coding")) return "coding";
  if (pathname.startsWith("/analytics")) return "analytics";
  if (pathname.startsWith("/premium")) return "premium";
  if (pathname.startsWith("/results")) return "results";
  return isPublicPath(pathname) ? "public" : "other";
}

/** Clear auth + user-specific caches everywhere (storage, zustand stores). */
export function clearAuthAndUserCaches(): void {
  useAuthStore.getState().logout();
  useProgressStore.getState().resetProgress();
}

interface EndSessionOptions {
  /** Broadcast to other tabs (default true). Forwarded messages pass false. */
  broadcast?: boolean;
}

/**
 * Terminate the local session because the backend invalidated it.
 * Idempotent: repeated calls (concurrent 401s) only run the cleanup once.
 * Never calls the backend.
 */
export function endSession(
  reason: SessionEndReason,
  { broadcast = true }: EndSessionOptions = {}
): void {
  const store = useAuthStore.getState();
  if (store.sessionEnded) return; // already handled — no duplicate UI/events

  clearAuthAndUserCaches();
  useAuthStore.getState().setSessionEnded(reason);

  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    trackEvent(AnalyticsEvents.SESSION_REVOKED, {
      reason_category: reason,
      route_category: getRouteCategory(pathname),
      in_exam: pathname.startsWith("/exam"),
    });
  }

  if (broadcast) {
    broadcastSessionMessage({ type: "session-ended", reason });
  }
}

/**
 * User-initiated logout. Clears everything but does NOT mark the session as
 * revoked (no session-ended screen) and tells other tabs to sign out.
 */
export function manualLogout(): void {
  clearAuthAndUserCaches();
  broadcastSessionMessage({ type: "logout" });
}

/** Dismiss the session-ended screen. Tokens remain cleared. */
export function dismissSessionEnded(): void {
  useAuthStore.getState().clearSessionEnded();
}

/**
 * Subscribe to cross-tab events. Call once (from Providers).
 * Returns an unsubscribe function.
 */
export function initSessionChannel(): () => void {
  return subscribeToSessionChannel((message) => {
    switch (message.type) {
      case "logout":
        clearAuthAndUserCaches();
        if (
          typeof window !== "undefined" &&
          isProtectedPath(window.location.pathname)
        ) {
          window.location.assign("/login");
        }
        break;
      case "session-ended":
        endSession(message.reason as SessionEndReason, { broadcast: false });
        break;
      case "tokens-rotated":
        // Tokens already live in shared localStorage — nothing to do.
        break;
    }
  });
}
