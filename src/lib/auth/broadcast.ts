/**
 * Cross-tab coordination over BroadcastChannel.
 *
 * Security rules:
 * - We NEVER broadcast access tokens, refresh tokens or session ids.
 * - Only coarse event types and the (non-secret) end reason are sent.
 * - No analytics or logging of token material.
 *
 * The channel is optional: if BroadcastChannel is unavailable (older
 * browsers, SSR, jsdom) every function degrades to a no-op and stays safe.
 */

export const SESSION_CHANNEL_NAME = "cracknqt-session";

export type SessionChannelMessage =
  | { type: "session-ended"; reason: string }
  | { type: "logout" }
  | { type: "tokens-rotated" };

type Listener = (message: SessionChannelMessage) => void;

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (typeof BroadcastChannel === "undefined") return null;
  try {
    return new BroadcastChannel(SESSION_CHANNEL_NAME);
  } catch {
    return null;
  }
}

/** Broadcast a message to other tabs. No-op when unavailable. */
export function broadcastSessionMessage(message: SessionChannelMessage): void {
  const channel = getChannel();
  if (!channel) return;
  try {
    channel.postMessage(message);
  } catch {
    // never throw from a best-effort coordination path
  } finally {
    channel.close();
  }
}

/**
 * Subscribe to messages from other tabs. Returns an unsubscribe function.
 * Messages from *this* tab are not delivered (BroadcastChannel semantics).
 */
export function subscribeToSessionChannel(listener: Listener): () => void {
  const channel = getChannel();
  if (!channel) return () => {};
  const handler = (event: MessageEvent) => {
    const data = event.data as SessionChannelMessage | undefined;
    if (!data || typeof data !== "object" || typeof data.type !== "string") return;
    listener(data);
  };
  channel.addEventListener("message", handler);
  return () => {
    channel.removeEventListener("message", handler);
    channel.close();
  };
}
