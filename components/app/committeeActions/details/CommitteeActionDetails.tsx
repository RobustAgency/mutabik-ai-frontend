"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";
import { useGetCommitteeActionQuery } from "@/app/lib/features/committeeActionsApi";
import {
  ActionType,
  Status,
  VerificationResult,
} from "@/interfaces/CommitteeAction";
import { formatDateShort } from "@/lib/helpers/date";

interface CommitteeActionDetailsProps {
  actionId: number;
}

const formatActionType = (type: ActionType): string => {
  const typeMap: Record<ActionType, string> = {
    [ActionType.IMPLEMENT_CHANGE]: "Implement Change",
    [ActionType.COLLECT_EVIDENCE]: "Collect Evidence",
    [ActionType.UPDATE_POLICY]: "Update Policy",
    [ActionType.CONDUCT_ASSESSMENT]: "Conduct Assessment",
    [ActionType.NOTIFY_REGULATOR]: "Notify Regulator",
    [ActionType.OTHER]: "Other",
  };
  return typeMap[type] || type;
};

const formatStatus = (status: Status): string => {
  const statusMap: Record<Status, string> = {
    [Status.NEW]: "New",
    [Status.IN_PROGRESS]: "In Progress",
    [Status.BLOCKED]: "Blocked",
    [Status.COMPLETED]: "Completed",
    [Status.CANCELLED]: "Cancelled",
  };
  return statusMap[status] || status;
};

const formatVerificationResult = (result: VerificationResult): string => {
  const resultMap: Record<VerificationResult, string> = {
    [VerificationResult.PENDING]: "Pending",
    [VerificationResult.PASSED]: "Passed",
    [VerificationResult.FAILED]: "Failed",
    [VerificationResult.NOT_APPLICABLE]: "Not Applicable",
  };
  return resultMap[result] || result;
};

const CommitteeActionDetails: React.FC<CommitteeActionDetailsProps> = ({
  actionId,
}) => {
  const router = useRouter();
  const { data: action, isLoading } = useGetCommitteeActionQuery(actionId);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading committee action...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!action) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Committee action not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColors: Record<Status, string> = {
    [Status.NEW]: "bg-[#EFF4FF] text-[#2970FF]",
    [Status.IN_PROGRESS]: "bg-[#FEF3C7] text-[#D97706]",
    [Status.BLOCKED]: "bg-[#FEE2E2] text-[#DC2626]",
    [Status.COMPLETED]: "bg-[#ECFDF3] text-[#047857]",
    [Status.CANCELLED]: "bg-[#F2F4F7] text-[#667085]",
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-sans font-medium text-lg leading-6 tracking-normal text-[#000000]">
              {action.title}
            </h2>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              Committee Action Details
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PermissionGate permission={PERMISSIONS.COMMITTEE_ACTIONS_EDIT}>
              <Button
                variant="outline"
                onClick={() => router.push(`/governance/committee-actions/${actionId}/edit`)}
              >
                Edit
              </Button>
            </PermissionGate>
            <Button
              variant="outline"
              onClick={() => router.push("/governance/committee-actions")}
            >
              Back to List
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Committee Decision
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {action.committeeDecision?.title || "Unknown"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Title
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {action.title}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Action Type
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatActionType(action.action_type)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Assignee
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {action.assignee?.name || "Unknown"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Due Date
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatDateShort(action.due_date)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Status
            </p>
            <div
              className={`inline-flex h-[24px] items-center justify-center rounded-full text-xs font-medium px-2 ${
                statusColors[action.status] || "bg-[#F2F4F7] text-[#667085]"
              }`}
            >
              {formatStatus(action.status)}
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Verification Result
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatVerificationResult(action.verification_result)}
            </p>
          </div>

          {action.evidence_link && (
            <div className="space-y-1">
              <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
                Evidence Link
              </p>
              <a
                href={action.evidence_link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-normal text-sm leading-5 tracking-normal text-[#4FD58F] hover:underline"
              >
                {action.evidence_link}
              </a>
            </div>
          )}

          {action.closed_at && (
            <div className="space-y-1">
              <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
                Closed At
              </p>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
                {formatDateShort(action.closed_at)}
              </p>
            </div>
          )}

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Created At
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatDateShort(action.created_at)}
            </p>
          </div>

          {action.notes && (
            <div className="space-y-1 md:col-span-2">
              <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
                Notes
              </p>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] whitespace-pre-wrap">
                {action.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitteeActionDetails;

