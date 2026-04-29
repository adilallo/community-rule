"use client";

/**
 * Edit published rule: community description with the same 200-char limit as
 * {@link CreateFlowScreenView} `community-context` step.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Create from "../../../components/modals/Create";
import TextInput from "../../../components/controls/TextInput";
import ContentLockup from "../../../components/type/ContentLockup";
import { useTranslation } from "../../../contexts/MessagesContext";

/** Matches `community-context` step and `createFlowSchemas` communityContext.max(200). */
export const COMMUNITY_CONTEXT_FIELD_MAX_LENGTH = 200;

export interface FinalReviewCommunityContextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current `communityContext` (trimmed for display; draft seeds from raw state in parent). */
  initialValue: string;
  onSave: (_value: string) => void;
}

export function FinalReviewCommunityContextEditModal({
  isOpen,
  onClose,
  initialValue,
  onSave,
}: FinalReviewCommunityContextEditModalProps) {
  const tModal = useTranslation(
    "create.reviewAndComplete.finalReview.communityContextEditModal",
  );
  const tField = useTranslation("create.community.communityContext");
  const tSave = useTranslation(
    "create.reviewAndComplete.finalReview.chipEditModal",
  );

  const [draft, setDraft] = useState("");
  const initialRef = useRef("");
  const seededOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      seededOpenRef.current = false;
      return;
    }
    if (seededOpenRef.current) return;
    seededOpenRef.current = true;
    const seed = initialValue;
    setDraft(seed);
    initialRef.current = seed;
  }, [isOpen, initialValue]);

  const isDirty = useMemo(
    () => draft !== initialRef.current,
    [draft],
  );

  const characterHint = tField("characterCountTemplate")
    .replace("{current}", String(draft.length))
    .replace("{max}", String(COMMUNITY_CONTEXT_FIELD_MAX_LENGTH));

  const handleSave = () => {
    if (!isDirty) return;
    const trimmed = draft.trimEnd();
    const capped = trimmed.slice(0, COMMUNITY_CONTEXT_FIELD_MAX_LENGTH);
    onSave(capped);
    onClose();
  };

  return (
    <Create
      isOpen={isOpen}
      onClose={onClose}
      backdropVariant="blurredYellow"
      headerContent={
        <div className="bg-[var(--color-surface-default-primary)] px-[24px] py-[12px] shrink-0">
          <ContentLockup
            title={tModal("title")}
            description={tModal("description")}
            variant="modal"
            alignment="left"
          />
        </div>
      }
      showBackButton={false}
      showNextButton
      nextButtonText={tSave("saveButton")}
      nextButtonDisabled={!isDirty}
      onNext={handleSave}
      ariaLabel={tModal("title")}
    >
      <div className="pb-2">
        <TextInput
          className="!transition-none"
          type="text"
          placeholder={tField("placeholder")}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
          }}
          inputSize="medium"
          formHeader={false}
          textHint={characterHint}
          maxLength={COMMUNITY_CONTEXT_FIELD_MAX_LENGTH}
        />
      </div>
    </Create>
  );
}
