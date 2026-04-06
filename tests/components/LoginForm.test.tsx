import React, { Suspense } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { renderWithProviders } from "../utils/test-utils";
import LoginForm from "../../app/components/modals/Login/LoginForm";

const { navMock } = vi.hoisted(() => ({
  navMock: {
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
  usePathname: () => "/login",
  useSearchParams: () => navMock.searchParams,
}));

vi.mock("../../lib/create/api", () => ({
  requestMagicLink: vi.fn(),
}));

import { requestMagicLink } from "../../lib/create/api";

function renderLoginForm() {
  return renderWithProviders(
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>,
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.mocked(requestMagicLink).mockReset();
    navMock.replace.mockReset();
    navMock.searchParams = new URLSearchParams();
  });

  it("renders title, email field, and submit control", () => {
    renderLoginForm();
    expect(
      screen.getByRole("heading", { name: /log in to communityrule/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /email address/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send me a magic link/i }),
    ).toBeInTheDocument();
  });

  it("shows validation error when email is invalid", async () => {
    const user = userEvent.setup();
    renderLoginForm();
    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "not-an-email",
    );
    await user.click(
      screen.getByRole("button", { name: /send me a magic link/i }),
    );
    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
    expect(requestMagicLink).not.toHaveBeenCalled();
  });

  it("submits trimmed email and shows success state when API succeeds", async () => {
    const user = userEvent.setup();
    vi.mocked(requestMagicLink).mockResolvedValue({ ok: true });
    renderLoginForm();
    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "  Pat@Example.COM  ",
    );
    await user.click(
      screen.getByRole("button", { name: /send me a magic link/i }),
    );
    await waitFor(() => {
      expect(requestMagicLink).toHaveBeenCalledWith("pat@example.com", "/");
    });
    expect(
      await screen.findByRole("heading", { name: /check your email/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/we sent a sign-in link/i)).toBeInTheDocument();
  });

  it("passes safe next path when next query param is set", async () => {
    const user = userEvent.setup();
    navMock.searchParams = new URLSearchParams("next=/learn");
    vi.mocked(requestMagicLink).mockResolvedValue({ ok: true });
    renderLoginForm();
    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "a@b.co",
    );
    await user.click(
      screen.getByRole("button", { name: /send me a magic link/i }),
    );
    await waitFor(() => {
      expect(requestMagicLink).toHaveBeenCalledWith("a@b.co", "/learn");
    });
  });

  it("shows API error when request fails", async () => {
    const user = userEvent.setup();
    vi.mocked(requestMagicLink).mockResolvedValue({
      ok: false,
      error: "Server says no",
    });
    renderLoginForm();
    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "ok@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: /send me a magic link/i }),
    );
    expect(await screen.findByText("Server says no")).toBeInTheDocument();
  });

  it("shows rate limit message when retryAfterMs is present", async () => {
    const user = userEvent.setup();
    vi.mocked(requestMagicLink).mockResolvedValue({
      ok: false,
      error: "Too many",
      retryAfterMs: 3500,
    });
    renderLoginForm();
    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "ok@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: /send me a magic link/i }),
    );
    expect(
      await screen.findByText(/try again in 4 seconds/i),
    ).toBeInTheDocument();
  });

  it("shows URL-driven error for expired_link", () => {
    navMock.searchParams = new URLSearchParams("error=expired_link");
    renderLoginForm();
    expect(
      screen.getByText(/that sign-in link has expired/i),
    ).toBeInTheDocument();
  });

  it("calls router.replace to clear error query when user types", async () => {
    const user = userEvent.setup();
    navMock.searchParams = new URLSearchParams("error=expired_link");
    renderLoginForm();
    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "x",
    );
    expect(navMock.replace).toHaveBeenCalledWith("/login", { scroll: false });
  });

  it("shows network error when request throws", async () => {
    const user = userEvent.setup();
    vi.mocked(requestMagicLink).mockRejectedValue(new Error("network"));
    renderLoginForm();
    await user.type(
      screen.getByRole("textbox", { name: /email address/i }),
      "ok@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: /send me a magic link/i }),
    );
    expect(
      await screen.findByText(/check your connection/i),
    ).toBeInTheDocument();
  });
});
