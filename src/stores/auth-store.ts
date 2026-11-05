"use client";

import { create } from "zustand";
import type { User } from "@/lib/api/types";
import type { SessionEndReason } from "@/lib/api/errors";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Set when the backend invalidated our session (or refresh failed). Drives the session-ended UI. */
  sessionEnded: SessionEndReason | null;
  login: (
    user: User,
    accessToken: string,
    refreshToken: string,
    sessionId?: string
  ) => void;
  /** Clears local auth state + storage only. Never triggers API calls or redirects. */
  logout: () => void;
  setLoading: (loading: boolean) => void;
  /** Persist a rotated token pair (after silent refresh). Never resurrects a cleared/ended session. */
  setTokens: (accessToken: string, refreshToken: string) => void;
  hydrate: () => void;
  setSessionEnded: (reason: SessionEndReason) => void;
  /** Dismiss the session-ended screen (user chose to sign in again / go home). Tokens stay cleared. */
  clearSessionEnded: () => void;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";
const SESSION_ID_KEY = "sessionId";

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  sessionId: null,
  isAuthenticated: false,
  isLoading: true,
  sessionEnded: null,

  login: (user, accessToken, refreshToken, sessionId) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (sessionId) localStorage.setItem(SESSION_ID_KEY, sessionId);
    else localStorage.removeItem(SESSION_ID_KEY);
    set({
      user,
      accessToken,
      sessionId: sessionId ?? null,
      isAuthenticated: true,
      isLoading: false,
      sessionEnded: null,
    });
  },

  logout: () => {
    clearAuthStorage();
    set({
      user: null,
      accessToken: null,
      sessionId: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setTokens: (accessToken, refreshToken) => {
    // Never resurrect a session that was explicitly ended locally.
    if (!localStorage.getItem(REFRESH_TOKEN_KEY)) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    set({ accessToken });
  },

  hydrate: () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, accessToken, sessionId, isAuthenticated: true, isLoading: false });
      } catch {
        clearAuthStorage();
        set({ isLoading: false });
      }
    } else {
      // Partial/stale state — start clean rather than "half authenticated".
      if (accessToken || userStr) clearAuthStorage();
      set({ isLoading: false });
    }
  },

  setSessionEnded: (reason) => set({ sessionEnded: reason }),
  clearSessionEnded: () => set({ sessionEnded: null }),
}));
