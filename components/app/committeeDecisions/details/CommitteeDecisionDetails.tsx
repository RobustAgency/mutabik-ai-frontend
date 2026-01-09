"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetCommitteeDecisionQuery } from "@/app/lib/features/committeeDecisionsApi";
import { useGetCommitteeMeetingsQuery } from "@/app/lib/features/committeeMeetingsApi";
import {
  DecisionType,
  DecisionScope,
  VoteMethod,
  VoteResult,
} from "@/interfaces/CommitteeDecision";
import { formatDateShort } from "@/lib/helpers/date";

interface CommitteeDecisionDetailsProps {
  decisionId: number;
}

const formatDecisionType = (type: DecisionType): string => {
  const typeMap: Record<DecisionType, string> = {
    [DecisionType.APPROVE]: "Approve",
    [DecisionType.DENY]: "Deny",
    [DecisionType.WAIVE]: "Waive",
    [DecisionType.POLICY]: "Policy",
    [DecisionType.ESCALATE]: "Escalate",
  };
  return typeMap[type] || type;
};

const formatDecisionScope = (scope: DecisionScope): string => {
  const scopeMap: Record<DecisionScope, string> = {
    [DecisionScope.MODEL]: "Model",
    [DecisionScope.USE_CASE]: "Use Case",
    [DecisionScope.CONTROL]: "Control",
    [DecisionScope.POLICY]: "Policy",
    [DecisionScope.VENDOR]: "Vendor",
    [DecisionScope.RELEASE]: "Release",
    [DecisionScope.ASSESSMENT]: "Assessment",
    [DecisionScope.OTHER]: "Other",
  };
  return scopeMap[scope] || scope;
};

const formatVoteMethod = (method: VoteMethod): string => {
  const methodMap: Record<VoteMethod, string> = {
    [VoteMethod.SIMPLE_MAJORITY]: "Simple Majority",
    [VoteMethod.SUPER_MAJORITY]: "Super Majority",
    [VoteMethod.CONSENSUS]: "Consensus",
    [VoteMethod.CHAIR_DECISION]: "Chair Decision",
  };
  return methodMap[method] || method;
};

const formatVoteResult = (result: VoteResult): string => {
  const resultMap: Record<VoteResult, string> = {
    [VoteResult.PASSED]: "Passed",
    [VoteResult.FAILED]: "Failed",
    [VoteResult.NOT_APPLICABLE]: "Not Applicable",
  };
  return resultMap[result] || result;
};

const CommitteeDecisionDetails: React.FC<CommitteeDecisionDetailsProps> = ({
  decisionId,
}) => {
  const router = useRouter();
  const { data: decision, isLoading } = useGetCommitteeDecisionQuery(decisionId);
  const { data: meetingsData } = useGetCommitteeMeetingsQuery({ per_page: 100 });
  const meetings = meetingsData?.data ?? [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading committee decision...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Committee decision not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const meeting = meetings.find((m) => m.id === decision.committee_meeting_id);
  const voteResultColors: Record<VoteResult, string> = {
    [VoteResult.PASSED]: "bg-[#ECFDF3] text-[#047857]",
    [VoteResult.FAILED]: "bg-[#FEE2E2] text-[#DC2626]",
    [VoteResult.NOT_APPLICABLE]: "bg-[#F2F4F7] text-[#667085]",
  };

  return (
    <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-sans font-medium text-lg leading-6 tracking-normal text-[#000000]">
              {formatDecisionType(decision.decision_type)} - {formatDecisionScope(decision.decision_scope)}
            </h2>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              Committee Decision Details
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/governance/committee-decisions/${decisionId}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/governance/committee-decisions")}
            >
              Back to List
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Committee Meeting
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {meeting
                ? `${meeting.committee?.name || "Unknown"} - ${formatDateShort(meeting.scheduled_at)}`
                : "Unknown"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Decision Type
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatDecisionType(decision.decision_type)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Decision Scope
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatDecisionScope(decision.decision_scope)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Owner Team
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {decision.owner_team}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Vote Method
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatVoteMethod(decision.vote_method)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Vote Result
            </p>
            <div
              className={`inline-flex h-[24px] items-center justify-center rounded-full text-xs font-medium px-2 ${
                voteResultColors[decision.vote_result] || "bg-[#F2F4F7] text-[#667085]"
              }`}
            >
              {formatVoteResult(decision.vote_result)}
            </div>
          </div>

          {decision.expiry_date && (
            <div className="space-y-1">
              <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
                Expiry Date
              </p>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
                {formatDateShort(decision.expiry_date)}
              </p>
            </div>
          )}

          <div className="space-y-1">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Created At
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
              {formatDateShort(decision.created_at)}
            </p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
              Rationale
            </p>
            <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] whitespace-pre-wrap">
              {decision.rationale}
            </p>
          </div>

          {decision.conditions && (
            <div className="space-y-1 md:col-span-2">
              <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
                Conditions
              </p>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939] whitespace-pre-wrap">
                {decision.conditions}
              </p>
            </div>
          )}

          {decision.related_ref && (
            <div className="space-y-1 md:col-span-2">
              <p className="font-sans font-medium text-xs leading-4 tracking-normal text-[#667085]">
                Related Reference
              </p>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
                {decision.related_ref}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitteeDecisionDetails;

