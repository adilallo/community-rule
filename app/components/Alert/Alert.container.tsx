"use client";

import { memo } from "react";
import { AlertView } from "./Alert.view";
import type { AlertProps } from "./Alert.types";

const AlertContainer = memo<AlertProps>(
  ({
    title,
    description,
    status = "default",
    type = "toast",
    onClose,
    className = "",
  }) => {
    // Determine background and border colors based on status and type
    const getStatusStyles = () => {
      switch (status) {
        case "positive":
          return {
            background: "bg-[var(--color-kiwi-kiwi0)]",
            borderColor:
              type === "toast"
                ? "var(--color-border-invert-positive-primary)"
                : undefined,
            titleColor: "text-[var(--color-content-invert-primary)]",
            descriptionColor: "text-[var(--color-content-invert-secondary)]",
            iconColor: "var(--color-kiwi-kiwi500)",
            closeButtonColor: "text-[var(--color-content-invert-primary)]",
            closeButtonIconColor: "var(--color-content-invert-primary)",
          };
        case "warning":
          return {
            background: "bg-[var(--color-yellow-yellow0)]",
            borderColor:
              type === "toast"
                ? "var(--color-border-invert-warning-primary)"
                : undefined,
            titleColor: "text-[var(--color-content-invert-primary)]",
            descriptionColor: "text-[var(--color-content-invert-secondary)]",
            iconColor: "var(--color-yellow-yellow500)",
            closeButtonColor: "text-[var(--color-content-invert-primary)]",
            closeButtonIconColor: "var(--color-content-invert-primary)",
          };
        case "danger":
          return {
            background: "bg-[var(--color-red-red0)]",
            borderColor:
              type === "toast"
                ? "var(--color-border-invert-negative-primary)"
                : undefined,
            titleColor: "text-[var(--color-content-invert-negative-primary)]",
            descriptionColor: "text-[var(--color-content-invert-negative-primary)]",
            iconColor: "var(--color-red-red500)",
            closeButtonColor: "text-[var(--color-content-invert-negative-primary)]",
            closeButtonIconColor: "var(--color-content-invert-primary)",
          };
        default:
          return {
            background: "bg-[var(--color-surface-default-tertiary)]",
            borderColor:
              type === "toast"
                ? "var(--color-border-default-primary)"
                : undefined,
            titleColor: "text-[var(--color-content-default-primary)]",
            descriptionColor: "text-[var(--color-content-default-primary)]",
            iconColor: "var(--color-content-default-brand-primary)",
            closeButtonColor: "text-[var(--color-content-default-primary)]",
            closeButtonIconColor: "var(--color-content-default-brand-primary)",
          };
      }
    };

    const statusStyles = getStatusStyles();

    const containerClasses = `flex gap-[var(--space-300)] items-center ${
      type === "toast"
        ? `pb-[var(--space-500)] pt-[var(--space-400)] px-[var(--space-1200)] rounded-tl-[var(--radius-200,8px)] rounded-tr-[var(--radius-200,8px)]`
        : `px-[var(--spacing-scale-024)] py-[var(--spacing-scale-016)] rounded-[var(--radius-200,8px)]`
    } ${statusStyles.background} border-solid`;

    const containerStyle =
      type === "toast" && statusStyles.borderColor
        ? {
            borderBottomWidth: "var(--border-large)",
            borderBottomColor: statusStyles.borderColor,
          }
        : undefined;

    const titleClasses =
      type === "banner"
        ? `font-inter text-[16px] leading-[20px] font-medium tracking-[0%] ${statusStyles.titleColor} relative shrink-0 w-full`
        : `font-inter text-[18px] leading-[24px] font-medium tracking-[0%] ${statusStyles.titleColor} relative shrink-0 w-full`;

    const descriptionClasses =
      type === "banner"
        ? `font-inter text-[16px] leading-[24px] font-normal tracking-[0%] ${statusStyles.descriptionColor} relative shrink-0 w-full mt-[var(--spacing-scale-004)]`
        : `font-inter text-[18px] leading-[23.4px] font-normal tracking-[0%] ${statusStyles.descriptionColor} relative shrink-0 w-full mt-[var(--spacing-scale-004)]`;

    const closeButtonClasses = `flex gap-[var(--spacing-scale-006)] items-center justify-center overflow-clip p-[var(--spacing-scale-012)] rounded-[var(--radius-full)] shrink-0 hover:bg-[var(--color-surface-default-secondary)] transition-colors ${statusStyles.closeButtonColor}`;

    return (
      <AlertView
        title={title}
        description={description}
        status={status}
        type={type}
        className={className}
        containerClasses={containerClasses}
        containerStyle={containerStyle}
        titleClasses={titleClasses}
        descriptionClasses={descriptionClasses}
        iconColor={statusStyles.iconColor}
        closeButtonClasses={closeButtonClasses}
        closeButtonIconColor={statusStyles.closeButtonIconColor}
        onClose={onClose}
      />
    );
  },
);

AlertContainer.displayName = "Alert";

export default AlertContainer;
