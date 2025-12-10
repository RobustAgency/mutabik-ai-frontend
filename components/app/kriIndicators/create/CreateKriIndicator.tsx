"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import KriIndicatorForm from "./KriIndicatorForm";
import { useCreateKriIndicatorMutation } from "@/app/lib/features/kriIndicatorApi";
import {
  CreateKriIndicatorData,
  UpdateKriIndicatorData,
} from "@/interfaces/KriIndicator";

const CreateKriIndicator: React.FC = () => {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [createIndicator, { isLoading }] = useCreateKriIndicatorMutation();

  const handleSubmit = async (
    payload: CreateKriIndicatorData | UpdateKriIndicatorData
  ) => {
    setServerErrors({});
    try {
      await createIndicator(payload as CreateKriIndicatorData).unwrap();
      router.push("/risk-compliance/ai-risk-management/kri");
    } catch (err: any) {
      if (err?.data?.errors) setServerErrors(err.data.errors);
      throw err;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="font-sans font-semibold text-2xl text-[#1D2939]">
          Create KRI Indicator
        </h1>
        <p className="font-sans font-normal text-sm text-[#667085]">
          Define thresholds, collection method, and alerting actions.
        </p>
      </div>

      <KriIndicatorForm
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        serverErrors={serverErrors}
      />
    </div>
  );
};

export default CreateKriIndicator;

