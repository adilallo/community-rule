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
  /** Rendered below the dialog card on the backdrop (e.g. “Back to home”). */
  belowCard?: ReactNode;
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
  belowCard,
}: CreateModalFrameViewProps) {
  if (!isOpen) return null;

  const content = (
    <div
      ref={overlayRef}
      className={`${backdropOverlayClasses[backdropVariant]} flex flex-col items-center justify-center gap-6 overflow-y-auto px-4 py-8`}
      onClick={onOverlayClick}
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
        {children}
      </div>
      {belowCard ? (
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          {belowCard}
        </div>
      ) : null}
    </div>
  );

  if (typeof window !== "undefined") {
    return createPortal(content, document.body);
  }

  return null;
}
