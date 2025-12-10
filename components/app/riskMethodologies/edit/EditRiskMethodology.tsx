"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RiskMethodologyForm } from "../create/RiskMethodologyForm";
import {
  useGetRiskMethodologyByIdQuery,
  useUpdateRiskMethodologyMutation,
} from "@/app/lib/features/riskMethodologyApi";
import { UpdateRiskMethodologyData } from "@/interfaces/RiskMethodology";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EditRiskMethodologyProps {
  methodologyId: string;
}

const EditRiskMethodology: React.FC<EditRiskMethodologyProps> = ({
  methodologyId,
}) => {
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetRiskMethodologyByIdQuery(
    Number(methodologyId)
  );
  const [updateRiskMethodology, { isLoading }] = useUpdateRiskMethodologyMutation();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (payload: UpdateRiskMethodologyData) => {
    setServerErrors({});
    try {
      await updateRiskMethodology({ id: Number(methodologyId), data: payload }).unwrap();
      router.push(`/risk-compliance/ai-risk-management/methodologies/${methodologyId}/details`);
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
          <p className="text-sm text-red-500">Failed to load risk methodology.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="font-sans font-semibold text-2xl text-[#1D2939]">
          Edit Risk Methodology
        </h1>
        <p className="font-sans font-normal text-sm text-[#667085]">
          Update likelihood/impact scales, matrix rules, and review policy.
        </p>
      </div>

      <RiskMethodologyForm
        initialData={data}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        serverErrors={serverErrors}
      />
    </div>
  );
};

export default EditRiskMethodology;

