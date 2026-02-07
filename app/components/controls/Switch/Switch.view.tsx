import { forwardRef } from "react";
import type { SwitchViewProps } from "./Switch.types";

export const SwitchView = forwardRef<HTMLButtonElement, SwitchViewProps>(
  (
    {
      switchId,
      propSwitch,
      text,
      switchClasses,
      trackClasses,
      thumbClasses,
      labelClasses,
      onClick,
      onKeyDown,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className="flex items-center">
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={propSwitch}
          aria-label={text || "Toggle switch"}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          className={switchClasses}
          {...rest}
        >
          <div className={trackClasses}>
            <div className={thumbClasses} />
          </div>
        </button>
        {text && <span className={labelClasses}>{text}</span>}
      </div>
    );
  },
);

SwitchView.displayName = "SwitchView";
