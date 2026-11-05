import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/analytics", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/analytics")>();
  return { ...actual, trackEvent: vi.fn() };
});

import { trackEvent, AnalyticsEvents } from "@/lib/analytics";
import {
  endSession,
  manualLogout,
  initSessionChannel,
  clearAuthAndUserCaches,
  getRouteCategory,
  isPublicPath,
} from "@/lib/auth/session";
import { useAuthStore } from "@/stores/auth-store";
import { useProgressStore } from "@/stores/progress-store";
import {
  MockBroadcastChannel,
  resetAllStores,
} from "./setup";

const trackEventMock = vi.mocked(trackEvent);

const testUser = {
  _id: "u1",
  name: "Test User",
  email: "test@example.com",
  role: "user" as const,
  isPremium: true,
};

async function seedAuthenticatedPremiumUser() {
  useAuthStore.getState().login(testUser, "A1", "R1", "S1");
  useProgressStore.getState().setDashboard({
    totalTests: 10,
    avgScore: 80,
    avgAccuracy: 85,
    totalTimeSpent: 3600,
    sectionPerformance: {},
    lastUpdated: new Date().toISOString(),
  });
}

beforeEach(async () => {
  MockBroadcastChannel.reset();
  vi.stubGlobal("BroadcastChannel", MockBroadcastChannel);
  await resetAllStores();
  trackEventMock.mockClear();
});

describe("endSession", () => {
  it("clears tokens, user, premium state, sessionId and cached progress", async () => {
    await seedAuthenticatedPremiumUser();
    endSession("revoked");

    const auth = useAuthStore.getState();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
    expect(auth.accessToken).toBeNull();
    expect(auth.sessionEnded).toBe("revoked");
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("sessionId")).toBeNull();
    // premium UI derives from user → cleared too
    expect(useProgressStore.getState().dashboard).toBeNull();
  });

  it("is idempotent — concurrent calls clean up exactly once", async () => {
    await seedAuthenticatedPremiumUser();
    endSession("revoked");
    endSession("revoked");
    endSession("expired"); // even a different reason must not re-trigger

    expect(trackEventMock).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().sessionEnded).toBe("revoked");
  });

  it("emits a non-sensitive analytics event exactly once", async () => {
    await seedAuthenticatedPremiumUser();
    endSession("revoked");

    expect(trackEventMock).toHaveBeenCalledTimes(1);
    const [name, params] = trackEventMock.mock.calls[0];
    expect(name).toBe(AnalyticsEvents.SESSION_REVOKED);
    expect(params).toEqual({
      reason_category: "revoked",
      route_category: "public",
      in_exam: false,
    });
    // no secrets in analytics
    expect(JSON.stringify(trackEventMock.mock.calls)).not.toContain("R1");
    expect(JSON.stringify(trackEventMock.mock.calls)).not.toContain("A1");
    expect(JSON.stringify(trackEventMock.mock.calls)).not.toContain("S1");
    expect(JSON.stringify(trackEventMock.mock.calls)).not.toContain("test@example.com");
  });
});

describe("manualLogout", () => {
  it("clears auth WITHOUT marking the session as ended", async () => {
    await seedAuthenticatedPremiumUser();
    manualLogout();

    const auth = useAuthStore.getState();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.sessionEnded).toBeNull();
    expect(useProgressStore.getState().dashboard).toBeNull();
  });

  it("broadcasts 'logout' without any token material", async () => {
    await seedAuthenticatedPremiumUser();
    const received: unknown[] = [];
    const listener = new MockBroadcastChannel("cracknqt-session");
    listener.addEventListener("message", (e) => received.push(e.data));

    manualLogout();

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual({ type: "logout" });
    expect(JSON.stringify(received)).not.toMatch(/token|R1|A1/i);
    listener.close();
  });
});

describe("initSessionChannel (cross-tab)", () => {
  it("clears auth in this tab when another tab logs out — no revoked screen", async () => {
    await seedAuthenticatedPremiumUser();
    const unsubscribe = initSessionChannel();

    const other = new MockBroadcastChannel("cracknqt-session");
    other.postMessage({ type: "logout" });

    const auth = useAuthStore.getState();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.sessionEnded).toBeNull();
    unsubscribe();
    other.close();
  });

  it("shows the session-ended state when another tab reports revocation", async () => {
    await seedAuthenticatedPremiumUser();
    const unsubscribe = initSessionChannel();

    const other = new MockBroadcastChannel("cracknqt-session");
    other.postMessage({ type: "session-ended", reason: "revoked" });

    expect(useAuthStore.getState().sessionEnded).toBe("revoked");
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    unsubscribe();
    other.close();
  });
});

describe("helpers", () => {
  it("classifies public vs protected paths", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/tcs-nqt-syllabus")).toBe(true);
    expect(isPublicPath("/dashboard")).toBe(false);
    expect(isPublicPath("/exam/abc123")).toBe(false);
  });

  it("maps paths to route categories", () => {
    expect(getRouteCategory("/exam/abc")).toBe("exam");
    expect(getRouteCategory("/dashboard")).toBe("dashboard");
    expect(getRouteCategory("/premium/payment")).toBe("premium");
    expect(getRouteCategory("/results/xyz")).toBe("results");
    expect(getRouteCategory("/")).toBe("public");
  });

  it("clearAuthAndUserCaches clears both stores", async () => {
    await seedAuthenticatedPremiumUser();
    clearAuthAndUserCaches();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useProgressStore.getState().dashboard).toBeNull();
  });
});
