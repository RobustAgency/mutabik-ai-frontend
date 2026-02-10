"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateCommitteeActionMutation } from "@/app/lib/features/committeeActionsApi";
import type { CreateCommitteeActionData } from "@/interfaces/CommitteeAction";
import { CommitteeActionForm } from "../shared/CommitteeActionForm";

const CreateCommitteeAction: React.FC = () => {
  const router = useRouter();
  const [createAction, { isLoading }] = useCreateCommitteeActionMutation();

  const handleSubmit = async (
    data: CreateCommitteeActionData | Partial<CreateCommitteeActionData>
  ) => {
    await createAction(data as CreateCommitteeActionData).unwrap();
  };

  const handleSuccess = () => {
    router.push("/governance/committee-actions");
  };

  return (
    <CommitteeActionForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Committee Action"
      description="Complete the form to create a new committee action"
    />
  );
};

export default CreateCommitteeAction;

