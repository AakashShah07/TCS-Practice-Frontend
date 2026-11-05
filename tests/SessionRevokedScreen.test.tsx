import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SessionRevokedScreen from "@/components/auth/SessionRevokedScreen";
import type { SessionEndReason } from "@/lib/api/errors";

const REASONS: SessionEndReason[] = ["revoked", "invalid", "expired", "refresh_failed"];

function renderScreen(reason: SessionEndReason = "revoked") {
  const onSignInAgain = vi.fn();
  const onBackToHome = vi.fn();
  render(
    <SessionRevokedScreen
      reason={reason}
      onSignInAgain={onSignInAgain}
      onBackToHome={onBackToHome}
    />
  );
  return { onSignInAgain, onBackToHome };
}

beforeEach(() => {
  // default: no reduced-motion preference
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      } as MediaQueryList)
  );
});

describe("SessionRevokedScreen", () => {
  it("renders the heading, a friendly message and both actions", () => {
    renderScreen("revoked");
    expect(
      screen.getByRole("heading", { name: /your session has ended/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/signed in on another device/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in again/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back to home/i })).toBeInTheDocument();
  });

  it("never uses banned/suspended/hacked wording for any reason", () => {
    for (const reason of REASONS) {
      const { unmount } = render(
        <SessionRevokedScreen
          reason={reason}
          onSignInAgain={() => {}}
          onBackToHome={() => {}}
        />
      );
      expect(screen.queryByText(/banned/i)).toBeNull();
      expect(screen.queryByText(/suspended/i)).toBeNull();
      expect(screen.queryByText(/hacked/i)).toBeNull();
      expect(screen.queryByText(/blocked/i)).toBeNull();
      unmount();
    }
  });

  it("exposes an accessible alertdialog with the heading/message wired up", () => {
    renderScreen("revoked");
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog.getAttribute("aria-labelledby")).toBe("session-ended-heading");
    expect(dialog.getAttribute("aria-describedby")).toBe("session-ended-description");
    expect(document.getElementById("session-ended-heading")).toHaveTextContent(
      "Your session has ended"
    );
    expect(document.getElementById("session-ended-description")).toHaveTextContent(
      /another device/i
    );
  });

  it("moves focus to the primary action on mount", () => {
    renderScreen("revoked");
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /sign in again/i })
    );
  });

  it("fires the sign-in and home callbacks", async () => {
    const { onSignInAgain, onBackToHome } = renderScreen("revoked");
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /sign in again/i }));
    await user.click(screen.getByRole("button", { name: /back to home/i }));
    expect(onSignInAgain).toHaveBeenCalledTimes(1);
    expect(onBackToHome).toHaveBeenCalledTimes(1);
  });

  it("is fully keyboard navigable", async () => {
    const { onSignInAgain, onBackToHome } = renderScreen("expired");
    const user = userEvent.setup();
    // focus starts on the primary action; Tab moves to the secondary one
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /sign in again/i })
    );
    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /back to home/i })
    );
    await user.keyboard("{Enter}");
    expect(onBackToHome).toHaveBeenCalledTimes(1);
    expect(onSignInAgain).not.toHaveBeenCalled();
  });

  it("works with prefers-reduced-motion enabled", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: query.includes("prefers-reduced-motion"),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        } as MediaQueryList)
    );
    renderScreen("refresh_failed");
    expect(
      screen.getByRole("heading", { name: /your session has ended/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in again/i })).toBeInTheDocument();
  });

  it("renders in light and dark themes without crashing", () => {
    const { unmount } = render(
      <div className="dark">
        <SessionRevokedScreen
          reason="revoked"
          onSignInAgain={() => {}}
          onBackToHome={() => {}}
        />
      </div>
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    unmount();
    render(
      <div className="light">
        <SessionRevokedScreen
          reason="revoked"
          onSignInAgain={() => {}}
          onBackToHome={() => {}}
        />
      </div>
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("is responsive: full-width card with bounded max width and scrollable viewport", () => {
    renderScreen("revoked");
    const card = screen.getByRole("alertdialog");
    expect(card.className).toContain("w-full");
    expect(card.className).toMatch(/max-w-(md|lg)/);
    // outer container scrolls instead of clipping on short screens
    const root = screen.getByTestId("session-revoked-screen");
    expect(root.className).toContain("overflow-y-auto");
  });

  it("shows a generic message for expired sessions (no device claim)", () => {
    renderScreen("expired");
    expect(
      screen.getByText(/session expired and could not be renewed/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/another device/i)).toBeNull();
  });
});
