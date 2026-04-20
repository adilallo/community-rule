"use client";

/**
 * Controlled section editor for a decision-approach chip. Used by both the
 * custom-rule `decision-approaches` add-method modal and the `final-review`
 * chip edit modal. Caller owns draft state — Confirm/Save persistence and
 * `markCreateFlowInteraction` live in the parent.
 */

import { memo, useCallback } from "react";
import { useMessages } from "../../../../contexts/MessagesContext";
import ModalTextAreaField from "../ModalTextAreaField";
import ApplicableScopeField from "../ApplicableScopeField";
import IncrementerBlock from "../../../../components/controls/IncrementerBlock";
import type { DecisionApproachDetailEntry } from "../../types";

export interface DecisionApproachEditFieldsProps {
  value: DecisionApproachDetailEntry;
  onChange: (_next: DecisionApproachDetailEntry) => void;
}

const CONSENSUS_LEVEL_MIN = 0;
const CONSENSUS_LEVEL_MAX = 100;
const CONSENSUS_LEVEL_STEP = 5;

function DecisionApproachEditFieldsComponent({
  value,
  onChange,
}: DecisionApproachEditFieldsProps) {
  const m = useMessages();
  const t = m.create.customRule.decisionApproaches;

  const patch = useCallback(
    <K extends keyof DecisionApproachDetailEntry>(
      key: K,
      next: DecisionApproachDetailEntry[K],
    ) => {
      onChange({ ...value, [key]: next });
    },
    [value, onChange],
  );

  return (
    <div className="flex flex-col gap-6">
      <ModalTextAreaField
        label={t.sectionHeadings.corePrinciple}
        value={value.corePrinciple}
        onChange={(v) => patch("corePrinciple", v)}
      />
      <ApplicableScopeField
        label={t.sectionHeadings.applicableScope}
        addLabel={t.scopeAddButtonLabel}
        scopes={value.applicableScope}
        selectedScopes={value.selectedApplicableScope}
        onToggleScope={(scope) =>
          patch(
            "selectedApplicableScope",
            value.selectedApplicableScope.includes(scope)
              ? value.selectedApplicableScope.filter((s) => s !== scope)
              : [...value.selectedApplicableScope, scope],
          )
        }
        onAddScope={(scope) =>
          patch("applicableScope", [...value.applicableScope, scope])
        }
      />
      <ModalTextAreaField
        label={t.sectionHeadings.stepByStepInstructions}
        value={value.stepByStepInstructions}
        onChange={(v) => patch("stepByStepInstructions", v)}
      />
      <IncrementerBlock
        label={t.sectionHeadings.consensusLevel}
        value={value.consensusLevel}
        min={CONSENSUS_LEVEL_MIN}
        max={CONSENSUS_LEVEL_MAX}
        step={CONSENSUS_LEVEL_STEP}
        onChange={(next) => patch("consensusLevel", next)}
        formatValue={(v) => `${v}%`}
        decrementAriaLabel="Decrease consensus level"
        incrementAriaLabel="Increase consensus level"
      />
      <ModalTextAreaField
        label={t.sectionHeadings.objectionsDeadlocks}
        value={value.objectionsDeadlocks}
        onChange={(v) => patch("objectionsDeadlocks", v)}
      />
    </div>
  );
}

DecisionApproachEditFieldsComponent.displayName =
  "DecisionApproachEditFields";

export default memo(DecisionApproachEditFieldsComponent);
