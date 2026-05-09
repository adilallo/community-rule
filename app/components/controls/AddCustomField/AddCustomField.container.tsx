"use client";

import { memo, useCallback, useMemo } from "react";
import { useMessages } from "../../../contexts/MessagesContext";
import { AddCustomFieldView } from "./AddCustomField.view";
import type { AddCustomFieldProps, AddCustomFieldType } from "./AddCustomField.types";

/**
 * Figma: "Add Custom Field" control — Community Rule System (`20235:12994`).
 * Collapsed CTA expands to a 2×2 field-type picker (per-type modals deferred).
 */
const AddCustomFieldContainer = memo<AddCustomFieldProps>(
  ({ active, onPressAdd, onSelectFieldType, className = "" }) => {
    const m = useMessages();
    const copy = m.create.customRule.customMethodCardWizard.addCustomField;

    const fieldTypeLabels = useMemo(
      () => ({
        text: copy.fieldTypes.text,
        badges: copy.fieldTypes.badges,
        upload: copy.fieldTypes.upload,
        proportion: copy.fieldTypes.proportion,
      }),
      [copy.fieldTypes],
    );

    const handleSelect = useCallback(
      (t: AddCustomFieldType) => {
        onSelectFieldType?.(t);
      },
      [onSelectFieldType],
    );

    return (
      <AddCustomFieldView
        active={active}
        onPressAdd={onPressAdd}
        onSelectFieldType={handleSelect}
        ctaLabel={copy.cta}
        fieldTypeLabels={fieldTypeLabels}
        className={className}
      />
    );
  },
);

AddCustomFieldContainer.displayName = "AddCustomField";

export default AddCustomFieldContainer;
