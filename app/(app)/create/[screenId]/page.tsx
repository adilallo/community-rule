import { notFound } from "next/navigation";
import { CreateFlowScreenView } from "../screens/CreateFlowScreenView";
import { isValidStep } from "../utils/flowSteps";
import type { CreateFlowStep } from "../types";

/**
 * Single dynamic route for the whole create wizard (every step in `FLOW_STEP_ORDER`).
 *
 * Only **canonical** `screenId` values from `CreateFlowStep` are valid. Old placeholder
 * segments from pre-product shells are not redirected — unknown slugs `notFound()`.
 */

interface PageProps {
  params: Promise<{ screenId: string }>;
}

export default async function CreateFlowScreenPage({ params }: PageProps) {
  const { screenId: raw } = await params;

  if (!isValidStep(raw)) {
    notFound();
  }

  return <CreateFlowScreenView screenId={raw as CreateFlowStep} />;
}
