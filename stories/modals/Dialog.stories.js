import React, { useState } from "react";
import Dialog from "../../app/components/modals/Dialog";
import Button from "../../app/components/buttons/Button";

export default {
  title: "Components/Modals/Dialog",
  component: Dialog,
};

function DialogStoryHost(args) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-8">
      <Button
        buttonType="filled"
        palette="default"
        size="medium"
        onClick={() => setIsOpen(true)}
      >
        Open dialog
      </Button>
      <Dialog
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        footer={
          <>
            <Button
              buttonType="outline"
              palette="default"
              size="medium"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              buttonType="filled"
              palette="default"
              size="medium"
              onClick={() => setIsOpen(false)}
            >
              Confirm
            </Button>
          </>
        }
      />
    </div>
  );
}

export const Default = {
  render: (args) => <DialogStoryHost {...args} />,
  args: {
    title: "Confirm action",
    description: "This cannot be undone.",
  },
};
