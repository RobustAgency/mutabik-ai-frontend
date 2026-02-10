"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";
import { useGetAiCommitteeQuery } from "@/app/lib/features/aiCommitteesApi";
import {
  AiCommitteeType,
  AiCommitteeCadence,
} from "@/interfaces/AiCommittee";
import { formatDateShort } from "@/lib/helpers/date";

interface AiCommitteeDetailsProps {
  committeeId: number;
}

const formatType = (type: AiCommitteeType): string => {
  const typeMap: Record<AiCommitteeType, string> = {
    [AiCommitteeType.GOVERNANCE]: "Governance",
    [AiCommitteeType.ETHICS]: "Ethics",
    [AiCommitteeType.RISK]: "Risk",
    [AiCommitteeType.SECURITY]: "Security",
    [AiCommitteeType.PRIVACY]: "Privacy",
    [AiCommitteeType.PRODUCT_OPS]: "Product Ops",
    [AiCommitteeType.OTHER]: "Other",
  };
  return typeMap[type] || type;
};

const formatCadence = (cadence: AiCommitteeCadence): string => {
  const cadenceMap: Record<AiCommitteeCadence, string> = {
    [AiCommitteeCadence.WEEKLY]: "Weekly",
    [AiCommitteeCadence.BIWEEKLY]: "Biweekly",
    [AiCommitteeCadence.MONTHLY]: "Monthly",
    [AiCommitteeCadence.QUARTERLY]: "Quarterly",
    [AiCommitteeCadence.AD_HOC]: "Ad Hoc",
  };
  return cadenceMap[cadence] || cadence;
};

const AiCommitteeDetails: React.FC<AiCommitteeDetailsProps> = ({ committeeId }) => {
  const router = useRouter();
  const { data: committee, isLoading } = useGetAiCommitteeQuery(committeeId);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading AI committee...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!committee) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">AI Committee not found</p>
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
              {committee.name}
            </h2>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              AI Committee Details
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PermissionGate permission={PERMISSIONS.AI_COMMITTEES_EDIT}>
              <Button
                variant="outline"
                onClick={() => router.push(`/governance/ai-committees/${committeeId}/edit`)}
              >
                Edit
              </Button>
            </PermissionGate>
            <Button
              variant="outline"
              onClick={() => router.push("/governance/ai-committees")}
            >
              Back to List
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Name
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {committee.name}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Type
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatType(committee.type)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Cadence
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatCadence(committee.cadence)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Owner Team
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {committee.owner_team}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Status
            </p>
            <div
              className={`inline-flex h-[24px] items-center justify-center rounded-full text-xs font-medium px-2 ${
                committee.active
                  ? "bg-[#ECFDF3] text-[#047857]"
                  : "bg-[#F2F4F7] text-[#667085]"
              }`}
            >
              {committee.active ? "Active" : "Inactive"}
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Created At
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatDateShort(committee.created_at)}
            </p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Charter
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] whitespace-pre-wrap">
              {committee.charter}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiCommitteeDetails;

