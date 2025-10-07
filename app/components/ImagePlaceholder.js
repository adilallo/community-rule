"use client";

import React, { memo } from "react";

/**
 * Simple image placeholder component for testing
 * Generates colored backgrounds with text overlays
 */
const ImagePlaceholder = memo(
  ({
    width = 260,
    height = 390,
    text = "Blog Image",
    color = "blue",
    className = "",
  }) => {
    const colors = {
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
