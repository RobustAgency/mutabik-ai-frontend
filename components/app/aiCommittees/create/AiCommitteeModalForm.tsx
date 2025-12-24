"use client";

import React from "react";
import { useCreateAiCommitteeMutation } from "@/app/lib/features/aiCommitteesApi";
import type { CreateAiCommitteeData } from "@/interfaces/AiCommittee";
import { AiCommitteeForm } from "../shared/AiCommitteeForm";

interface AiCommitteeModalFormProps {
  onSuccess: (committee: any) => void;
  onCancel: () => void;
}

/**
 * Inline-create adapter for AI Committee to work with InlineCreateModal.
 * Reuses the shared AiCommitteeForm component and surfaces the created item
 * back to the parent on success.
 */
const AiCommitteeModalForm: React.FC<AiCommitteeModalFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [createCommittee, { isLoading }] = useCreateAiCommitteeMutation();

  const handleSubmit = async (data: CreateAiCommitteeData | Partial<CreateAiCommitteeData>) => {
    const result = await createCommittee(data as CreateAiCommitteeData).unwrap();
    // Pass the created committee to onSuccess callback
    onSuccess(result);
  };

  const handleSuccess = () => {
    // This will be called after form submission, but we already handled onSuccess in handleSubmit
    // So we can just call onCancel to close the modal
    onCancel();
  };

  return (
    <AiCommitteeForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create AI Committee"
      description="Complete the form to create a new AI committee"
      hideHeader={true}
    />
  );
};

export default AiCommitteeModalForm;

