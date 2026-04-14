"use client";

import { notFound, useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { CreateFlowScreenView } from "../screens/CreateFlowScreenView";
import { isValidStep } from "../utils/flowSteps";
import type { CreateFlowStep } from "../types";

interface PageProps {
  params: Promise<{ screenId: string }>;
}

export default function CreateFlowScreenPage({ params }: PageProps) {
  const { screenId: raw } = use(params);
  const router = useRouter();

  useEffect(() => {
    if (raw === "community-reflection") {
      router.replace("/create/community-save");
    }
  }, [raw, router]);

  if (raw === "community-reflection") {
    return null;
  }

  if (!isValidStep(raw)) {
    notFound();
  }

  const screenId = raw as CreateFlowStep;
  return <CreateFlowScreenView screenId={screenId} />;
}
