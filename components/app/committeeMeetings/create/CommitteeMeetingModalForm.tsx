"use client";

import React from "react";
import { useCreateCommitteeMeetingMutation } from "@/app/lib/features/committeeMeetingsApi";
import type { CreateCommitteeMeetingData } from "@/interfaces/CommitteeMeeting";
import { CommitteeMeetingForm } from "../shared/CommitteeMeetingForm";

interface CommitteeMeetingModalFormProps {
  onSuccess: (meeting: any) => void;
  onCancel: () => void;
}

/**
 * Inline-create adapter for Committee Meeting to work with InlineCreateModal.
 * Reuses the shared CommitteeMeetingForm component and surfaces the created item
 * back to the parent on success.
 */
const CommitteeMeetingModalForm: React.FC<CommitteeMeetingModalFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [createMeeting, { isLoading }] = useCreateCommitteeMeetingMutation();

  const handleSubmit = async (data: CreateCommitteeMeetingData | Partial<CreateCommitteeMeetingData>) => {
    const result = await createMeeting(data as CreateCommitteeMeetingData).unwrap();
    // Pass the created meeting to onSuccess callback
    onSuccess(result);
  };

  const handleSuccess = () => {
    // This will be called after form submission, but we already handled onSuccess in handleSubmit
    // So we can just call onCancel to close the modal
    onCancel();
  };

  return (
    <CommitteeMeetingForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Committee Meeting"
      description="Complete the form to create a new committee meeting"
      hideHeader={true}
    />
  );
};

export default CommitteeMeetingModalForm;

