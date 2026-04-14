"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { CreateFlowScreenView } from "../screens/CreateFlowScreenView";
import { isValidStep } from "../utils/flowSteps";
import type { CreateFlowStep } from "../types";

interface PageProps {
  params: Promise<{ screenId: string }>;
}

export default function CreateFlowScreenPage({ params }: PageProps) {
  const { screenId: raw } = use(params);

  if (!isValidStep(raw)) {
    notFound();
  }

  const screenId = raw as CreateFlowStep;
  return <CreateFlowScreenView screenId={screenId} />;
}
