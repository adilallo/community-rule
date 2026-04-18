import React from "react";
import ApplicableScopeField from "../../app/create/components/ApplicableScopeField";

export default {
  title: "Create Flow/ApplicableScopeField",
  component: ApplicableScopeField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared 'Applicable Scope' field used by the `decision-approaches` and `conflict-management` create-flow modals. Pairs an `InputLabel` with a row of toggle-chips plus an inline pill input for adding new scope values.",
      },
    },
  },
  argTypes: {
    label: { control: { type: "text" } },
    addLabel: { control: { type: "text" } },
    inputPlaceholder: { control: { type: "text" } },
    onToggleScope: { action: "toggle" },
    onAddScope: { action: "add" },
  },
  tags: ["autodocs"],
};

const INITIAL_SCOPES = ["Finance", "Operations", "Product", "People"];

export const Default = {
  render: (args) => {
    const [scopes, setScopes] = React.useState(INITIAL_SCOPES);
    const [selected, setSelected] = React.useState(["Finance"]);

    return (
      <div className="w-[520px]">
        <ApplicableScopeField
          {...args}
          scopes={scopes}
          selectedScopes={selected}
          onToggleScope={(scope) => {
            setSelected((prev) =>
              prev.includes(scope)
                ? prev.filter((s) => s !== scope)
                : [...prev, scope],
            );
          }}
          onAddScope={(scope) => setScopes((prev) => [...prev, scope])}
        />
      </div>
    );
  },
  args: {
    label: "Applicable Scope",
    addLabel: "Add Applicable Scope",
  },
};

export const Empty = {
  render: () => {
    const [scopes, setScopes] = React.useState([]);
    const [selected, setSelected] = React.useState([]);

    return (
      <div className="w-[520px]">
        <ApplicableScopeField
          label="Applicable Scope"
          addLabel="Add Applicable Scope"
          scopes={scopes}
          selectedScopes={selected}
          onToggleScope={(scope) =>
            setSelected((prev) =>
              prev.includes(scope)
                ? prev.filter((s) => s !== scope)
                : [...prev, scope],
            )
          }
          onAddScope={(scope) => setScopes((prev) => [...prev, scope])}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "With no scopes yet — only the '+ Add' affordance is visible. Click it to reveal the pill text input.",
      },
    },
  },
};
