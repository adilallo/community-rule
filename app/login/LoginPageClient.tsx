"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "../contexts/MessagesContext";
import Login from "../components/modals/Login";
import LoginForm from "../components/modals/Login/LoginForm";

export default function LoginPageClient() {
  const router = useRouter();
  const t = useTranslation("pages.login");

  return (
    <div className="min-h-[100dvh] bg-[var(--color-surface-inverse-brand-primary)]">
      <Login
        isOpen
        usePortal={false}
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
