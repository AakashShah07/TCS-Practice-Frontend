/**
 * Interceptor contract tests — runs the real Axios instance with a mocked
 * HTTP adapter, so the actual request/response interceptor chain executes.
 * The refresh call itself (plain axios.post) is spied on.
 */
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("@/lib/analytics", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/analytics")>();
  return { ...actual, trackEvent: vi.fn() };
});

import apiClient, { __resetRefreshForTests } from "@/lib/api/client";
import { trackEvent } from "@/lib/analytics";
import { useAuthStore } from "@/stores/auth-store";
import { useProgressStore } from "@/stores/progress-store";
import { resetAllStores } from "./setup";

const trackEventMock = vi.mocked(trackEvent);
const originalAdapter = apiClient.defaults.adapter;

const testUser = {
  _id: "u1",
  name: "Test User",
  email: "test@example.com",
  role: "user" as const,
  isPremium: true,
};

function seedSession() {
  useAuthStore.getState().login(testUser, "A1", "R1", "S1");
}

function okAdapterResponse(config: InternalAxiosRequestConfig, data: unknown) {
  return {
    status: 200,
    statusText: "OK",
    data,
    headers: {},
    config,
  };
}

function httpError(
  status: number,
  data: unknown,
  config?: InternalAxiosRequestConfig
): AxiosError {
  const cfg = (config ?? { headers: {} }) as InternalAxiosRequestConfig;
  const response = {
    status,
    statusText: String(status),
    data,
    headers: {},
    config: cfg,
  };
  return new AxiosError(
    `Request failed with status code ${status}`,
    "ERR_BAD_REQUEST",
    cfg,
    undefined,
    response as never
  );
}

function networkError(config?: InternalAxiosRequestConfig): AxiosError {
  return new AxiosError(
    "Network Error",
    "ERR_NETWORK",
    (config ?? { headers: {} }) as InternalAxiosRequestConfig
  );
}

/** Point every apiClient request at `handler` instead of the network. */
function setAdapter(
  handler: (config: InternalAxiosRequestConfig) => Promise<unknown>
) {
  apiClient.defaults.adapter = vi.fn(handler) as never;
}

function adapterCalls() {
  return (apiClient.defaults.adapter as unknown as ReturnType<typeof vi.fn>)
    .mock.calls as [InternalAxiosRequestConfig][];
}

beforeEach(async () => {
  await resetAllStores();
  __resetRefreshForTests();
  trackEventMock.mockClear();
  vi.spyOn(axios, "post").mockReset();
});

afterAll(() => {
  apiClient.defaults.adapter = originalAdapter;
});

describe("SESSION_REVOKED", () => {
  it("clears auth immediately, does NOT call refresh, and flags sessionEnded", async () => {
    seedSession();
    setAdapter((config) => {
      throw httpError(401, {
        success: false,
        code: "SESSION_REVOKED",
        message: "Session has been revoked or replaced",
      }, config);
    });

    await expect(apiClient.get("/dashboard")).rejects.toBeTruthy();

    expect(axios.post).not.toHaveBeenCalled();
    const auth = useAuthStore.getState();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
    expect(auth.sessionEnded).toBe("revoked");
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(localStorage.getItem("sessionId")).toBeNull();
  });

  it("clears premium UI state and cached progress", async () => {
    seedSession();
    useProgressStore.getState().setDashboard({
      totalTests: 3,
      avgScore: 50,
      avgAccuracy: 60,
      totalTimeSpent: 100,
      sectionPerformance: {},
      lastUpdated: "2026-01-01",
    });
    setAdapter((config) => {
      throw httpError(401, { success: false, code: "SESSION_REVOKED" }, config);
    });

    await expect(apiClient.get("/analytics/dashboard")).rejects.toBeTruthy();

    expect(useAuthStore.getState().user?.isPremium).toBeUndefined();
    expect(useProgressStore.getState().dashboard).toBeNull();
  });

  it("is idempotent under concurrent requests (one screen, one analytics event)", async () => {
    seedSession();
    setAdapter((config) => {
      throw httpError(401, { success: false, code: "SESSION_REVOKED" }, config);
    });

    await expect(apiClient.get("/a")).rejects.toBeTruthy();
    await expect(apiClient.get("/b")).rejects.toBeTruthy();

    expect(useAuthStore.getState().sessionEnded).toBe("revoked");
    expect(trackEventMock).toHaveBeenCalledTimes(1);
  });
});

