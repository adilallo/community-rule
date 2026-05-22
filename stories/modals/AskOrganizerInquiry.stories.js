import React, { useState } from "react";
import AskOrganizerInquiryModal from "../../app/components/modals/AskOrganizerInquiry";
import Button from "../../app/components/buttons/Button";

export default {
  title: "Components/Modals/AskOrganizerInquiry",
  component: AskOrganizerInquiryModal,
};

function AskOrganizerInquiryStoryHost() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-8">
      <Button
        buttonType="filled"
        palette="default"
        size="medium"
        onClick={() => setIsOpen(true)}
      >
        Ask an organizer
      </Button>
      <AskOrganizerInquiryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}

export const Default = {
  render: () => <AskOrganizerInquiryStoryHost />,
};
