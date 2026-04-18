"use client";

import { memo } from "react";
import { InputWithCounterView } from "./InputWithCounter.view";
import type { InputWithCounterProps } from "./InputWithCounter.types";

/**
 * Figma: "Control / InputWithCounter" (TODO(figma)).
 * Single-line text input with a label, optional help glyph, and a live
 * `value.length / maxLength` counter underneath.
 */
const InputWithCounterContainer = memo<InputWithCounterProps>((props) => {
  return <InputWithCounterView {...props} />;
});

InputWithCounterContainer.displayName = "InputWithCounter";

export default InputWithCounterContainer;
