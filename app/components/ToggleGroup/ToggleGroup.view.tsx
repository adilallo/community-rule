import type { ToggleGroupViewProps } from "./ToggleGroup.types";

export function ToggleGroupView({
  groupId,
  children,
  className: _className,
  position: _position,
  state: _state,
  showText,
  ariaLabel,
  toggleClasses,
  onClick,
  onKeyDown,
  onFocus,
  onBlur,
  ...rest
}: ToggleGroupViewProps) {
  return (
    <button
      id={groupId}
      type="button"
      role="button"
      aria-label={ariaLabel || (showText ? undefined : "Toggle option")}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      className={toggleClasses}
      {...rest}
    >
      {showText ? children : children || "☰"}
    </button>
  );
}
