"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AiRiskRegisterForm from "../create/AiRiskRegisterForm";
import {
  useGetAiRiskRegisterByIdQuery,
  useUpdateAiRiskRegisterMutation,
} from "@/app/lib/features/aiRiskRegisterApi";
import { UpdateAiRiskRegisterData } from "@/interfaces/AiRiskRegister";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EditAiRiskRegisterProps {
  riskId: string;
}

const EditAiRiskRegister: React.FC<EditAiRiskRegisterProps> = ({ riskId }) => {
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetAiRiskRegisterByIdQuery(
    Number(riskId)
  );
  const [updateRisk, { isLoading }] = useUpdateAiRiskRegisterMutation();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (payload: UpdateAiRiskRegisterData) => {
    setServerErrors({});
    try {
      await updateRisk({ id: Number(riskId), data: payload }).unwrap();
      router.push(`/risk-compliance/ai-risk-management/register/${riskId}/details`);
    } catch (err: any) {
      if (err?.data?.errors) {
        setServerErrors(err.data.errors);
      }
      throw err;
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#4FD58F]" />
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6">
          <p className="text-sm text-red-500">Failed to load AI risk register.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="font-sans font-semibold text-2xl text-[#1D2939]">
          Edit AI Risk
        </h1>
        <p className="font-sans font-normal text-sm text-[#667085]">
          Update assessment details and ownership.
        </p>
      </div>

      <AiRiskRegisterForm
        initialData={data}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        serverErrors={serverErrors}
      />
    </div>
  );
};

export default EditAiRiskRegister;

