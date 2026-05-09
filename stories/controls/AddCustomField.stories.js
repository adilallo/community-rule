import React, { useState } from "react";
import AddCustomField from "../../app/components/controls/AddCustomField";
import { MessagesProvider } from "../../app/contexts/MessagesContext";
import messages from "../../messages/en/index";

/** Figma: Add Custom Field — node `20235:12994` (Community Rule System). */
export default {
  title: "Components/Controls/AddCustomField",
  component: AddCustomField,
  decorators: [
    (Story) => (
      <MessagesProvider messages={messages}>
        <div className="w-[min(100%,546px)] bg-[var(--color-surface-default-primary)] p-6">
          <Story />
        </div>
      </MessagesProvider>
    ),
  ],
};

export const Collapsed = {
  render: () => {
    const [active, setActive] = useState(false);
    return (
      <AddCustomField
        active={active}
        onPressAdd={() => setActive(true)}
        onSelectFieldType={() => {}}
      />
    );
  },
};

export const Expanded = {
  args: {
    active: true,
    onPressAdd: () => {},
    onSelectFieldType: () => {},
  },
};
