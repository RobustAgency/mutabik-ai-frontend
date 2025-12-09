"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RiskMethodologyForm } from "./RiskMethodologyForm";
import { useCreateRiskMethodologyMutation } from "@/app/lib/features/riskMethodologyApi";
import { CreateRiskMethodologyData } from "@/interfaces/RiskMethodology";

const CreateRiskMethodology: React.FC = () => {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [createRiskMethodology, { isLoading }] = useCreateRiskMethodologyMutation();

  const handleSubmit = async (payload: CreateRiskMethodologyData) => {
    setServerErrors({});
    try {
      await createRiskMethodology(payload).unwrap();
      router.push("/governance/risk-methodologies");
    } catch (err: any) {
      if (err?.data?.errors) {
        setServerErrors(err.data.errors);
      }
      throw err;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="font-sans font-semibold text-2xl text-[#1D2939]">
          Create Risk Methodology
        </h1>
        <p className="font-sans font-normal text-sm text-[#667085]">
          Define likelihood and impact scales, matrix rules, and review policy.
        </p>
      </div>

      <RiskMethodologyForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        serverErrors={serverErrors}
      />
    </div>
  );
};

export default CreateRiskMethodology;

