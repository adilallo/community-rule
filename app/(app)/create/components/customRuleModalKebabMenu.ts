import type { ModalHeaderMenuItem } from "../../../components/modals/ModalHeader/ModalHeader.types";

export interface CustomRuleModalKebabMenuCopy {
  items: {
    customize: string;
    duplicate: string;
    remove: string;
  };
  saveEdits: string;
}

export interface CustomRuleModalKebabHandlers {
  showCustomize?: boolean;
  onCustomize?: () => void;
  onDuplicate?: () => void;
  showRemove?: boolean;
  onRemove?: () => void;
}

export function buildCustomRuleModalKebabMenu(
  copy: CustomRuleModalKebabMenuCopy,
  handlers: CustomRuleModalKebabHandlers,
): ModalHeaderMenuItem[] {
  const items: ModalHeaderMenuItem[] = [];
  if (handlers.showCustomize && handlers.onCustomize) {
    items.push({
      id: "customize",
      label: copy.items.customize,
      leadingIcon: "custom",
      onClick: handlers.onCustomize,
    });
  }
  if (handlers.onDuplicate) {
    items.push({
      id: "duplicate",
      label: copy.items.duplicate,
      leadingIcon: "content_copy",
      onClick: handlers.onDuplicate,
    });
  }
  if (handlers.showRemove && handlers.onRemove) {
    items.push({
      id: "remove",
      label: copy.items.remove,
      leadingIcon: "warning",
      variant: "destructive",
      onClick: handlers.onRemove,
    });
  }
  return items;
}
