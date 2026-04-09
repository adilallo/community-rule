"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import Login from "../components/modals/Login";
import LoginForm from "../components/modals/Login/LoginForm";
import { useTranslation } from "./MessagesContext";

export type AuthModalLoginVariant = "default" | "saveProgress";

export type AuthModalBackdropVariant = "solid" | "blurredYellow";

export type OpenLoginOptions = {
  variant?: AuthModalLoginVariant;
  /** Passed to `requestMagicLink` as `next` (internal path). */
  nextPath?: string;
  backdropVariant?: AuthModalBackdropVariant;
};

type AuthModalContextValue = {
  openLogin: (_opts?: OpenLoginOptions) => void;
  closeLogin: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<OpenLoginOptions>({});
  const t = useTranslation("pages.login");

  const openLogin = useCallback((o?: OpenLoginOptions) => {
    setOpts(o ?? {});
    setOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setOpen(false);
    setOpts({});
  }, []);

  const value = useMemo(
    () => ({ openLogin, closeLogin }),
    [openLogin, closeLogin],
  );

  const backdropVariant = opts.backdropVariant ?? "blurredYellow";

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <Login
        isOpen={open}
        onClose={closeLogin}
        backdropVariant={backdropVariant}
        usePortal
        ariaLabelledBy="login-modal-heading"
        belowCard={
          <Link
            href="/"
            className="font-inter font-normal text-[14px] leading-[20px] text-[var(--color-content-invert-tertiary,#2d2d2d)] text-center hover:opacity-90"
            onClick={() => closeLogin()}
          >
            {t("backToHome")}
          </Link>
        }
      >
        <LoginForm
          variant={opts.variant ?? "default"}
          magicLinkNextPath={opts.nextPath}
        />
      </Login>
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}
