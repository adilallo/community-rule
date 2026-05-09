"use client";

import type { ReactNode } from "react";
import type { CreateFlowStep } from "../types";
import { renderCreateFlowScreen } from "./createFlowScreenComponents";

/**
 * Maps each wizard `screenId` to its screen component.
 *
 * **Folder rule (Figma):** subfolders match `CREATE_FLOW_SCREEN_REGISTRY[].layoutKind`
 * — `select/` (two-column chip flows), `card/` (compact card-stack steps), `text/`, etc.
 * The URL segment (`communication-methods`) is not the folder name; see `createFlowScreenRegistry.ts`.
 *
 * Implementation lives in {@link renderCreateFlowScreen} (`createFlowScreenComponents.tsx`)
 * so the registry metadata and this router stay easier to keep in sync (CR-92 §3).
 */
export function CreateFlowScreenView({
  screenId,
}: {
  screenId: CreateFlowStep;
}): ReactNode {
  return renderCreateFlowScreen(screenId);
}
