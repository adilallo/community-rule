import React, { useState } from "react";
import Share from "../../app/components/modals/Share";
import { MessagesProvider } from "../../app/contexts/MessagesContext";
import messages from "../../messages/en/index";

/** Figma: Modal / Share — node 22073-30884 (Community Rule System). */
export default {
  title: "modals/Share",
  component: Share,
};

function ShareStoryHost() {
  const [open, setOpen] = useState(true);
  return (
    <MessagesProvider messages={messages}>
      <div className="min-h-[100dvh] bg-[var(--color-surface-inverse-brand-primary)] p-6">
        <button
          type="button"
          className="rounded-md bg-white px-4 py-2 text-sm text-black"
          onClick={() => setOpen(true)}
        >
          Open Share
        </button>
        <Share
          isOpen={open}
          onClose={() => setOpen(false)}
          onCopyLink={() => {}}
          onEmailShare={() => {}}
          onSignalShare={() => {}}
          onSlackShare={() => {}}
          onDiscordShare={() => {}}
        />
      </div>
    </MessagesProvider>
  );
}

export const Default = {
  name: "Modal / Share",
  render: () => <ShareStoryHost />,
};
