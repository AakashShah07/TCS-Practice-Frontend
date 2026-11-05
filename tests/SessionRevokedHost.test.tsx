import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/dashboard",
}));

import SessionRevokedHost from "@/components/auth/SessionRevokedHost";
import { useAuthStore } from "@/stores/auth-store";
import { resetAllStores } from "./setup";

beforeEach(async () => {
  pushMock.mockClear();
  await resetAllStores();
});

describe("SessionRevokedHost", () => {
  it("renders nothing while the session is healthy", () => {
    const { container } = render(<SessionRevokedHost />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the screen once the session is revoked", () => {
    useAuthStore.getState().setSessionEnded("revoked");
    render(<SessionRevokedHost />);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("'Sign in again' dismisses the screen and routes to /login with a safe return URL", async () => {
    useAuthStore.getState().setSessionEnded("revoked");
    render(<SessionRevokedHost />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /sign in again/i }));

    expect(pushMock).toHaveBeenCalledWith("/login?from=%2Fdashboard");
    expect(useAuthStore.getState().sessionEnded).toBeNull();
  });

  it("'Back to home' dismisses the screen and routes to the landing page", async () => {
    useAuthStore.getState().setSessionEnded("revoked");
    render(<SessionRevokedHost />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /back to home/i }));

    expect(pushMock).toHaveBeenCalledWith("/");
    expect(useAuthStore.getState().sessionEnded).toBeNull();
  });
});
