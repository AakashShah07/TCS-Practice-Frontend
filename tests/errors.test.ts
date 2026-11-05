import { describe, expect, it } from "vitest";
import { AxiosError } from "axios";
import {
  getErrorCode,
  getErrorStatus,
  isNetworkError,
} from "@/lib/api/errors";
import { isSessionRevokedError } from "@/lib/api/exam-sync";

function axiosHttpError(
  status: number,
  data: unknown
): AxiosError<{ code?: string }> {
  const config = { headers: {} } as never;
  const response = {
    status,
    statusText: String(status),
    data: data as { code?: string },
    headers: {},
    config,
  };
  return new AxiosError(
    `Request failed with status code ${status}`,
    "ERR_BAD_REQUEST",
    config,
    undefined,
    response as never
  );
}

describe("getErrorCode", () => {
  it("extracts known backend codes", () => {
    expect(getErrorCode(axiosHttpError(401, { code: "SESSION_REVOKED" }))).toBe("SESSION_REVOKED");
    expect(getErrorCode(axiosHttpError(401, { code: "TOKEN_INVALID" }))).toBe("TOKEN_INVALID");
    expect(getErrorCode(axiosHttpError(401, { code: "TOKEN_EXPIRED" }))).toBe("TOKEN_EXPIRED");
    expect(getErrorCode(axiosHttpError(401, { code: "REFRESH_TOKEN_INVALID" }))).toBe("REFRESH_TOKEN_INVALID");
    expect(getErrorCode(axiosHttpError(401, { code: "REFRESH_TOKEN_EXPIRED" }))).toBe("REFRESH_TOKEN_EXPIRED");
    expect(getErrorCode(axiosHttpError(403, { code: "PREMIUM_REQUIRED" }))).toBe("PREMIUM_REQUIRED");
    expect(getErrorCode(axiosHttpError(403, { code: "ADMIN_REQUIRED" }))).toBe("ADMIN_REQUIRED");
  });

  it("returns null for unknown codes and malformed bodies", () => {
    expect(getErrorCode(axiosHttpError(401, { code: "SOMETHING_ELSE" }))).toBeNull();
    expect(getErrorCode(axiosHttpError(401, {}))).toBeNull();
    expect(getErrorCode(new Error("boom"))).toBeNull();
    expect(getErrorCode(undefined)).toBeNull();
  });
});

describe("getErrorStatus / isNetworkError", () => {
  it("reads the HTTP status", () => {
    expect(getErrorStatus(axiosHttpError(403, { code: "PREMIUM_REQUIRED" }))).toBe(403);
    expect(getErrorStatus(new Error("boom"))).toBeNull();
  });

  it("detects network failures (no response received)", () => {
    const network = new AxiosError("Network Error", "ERR_NETWORK");
    expect(isNetworkError(network)).toBe(true);
    expect(isNetworkError(axiosHttpError(500, {}))).toBe(false);
    expect(isNetworkError(new Error("nope"))).toBe(false);
  });
});

describe("isSessionRevokedError", () => {
  it("is true only for SESSION_REVOKED", () => {
    expect(isSessionRevokedError(axiosHttpError(401, { code: "SESSION_REVOKED" }))).toBe(true);
    expect(isSessionRevokedError(axiosHttpError(401, { code: "TOKEN_EXPIRED" }))).toBe(false);
    expect(isSessionRevokedError(axiosHttpError(401, { code: "REFRESH_TOKEN_INVALID" }))).toBe(false);
    expect(isSessionRevokedError(new Error("network"))).toBe(false);
  });
});
