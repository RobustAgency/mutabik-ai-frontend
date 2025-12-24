"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateCommitteeMembershipMutation } from "@/app/lib/features/committeeMembershipsApi";
import type { CreateCommitteeMembershipData } from "@/interfaces/CommitteeMembership";
import { CommitteeMembershipForm } from "../shared/CommitteeMembershipForm";

const CreateCommitteeMembership: React.FC = () => {
  const router = useRouter();
  const [createMembership, { isLoading }] = useCreateCommitteeMembershipMutation();

  const handleSubmit = async (
    data: CreateCommitteeMembershipData | Partial<CreateCommitteeMembershipData>
  ) => {
    await createMembership(data as CreateCommitteeMembershipData).unwrap();
  };

  const handleSuccess = () => {
    router.push("/governance/committee-memberships");
  };

  return (
    <CommitteeMembershipForm
      mode="create"
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Create Committee Membership"
      description="Complete the form to create a new committee membership"
    />
  );
};

export default CreateCommitteeMembership;

