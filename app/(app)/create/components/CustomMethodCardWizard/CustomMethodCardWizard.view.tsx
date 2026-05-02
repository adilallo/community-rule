"use client";

import { memo } from "react";
import Create from "../../../../components/modals/Create";
import InputWithCounter from "../../../../components/controls/InputWithCounter";
import TextArea from "../../../../components/controls/TextArea";
import AddCustomField from "../../../../components/controls/AddCustomField";
import { CustomMethodCardWizardFieldBodiesView } from "./CustomMethodCardWizardFieldBodies.view";
import type { CustomMethodCardWizardViewProps } from "./CustomMethodCardWizard.types";

function CustomMethodCardWizardViewComponent({
  isOpen,
  onDismiss,
  wizardStep,
  title,
  description,
  policyTitle,
  policyDescription,
  addFieldExpanded,
  copy,
  maxChars,
  onPolicyTitleChange,
  onPolicyDescriptionChange,
  onPressAddCustomField,
  onSelectFieldType,
  fieldTypeModal,
  fieldBodiesCopy,
  fieldBodiesProps,
  nextDisabled,
  nextLabel,
  showBackButton,
  onBack,
  onNext,
  stepper,
}: CustomMethodCardWizardViewProps) {
  return (
    <Create
      isOpen={isOpen}
      onClose={onDismiss}
      title={title}
      description={description}
      showBackButton={showBackButton}
      showNextButton
      onBack={onBack}
      onNext={onNext}
      nextButtonText={nextLabel}
      nextButtonDisabled={nextDisabled}
      currentStep={wizardStep}
      totalSteps={3}
      stepper={stepper}
      backdropVariant="blurredYellow"
    >
      {fieldTypeModal ? (
        <CustomMethodCardWizardFieldBodiesView
          fieldType={fieldTypeModal}
          copy={fieldBodiesCopy}
          {...fieldBodiesProps}
        />
      ) : null}
      {!fieldTypeModal && wizardStep === 1 ? (
        <InputWithCounter
          placeholder={copy.step1.fieldPlaceholder}
          value={policyTitle}
          onChange={onPolicyTitleChange}
          maxLength={maxChars}
        />
      ) : null}
      {!fieldTypeModal && wizardStep === 2 ? (
        <TextArea
          appearance="default"
          formHeader={false}
          placeholder={copy.step2.fieldPlaceholder}
          value={policyDescription}
          maxLength={maxChars}
          onChange={(e) => onPolicyDescriptionChange(e.target.value)}
          textHint={`${policyDescription.length}/${maxChars}`}
          className="w-full"
          rows={4}
        />
      ) : null}
      {!fieldTypeModal && wizardStep === 3 ? (
        <AddCustomField
          active={addFieldExpanded}
          onPressAdd={onPressAddCustomField}
          onSelectFieldType={onSelectFieldType}
        />
      ) : null}
    </Create>
  );
}

export const CustomMethodCardWizardView = memo(
  CustomMethodCardWizardViewComponent,
);
CustomMethodCardWizardView.displayName = "CustomMethodCardWizardView";
