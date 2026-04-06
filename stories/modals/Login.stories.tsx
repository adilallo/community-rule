import React, { Suspense, useEffect } from "react";
import Login from "../../app/components/modals/Login";
import LoginForm from "../../app/components/modals/Login/LoginForm";

/**
 * Storybook runs outside Next.js request context; successful "Send link" needs fetch mocked
 * because `requestMagicLink` POSTs to `/api/auth/magic-link/request`.
 */
function MagicLinkFetchMock({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const orig = globalThis.fetch;
    globalThis.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      if (url.includes("/api/auth/magic-link/request")) {
        return new Response("{}", {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return orig(input as Request, init);
    };
    return () => {
      globalThis.fetch = orig;
    };
  }, []);
  return <>{children}</>;
}

export default {
  title: "Components/Modals/Login",
  component: Login,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/login",
      },
    },
    docs: {
      description: {
        component:
          "Full-page style login shell (yellow backdrop) with modal card. Uses magic-link `LoginForm` inside. Matches `/login` and header modal usage.",
      },
    },
  },
  decorators: [
    (Story: () => React.ReactNode) => (
      <div className="min-h-[100dvh] bg-[var(--color-surface-inverse-brand-primary)]">
        <MagicLinkFetchMock>
          <Story />
        </MagicLinkFetchMock>
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export const ModalChromeOnly = {
  name: "Modal (placeholder content)",
  render: () => (
    <Login
      isOpen
      onClose={() => {}}
      ariaLabelledBy="login-modal-heading"
      belowCard={
        <a
          href="/"
          className="font-inter font-normal text-[14px] leading-[20px] text-[var(--color-content-invert-tertiary,#2d2d2d)] text-center hover:opacity-90"
        >
          ← Back to home
        </a>
      }
    >
      <p
        id="login-modal-heading"
        className="font-inter px-2 py-4 text-[var(--color-content-default-primary)]"
      >
        Placeholder body — use &quot;With magic link form&quot; for the real
        flow.
      </p>
    </Login>
  ),
};

export const WithMagicLinkForm = {
  name: "With magic link form",
  render: () => (
    <Login
      isOpen
      onClose={() => {}}
      ariaLabelledBy="login-modal-heading"
      belowCard={
        <a
          href="/"
          className="font-inter font-normal text-[14px] leading-[20px] text-[var(--color-content-invert-tertiary,#2d2d2d)] text-center hover:opacity-90"
        >
          ← Back to home
        </a>
      }
    >
      <Suspense fallback={<p className="font-inter p-6">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </Login>
  ),
};

export const FormOnly = {
  name: "Login form (card inset)",
  parameters: {
    docs: {
      description: {
        story:
          "Form only, for inspecting copy and layout without the modal chrome. Wrap in `Login` in the app.",
      },
    },
  },
  render: () => (
    <div className="mx-auto max-w-[560px] rounded-[20px] bg-[var(--color-surface-default-primary)] p-6 shadow-lg">
      <Suspense fallback={<p className="font-inter">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  ),
};
