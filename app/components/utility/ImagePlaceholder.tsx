"use client";

import { memo } from "react";
import { normalizeImagePlaceholderColor } from "../../../lib/propNormalization";

export type ImagePlaceholderColorValue =
  | "blue"
  | "green"
  | "purple"
  | "red"
  | "orange"
  | "teal"
  | "Blue"
  | "Green"
  | "Purple"
  | "Red"
  | "Orange"
  | "Teal";

interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  text?: string;
  /**
   * Image placeholder color. Accepts both lowercase and PascalCase (case-insensitive).
   * Figma uses PascalCase, codebase uses lowercase - both are supported.
   */
  color?: ImagePlaceholderColorValue;
  className?: string;
}

/**
 * Simple image placeholder component for testing
 * Generates colored backgrounds with text overlays
 */
const ImagePlaceholder = memo<ImagePlaceholderProps>(
  ({
    width = 260,
    height = 390,
    text = "Blog Image",
    color: colorProp = "blue",
    className = "",
  }) => {
    // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
    const color = normalizeImagePlaceholderColor(colorProp);
    const colors: Record<string, string> = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
      orange: "bg-orange-500",
      teal: "bg-teal-500",
    };

    const bgColor = colors[color] || colors.blue;

    return (
      <div
        className={`${bgColor} flex items-center justify-center text-white font-bold text-lg ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {text}
      </div>
    );
  },
);

ImagePlaceholder.displayName = "ImagePlaceholder";

export default ImagePlaceholder;
