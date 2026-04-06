"use client";

import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { LoginView } from "./Login.view";
import type { LoginProps } from "./Login.types";

const LoginContainer = memo<LoginProps>(
  ({
    isOpen,
    onClose,
    children,
    belowCard,
    className = "",
    ariaLabel,
    ariaLabelledBy,
    usePortal = true,
  }) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);
    const [portalReady, setPortalReady] = useState(() => !usePortal);

    // Defer enabling the portal until after the layout commit so we don’t sync-setState
    // inside the effect (eslint react-hooks/set-state-in-effect) while still mounting
    // before the next paint, avoiding a flash of underlying layout.
    useLayoutEffect(() => {
      if (!usePortal) return;
      const id = requestAnimationFrame(() => {
        setPortalReady(true);
      });
      return () => cancelAnimationFrame(id);
    }, [usePortal]);

    useEffect(() => {
      if (!isOpen) return;
      if (usePortal && !portalReady) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen, portalReady, onClose, usePortal]);

    useEffect(() => {
      if (!isOpen) return;
      if (usePortal && !portalReady) return;

      previousActiveElementRef.current = document.activeElement as HTMLElement;

      document.body.style.overflow = "hidden";

      if (dialogRef.current) {
        const dialog = dialogRef.current;
        const focusableSelector =
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        const focusInitial = () => {
          const emailField = dialog.querySelector<HTMLInputElement>(
            'input[type="email"]:not([disabled])',
          );
          if (emailField) {
            emailField.focus();
            return;
          }
          const focusableElements = dialog.querySelectorAll(focusableSelector);
          const firstElement = focusableElements[0] as HTMLElement;
          if (firstElement) {
            firstElement.focus();
          } else {
            dialog.setAttribute("tabindex", "-1");
            dialog.focus();
          }
        };

        requestAnimationFrame(() => {
          requestAnimationFrame(focusInitial);
        });
      }

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== "Tab" || !dialogRef.current) return;

        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) as NodeListOf<HTMLElement>;
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      };

      document.addEventListener("keydown", handleTab);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleTab);
        previousActiveElementRef.current?.focus();
      };
    }, [isOpen, portalReady, usePortal]);

    return (
      <LoginView
        isOpen={isOpen}
        onClose={onClose}
        belowCard={belowCard}
        className={className}
        ariaLabel={ariaLabel}
        ariaLabelledBy={ariaLabelledBy}
        dialogRef={dialogRef}
        backdropRef={backdropRef}
        portalReady={portalReady}
        usePortal={usePortal}
      >
        {children}
      </LoginView>
    );
  },
);

LoginContainer.displayName = "Login";

export default LoginContainer;
