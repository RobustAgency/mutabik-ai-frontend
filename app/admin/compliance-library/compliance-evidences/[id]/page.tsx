"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ComplianceEvidenceForm from "@/components/admin/compliance-evidence/ComplianceEvidenceForm";
import { useComplianceEvidenceMutations, useComplianceEvidence } from "@/hooks/admin/useComplianceEvidence";
import Spinner from "@/components/ui/spinner";
import { CreateComplianceEvidenceRequest, UpdateComplianceEvidenceRequest } from "@/interfaces/ComplianceEvidence";

export default function EditComplianceEvidencePage() {
  const params = useParams();
  const router = useRouter();
  const complianceEvidenceId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const { complianceEvidence, loading: loadingComplianceEvidence, error: fetchError } =
    useComplianceEvidence(complianceEvidenceId);
  const { updateComplianceEvidence } = useComplianceEvidenceMutations();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const handleCancel = () => {
    router.push("/admin/compliance-library/compliance-evidences");
  };

  const handleSubmit = async (data: CreateComplianceEvidenceRequest | UpdateComplianceEvidenceRequest) => {
    try {
      setServerErrors({});
      await updateComplianceEvidence(complianceEvidenceId, data as UpdateComplianceEvidenceRequest);
      router.push("/admin/compliance-library/compliance-evidences");
    } catch (err: any) {
      console.error("Failed to update compliance evidence:", err);
      setServerErrors(err?.data?.errors || {});
      throw err;
    }
  };

  if (loadingComplianceEvidence) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-6 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-[#737373]">Loading compliance evidence...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-6 flex flex-col items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading compliance evidence</p>
          <p className="mt-2">{(fetchError as any)?.data?.message || "An unexpected error occurred."}</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Compliance Evidence
          </button>
        </div>
      </div>
    );
  }

  if (!complianceEvidence && !loadingComplianceEvidence) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#171717]">Compliance Evidence not found</p>
          <p className="mt-2 text-[#737373]">The compliance evidence you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Compliance Evidence
          </button>
        </div>
      </div>
    );
  }

  return (
    <ComplianceEvidenceForm
      mode="edit"
      complianceEvidenceId={complianceEvidenceId}
      onSubmit={handleSubmit}
      serverErrors={serverErrors}
    />
  );
}

