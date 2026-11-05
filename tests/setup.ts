import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// RTL cleanup (vitest globals are disabled, so register it explicitly)
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Shared pre-test hygiene: clean storage and reset zustand stores.
beforeEach(() => {
  localStorage.clear();
});

/** Default matchMedia mock (no reduced-motion preference). */
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

/** Reset the auth store to its pre-login state. */
export async function resetAuthStore() {
  const { useAuthStore } = await import("@/stores/auth-store");
  useAuthStore.setState({
    user: null,
    accessToken: null,
    sessionId: null,
    isAuthenticated: false,
    isLoading: false,
    sessionEnded: null,
  });
}

export async function resetProgressStore() {
  const { useProgressStore } = await import("@/stores/progress-store");
  useProgressStore.getState().resetProgress();
}

export async function resetAllStores() {
  await resetAuthStore();
  await resetProgressStore();
}

/** A minimal in-memory BroadcastChannel hub for cross-tab tests. */
export class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = [];
  name: string;
  private listeners = new Set<(event: MessageEvent) => void>();

  constructor(name: string) {
    this.name = name;
    MockBroadcastChannel.instances.push(this);
  }

  postMessage(data: unknown) {
    for (const instance of MockBroadcastChannel.instances) {
      if (instance === this || instance.name !== this.name) continue;
      instance.dispatch(data);
    }
  }

  private dispatch(data: unknown) {
    const event = { data } as MessageEvent;
    for (const listener of this.listeners) listener(event);
  }

  addEventListener(_type: string, listener: (event: MessageEvent) => void) {
    this.listeners.add(listener);
  }

  removeEventListener(_type: string, listener: (event: MessageEvent) => void) {
    this.listeners.delete(listener);
  }

  close() {
    this.listeners.clear();
    MockBroadcastChannel.instances = MockBroadcastChannel.instances.filter(
      (i) => i !== this
    );
  }

  static reset() {
    MockBroadcastChannel.instances = [];
  }
}
