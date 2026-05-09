"use client";

import { memo, useEffect, useId, useRef, useState } from "react";
import { ModalHeaderView } from "./ModalHeader.view";
import type { ModalHeaderProps } from "./ModalHeader.types";

/**
 * Figma: "Utility / ModalHeader". Lives under `modals/` with other composed modal chrome.
 * Sticky 48px modal header with optional close (left) and more-options
 * (right) icon buttons.
 */
const ModalHeaderContainer = memo<ModalHeaderProps>((props) => {
  const { menuItems = [] } = props;
  const hasMenu = menuItems.length > 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen || !hasMenu) return;
    const onDoc = (event: MouseEvent) => {
      if (
        menuWrapRef.current &&
        !menuWrapRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [hasMenu, menuOpen]);

  useEffect(() => {
    if (!menuOpen || !hasMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasMenu, menuOpen]);

  return (
    <div ref={menuWrapRef}>
      <ModalHeaderView
        {...props}
        menuId={menuId}
        menuOpen={menuOpen}
        onToggleMenu={hasMenu ? () => setMenuOpen((open) => !open) : undefined}
        onMenuItemClick={
          hasMenu
            ? (item) => {
                item.onClick?.();
                setMenuOpen(false);
              }
            : undefined
        }
      />
    </div>
  );
});

ModalHeaderContainer.displayName = "ModalHeader";

export default ModalHeaderContainer;
