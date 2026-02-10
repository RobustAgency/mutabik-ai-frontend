"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";
import { useGetCommitteeMembershipQuery } from "@/app/lib/features/committeeMembershipsApi";
import { useGetAiCommitteesQuery } from "@/app/lib/features/aiCommitteesApi";
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";
import {
  CommitteeMembershipMemberRole,
  CommitteeMembershipEligibility,
} from "@/interfaces/CommitteeMembership";
import { formatDateShort } from "@/lib/helpers/date";

interface CommitteeMembershipDetailsProps {
  membershipId: number;
}

const formatMemberRole = (role: CommitteeMembershipMemberRole): string => {
  const roleMap: Record<CommitteeMembershipMemberRole, string> = {
    [CommitteeMembershipMemberRole.CHAIR]: "Chair",
    [CommitteeMembershipMemberRole.VOTING_MEMBER]: "Voting Member",
    [CommitteeMembershipMemberRole.ADVISOR]: "Advisor",
    [CommitteeMembershipMemberRole.SECRETARY]: "Secretary",
    [CommitteeMembershipMemberRole.OBSERVER]: "Observer",
  };
  return roleMap[role] || role;
};

const formatEligibility = (eligibility: CommitteeMembershipEligibility): string => {
  const eligibilityMap: Record<CommitteeMembershipEligibility, string> = {
    [CommitteeMembershipEligibility.ACTIVE]: "Active",
    [CommitteeMembershipEligibility.SUSPENDED]: "Suspended",
    [CommitteeMembershipEligibility.TERM_ENDED]: "Term Ended",
  };
  return eligibilityMap[eligibility] || eligibility;
};

const CommitteeMembershipDetails: React.FC<CommitteeMembershipDetailsProps> = ({
  membershipId,
}) => {
  const router = useRouter();
  const { data: membership, isLoading } = useGetCommitteeMembershipQuery(membershipId);
  const { data: committeesData } = useGetAiCommitteesQuery({ per_page: 100 });
  const { data: stakeholdersResponse } = useGetStakeholdersQuery({ per_page: 100 });
  const stakeholders = stakeholdersResponse?.data || [];

  const committees = committeesData?.data ?? [];
  const committee = committees.find((c) => c.id === membership?.ai_committee_id);
  const stakeholder = stakeholders.find(
    (s) => s.id === membership?.stakeholder_id
  );

  if (isLoading) {
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

  if (!membership) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Committee membership not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-sans font-medium text-lg leading-6 tracking-normal text-[#000000]">
              Committee Membership Details
            </h2>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              View committee membership information
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PermissionGate permission={PERMISSIONS.COMMITTEE_MEMBERSHIPS_EDIT}>
              <Button
                variant="outline"
                onClick={() => router.push(`/governance/committee-memberships/${membershipId}/edit`)}
              >
                Edit
              </Button>
            </PermissionGate>
            <Button
              variant="outline"
              onClick={() => router.push("/governance/committee-memberships")}
            >
              Back to List
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Committee
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {committee?.name || `Committee #${membership.ai_committee_id}`}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Stakeholder
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {stakeholder?.display_name || `Stakeholder #${membership.stakeholder_id}`}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Member Role
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatMemberRole(membership.member_role)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Eligibility
            </p>
            <div
              className={`inline-flex h-[24px] items-center justify-center rounded-full text-xs font-medium px-2 ${
                membership.eligibility === CommitteeMembershipEligibility.ACTIVE
                  ? "bg-[#ECFDF3] text-[#047857]"
                  : membership.eligibility === CommitteeMembershipEligibility.SUSPENDED
                  ? "bg-[#FEF3C7] text-[#D97706]"
                  : "bg-[#F2F4F7] text-[#667085]"
              }`}
            >
              {formatEligibility(membership.eligibility)}
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Start Date
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatDateShort(membership.start_date)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              End Date
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {membership.end_date ? formatDateShort(membership.end_date) : "N/A"}
            </p>
          </div>

          {membership.expertise_tags && membership.expertise_tags.length > 0 && (
            <div className="space-y-1 md:col-span-2">
              <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
                Expertise Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {membership.expertise_tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-[#F2F4F7] text-[#667085] text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Created At
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatDateShort(membership.created_at)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitteeMembershipDetails;

