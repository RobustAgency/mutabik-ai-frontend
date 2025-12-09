"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AiRiskRegisterForm from "./AiRiskRegisterForm";
import { useCreateAiRiskRegisterMutation } from "@/app/lib/features/aiRiskRegisterApi";
import {
  CreateAiRiskRegisterData,
  UpdateAiRiskRegisterData,
} from "@/interfaces/AiRiskRegister";

const CreateAiRiskRegister: React.FC = () => {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [createRisk, { isLoading }] = useCreateAiRiskRegisterMutation();

  const handleSubmit = async (
    payload: CreateAiRiskRegisterData | UpdateAiRiskRegisterData
  ) => {
    setServerErrors({});
    try {
      await createRisk(payload as CreateAiRiskRegisterData).unwrap();
      router.push("/risk-compliance/ai-risk-management/register");
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
          Register AI Risk
        </h1>
        <p className="font-sans font-normal text-sm text-[#667085]">
          Capture risk details, scoring, and ownership for AI models.
        </p>
      </div>

      <AiRiskRegisterForm
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        serverErrors={serverErrors}
      />
    </div>
  );
};

export default CreateAiRiskRegister;

