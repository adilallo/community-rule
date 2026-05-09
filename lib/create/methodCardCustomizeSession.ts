import type { CustomMethodCardFieldBlock } from "./customMethodCardFieldBlocks";

export type MethodCardHeaderDraft = {
  title: string;
  description: string;
};

/** Snapshot of modal-local edits taken when the user enters Customize mode. */
export type MethodCardCustomizeSnapshot<TDraft> = {
  pendingDraft: TDraft;
  fieldBlocks: CustomMethodCardFieldBlock[] | null;
  headerDraft: MethodCardHeaderDraft;
};

export function captureMethodCardCustomizeSnapshot<TDraft>(
  pendingDraft: TDraft,
  fieldBlocks: CustomMethodCardFieldBlock[] | null,
  headerDraft: MethodCardHeaderDraft,
): MethodCardCustomizeSnapshot<TDraft> {
  return {
    pendingDraft: structuredClone(pendingDraft),
    fieldBlocks:
      fieldBlocks === null ? null : structuredClone(fieldBlocks),
    headerDraft: { ...headerDraft },
  };
}

export function isMethodCardCustomizeSessionDirty<TDraft>(
  snapshot: MethodCardCustomizeSnapshot<TDraft>,
  pendingDraft: TDraft | null,
  draftFieldBlocks: CustomMethodCardFieldBlock[] | null,
  headerDraft: MethodCardHeaderDraft | null,
): boolean {
  if (!pendingDraft) {
    return false;
  }
  if (
    JSON.stringify(pendingDraft) !== JSON.stringify(snapshot.pendingDraft)
  ) {
    return true;
  }
  if (headerDraft !== null) {
    if (
      headerDraft.title !== snapshot.headerDraft.title ||
      headerDraft.description !== snapshot.headerDraft.description
    ) {
      return true;
    }
  }
  const cur =
    draftFieldBlocks === null ? null : JSON.stringify(draftFieldBlocks);
  const snap =
    snapshot.fieldBlocks === null ? null : JSON.stringify(snapshot.fieldBlocks);
  return cur !== snap;
}

/** For Close / overlay / Escape — skip closing when user cancels the confirm. */
export function confirmDiscardMethodCardCustomizeSession<TDraft>(
  modalEditUnlocked: boolean,
  snapshot: MethodCardCustomizeSnapshot<TDraft> | null,
  pendingDraft: TDraft | null,
  draftFieldBlocks: CustomMethodCardFieldBlock[] | null,
  headerDraft: MethodCardHeaderDraft | null,
  message: string,
): boolean {
  if (!modalEditUnlocked || snapshot === null) {
    return true;
  }
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
  return window.confirm(message);
}
