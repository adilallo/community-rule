"use client";

import { createPortal } from "react-dom";
import ModalHeader from "../../utility/ModalHeader";
import type { LoginViewProps } from "./Login.types";

export function LoginView({
  isOpen,
  onClose,
  children,
  belowCard,
  className,
  ariaLabel,
  ariaLabelledBy,
  dialogRef,
  backdropRef,
  portalReady,
  usePortal,
}: LoginViewProps) {
  if (!isOpen) return null;
  if (usePortal && !portalReady) return null;

  const content = (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-6 overflow-y-auto bg-[var(--color-surface-inverse-brand-primary)] px-4 py-8"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={`flex min-h-0 max-h-[90vh] w-full max-w-[560px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-500,20px)] bg-[var(--color-surface-default-primary)] shadow-[0px_0px_48px_0px_rgba(0,0,0,0.1)] z-[9999] ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader onClose={onClose} onMoreOptions={onClose} />
        <div className="scrollbar-design flex min-h-0 flex-1 flex-col overflow-x-clip overflow-y-auto px-6 pb-8 pt-0">
          {children}
        </div>
      </div>
      {belowCard ? (
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          {belowCard}
        </div>
      ) : null}
    </div>
  );

  if (usePortal) {
    return createPortal(content, document.body);
  }

  return content;
}
