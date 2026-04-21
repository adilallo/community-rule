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

/** Fake marketing page behind the overlay (header “Log in” opens `AuthModalProvider` with this look). */
function FakeMarketingPageBehindOverlay({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-amber-50"
        aria-hidden
      />
      <div className="relative z-0 px-8 py-16">
        <p className="font-inter max-w-md text-lg text-neutral-800">
          Placeholder page content — the login overlay portals above this and
          uses backdrop blur (`blurredYellow`).
        </p>
      </div>
      {children}
    </div>
  );
}

export default {
  title: "Components/Modals/Login",
  component: Login,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
    docs: {
      description: {
        component:
          '**Primary UX:** `AuthModalProvider` opens this as a **popup overlay** on top of the current page — `backdropVariant="blurredYellow"`, `usePortal` (default). **`/login`** is a thin full-page shell: yellow **solid** backdrop, `usePortal={false}`, same `LoginForm` inside.',
      },
    },
  },
  decorators: [
    (Story: () => React.ReactNode) => (
      <MagicLinkFetchMock>
        <Story />
      </MagicLinkFetchMock>
    ),
  ],
  tags: ["autodocs"],
};

/** Matches `AuthModalProvider`: blurred backdrop + portal over whatever route the user was on. */
export const HeaderOverlayBlurred = {
  name: "Header overlay (blurred — default)",
  parameters: {
    docs: {
      description: {
        story:
          'Same as **Log in** from the site header: `backdropVariant="blurredYellow"`, `usePortal`, card + “Back to home” below.',
      },
    },
  },
  render: () => (
    <FakeMarketingPageBehindOverlay>
      <Login
        isOpen
        onClose={() => {}}
        backdropVariant="blurredYellow"
        usePortal
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
    </FakeMarketingPageBehindOverlay>
  ),
};

/** Matches `app/(app)/login/page.tsx`: dedicated route, solid yellow, no portal. */
export const FullPageRouteSolid = {
  name: "Full-page route (/login — solid)",
  parameters: {
    nextjs: {
      navigation: { pathname: "/login" },
    },
    docs: {
      description: {
        story:
          "Verify-email **error** links and bookmarks use `/login` with a **solid** backdrop and `usePortal={false}`.",
      },
    },
  },
  decorators: [
    (Story: () => React.ReactNode) => (
      <div className="min-h-[100dvh] bg-[var(--color-surface-inverse-brand-primary)]">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Login
      isOpen
      onClose={() => {}}
      backdropVariant="solid"
      usePortal={false}
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

export const ModalChromeOnly = {
  name: "Modal chrome only (placeholder)",
  render: () => (
    <div className="min-h-[100dvh] bg-[var(--color-surface-inverse-brand-primary)]">
      <Login
        isOpen
        onClose={() => {}}
        backdropVariant="solid"
        usePortal={false}
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
          Placeholder body — use &quot;Header overlay&quot; or &quot;Full-page
          route&quot; for the real flow.
        </p>
      </Login>
    </div>
  ),
};

export const FormOnly = {
  name: "Login form (card inset)",
  parameters: {
    docs: {
      description: {
        story:
          "Form only, for inspecting copy and layout without overlay chrome. In the app it is always wrapped by `Login` (modal) or the `/login` page shell.",
      },
    },
  },
  decorators: [
    (Story: () => React.ReactNode) => (
      <div className="min-h-[200px] bg-[var(--color-surface-inverse-brand-primary)] p-8">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="mx-auto max-w-[560px] rounded-[20px] bg-[var(--color-surface-default-primary)] p-6 shadow-lg">
      <Suspense fallback={<p className="font-inter">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  ),
};
