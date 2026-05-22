"use client";

import { memo, useCallback, useRef, useState } from "react";
import { useTranslation } from "../../../../contexts/MessagesContext";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";
import { uploadCreateFlowFile } from "../../../../../lib/create/uploadToServer";
import { CustomMethodCardUploadBlockRowView } from "./CustomMethodCardUploadBlockRow.view";
import type { CustomMethodCardUploadBlockRowProps } from "./CustomMethodCardFieldBlocksSummary.types";

function mapBlockById(
  blocks: CustomMethodCardFieldBlock[],
  blockId: string,
  mapFn: (_b: CustomMethodCardFieldBlock) => CustomMethodCardFieldBlock,
): CustomMethodCardFieldBlock[] {
  return blocks.map((b) => (b.id === blockId ? mapFn(b) : b));
}

function CustomMethodCardUploadBlockRowContainerComponent({
  block,
  blocks,
  onPatch,
  uploadFileInputAriaLabel,
  uploadHint,
  clearPendingUploadAriaLabel,
  clearPendingUploadTooltip,
  uploadPreviewImageAlt,
  noFileChosen,
}: CustomMethodCardUploadBlockRowProps) {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const tUpload = useTranslation("create.upload");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearUpload = useCallback(() => {
    onPatch(
      mapBlockById(blocks, block.id, (b) =>
        b.kind === "upload"
          ? { ...b, fileName: undefined, assetUrl: undefined }
          : b,
      ),
    );
  }, [block.id, blocks, onPatch]);

  const handleFileInputChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (e) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      setErrorMessage(null);
      setBusy(true);
      void (async () => {
        try {
          const { url } = await uploadCreateFlowFile(
            file,
            "customMethodAttachment",
          );
          const name = file.name?.trim();
          onPatch(
            mapBlockById(blocks, block.id, (b) =>
              b.kind === "upload"
                ? {
                    ...b,
                    ...(name ? { fileName: name } : {}),
                    assetUrl: url,
                  }
                : b,
            ),
          );
        } catch {
          setErrorMessage(tUpload("errors.generic"));
        } finally {
          setBusy(false);
        }
      })();
    },
    [block.id, blocks, onPatch, tUpload],
  );

  const handleUploadClick = useCallback(() => {
    if (!busy) uploadInputRef.current?.click();
  }, [busy]);

  return (
    <CustomMethodCardUploadBlockRowView
      block={block}
      blocks={blocks}
      onPatch={onPatch}
      uploadFileInputAriaLabel={uploadFileInputAriaLabel}
      uploadHint={uploadHint}
      clearPendingUploadAriaLabel={clearPendingUploadAriaLabel}
      clearPendingUploadTooltip={clearPendingUploadTooltip}
      uploadPreviewImageAlt={uploadPreviewImageAlt}
      noFileChosen={noFileChosen}
      uploadInputRef={uploadInputRef}
      busy={busy}
      uploadingHint={tUpload("uploading")}
      errorMessage={errorMessage}
      onClearUpload={clearUpload}
      onFileInputChange={handleFileInputChange}
      onUploadClick={handleUploadClick}
    />
  );
}

export const CustomMethodCardUploadBlockRow = memo(
  CustomMethodCardUploadBlockRowContainerComponent,
);
CustomMethodCardUploadBlockRow.displayName = "CustomMethodCardUploadBlockRow";
