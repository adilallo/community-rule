import React, { memo, useCallback, useId, forwardRef } from "react";

const Switch = memo(
  forwardRef((props, ref) => {
    const {
      checked = false,
      onChange,
      onFocus,
      onBlur,
      state = "default",
      label,
      className = "",
      ...rest
    } = props;

    const switchId = useId();

    const handleClick = useCallback(
      (e) => {
        if (onChange) {
          onChange(e);
        }
      },
      [onChange],
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (onChange) {
            onChange(e);
          }
        }
      },
      [onChange],
    );

    const handleFocus = useCallback(
      (e) => {
        if (onFocus) {
          onFocus(e);
        }
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e) => {
        if (onBlur) {
          onBlur(e);
        }
      },
      [onBlur],
    );

    // Switch track styles based on checked state
    const getTrackStyles = useCallback(() => {
      return checked
        ? "bg-[var(--color-surface-inverse-tertiary)]"
        : "bg-[var(--color-surface-default-tertiary)]";
    }, [checked]);

    // Switch thumb styles based on checked state
    const getThumbStyles = useCallback(() => {
      return "bg-[var(--color-gray-000)]";
    }, []);

    // Focus styles
    const getFocusStyles = useCallback(() => {
      if (state === "focus") {
        return "shadow-[0_0_5px_3px_#3281F8] rounded-full";
      }
      return "";
    }, [state]);

    const trackStyles = getTrackStyles();
    const thumbStyles = getThumbStyles();
    const focusStyles = getFocusStyles();

    const switchClasses = `
      relative
      inline-flex
      items-center
      cursor-pointer
      transition-all
      duration-200
      focus:outline-none
      focus-visible:shadow-[0_0_5px_3px_#3281F8]
      focus-visible:rounded-full
      ${focusStyles}
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    const trackClasses = `
      ${trackStyles}
      w-[40px]
      h-[24px]
      rounded-full
      transition-all
      duration-200
      flex
      items-center
      ${checked ? "justify-end" : "justify-start"}
      p-[2px]
    `
      .trim()
      .replace(/\s+/g, " ");

    const thumbClasses = `
      ${thumbStyles}
      w-[var(--measures-sizing-020)]
      h-[var(--measures-sizing-020)]
      rounded-[var(--measures-radius-xlarge)]
      transition-all
      duration-200
      shadow-sm
    `
      .trim()
      .replace(/\s+/g, " ");

    const labelClasses = `
      ml-[var(--measures-spacing-008)]
      font-inter
      font-normal
      text-[14px]
      leading-[20px]
      text-[var(--color-content-default-primary)]
    `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <div className="flex items-center">
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label || "Toggle switch"}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={switchClasses}
          {...rest}
        >
          <div className={trackClasses}>
            <div className={thumbClasses} />
          </div>
        </button>
        {label && <span className={labelClasses}>{label}</span>}
      </div>
    );
  }),
);

Switch.displayName = "Switch";

export default Switch;
