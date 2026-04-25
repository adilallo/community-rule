"use client";

import type { ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";

/** Matches {@link CreateView} overlay options — shared with {@link DialogView}. */
export type CreateModalBackdropVariant = "default" | "blurredYellow";

const backdropOverlayClasses: Record<CreateModalBackdropVariant, string> = {
  default: "fixed inset-0 bg-black/50 z-[9998]",
  blurredYellow:
    "fixed inset-0 z-[9998] bg-[var(--color-surface-inverse-brand-primary)]/85 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-surface-inverse-brand-primary)]/75",
};

export type CreateModalFrameViewProps = {
  isOpen: boolean;
  onOverlayClick: () => void;
  backdropVariant: CreateModalBackdropVariant;
  className: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  overlayRef: RefObject<HTMLDivElement | null>;
  dialogRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};

/**
 * Portal + dimmed overlay + centered dialog shell used by Create and Dialog.
 */
export function CreateModalFrameView({
  isOpen,
  onOverlayClick,
  backdropVariant,
  className,
  ariaLabel,
  ariaLabelledBy,
  overlayRef,
  dialogRef,
  children,
}: CreateModalFrameViewProps) {
  if (!isOpen) return null;

  const content = (
    <>
      <div
        ref={overlayRef}
        className={backdropOverlayClasses[backdropVariant]}
        onClick={onOverlayClick}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-surface-default-primary)] rounded-[var(--radius-500,20px)] shadow-[0px_0px_48px_0px_rgba(0,0,0,0.1)] w-[560px] max-h-[90vh] flex min-h-0 flex-col overflow-hidden z-[9999] ${className}`}
      >
        {children}
      </div>
    </>
  );

  if (typeof window !== "undefined") {
    return createPortal(content, document.body);
  }

  return null;
}
