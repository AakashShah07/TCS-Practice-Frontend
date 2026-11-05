import axios from "axios";
import { toast } from "sonner";

import { endSession } from "@/lib/auth/session";
import { broadcastSessionMessage } from "@/lib/auth/broadcast";
import { useAuthStore } from "@/stores/auth-store";
import { getErrorCode, getErrorStatus, isNetworkError } from "./errors";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ---------------------------------------------------------------------------
// Silent refresh — single-flight, cross-tab aware, never resurrects a session
// that was cleared mid-flight.
// ---------------------------------------------------------------------------

type RefreshResult =
  | { ok: true; accessToken: string }
  | { ok: false; reason: "network" | "invalid" | "expired" | "revoked" | "aborted" };

/** True while any authenticated session exists locally. */
function authStillPresent(): boolean {
  return (
    typeof window !== "undefined" &&
    !!localStorage.getItem("refreshToken") &&
    useAuthStore.getState().isAuthenticated
  );
}

async function performRefresh(): Promise<RefreshResult> {
  const sentRefreshToken = localStorage.getItem("refreshToken");
  if (!sentRefreshToken) return { ok: false, reason: "expired" };

  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken: sentRefreshToken },
      { timeout: 15000 }
    );

    // Logged out (here or in another tab) while the request was in flight —
    // do not write tokens back, and do NOT raise the session-ended screen
    // (the user signed out deliberately).
    if (!authStillPresent()) return { ok: false, reason: "aborted" };

    // Stale-response guard — another tab may have rotated the token pair
    // while this request was in flight. Never let our (older) response
    // overwrite their newer tokens.
    const latestRefreshToken = localStorage.getItem("refreshToken");
    const latestAccessToken = localStorage.getItem("accessToken");
    if (latestRefreshToken && latestRefreshToken !== sentRefreshToken) {
      if (latestAccessToken) {
        // Adopt the newer state into the store (tokens stay in storage —
        // never write our stale response over them).
        useAuthStore.setState({ accessToken: latestAccessToken });
        return { ok: true, accessToken: latestAccessToken };
      }
      return { ok: false, reason: "network" }; // retry later; don't clobber
    }

    if (data?.success && data?.accessToken && data?.refreshToken) {
      useAuthStore
        .getState()
        .setTokens(data.accessToken, data.refreshToken);
      broadcastSessionMessage({ type: "tokens-rotated" });
      return { ok: true, accessToken: data.accessToken };
    }

    // Malformed success payload — treat as an unrecoverable refresh.
    return { ok: false, reason: "invalid" };
  } catch (error) {
    const code = getErrorCode(error);

    if (code === "SESSION_REVOKED") return { ok: false, reason: "revoked" };
    if (code === "REFRESH_TOKEN_EXPIRED" || code === "TOKEN_EXPIRED") {
      return { ok: false, reason: "expired" };
    }
    if (code === "REFRESH_TOKEN_INVALID" || code === "TOKEN_INVALID") {
      // Concurrency recovery — another tab may have rotated the token
      // pair while ours was rejected. Adopt the newer state if it exists.
      const latestRefreshToken = localStorage.getItem("refreshToken");
      const latestAccessToken = localStorage.getItem("accessToken");
      if (
        latestRefreshToken &&
        latestRefreshToken !== sentRefreshToken &&
        latestAccessToken
      ) {
        useAuthStore.setState({ accessToken: latestAccessToken });
        return { ok: true, accessToken: latestAccessToken };
      }
      return { ok: false, reason: "invalid" };
    }
    if (isNetworkError(error)) return { ok: false, reason: "network" };
    // Unknown 401 from the refresh endpoint — treat as re-auth required.
    if (getErrorStatus(error) === 401) return { ok: false, reason: "invalid" };
    // Anything else (5xx etc.) is not a revocation — leave auth untouched.
    return { ok: false, reason: "network" };
  }
}

let refreshPromise: Promise<RefreshResult> | null = null;

/** All concurrent 401s share this single refresh operation. */
export function refreshAccessToken(): Promise<RefreshResult> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/** Test-only hook: reset the single-flight lock between tests. */
export function __resetRefreshForTests(): void {
  refreshPromise = null;
}

// ---------------------------------------------------------------------------
// Restriction toasts (403) — never log the user out for these.
// ---------------------------------------------------------------------------

let lastRestrictionToastAt = 0;
const RESTRICTION_TOAST_COOLDOWN_MS = 5000;

function toastRestrictionOnce(code: "PREMIUM_REQUIRED" | "ADMIN_REQUIRED") {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastRestrictionToastAt < RESTRICTION_TOAST_COOLDOWN_MS) return;
  lastRestrictionToastAt = now;
  toast.error(
    code === "PREMIUM_REQUIRED"
      ? "This content is available with Premium membership."
      : "Admin access is required for this action."
  );
}

let lastNetworkToastAt = 0;

function toastNetworkOnce() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastNetworkToastAt < RESTRICTION_TOAST_COOLDOWN_MS) return;
  lastNetworkToastAt = now;
  toast.error("Connection problem — please check your internet and try again.");
}

// ---------------------------------------------------------------------------
// Response interceptor — exact backend contract handling.
// ---------------------------------------------------------------------------

const AUTH_ENDPOINT_PATTERN =
  /\/auth\/(login|register|refresh|logout)(\?|$|\/)/;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status: number | null = error?.response?.status ?? null;
    const code = getErrorCode(error);
    const requestUrl: string = originalRequest?.url ?? "";
    const isAuthRequest = AUTH_ENDPOINT_PATTERN.test(requestUrl);

    // --- 403: authorization restrictions. NOT a session problem. ---
    if (code === "PREMIUM_REQUIRED" || code === "ADMIN_REQUIRED") {
      toastRestrictionOnce(code);
      return Promise.reject(error);
    }

    // --- 401 handling ---
    if (status === 401 && !isAuthRequest && originalRequest) {
      // SESSION_REVOKED — never attempt a refresh; the backend has
      // already replaced this session. Clear immediately.
      if (code === "SESSION_REVOKED") {
        endSession("revoked");
        return Promise.reject(error);
      }

      // TOKEN_INVALID — the credential itself is invalid; clear without refreshing.
      if (code === "TOKEN_INVALID") {
        endSession("invalid");
        return Promise.reject(error);
      }

      // TOKEN_EXPIRED (or a 401 without a code) → silent refresh.
      if (originalRequest._retry) {
        return Promise.reject(error); // already retried once — do not loop
      }
      originalRequest._retry = true;

      const result = await refreshAccessToken();
      if (result.ok) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
        return apiClient(originalRequest);
      }

      switch (result.reason) {
        case "revoked":
          endSession("revoked");
          break;
        case "expired":
          endSession("expired");
          break;
        case "invalid":
          endSession("refresh_failed");
          break;
        case "aborted":
          // User signed out mid-flight — nothing to announce.
          break;
        case "network":
          // Transient failure — keep the session; user can retry.
          toastNetworkOnce();
          break;
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
