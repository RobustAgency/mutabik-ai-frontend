"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateAiCommitteeMutation } from "@/app/lib/features/aiCommitteesApi";
import type { CreateAiCommitteeData } from "@/interfaces/AiCommittee";
import { AiCommitteeForm } from "../shared/AiCommitteeForm";

const CreateAiCommittee: React.FC = () => {
  const router = useRouter();
  const [createCommittee, { isLoading }] = useCreateAiCommitteeMutation();

  const handleSubmit = async (data: CreateAiCommitteeData | Partial<CreateAiCommitteeData>) => {
    await createCommittee(data as CreateAiCommitteeData).unwrap();
  };

  const handleSuccess = () => {
    router.push("/governance/ai-committees");
  };

  return (
    <AiCommitteeForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create AI Committee"
      description="Complete the form to create a new AI committee"
    />
  );
};

export default CreateAiCommittee;

