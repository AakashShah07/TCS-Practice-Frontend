import axios from "axios";

/** Reasons the session may end — used by the session-ended UI. */
export type SessionEndReason =
  | "revoked"
  | "invalid"
  | "expired"
  | "refresh_failed";

/** Backend auth error codes (exact contract — do not invent new ones). */
export type AuthErrorCode =
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  | "SESSION_REVOKED"
  | "REFRESH_TOKEN_INVALID"
  | "REFRESH_TOKEN_EXPIRED"
  | "PREMIUM_REQUIRED"
  | "ADMIN_REQUIRED";

/** Shape of the backend's standard error body. */
export interface ApiErrorBody {
  success?: boolean;
  code?: string;
  message?: string;
}

type MaybeAxiosError = {
  response?: { status?: number; data?: ApiErrorBody };
  code?: string;
  message?: string;
};

/** Extract the backend `code` from an unknown thrown error, if present. */
export function getErrorCode(error: unknown): AuthErrorCode | null {
  const code = (error as MaybeAxiosError | null)?.response?.data?.code;
  if (typeof code !== "string") return null;
  const known: AuthErrorCode[] = [
    "TOKEN_INVALID",
    "TOKEN_EXPIRED",
    "SESSION_REVOKED",
    "REFRESH_TOKEN_INVALID",
    "REFRESH_TOKEN_EXPIRED",
    "PREMIUM_REQUIRED",
    "ADMIN_REQUIRED",
  ];
  return (known as string[]).includes(code) ? (code as AuthErrorCode) : null;
}

export function getErrorStatus(error: unknown): number | null {
  const status = (error as MaybeAxiosError | null)?.response?.status;
  return typeof status === "number" ? status : null;
}

/** True when the request never got a response (offline, DNS, CORS, timeout…). */
export function isNetworkError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  return !error.response;
}

/** Attach a normalized `code` property so callers can switch on it uniformly. */
export function withErrorCode(error: unknown): unknown {
  if (error && typeof error === "object" && !("code" in error)) {
    const code = getErrorCode(error);
    if (code) (error as Record<string, unknown>).code = code;
  }
  return error;
}
