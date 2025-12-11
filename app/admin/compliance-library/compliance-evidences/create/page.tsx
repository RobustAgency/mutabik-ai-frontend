"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ComplianceEvidenceForm from "@/components/admin/compliance-evidence/ComplianceEvidenceForm";
import { useComplianceEvidenceMutations } from "@/hooks/admin/useComplianceEvidence";
import { CreateComplianceEvidenceRequest, UpdateComplianceEvidenceRequest } from "@/interfaces/ComplianceEvidence";

export default function CreateComplianceEvidencePage() {
  const router = useRouter();
  const { createComplianceEvidence } = useComplianceEvidenceMutations();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (data: CreateComplianceEvidenceRequest | UpdateComplianceEvidenceRequest) => {
    try {
      setServerErrors({});
      await createComplianceEvidence(data as CreateComplianceEvidenceRequest);
      router.push("/admin/compliance-library/compliance-evidences");
    } catch (err: any) {
      console.error("Failed to create compliance evidence:", err);
      setServerErrors(err?.data?.errors || {});
      throw err;
    }
  };

  return (
    <ComplianceEvidenceForm
      mode="create"
      onSubmit={handleSubmit}
      serverErrors={serverErrors}
    />
  );
}

