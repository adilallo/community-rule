"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMessages, useTranslation } from "../../../../contexts/MessagesContext";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";
import { CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS } from "../../../../../lib/create/customMethodCardWizardConstants";
import type { AddCustomFieldType } from "../../../../components/controls/AddCustomField/AddCustomField.types";
import { CustomMethodCardWizardView } from "./CustomMethodCardWizard.view";
import type { CustomMethodCardWizardProps } from "./CustomMethodCardWizard.types";

/**
 * Shared 3-step add-custom-method-card flow (Figma Modal / Create — nodes
 * `20066:14748`, `20094:48551`, `20066:14361`).
 */
const CustomMethodCardWizardContainer = memo<CustomMethodCardWizardProps>(
  ({ isOpen, onClose, onFinalize }) => {
    const m = useMessages();
    const t = useTranslation("common");
    const w = m.create.customRule.customMethodCardWizard;

    const copy = useMemo(
      () => ({
        step1: w.steps["1"],
        step2: w.steps["2"],
        step3: w.steps["3"],
        footerFinalize: w.footer.finalize,
        fieldModals: w.fieldModals,
      }),
      [w.fieldModals, w.footer.finalize, w.steps],
    );

    const fieldBodiesCopy = useMemo(
      () => ({
        requiredHint: copy.fieldModals.requiredHint,
        text: copy.fieldModals.text,
        badges: copy.fieldModals.badges,
        upload: copy.fieldModals.upload,
        proportion: copy.fieldModals.proportion,
      }),
      [copy.fieldModals],
    );

    const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
    const [policyTitle, setPolicyTitle] = useState("");
    const [policyDescription, setPolicyDescription] = useState("");
    const [addFieldExpanded, setAddFieldExpanded] = useState(false);
    const [fieldTypeModal, setFieldTypeModal] =
      useState<AddCustomFieldType | null>(null);
    const [draftFieldBlocks, setDraftFieldBlocks] = useState<
      CustomMethodCardFieldBlock[]
    >([]);

    const [textBlockTitle, setTextBlockTitle] = useState("");
    const [textPlaceholderBody, setTextPlaceholderBody] = useState("");
    const [badgeBlockTitle, setBadgeBlockTitle] = useState("");
    const [badgeOptions, setBadgeOptions] = useState<string[]>([]);
    const [uploadBlockTitle, setUploadBlockTitle] = useState("");
    const [uploadFileName, setUploadFileName] = useState<string | undefined>(
      undefined,
    );
    const [proportionBlockTitle, setProportionBlockTitle] = useState("");
    const [proportionDefault, setProportionDefault] = useState(50);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetFieldTypeDrafts = useCallback(() => {
      setTextBlockTitle("");
      setTextPlaceholderBody("");
      setBadgeBlockTitle("");
      setBadgeOptions([]);
      setUploadBlockTitle("");
      setUploadFileName(undefined);
      setProportionBlockTitle("");
      setProportionDefault(50);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, []);

    const reset = useCallback(() => {
      setWizardStep(1);
      setPolicyTitle("");
      setPolicyDescription("");
      setAddFieldExpanded(false);
      setFieldTypeModal(null);
      setDraftFieldBlocks([]);
      resetFieldTypeDrafts();
    }, [resetFieldTypeDrafts]);

    useEffect(() => {
      if (!isOpen) {
        reset();
      }
    }, [isOpen, reset]);

    const dismiss = useCallback(() => {
      reset();
      onClose();
    }, [onClose, reset]);

    const titleTrim = policyTitle.trim();
    const descriptionTrim = policyDescription.trim();

    const stepValid = useMemo(() => {
      const titleOk =
        titleTrim.length > 0 &&
        titleTrim.length <= CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS;
      const descriptionOk =
        descriptionTrim.length > 0 &&
        descriptionTrim.length <= CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS;
      if (wizardStep === 1) return titleOk;
      if (wizardStep === 2) return descriptionOk;
      return titleOk && descriptionOk;
    }, [
      descriptionTrim.length,
      titleTrim.length,
      wizardStep,
    ]);

    const fieldModalStepValid = useMemo(() => {
      if (!fieldTypeModal) return false;
      if (fieldTypeModal === "text") {
        const t0 = textBlockTitle.trim();
        return (
          t0.length > 0 &&
          t0.length <= CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS
        );
      }
      if (fieldTypeModal === "badges") {
        const t0 = badgeBlockTitle.trim();
        return (
          t0.length > 0 &&
          t0.length <= CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS
        );
      }
      if (fieldTypeModal === "upload") {
        const t0 = uploadBlockTitle.trim();
        return (
          t0.length > 0 &&
          t0.length <= CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS
        );
      }
      const t0 = proportionBlockTitle.trim();
      return (
        t0.length > 0 &&
        t0.length <= CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS &&
        proportionDefault >= 1 &&
        proportionDefault <= 100
      );
    }, [
      badgeBlockTitle,
      fieldTypeModal,
      proportionBlockTitle,
      proportionDefault,
      textBlockTitle,
      uploadBlockTitle,
    ]);

    const headerTitle =
      wizardStep === 1
        ? copy.step1.title
        : wizardStep === 2
          ? copy.step2.title
          : copy.step3.title;

    const headerDescription =
      wizardStep === 1
        ? copy.step1.description
        : wizardStep === 2
          ? copy.step2.description
          : copy.step3.description;

    const fieldModalHeader = fieldTypeModal
      ? copy.fieldModals[fieldTypeModal]
      : null;

    const shellTitle = fieldModalHeader?.title ?? headerTitle;
    const shellDescription = fieldModalHeader?.description ?? headerDescription;

    const nextLabel = fieldTypeModal
      ? copy.fieldModals.addField
      : wizardStep === 3
        ? copy.footerFinalize
        : t("buttons.next");

    const shellNextDisabled = fieldTypeModal
      ? !fieldModalStepValid
      : !stepValid;

    const handleShellClose = useCallback(() => {
      if (fieldTypeModal) {
        setFieldTypeModal(null);
        return;
      }
      dismiss();
    }, [dismiss, fieldTypeModal]);

    const handleBack = useCallback(() => {
      if (fieldTypeModal) {
        setFieldTypeModal(null);
        return;
      }
      if (wizardStep === 1) {
        dismiss();
        return;
      }
      setWizardStep((s) => (s === 2 ? 1 : 2));
    }, [dismiss, fieldTypeModal, wizardStep]);

    const handleSelectFieldType = useCallback((ft: AddCustomFieldType) => {
      resetFieldTypeDrafts();
      setFieldTypeModal(ft);
    }, [resetFieldTypeDrafts]);

    const handleFileChosen = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setUploadFileName(file?.name);
      },
      [],
    );

    const handleBadgeAddOption = useCallback((label: string) => {
      setBadgeOptions((prev) =>
        prev.includes(label) ? prev : [...prev, label],
      );
    }, []);

    const appendFieldBlock = useCallback(() => {
      if (!fieldTypeModal || !fieldModalStepValid) return;
      const id = crypto.randomUUID();
      let block: CustomMethodCardFieldBlock;
      switch (fieldTypeModal) {
        case "text":
          block = {
            kind: "text",
            id,
            blockTitle: textBlockTitle.trim(),
            placeholderText: textPlaceholderBody,
          };
          break;
        case "badges":
          block = {
            kind: "badges",
            id,
            blockTitle: badgeBlockTitle.trim(),
            options: [...badgeOptions],
          };
          break;
        case "upload":
          block = {
            kind: "upload",
            id,
            blockTitle: uploadBlockTitle.trim(),
            fileName: uploadFileName,
          };
          break;
        default:
          block = {
            kind: "proportion",
            id,
            blockTitle: proportionBlockTitle.trim(),
            defaultPercent: proportionDefault,
          };
      }
      setDraftFieldBlocks((prev) => [...prev, block]);
      setFieldTypeModal(null);
    }, [
      badgeBlockTitle,
      badgeOptions,
      fieldModalStepValid,
      fieldTypeModal,
      proportionBlockTitle,
      proportionDefault,
      textBlockTitle,
      textPlaceholderBody,
      uploadBlockTitle,
      uploadFileName,
    ]);

    const handleNext = useCallback(() => {
      if (fieldTypeModal) {
        appendFieldBlock();
        return;
      }
      if (!stepValid) return;
      if (wizardStep === 3) {
        onFinalize({
          title: titleTrim,
          description: descriptionTrim,
          fieldBlocks: draftFieldBlocks,
        });
        dismiss();
        return;
      }
      setWizardStep((s) => (s === 1 ? 2 : 3));
    }, [
      appendFieldBlock,
      descriptionTrim,
      dismiss,
      draftFieldBlocks,
      fieldTypeModal,
      onFinalize,
      stepValid,
      titleTrim,
      wizardStep,
    ]);

    return (
      <CustomMethodCardWizardView
        isOpen={isOpen}
        onDismiss={handleShellClose}
        wizardStep={wizardStep}
        title={shellTitle}
        description={shellDescription}
        policyTitle={policyTitle}
        policyDescription={policyDescription}
        addFieldExpanded={addFieldExpanded}
        copy={copy}
        maxChars={CUSTOM_METHOD_CARD_WIZARD_MAX_FIELD_CHARS}
        onPolicyTitleChange={setPolicyTitle}
        onPolicyDescriptionChange={setPolicyDescription}
        onPressAddCustomField={() => setAddFieldExpanded(true)}
        onSelectFieldType={handleSelectFieldType}
        fieldTypeModal={fieldTypeModal}
        fieldBodiesCopy={fieldBodiesCopy}
        fieldBodiesProps={{
          textBlockTitle,
          textPlaceholderBody,
          onTextBlockTitleChange: setTextBlockTitle,
          onTextPlaceholderBodyChange: setTextPlaceholderBody,
          badgeBlockTitle,
          badgeOptions,
          onBadgeBlockTitleChange: setBadgeBlockTitle,
          onBadgeAddOption: handleBadgeAddOption,
          uploadBlockTitle,
          onUploadBlockTitleChange: setUploadBlockTitle,
          fileInputRef,
          onFileChosen: handleFileChosen,
          proportionBlockTitle,
          proportionDefault,
          onProportionBlockTitleChange: setProportionBlockTitle,
          onProportionDefaultChange: setProportionDefault,
        }}
        nextDisabled={shellNextDisabled}
        nextLabel={nextLabel}
        showBackButton
        onBack={handleBack}
        onNext={handleNext}
        stepper={!fieldTypeModal}
      />
    );
  },
);

CustomMethodCardWizardContainer.displayName = "CustomMethodCardWizard";

export default CustomMethodCardWizardContainer;
