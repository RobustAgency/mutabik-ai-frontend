"use client";

import React from "react";
import { useCreateDataProtectionImpactAssessmentMutation } from "@/app/lib/features/dataProtectionImpactAssessmentsApi";
import type { CreateDPIAData } from "@/interfaces/DataProtectionImpactAssessment";
import { DPIAForm } from "../shared/DPIAForm";

interface DpiaModalFormProps {
  onSuccess?: (dpia: any) => void;
  onCancel?: () => void;
}

const DpiaModalForm: React.FC<DpiaModalFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [createDPIA, { isLoading }] =
    useCreateDataProtectionImpactAssessmentMutation();

  const handleSubmit = async (
    data: CreateDPIAData | Partial<CreateDPIAData>
  ) => {
    const result = await createDPIA(data as CreateDPIAData).unwrap();
    if (onSuccess) {
      onSuccess(result);
    }
  };

  return (
    <DPIAForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={onCancel}
      title="Create Processing Activity"
      description="Create a new Data Protection Impact Assessment and link it to this ROPA."
      hideHeader
    />
  );
};

export default DpiaModalForm;

