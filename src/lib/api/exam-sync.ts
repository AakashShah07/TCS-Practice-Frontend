import { getErrorCode } from "@/lib/api/errors";

/**
 * True when this error means the backend ended our session (SESSION_REVOKED).
 * The exam uses this to stop all further authenticated sync calls — the
 * session-ended screen explains the situation, and local attempt state is
 * preserved (never auto-submitted, never wiped).
 */
export function isSessionRevokedError(error: unknown): boolean {
  return getErrorCode(error) === "SESSION_REVOKED";
}
