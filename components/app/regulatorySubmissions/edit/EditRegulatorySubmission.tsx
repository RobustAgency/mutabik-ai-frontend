"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RegulatorySubmissionForm } from "../shared/RegulatorySubmissionForm";
import {
  useGetRegulatorySubmissionQuery,
  useUpdateRegulatorySubmissionMutation,
} from "@/app/lib/features/regulatorySubmissionsApi";
import type { CreateRegulatorySubmissionRequest } from "@/interfaces/RegulatorySubmission";

interface EditRegulatorySubmissionProps {
  id: number;
}

const EditRegulatorySubmission: React.FC<EditRegulatorySubmissionProps> = ({ id }) => {
  const router = useRouter();
  const { data: submission, isLoading: isLoadingSubmission } =
    useGetRegulatorySubmissionQuery(id);
  const [updateSubmission, { isLoading: isUpdating }] =
    useUpdateRegulatorySubmissionMutation();

  const handleSubmit = async (data: Partial<CreateRegulatorySubmissionRequest>) => {
    await updateSubmission({ id, data }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/regulatory-submissions");
  };

  if (isLoadingSubmission) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-[#667085]">Loading regulatory submission...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-[#667085]">Regulatory submission not found</p>
      </div>
    );
  }

  return (
    <RegulatorySubmissionForm
      mode="edit"
      initialData={submission}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Regulatory Submission"
      description={`Update details for ${submission.tracking_id}`}
    />
  );
};

export default EditRegulatorySubmission;

