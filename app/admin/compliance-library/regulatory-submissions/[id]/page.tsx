"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RegulatorySubmissionForm from "@/components/admin/regulatory-submissions/RegulatorySubmissionForm";
import { useRegulatorySubmissionMutations, useRegulatorySubmission } from "@/hooks/admin/useRegulatorySubmissions";
import Spinner from "@/components/ui/spinner";
import { CreateRegulatorySubmissionRequest, UpdateRegulatorySubmissionRequest } from "@/interfaces/RegulatorySubmission";

export default function EditRegulatorySubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const { regulatorySubmission, loading: loadingSubmission, error: fetchError } = useRegulatorySubmission(submissionId);
  const { updateRegulatorySubmission } = useRegulatorySubmissionMutations();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

  const handleCancel = () => {
    router.push("/admin/compliance-library/regulatory-submissions");
  };

  const handleSubmit = async (data: CreateRegulatorySubmissionRequest | UpdateRegulatorySubmissionRequest) => {
    try {
      setServerErrors({});
      await updateRegulatorySubmission(submissionId, data as UpdateRegulatorySubmissionRequest);
      router.push("/admin/compliance-library/regulatory-submissions");
    } catch (err: any) {
      setServerErrors(err?.data?.errors || {});
      throw err;
    }
  };

  if (loadingSubmission) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-6 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-[#737373]">Loading regulatory submission...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-6 flex flex-col items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading regulatory submission</p>
          <p className="mt-2">{(fetchError as any)?.data?.message || "An unexpected error occurred."}</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Regulatory Submissions
          </button>
        </div>
      </div>
    );
  }

  if (!regulatorySubmission && !loadingSubmission) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#171717]">Regulatory Submission not found</p>
          <p className="mt-2 text-[#737373]">The regulatory submission you're looking for doesn't exist.</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Regulatory Submissions
          </button>
        </div>
      </div>
    );
  }

  return (
    <RegulatorySubmissionForm
      mode="edit"
      regulatorySubmissionId={submissionId}
      onSubmit={handleSubmit}
      serverErrors={serverErrors}
    />
  );
}

