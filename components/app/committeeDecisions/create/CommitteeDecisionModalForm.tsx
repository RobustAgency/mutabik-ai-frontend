"use client";

import React from "react";
import { useCreateCommitteeDecisionMutation } from "@/app/lib/features/committeeDecisionsApi";
import type { CreateCommitteeDecisionData } from "@/interfaces/CommitteeDecision";
import { CommitteeDecisionForm } from "../shared/CommitteeDecisionForm";

interface CommitteeDecisionModalFormProps {
  onSuccess: (decision: any) => void;
  onCancel: () => void;
}

/**
 * Inline-create adapter for Committee Decision to work with InlineCreateModal.
 * Reuses the shared CommitteeDecisionForm component and surfaces the created item
 * back to the parent on success.
 */
const CommitteeDecisionModalForm: React.FC<CommitteeDecisionModalFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [createDecision, { isLoading }] = useCreateCommitteeDecisionMutation();

  const handleSubmit = async (data: CreateCommitteeDecisionData | Partial<CreateCommitteeDecisionData>) => {
    const result = await createDecision(data as CreateCommitteeDecisionData).unwrap();
    // Pass the created decision to onSuccess callback
    onSuccess(result);
  };

  const handleSuccess = () => {
    // This will be called after form submission, but we already handled onSuccess in handleSubmit
    // So we can just call onCancel to close the modal
    onCancel();
  };

  return (
    <CommitteeDecisionForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Committee Decision"
      description="Complete the form to create a new committee decision"
      hideHeader={true}
    />
  );
};

export default CommitteeDecisionModalForm;

