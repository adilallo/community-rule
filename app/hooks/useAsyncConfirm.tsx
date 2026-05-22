"use client";

import { useCallback, useRef, useState } from "react";
import Button from "../components/buttons/Button";
import Create from "../components/modals/Create";
import type { CreateModalBackdropVariant } from "../components/modals/Create/CreateModalFrame.view";

export type AsyncConfirmOptions = {
  title: string;
  description: string;
  proceedText: string;
  cancelText: string;
  ariaLabel?: string;
  backdropVariant?: CreateModalBackdropVariant;
};

/**
 * Promise-based confirm dialog backed by the Create modal shell.
 *
 * @returns `requestConfirm` resolves true when the user proceeds, false on cancel.
 * Render `confirmDialog` once near the root of the consuming component tree.
 *
 * @example
 * const { requestConfirm, confirmDialog } = useAsyncConfirm();
 * if (!(await requestConfirm({ title: "Leave?", description: "...", proceedText: "Leave", cancelText: "Stay" }))) return;
 * return <>{confirmDialog}</>;
 */
export function useAsyncConfirm() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AsyncConfirmOptions | null>(null);
  const resolverRef = useRef<((proceed: boolean) => void) | null>(null);

  const requestConfirm = useCallback((opts: AsyncConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setOptions(opts);
      setOpen(true);
    });
  }, []);

  const close = useCallback((proceed: boolean) => {
    setOpen(false);
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setOptions(null);
    resolve?.(proceed);
  }, []);

  const confirmDialog =
    open && options ? (
      <Create
        isOpen={open}
        onClose={() => close(false)}
        title={options.title}
        description={options.description}
        showBackButton={false}
        showNextButton
        nextButtonText={options.proceedText}
        onNext={() => close(true)}
        footerContent={
          <Button
            buttonType="ghost"
            palette="default"
            size="xsmall"
            onClick={() => close(false)}
          >
            {options.cancelText}
          </Button>
        }
        backdropVariant={options.backdropVariant ?? "blurredYellow"}
        ariaLabel={options.ariaLabel ?? options.title}
      />
    ) : null;

  return { requestConfirm, confirmDialog };
}