describe("TOKEN_INVALID", () => {
  it("clears auth without attempting refresh and marks the session ended", async () => {
    seedSession();
    setAdapter((config) => {
      throw httpError(401, { success: false, code: "TOKEN_INVALID" }, config);
    });

    await expect(apiClient.get("/dashboard")).rejects.toBeTruthy();

    expect(axios.post).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().sessionEnded).toBe("invalid");
  });
});

describe("TOKEN_EXPIRED → silent refresh", () => {
  it("refreshes, rotates tokens and retries the original request with the new token", async () => {
    seedSession();
    let first = true;
    setAdapter(async (config) => {
      if (first) {
        first = false;
        throw httpError(401, { code: "TOKEN_EXPIRED" }, config);
      }
      return okAdapterResponse(config, { success: true, data: { ok: true } });
    });
    vi.spyOn(axios, "post").mockResolvedValue({
      data: {
        success: true,
        accessToken: "A2",
        refreshToken: "R2",
        sessionId: "S1",
      },
    });

    const res = await apiClient.get("/dashboard");

    expect(res.data).toEqual({ success: true, data: { ok: true } });
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/auth/refresh"),
      { refreshToken: "R1" },
      expect.anything()
    );
    expect(localStorage.getItem("accessToken")).toBe("A2");
    expect(localStorage.getItem("refreshToken")).toBe("R2");
    const retryAuth = adapterCalls()[1][0].headers?.Authorization;
    expect(retryAuth).toBe("Bearer A2");
    expect(useAuthStore.getState().sessionEnded).toBeNull();
  });

  it("concurrent requests share a single refresh operation", async () => {
    seedSession();
    let failures = 2; // both initial requests 401 once
    setAdapter(async (config) => {
      if (failures > 0) {
        failures -= 1;
        throw httpError(401, { code: "TOKEN_EXPIRED" }, config);
      }
      return okAdapterResponse(config, { success: true, data: {} });
    });
    vi.spyOn(axios, "post").mockResolvedValue({
      data: { success: true, accessToken: "A2", refreshToken: "R2" },
    });

    const [r1, r2] = await Promise.all([
      apiClient.get("/a"),
      apiClient.get("/b"),
    ]);

    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("does not retry more than once (no infinite loop)", async () => {
    seedSession();
    setAdapter((config) => {
      throw httpError(401, { code: "TOKEN_EXPIRED" }, config);
    });
    vi.spyOn(axios, "post").mockRejectedValue(
      httpError(401, { code: "REFRESH_TOKEN_INVALID" })
    );

    await expect(apiClient.get("/dashboard")).rejects.toBeTruthy();

    // one initial call, no retry after refresh failed
    expect(adapterCalls()).toHaveLength(1);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("never overwrites a newer token pair that another tab stored meanwhile", async () => {
    seedSession();
    let first = true;
    setAdapter(async (config) => {
      if (first) {
        first = false;
        throw httpError(401, { code: "TOKEN_EXPIRED" }, config);
      }
      return okAdapterResponse(config, { success: true, data: {} });
    });
    // Another tab rotates the pair while our refresh is in flight
    vi.spyOn(axios, "post").mockImplementation(async () => {
      localStorage.setItem("accessToken", "A2");
      localStorage.setItem("refreshToken", "R2");
      return {
        data: { success: true, accessToken: "STALE_A", refreshToken: "STALE_R" },
      } as never;
    });

    await apiClient.get("/dashboard");

    expect(localStorage.getItem("accessToken")).toBe("A2");
    expect(localStorage.getItem("refreshToken")).toBe("R2");
    expect(useAuthStore.getState().accessToken).toBe("A2");
  });

  it("adopts another tab's rotated pair when our refresh is rejected as REFRESH_TOKEN_INVALID", async () => {
    seedSession();
    let first = true;
    setAdapter(async (config) => {
      if (first) {
        first = false;
        throw httpError(401, { code: "TOKEN_EXPIRED" }, config);
      }
      return okAdapterResponse(config, { success: true, data: {} });
    });
    vi.spyOn(axios, "post").mockImplementation(async () => {
      // Tab B already consumed R1 and stored the rotated pair
      localStorage.setItem("accessToken", "A2");
      localStorage.setItem("refreshToken", "R2");
      throw httpError(401, { code: "REFRESH_TOKEN_INVALID" });
    });

    await apiClient.get("/dashboard");

    expect(adapterCalls()[1][0].headers?.Authorization).toBe("Bearer A2");
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().sessionEnded).toBeNull();
  });

  it("requires re-authentication when REFRESH_TOKEN_INVALID and no rotated pair exists", async () => {
    seedSession();
    setAdapter((config) => {
      throw httpError(401, { code: "TOKEN_EXPIRED" }, config);
    });
    vi.spyOn(axios, "post").mockRejectedValue(
      httpError(401, { code: "REFRESH_TOKEN_INVALID" })
    );

    await expect(apiClient.get("/dashboard")).rejects.toBeTruthy();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().sessionEnded).toBe("refresh_failed");
    expect(adapterCalls()).toHaveLength(1);
  });

  it("requires re-authentication when REFRESH_TOKEN_EXPIRED", async () => {
    seedSession();
    setAdapter((config) => {
      throw httpError(401, { code: "TOKEN_EXPIRED" }, config);
    });
    vi.spyOn(axios, "post").mockRejectedValue(
      httpError(401, { code: "REFRESH_TOKEN_EXPIRED" })
    );

    await expect(apiClient.get("/dashboard")).rejects.toBeTruthy();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().sessionEnded).toBe("expired");
  });

  it("SESSION_REVOKED from the refresh endpoint takes precedence over refresh recovery", async () => {
    seedSession();
    setAdapter((config) => {
      throw httpError(401, { code: "TOKEN_EXPIRED" }, config);
    });
    vi.spyOn(axios, "post").mockRejectedValue(
      httpError(401, { code: "SESSION_REVOKED" })
    );

    await expect(apiClient.get("/dashboard")).rejects.toBeTruthy();

    expect(useAuthStore.getState().sessionEnded).toBe("revoked");
  });

  it("a logout during an in-flight refresh is never resurrected", async () => {
    seedSession();
    let first = true;
    setAdapter(async (config) => {
      if (first) {
        first = false;
        throw httpError(401, { code: "TOKEN_EXPIRED" }, config);
      }
      return okAdapterResponse(config, { success: true, data: {} });
    });
    // User signs out locally while the refresh request is in flight
    vi.spyOn(axios, "post").mockImplementation(async () => {
      useAuthStore.getState().logout(); // also clears localStorage
      return {
        data: { success: true, accessToken: "A2", refreshToken: "R2" },
      } as never;
    });

    await expect(apiClient.get("/dashboard")).rejects.toBeTruthy();

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    // deliberate sign-out must NOT show the session-ended screen
    expect(useAuthStore.getState().sessionEnded).toBeNull();
  });
});

describe("403 authorization restrictions", () => {
  it("PREMIUM_REQUIRED does not log the user out", async () => {
    seedSession();
    setAdapter((config) => {
      throw httpError(403, { code: "PREMIUM_REQUIRED" }, config);
    });

    await expect(apiClient.get("/premium/tests")).rejects.toBeTruthy();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().sessionEnded).toBeNull();
  });

  it("ADMIN_REQUIRED does not log the user out", async () => {
    seedSession();
    setAdapter((config) => {
      throw httpError(403, { code: "ADMIN_REQUIRED" }, config);
    });

    await expect(apiClient.get("/admin")).rejects.toBeTruthy();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().sessionEnded).toBeNull();
  });
});

describe("network failure", () => {
  it("never revokes authentication", async () => {
    seedSession();
    setAdapter((config) => {
      throw networkError(config);
    });
    vi.spyOn(axios, "post").mockRejectedValue(networkError());

    await expect(apiClient.get("/dashboard")).rejects.toBeTruthy();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().sessionEnded).toBeNull();
  });
});
