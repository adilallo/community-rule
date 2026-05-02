"use client";

/**
 * Controlled field blocks for wizard-authored method cards in Create modals
 * (facet screens + final-review chip edit). When `onBlocksChange` is omitted,
 * blocks render read-only (disabled controls).
 *
 * Layout matches preset method editors ({@link CommunicationMethodEditFields},
 * {@link DecisionApproachEditFields}): {@link ModalTextAreaField},
 * {@link ApplicableScopeField} chip rows, {@link IncrementerBlock}.
 */

import { memo, useCallback, useRef } from "react";
import { useMessages } from "../../../contexts/MessagesContext";
import Chip from "../../../components/controls/Chip";
import IncrementerBlock from "../../../components/controls/IncrementerBlock";
import InlineTextButton from "../../../components/buttons/InlineTextButton";
import Upload from "../../../components/controls/Upload";
import ApplicableScopeField from "./ApplicableScopeField";
import InputLabel from "../../../components/type/InputLabel";
import type { CustomMethodCardFieldBlock } from "../../../../lib/create/customMethodCardFieldBlocks";
import ModalTextAreaField from "./ModalTextAreaField";

const TEXT_VALUE_MAX = 8000;

export interface CustomMethodCardFieldBlocksSummaryProps {
  blocks: CustomMethodCardFieldBlock[];
  /** When set, fields update the draft via immutable block-array replacements. */
  onBlocksChange?: (_next: CustomMethodCardFieldBlock[]) => void;
}

function mapBlockById(
  blocks: CustomMethodCardFieldBlock[],
  blockId: string,
  mapFn: (_b: CustomMethodCardFieldBlock) => CustomMethodCardFieldBlock,
): CustomMethodCardFieldBlock[] {
  return blocks.map((b) => (b.id === blockId ? mapFn(b) : b));
}

function CustomMethodCardUploadBlockRow({
  block,
  blocks,
  patch,
  uploadFileInputAriaLabel,
  uploadHint,
  clearFileLabel,
  noFileChosen,
}: {
  block: Extract<CustomMethodCardFieldBlock, { kind: "upload" }>;
  blocks: CustomMethodCardFieldBlock[];
  patch: (_next: CustomMethodCardFieldBlock[]) => void;
  uploadFileInputAriaLabel: string;
  uploadHint: string;
  clearFileLabel: string;
  noFileChosen: string;
}) {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const displayName = block.fileName?.trim() ? block.fileName : noFileChosen;

  return (
    <div className="flex flex-col gap-2">
      <InputLabel
        label={block.blockTitle}
        helpIcon
        size="s"
        palette="default"
      />
      <p className="font-[family-name:var(--font-body)] text-[length:var(--font-size-body-m)] text-[var(--color-content-default-secondary)]">
        {displayName}
      </p>
      <input
        ref={uploadInputRef}
        type="file"
        className="sr-only"
        tabIndex={-1}
        aria-label={uploadFileInputAriaLabel}
        onChange={(e) => {
          const file = e.target.files?.[0];
          const name = file?.name?.trim();
          patch(
            mapBlockById(blocks, block.id, (b) =>
              b.kind === "upload"
                ? {
                    ...b,
                    ...(name ? { fileName: name } : {}),
                  }
                : b,
            ),
          );
          e.target.value = "";
        }}
      />
      <Upload
        hintText={uploadHint}
        onClick={() => uploadInputRef.current?.click()}
      />
      {block.fileName?.trim() ? (
        <InlineTextButton
          onClick={() =>
            patch(
              mapBlockById(blocks, block.id, (b) =>
                b.kind === "upload" ? { ...b, fileName: undefined } : b,
              ),
            )
          }
        >
          {clearFileLabel}
        </InlineTextButton>
      ) : null}
    </div>
  );
}

