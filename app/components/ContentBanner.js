"use client";

import { getAssetPath } from "../../lib/assetUtils";
import ContentContainer from "./ContentContainer";

export default function ContentBanner({ post }) {
  return (
    <div className="pt-[var(--measures-spacing-016)] h-[275px] sm:h-[326px] relative w-full sm:overflow-hidden">
      {/* Background SVG */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat aspect-[320/225.5]"
        style={{
          backgroundImage: `url(${getAssetPath("assets/Content_Banner.svg")})`,
          backgroundPosition: "center bottom",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-center pl-[var(--measures-spacing-016)] pr-[96px]">
        {/* ContentContainer with post data */}
        <ContentContainer post={post} size="responsive" />
      </div>
    </div>
  );
}
