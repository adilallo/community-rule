"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../contexts/MessagesContext";
import Login from "../../components/modals/Login";
import LoginForm from "../../components/modals/Login/LoginForm";

const loginPageBgClass =
  "min-h-[100dvh] bg-[var(--color-surface-inverse-brand-primary)]";

function LoginLoadingFallback() {
  const t = useTranslation("pages.login");
  return (
    <div className={`${loginPageBgClass} flex items-center justify-center`}>
      <p className="font-inter text-[14px] text-[var(--color-content-default-primary)]">
        {t("loadingFallback")}
      </p>
    </div>
  );
}

/**
 * Full-page login shell for magic-link **error redirects** (`?error=*`) and direct `/login` visits.
 * Header **Log in** uses `AuthModalProvider` instead; this route stays for verify failures and bookmarks.
 */
function LoginWithSearchParams() {
  const router = useRouter();
  const t = useTranslation("pages.login");

  return (
    <div className={loginPageBgClass}>
      <Login
        isOpen
        usePortal={false}
        backdropVariant="solid"
        onClose={() => {
          router.push("/");
        }}
        ariaLabelledBy="login-modal-heading"
        belowCard={
          <Link
            href="/"
            className="font-inter font-normal text-[14px] leading-[20px] text-[var(--color-content-invert-tertiary,#2d2d2d)] text-center hover:opacity-90"
          >
            {t("backToHome")}
          </Link>
        }
      >
        <LoginForm />
      </Login>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginWithSearchParams />
    </Suspense>
  );
}
