import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/stores/auth-store";
import { resetAllStores } from "./setup";

const user = {
  _id: "u1",
  name: "Test User",
  email: "test@example.com",
  role: "user" as const,
  isPremium: true,
};

beforeEach(async () => {
  await resetAllStores();
});

describe("auth-store", () => {
  it("login stores tokens, user, sessionId and marks premium unusable after logout", () => {
    useAuthStore.getState().login(user, "A1", "R1", "S1");

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.sessionId).toBe("S1");
    expect(localStorage.getItem("accessToken")).toBe("A1");
    expect(localStorage.getItem("refreshToken")).toBe("R1");
    expect(localStorage.getItem("sessionId")).toBe("S1");

    useAuthStore.getState().logout();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("sessionId")).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("hydrate restores a persisted session including sessionId", () => {
    localStorage.setItem("accessToken", "A1");
    localStorage.setItem("refreshToken", "R1");
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("sessionId", "S1");

    useAuthStore.getState().hydrate();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.sessionId).toBe("S1");
    expect(state.isLoading).toBe(false);
  });

  it("hydrate with corrupt user JSON clears the stale state", () => {
    localStorage.setItem("accessToken", "A1");
    localStorage.setItem("user", "{not json");

    useAuthStore.getState().hydrate();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("hydrate with partial state (token only) does not half-authenticate", () => {
    localStorage.setItem("accessToken", "A1");

    useAuthStore.getState().hydrate();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("setTokens rotates the pair but never resurrects a cleared session", () => {
    useAuthStore.getState().login(user, "A1", "R1", "S1");
    useAuthStore.getState().setTokens("A2", "R2");
    expect(localStorage.getItem("accessToken")).toBe("A2");
    expect(localStorage.getItem("refreshToken")).toBe("R2");

    useAuthStore.getState().logout();
    useAuthStore.getState().setTokens("A3", "R3"); // must be a no-op
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("manual login clears any previous sessionEnded flag", () => {
    useAuthStore.getState().setSessionEnded("revoked");
    useAuthStore.getState().login(user, "A1", "R1", "S1");
    expect(useAuthStore.getState().sessionEnded).toBeNull();
  });
});
