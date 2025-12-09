"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AiRiskTreatmentForm from "./AiRiskTreatmentForm";
import { useCreateAiRiskTreatmentMutation } from "@/app/lib/features/aiRiskTreatmentApi";
import {
  CreateAiRiskTreatmentData,
  UpdateAiRiskTreatmentData,
} from "@/interfaces/AiRiskTreatment";

const CreateAiRiskTreatment: React.FC = () => {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [createTreatment, { isLoading }] = useCreateAiRiskTreatmentMutation();

  const handleSubmit = async (
    payload: CreateAiRiskTreatmentData | UpdateAiRiskTreatmentData
  ) => {
    setServerErrors({});
    try {
      await createTreatment(payload as CreateAiRiskTreatmentData).unwrap();
      router.push("/risk-compliance/ai-risk-management/treatment");
    } catch (err: any) {
      if (err?.data?.errors) setServerErrors(err.data.errors);
      throw err;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="font-sans font-semibold text-2xl text-[#1D2939]">
          Create AI Risk Treatment
        </h1>
        <p className="font-sans font-normal text-sm text-[#667085]">
          Plan and track mitigation for identified risks.
        </p>
      </div>

      <AiRiskTreatmentForm
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        serverErrors={serverErrors}
      />
    </div>
  );
};

export default CreateAiRiskTreatment;

