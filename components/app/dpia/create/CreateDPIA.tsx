"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateDataProtectionImpactAssessmentMutation } from "@/app/lib/features/dataProtectionImpactAssessmentsApi";
import type { CreateDPIAData } from "@/interfaces/DataProtectionImpactAssessment";
import { DPIAForm } from "../shared/DPIAForm";

const CreateDPIA: React.FC = () => {
  const router = useRouter();
  const [createDPIA, { isLoading }] =
    useCreateDataProtectionImpactAssessmentMutation();

  const handleSubmit = async (
    data: CreateDPIAData | Partial<CreateDPIAData>
  ) => {
    await createDPIA(data as CreateDPIAData).unwrap();
  };

  const handleSuccess = () => {
    router.push("/privacy/dpia");
  };

  return (
    <DPIAForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Data Protection Impact Assessment"
      description="Complete all steps to create a new DPIA"
    />
  );
};

export default CreateDPIA;


