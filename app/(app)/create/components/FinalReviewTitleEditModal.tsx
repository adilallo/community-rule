"use client";

/**
 * Edit published rule: community name with the same 48-char limit as
 * {@link CreateFlowTextFieldScreen} `community-name` step.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import Create from "../../../components/modals/Create";
import TextInput from "../../../components/controls/TextInput";
import ContentLockup from "../../../components/type/ContentLockup";
import { useTranslation } from "../../../contexts/MessagesContext";

/** Matches `community-name` step (`CreateFlowTextFieldScreen` `maxLength={48}`). */
export const COMMUNITY_TITLE_FIELD_MAX_LENGTH = 48;

export interface FinalReviewTitleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValue: string;
  onSave: (_value: string) => void;
}

export function FinalReviewTitleEditModal({
  isOpen,
  onClose,
  initialValue,
  onSave,
}: FinalReviewTitleEditModalProps) {
  const tModal = useTranslation(
    "create.reviewAndComplete.finalReview.titleEditModal",
  );
  const tField = useTranslation("create.community.communityName");
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

  const isDirty = useMemo(() => draft !== initialRef.current, [draft]);

  const trimmedDraft = draft.trim();
  const canSave = isDirty && trimmedDraft.length > 0;

  const characterHint = tField("characterCountTemplate")
    .replace("{current}", String(draft.length))
    .replace("{max}", String(COMMUNITY_TITLE_FIELD_MAX_LENGTH));

  const handleSave = () => {
    if (!canSave) return;
    const capped = trimmedDraft.slice(0, COMMUNITY_TITLE_FIELD_MAX_LENGTH);
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
      nextButtonDisabled={!canSave}
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
          maxLength={COMMUNITY_TITLE_FIELD_MAX_LENGTH}
        />
      </div>
    </Create>
  );
}
