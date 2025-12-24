"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ComplianceEvidenceForm } from "../shared/ComplianceEvidenceForm";
import {
  useGetComplianceEvidenceQuery,
  useUpdateComplianceEvidenceMutation,
} from "@/app/lib/features/complianceEvidenceApi";
import type { CreateComplianceEvidenceRequest } from "@/interfaces/ComplianceEvidence";

interface EditComplianceEvidenceProps {
  id: number;
}

const EditComplianceEvidence: React.FC<EditComplianceEvidenceProps> = ({ id }) => {
  const router = useRouter();
  const { data: evidence, isLoading: isLoadingEvidence } =
    useGetComplianceEvidenceQuery(id);
  const [updateEvidence, { isLoading: isUpdating }] =
    useUpdateComplianceEvidenceMutation();

  const handleSubmit = async (data: Partial<CreateComplianceEvidenceRequest>) => {
    await updateEvidence({ id, data }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/compliance-evidences");
  };

  if (isLoadingEvidence) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-[#667085]">Loading compliance evidence...</p>
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-[#667085]">Compliance evidence not found</p>
      </div>
    );
  }

  return (
    <ComplianceEvidenceForm
      mode="edit"
      initialData={evidence}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Compliance Evidence"
      description={`Update details for evidence #${evidence.id}`}
    />
  );
};

export default EditComplianceEvidence;

