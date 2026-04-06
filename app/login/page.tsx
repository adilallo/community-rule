import type { Metadata } from "next";
import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Log in · CommunityRule",
  robots: { index: false, follow: false },
};

function LoginFallback() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-inverse-brand-primary)] flex items-center justify-center">
      <p className="font-inter text-[14px] text-[var(--color-content-default-primary)]">
        Loading…
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}
