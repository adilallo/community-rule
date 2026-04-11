"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { VALID_STEPS } from "../utils/flowSteps";

interface PageProps {
  params: Promise<{ step: string }>;
}

/**
 * Dynamic route handler for create flow steps
 *
 * Handles all flow steps via dynamic routing: /create/[step]
 * Validates step exists and renders appropriate template (placeholder for now)
 */
export default function CreateFlowStepPage({ params }: PageProps) {
  const { step } = use(params);

  // Validate step exists
  if (!(VALID_STEPS as readonly string[]).includes(step)) {
    notFound();
  }

  // Placeholder content - templates will be implemented in CR-51-55
  return (
    <div className="flex flex-1 max-md:items-start max-md:justify-start md:items-center md:justify-center">
      <div className="text-center">
        <h1 className="text-white text-2xl font-bold mb-4">
          Create Flow Step: {step}
        </h1>
        <p className="text-gray-400">
          Template implementation coming in CR-51 through CR-55
        </p>
      </div>
    </div>
  );
}
