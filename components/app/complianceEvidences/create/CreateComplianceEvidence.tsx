"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ComplianceEvidenceForm } from "../shared/ComplianceEvidenceForm";
import { useCreateComplianceEvidenceMutation } from "@/app/lib/features/complianceEvidenceApi";
import type { CreateComplianceEvidenceRequest } from "@/interfaces/ComplianceEvidence";

const CreateComplianceEvidence: React.FC = () => {
  const router = useRouter();
  const [createEvidence, { isLoading }] = useCreateComplianceEvidenceMutation();

  const handleSubmit = async (data: CreateComplianceEvidenceRequest | Partial<CreateComplianceEvidenceRequest>) => {
    await createEvidence(data as CreateComplianceEvidenceRequest).unwrap();
  };

  const handleSuccess = () => {
    router.push("/compliance-evidences");
  };

  return (
    <ComplianceEvidenceForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Compliance Evidence"
      description="Create a new compliance evidence"
    />
  );
};

export default CreateComplianceEvidence;

