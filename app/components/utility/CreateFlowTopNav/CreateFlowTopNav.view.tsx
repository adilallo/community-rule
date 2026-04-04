import Logo from "../../asset/logo";
import Button from "../../buttons/Button";
import type { CreateFlowTopNavProps } from "./CreateFlowTopNav.types";

export function CreateFlowTopNavView({
  hasShare = false,
  hasExport = false,
  hasEdit = false,
  loggedIn = false,
  onShare,
  onExport,
  onEdit,
  onExit,
  buttonPalette = "default",
  className = "",
}: CreateFlowTopNavProps) {
  const exitButtonText = loggedIn ? "Save & Exit" : "Exit";

  return (
    <header
      className={`bg-black w-full ${className}`}
      role="banner"
      aria-label="Create Rule Flow Navigation"
    >
      <nav
        className="flex items-center justify-between mx-auto max-w-[639px] md:max-w-[1920px] px-[var(--spacing-measures-spacing-500,20px)] md:px-[48px] py-[var(--spacing-measures-spacing-300,12px)] md:py-[var(--spacing-measures-spacing-016,16px)]"
        role="navigation"
        aria-label="Create Flow Navigation"
      >
        {/* Logo - Left */}
        <Logo size="createFlow" wordmark palette={buttonPalette} />

        {/* Button Group - Right */}
        <div className="flex items-center gap-[var(--spacing-scale-012,12px)]">
          {hasShare && (
            <Button
              buttonType="outline"
              palette={buttonPalette}
              size="xsmall"
              onClick={onShare}
              ariaLabel="Share"
              className="md:!text-[12px] md:!leading-[14px] !text-[10px] !leading-[12px] !px-[var(--spacing-scale-006,6px)] md:!px-[var(--spacing-scale-008,8px)] !py-[6px] md:!py-[8px] !border md:!border-[1.5px]"
            >
              Share
            </Button>
          )}

          {hasExport && (
            <Button
              buttonType="outline"
              palette={buttonPalette}
              size="xsmall"
              onClick={onExport}
              ariaLabel="Export"
              className="justify-center gap-[var(--spacing-scale-002,2px)] !pl-[var(--spacing-scale-012,12px)] !pr-[var(--spacing-scale-006,6px)] md:!pr-[var(--spacing-scale-006,6px)] !text-[10px] md:!text-[12px] !leading-[12px] md:!leading-[14px] !py-[6px] md:!py-[8px] !border md:!border-[1.5px]"
            >
              <span>Export</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 md:w-[14px] md:h-[14px]"
                aria-hidden="true"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          )}

          {hasEdit && (
            <Button
              buttonType="outline"
              palette={buttonPalette}
              size="xsmall"
              onClick={onEdit}
              ariaLabel="Edit"
              className="md:!text-[12px] md:!leading-[14px] !text-[10px] !leading-[12px] !px-[var(--spacing-scale-006,6px)] md:!px-[var(--spacing-scale-008,8px)] !py-[6px] md:!py-[8px] !border md:!border-[1.5px]"
            >
              Edit
            </Button>
          )}

          <Button
            buttonType="outline"
            palette={buttonPalette}
            size="xsmall"
            onClick={() => onExit?.({ saveDraft: loggedIn })}
            ariaLabel={exitButtonText}
            className="md:!text-[12px] md:!leading-[14px] !text-[10px] !leading-[12px] !px-[var(--spacing-scale-006,6px)] md:!px-[var(--spacing-scale-008,8px)] !py-[6px] md:!py-[8px] !border md:!border-[1.5px]"
          >
            {exitButtonText}
          </Button>
        </div>
      </nav>
    </header>
  );
}
