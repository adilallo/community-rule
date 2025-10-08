import React, { memo } from "react";

const Separator = memo(() => {
  return (
    <div className="flex flex-col items-center self-stretch">
      <div className="flex items-start self-stretch h-px w-full bg-[var(--border-color-default-secondary)]" />
    </div>
  );
});

Separator.displayName = "Separator";

export default Separator;
