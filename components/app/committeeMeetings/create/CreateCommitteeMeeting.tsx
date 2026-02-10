"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateCommitteeMeetingMutation } from "@/app/lib/features/committeeMeetingsApi";
import type { CreateCommitteeMeetingData } from "@/interfaces/CommitteeMeeting";
import { CommitteeMeetingForm } from "../shared/CommitteeMeetingForm";

const CreateCommitteeMeeting: React.FC = () => {
  const router = useRouter();
  const [createMeeting, { isLoading }] = useCreateCommitteeMeetingMutation();

  const handleSubmit = async (
    data: CreateCommitteeMeetingData | Partial<CreateCommitteeMeetingData>
  ) => {
    await createMeeting(data as CreateCommitteeMeetingData).unwrap();
  };

  const handleSuccess = () => {
    router.push("/governance/committee-meetings");
  };

  return (
    <CommitteeMeetingForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Committee Meeting"
      description="Complete the form to create a new committee meeting"
    />
  );
};

export default CreateCommitteeMeeting;

