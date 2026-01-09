"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateCommitteeDecisionMutation } from "@/app/lib/features/committeeDecisionsApi";
import type { CreateCommitteeDecisionData } from "@/interfaces/CommitteeDecision";
import { CommitteeDecisionForm } from "../shared/CommitteeDecisionForm";

const CreateCommitteeDecision: React.FC = () => {
  const router = useRouter();
  const [createDecision, { isLoading }] = useCreateCommitteeDecisionMutation();

  const handleSubmit = async (
    data: CreateCommitteeDecisionData | Partial<CreateCommitteeDecisionData>
  ) => {
    await createDecision(data as CreateCommitteeDecisionData).unwrap();
  };

  const handleSuccess = () => {
    router.push("/governance/committee-decisions");
  };

  return (
    <CommitteeDecisionForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Committee Decision"
      description="Complete the form to create a new committee decision"
    />
  );
};

export default CreateCommitteeDecision;