function CustomMethodCardFieldBlocksSummaryComponent({
  blocks,
  onBlocksChange,
}: CustomMethodCardFieldBlocksSummaryProps) {
  const m = useMessages();
  const wiz = m.create.customRule.customMethodCardWizard;
  const fm = wiz.fieldModals;
  const em = wiz.editModal;
  const emptyValue = em.readout.emptyValue;
  const noFileChosen = em.readout.noFileChosen;
  const readOnly = !onBlocksChange;

  const patch = useCallback(
    (next: CustomMethodCardFieldBlock[]) => {
      onBlocksChange?.(next);
    },
    [onBlocksChange],
  );

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block) => {
        if (block.kind === "text") {
          return (
            <ModalTextAreaField
              key={block.id}
              label={block.blockTitle}
              rows={6}
              value={block.placeholderText}
              onChange={(v) =>
                patch(
                  mapBlockById(blocks, block.id, (b) =>
                    b.kind === "text"
                      ? { ...b, placeholderText: v.slice(0, TEXT_VALUE_MAX) }
                      : b,
                  ),
                )
              }
              disabled={readOnly}
            />
          );
        }

        if (block.kind === "badges") {
          if (readOnly) {
            return (
              <div key={block.id} className="flex flex-col gap-2">
                <InputLabel
                  label={block.blockTitle}
                  helpIcon
                  size="s"
                  palette="default"
                />
                {block.options.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {block.options.map((opt, idx) => (
                      <Chip
                        key={`${block.id}-${idx}`}
                        label={opt}
                        state="selected"
                        palette="default"
                        size="s"
                        disabled
                        ariaLabel={opt}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="font-[family-name:var(--font-body)] text-[length:var(--font-size-body-m)] text-[var(--color-content-default-secondary)]">
                    {emptyValue}
                  </p>
                )}
              </div>
            );
          }
          return (
            <ApplicableScopeField
              key={block.id}
              label={block.blockTitle}
              addLabel={fm.badges.addOptionLabel}
              scopes={block.options}
              selectedScopes={block.options}
              onToggleScope={(scope) =>
                patch(
                  mapBlockById(blocks, block.id, (b) =>
                    b.kind === "badges"
                      ? { ...b, options: b.options.filter((o) => o !== scope) }
                      : b,
                  ),
                )
              }
              onAddScope={(scope) =>
                patch(
                  mapBlockById(blocks, block.id, (b) => {
                    if (b.kind !== "badges") return b;
                    if (b.options.includes(scope) || b.options.length >= 50)
                      return b;
                    return { ...b, options: [...b.options, scope] };
                  }),
                )
              }
            />
          );
        }

        if (block.kind === "upload") {
          return (
            <div key={block.id}>
              {readOnly ? (
                <ModalTextAreaField
                  label={block.blockTitle}
                  rows={2}
                  value={
                    block.fileName?.trim() ? block.fileName : noFileChosen
                  }
                  onChange={() => {}}
                  disabled
                />
              ) : (
                <CustomMethodCardUploadBlockRow
                  block={block}
                  blocks={blocks}
                  patch={patch}
                  uploadFileInputAriaLabel={fm.upload.uploadFileInputAriaLabel}
                  uploadHint={fm.upload.uploadHint}
                  clearFileLabel={em.clearFileLabel}
                  noFileChosen={noFileChosen}
                />
              )}
            </div>
          );
        }

        return (
          <IncrementerBlock
            key={block.id}
            label={block.blockTitle}
            value={block.defaultPercent}
            min={1}
            max={100}
            step={1}
            disabled={readOnly}
            onChange={(v) =>
              patch(
                mapBlockById(blocks, block.id, (b) =>
                  b.kind === "proportion" ? { ...b, defaultPercent: v } : b,
                ),
              )
            }
            formatValue={(v) => `${v}%`}
            decrementAriaLabel={fm.proportion.decrementAriaLabel}
            incrementAriaLabel={fm.proportion.incrementAriaLabel}
          />
        );
      })}
    </div>
  );
}

const CustomMethodCardFieldBlocksSummary = memo(
  CustomMethodCardFieldBlocksSummaryComponent,
);
CustomMethodCardFieldBlocksSummary.displayName =
  "CustomMethodCardFieldBlocksSummary";

export default CustomMethodCardFieldBlocksSummary;
