"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetCommitteeMembershipQuery,
  useUpdateCommitteeMembershipMutation,
} from "@/app/lib/features/committeeMembershipsApi";
import type { CreateCommitteeMembershipData } from "@/interfaces/CommitteeMembership";
import { CommitteeMembershipForm } from "../shared/CommitteeMembershipForm";

interface EditCommitteeMembershipProps {
  membershipId: number;
}

const EditCommitteeMembership: React.FC<EditCommitteeMembershipProps> = ({
  membershipId,
}) => {
  const router = useRouter();
  const { data: membership, isLoading: loadingMembership } =
    useGetCommitteeMembershipQuery(membershipId);
  const [updateMembership, { isLoading: isUpdating }] =
    useUpdateCommitteeMembershipMutation();

  const handleSubmit = async (
    data: CreateCommitteeMembershipData | Partial<CreateCommitteeMembershipData>
  ) => {
    await updateMembership({
      id: membershipId,
      data: data as Partial<CreateCommitteeMembershipData>,
    }).unwrap();
  };

  const handleSuccess = () => {
    router.push("/governance/committee-memberships");
  };

  if (loadingMembership) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading committee membership...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CommitteeMembershipForm
      mode="edit"
      initialData={membership}
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      title="Edit Committee Membership"
      description="Update committee membership information"
    />
  );
};

export default EditCommitteeMembership;

