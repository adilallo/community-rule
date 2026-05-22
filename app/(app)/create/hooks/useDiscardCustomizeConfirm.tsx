"use client";

import { useCallback } from "react";
import messages from "../../../../messages/en/index";
import { useAsyncConfirm } from "../../../hooks/useAsyncConfirm";
import type { CustomMethodCardFieldBlock } from "../../../../lib/create/customMethodCardFieldBlocks";
import {
  confirmDiscardMethodCardCustomizeSession,
  isMethodCardCustomizeSessionDirty,
  type MethodCardCustomizeSnapshot,
  type MethodCardHeaderDraft,
} from "../../../../lib/create/methodCardCustomizeSession";

const copy = messages.create.customRule.modalKebabMenu;

const confirmOptions = {
  title: copy.discardUnsavedCustomizeChangesTitle,
  description: copy.discardUnsavedCustomizeChangesDescription,
  proceedText: copy.discardUnsavedCustomizeChangesProceed,
  cancelText: copy.discardUnsavedCustomizeChangesCancel,
};

/**
 * Create-flow confirm for exiting customize mode with unsaved edits.
 *
 * @returns Async helpers plus `confirmDialog` to render once in the screen JSX.
 */
export function useDiscardCustomizeConfirm() {
  const { requestConfirm, confirmDialog } = useAsyncConfirm();

  const runConfirm = useCallback(
    () => requestConfirm(confirmOptions),
    [requestConfirm],
  );

  const confirmDiscard = useCallback(
    async <TDraft,>(
      modalEditUnlocked: boolean,
      snapshot: MethodCardCustomizeSnapshot<TDraft> | null,
      pendingDraft: TDraft | null,
      draftFieldBlocks: CustomMethodCardFieldBlock[] | null,
      headerDraft: MethodCardHeaderDraft | null,
    ) =>
      confirmDiscardMethodCardCustomizeSession(
        modalEditUnlocked,
        snapshot,
        pendingDraft,
        draftFieldBlocks,
        headerDraft,
        runConfirm,
      ),
    [runConfirm],
  );

  const confirmDirtyCustomizeCancel = useCallback(
    async <TDraft,>(
      snapshot: MethodCardCustomizeSnapshot<TDraft>,
      pendingDraft: TDraft | null,
      draftFieldBlocks: CustomMethodCardFieldBlock[] | null,
      headerDraft: MethodCardHeaderDraft | null,
    ) => {
      if (
        !isMethodCardCustomizeSessionDirty(
          snapshot,
          pendingDraft,
          draftFieldBlocks,
          headerDraft,
        )
      ) {
        return true;
      }
      return runConfirm();
    },
    [runConfirm],
  );

  return { confirmDiscard, confirmDirtyCustomizeCancel, confirmDialog };
}
