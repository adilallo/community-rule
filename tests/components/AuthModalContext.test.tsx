import React, { Suspense } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { renderWithProviders } from "../utils/test-utils";
import { useAuthModal } from "../../app/contexts/AuthModalContext";

const { navMock } = vi.hoisted(() => ({
  navMock: {
    pathname: "/",
    searchParams: new URLSearchParams(),
    replace: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: navMock.replace,
    push: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => navMock.pathname,
  useSearchParams: () => navMock.searchParams,
}));

vi.mock("../../lib/create/api", () => ({
  requestMagicLink: vi.fn(),
}));

vi.mock("../../app/create/anonymousDraftStorage", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("../../app/create/anonymousDraftStorage")
    >();
  return {
    ...actual,
    setTransferPendingFlag: vi.fn(),
  };
});

import { requestMagicLink } from "../../lib/create/api";
import { setTransferPendingFlag } from "../../app/create/anonymousDraftStorage";

function LoginTrigger() {
  const { openLogin, closeLogin } = useAuthModal();
  return (
    <div>
      <button type="button" onClick={() => openLogin()}>
        Open login modal
      </button>
      <button
        type="button"
        onClick={() =>
          openLogin({
            variant: "saveProgress",
            nextPath: "/create/select?syncDraft=1",
          })
        }
      >
        Open save progress
      </button>
      <button type="button" onClick={() => closeLogin()}>
        Close from outside
      </button>
    </div>
  );
}

describe("AuthModalProvider (header overlay)", () => {
  beforeEach(() => {
    vi.mocked(requestMagicLink).mockReset();
    vi.mocked(setTransferPendingFlag).mockReset();
    navMock.replace.mockReset();
    navMock.pathname = "/";
    navMock.searchParams = new URLSearchParams();
  });

  it("opens blurred overlay with LoginForm when openLogin is called", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Suspense fallback={null}>
        <LoginTrigger />
      </Suspense>,
    );
    await user.click(screen.getByRole("button", { name: /open login modal/i }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    const backdrop = screen.getByRole("dialog").parentElement;
    expect(backdrop).toHaveClass("backdrop-blur-md");
    expect(
      screen.getByRole("heading", { name: /log in to communityrule/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to home/i }),
    ).toBeInTheDocument();
  });

  it("closes overlay when closeLogin is called", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Suspense fallback={null}>
        <LoginTrigger />
      </Suspense>,
    );
    await user.click(screen.getByRole("button", { name: /open login modal/i }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    await user.click(
      screen.getByRole("button", { name: /close from outside/i }),
    );
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("saveProgress openLogin wires magicLinkNextPath and transfer flag on success", async () => {
    const user = userEvent.setup();
    vi.mocked(requestMagicLink).mockResolvedValue({ ok: true });
    renderWithProviders(
      <Suspense fallback={null}>
        <LoginTrigger />
      </Suspense>,
    );
    await user.click(
      screen.getByRole("button", { name: /open save progress/i }),
    );
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "guest@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: /send me a magic link/i }),
    );
    await waitFor(() => {
      expect(requestMagicLink).toHaveBeenCalledWith(
        "guest@example.com",
        "/create/select?syncDraft=1",
      );
    });
    expect(setTransferPendingFlag).toHaveBeenCalled();
  });
});
