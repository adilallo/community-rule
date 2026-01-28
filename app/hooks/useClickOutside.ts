import { useEffect, RefObject } from "react";

/**
 * Hook to detect clicks outside of specified elements
 * Useful for closing dropdowns, modals, or menus when clicking outside
 *
 * @param refs - Array of refs to elements that should not trigger the callback
 * @param handler - Callback function to execute when clicking outside
 * @param enabled - Whether the hook is enabled (default: true)
 *
 * @example
 * ```tsx
 * const menuRef = useRef<HTMLDivElement>(null);
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * const [isOpen, setIsOpen] = useState(false);
 *
 * useClickOutside([menuRef, buttonRef], () => setIsOpen(false), isOpen);
 * ```
 */
export function useClickOutside(
  refs: Array<RefObject<HTMLElement>>,
  handler: (_event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Check if click is outside all provided refs
      const isOutside = refs.every((ref) => {
        const element = ref.current;
        if (!element) return true;
        return !element.contains(event.target as Node);
      });

      if (isOutside) {
        handler(event);
      }
    };

    // Use mousedown instead of click for better UX (catches drag events)
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [refs, handler, enabled]);
}
