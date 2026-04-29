"use client";

/**
 * Figma: "Modal / Alert" (6351-14646)
 * https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=6351-14646
 */

import { memo } from "react";
import { AlertView } from "./Alert.view";
import type { AlertProps } from "./Alert.types";

function layoutFor(
  type: NonNullable<AlertProps["type"]>,
  size: NonNullable<AlertProps["size"]>,
): {
  containerClasses: string;
  titleClasses: string;
  descriptionClasses: string;
} {
  if (type === "toast") {
    const padH =
      size === "s"
        ? "px-[var(--space-500)]"
        : "px-[var(--space-1200)]";
    const containerClasses = `flex gap-[var(--space-300)] items-center ${padH} pb-[var(--space-500)] pt-[var(--space-400)] rounded-tl-[var(--radius-200,8px)] rounded-tr-[var(--radius-200,8px)] border-solid`;
    if (size === "s") {
      return {
        containerClasses,
        titleClasses:
          "font-inter text-[14px] leading-[18px] font-medium tracking-[0%]",
        descriptionClasses:
          "font-inter text-[14px] leading-[20px] font-normal tracking-[0%] mt-[var(--spacing-scale-004)]",
      };
    }
    return {
      containerClasses,
      titleClasses:
        "font-inter text-[18px] leading-[24px] font-medium tracking-[0%]",
      descriptionClasses:
        "font-inter text-[18px] leading-[1.3] font-normal tracking-[0%] mt-[var(--spacing-scale-004)]",
    };
  }

  if (size === "s") {
    return {
      containerClasses:
        "flex gap-[var(--space-300)] items-center p-[var(--space-300)] rounded-[var(--radius-200,8px)] border-solid",
      titleClasses:
        "font-inter text-[14px] leading-[18px] font-medium tracking-[0%]",
      descriptionClasses:
        "font-inter text-[14px] leading-[20px] font-normal tracking-[0%] mt-[var(--spacing-scale-004)]",
    };
  }
  return {
    containerClasses:
      "flex gap-[var(--space-300)] items-center px-[var(--space-600)] py-[var(--space-400)] rounded-[var(--radius-200,8px)] border-solid",
    titleClasses:
      "font-inter text-[16px] leading-[20px] font-medium tracking-[0%]",
    descriptionClasses:
      "font-inter text-[16px] leading-[24px] font-normal tracking-[0%] mt-[var(--spacing-scale-004)]",
  };
}

const AlertContainer = memo<AlertProps>(
  ({
    title,
    description,
    status: statusProp = "default",
    type: typeProp = "toast",
    size: sizeProp = "m",
    hasLeadingIcon = true,
    hasBodyText = true,
    hasTrailingIcon: hasTrailingIconProp,
    onClose,
    className = "",
  }) => {
    const status = statusProp;
    const type = typeProp;
    const size = sizeProp;

    const getStatusStyles = () => {
      switch (status) {
        case "positive":
          return {
            background:
              "bg-[var(--color-surface-invert-positive-secondary,var(--color-kiwi-kiwi0))]",
            borderColor:
              type === "toast"
                ? "var(--color-border-invert-positive-primary)"
                : undefined,
            titleColor: "text-[var(--color-content-invert-primary)]",
            descriptionColor:
              "text-[var(--color-content-invert-secondary)]",
            iconColor: "var(--color-kiwi-kiwi500)",
            closeButtonIconColor: "var(--color-content-invert-primary)",
          };
        case "warning":
          return {
            background:
              "bg-[var(--color-surface-invert-warning-secondary,var(--color-yellow-yellow0))]",
            borderColor:
              type === "toast"
                ? "var(--color-border-invert-warning-primary)"
                : undefined,
            titleColor: "text-[var(--color-content-invert-primary)]",
            descriptionColor:
              "text-[var(--color-content-invert-secondary)]",
            iconColor: "var(--color-yellow-yellow500)",
            closeButtonIconColor: "var(--color-content-invert-primary)",
          };
        case "danger":
          return {
            background:
              "bg-[var(--color-surface-invert-negative-secondary,var(--color-red-red0))]",
            borderColor:
              type === "toast"
                ? "var(--color-border-invert-negative-primary)"
                : undefined,
            titleColor: "text-[var(--color-content-invert-negative-primary)]",
            descriptionColor:
              "text-[var(--color-content-invert-negative-primary)]",
            iconColor: "var(--color-red-red500)",
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
            closeButtonIconColor:
              "var(--color-content-default-brand-primary)",
          };
      }
    };

    const statusStyles = getStatusStyles();
    const layout = layoutFor(type, size);

    const containerStyle =
      type === "toast" && statusStyles.borderColor
        ? {
            borderBottomWidth: "var(--border-large)",
            borderBottomColor: statusStyles.borderColor,
          }
        : undefined;

    const containerClasses = `${layout.containerClasses} ${statusStyles.background}`;

    const titleClasses = `${layout.titleClasses} ${statusStyles.titleColor} relative shrink-0 w-full`;
    const descriptionClasses = `${layout.descriptionClasses} ${statusStyles.descriptionColor} relative shrink-0 w-full`;

    const hasTrailingIcon =
      hasTrailingIconProp ?? Boolean(onClose);
    const showClose = hasTrailingIcon && Boolean(onClose);

    return (
      <AlertView
        title={title}
        description={description}
        status={status}
        type={type}
        hasLeadingIcon={hasLeadingIcon}
        hasBodyText={hasBodyText}
        hasTrailingIcon={showClose}
        className={className}
        containerClasses={containerClasses}
        containerStyle={containerStyle}
        titleClasses={titleClasses}
        descriptionClasses={descriptionClasses}
        iconColor={statusStyles.iconColor}
        closeButtonIconColor={statusStyles.closeButtonIconColor}
        onClose={onClose}
      />
    );
  },
);

AlertContainer.displayName = "Alert";

export default AlertContainer;
