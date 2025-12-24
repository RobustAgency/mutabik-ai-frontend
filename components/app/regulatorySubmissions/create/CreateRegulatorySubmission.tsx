"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RegulatorySubmissionForm } from "../shared/RegulatorySubmissionForm";
import { useCreateRegulatorySubmissionMutation } from "@/app/lib/features/regulatorySubmissionsApi";
import type { CreateRegulatorySubmissionRequest } from "@/interfaces/RegulatorySubmission";

const CreateRegulatorySubmission: React.FC = () => {
  const router = useRouter();
  const [createSubmission, { isLoading }] = useCreateRegulatorySubmissionMutation();

  const handleSubmit = async (data: CreateRegulatorySubmissionRequest | Partial<CreateRegulatorySubmissionRequest>) => {
    await createSubmission(data as CreateRegulatorySubmissionRequest).unwrap();
  };

  const handleSuccess = () => {
    router.push("/regulatory-submissions");
  };

  return (
    <RegulatorySubmissionForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Regulatory Submission"
      description="Create a new regulatory submission"
    />
  );
};

export default CreateRegulatorySubmission;

