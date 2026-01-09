"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetCommitteeDecisionsQuery,
  useDeleteCommitteeDecisionMutation,
} from "@/app/lib/features/committeeDecisionsApi";
import type {
  CommitteeDecision,
  CommitteeDecisionFilters,
} from "@/interfaces/CommitteeDecision";
import {
  DecisionType,
  DecisionScope,
  VoteResult,
} from "@/interfaces/CommitteeDecision";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";

const formatDate = (dateString: string | null | undefined): string =>
  formatDateShort(dateString);

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

const formatVoteResult = (result: VoteResult): string => {
  const resultMap: Record<VoteResult, string> = {
    [VoteResult.PASSED]: "Passed",
    [VoteResult.FAILED]: "Failed",
    [VoteResult.NOT_APPLICABLE]: "Not Applicable",
  };
  return resultMap[result] || result;
};

const CommitteeDecisions: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<CommitteeDecisionFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    decisionId: number | null;
    decisionInfo: string;
  }>({
    isOpen: false,
    decisionId: null,
    decisionInfo: "",
  });

  const queryParams = React.useMemo(
    () => ({
      ...filters,
      page: currentPage,
      per_page: 15,
    }),
    [filters, currentPage]
  );

  const { data, isLoading } = useGetCommitteeDecisionsQuery(queryParams);
  const [deleteDecision, { isLoading: isDeleting }] =
    useDeleteCommitteeDecisionMutation();

  const decisions = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEditClick = (
    e: React.MouseEvent,
    decision: CommitteeDecision
  ) => {
    e.stopPropagation();
    router.push(`/governance/committee-decisions/${decision.id}/edit`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    decision: CommitteeDecision
  ) => {
    e.stopPropagation();
    const meetingDate = decision.committeeMeeting?.scheduled_at
      ? formatDate(decision.committeeMeeting.scheduled_at)
      : "Unknown";
    setDeleteDialogState({
      isOpen: true,
      decisionId: decision.id,
      decisionInfo: `${formatDecisionType(decision.decision_type)} - ${meetingDate}`,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.decisionId) {
      try {
        await deleteDecision(deleteDialogState.decisionId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          decisionId: null,
          decisionInfo: "",
        });
      } catch (error) {
        console.error("Failed to delete Committee Decision:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        decisionId: null,
        decisionInfo: "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<CommitteeDecision>[] = [
    {
      accessorKey: "decision_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Decision Type
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {formatDecisionType(getValue() as DecisionType)}
        </div>
      ),
    },
    {
      accessorKey: "decision_scope",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Scope
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatDecisionScope(getValue() as DecisionScope)}
        </div>
      ),
    },
    {
      accessorKey: "vote_result",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Vote Result
        </div>
      ),
      cell: ({ getValue }) => {
        const result = getValue() as VoteResult;
        const resultColors: Record<VoteResult, string> = {
          [VoteResult.PASSED]: "bg-[#ECFDF3] text-[#047857]",
          [VoteResult.FAILED]: "bg-[#FEE2E2] text-[#DC2626]",
          [VoteResult.NOT_APPLICABLE]: "bg-[#F2F4F7] text-[#667085]",
        };
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${
              resultColors[result] || "bg-[#F2F4F7] text-[#667085]"
            }`}
          >
            {formatVoteResult(result)}
          </div>
        );
      },
    },
    {
      accessorKey: "owner_team",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Owner Team
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "expiry_date",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Expiry Date
        </div>
      ),
      cell: ({ getValue }) => {
        const rawDate = getValue() as string | null;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {rawDate ? formatDate(rawDate) : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Created
        </div>
      ),
      cell: ({ getValue }) => {
        const rawDate = getValue() as string | null;
        const formatted = formatDate(rawDate);
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {formatted}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Actions
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              className="text-[#667085]"
              onClick={(e) => handleEditClick(e, row.original)}
            >
              Edit
            </Button>
            <Button
              variant={"outline"}
              className="text-[#667085]"
              onClick={(e) => handleDeleteClick(e, row.original)}
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        <CardContent className="flex flex-col flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                Committee Decisions
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage and track committee decisions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/governance/committee-decisions/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Decision
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={decisions}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/governance/committee-decisions/${row.id}/details`)
              }
              pagination={
                pagination
                  ? {
                      page: pagination.current_page,
                      limit: pagination.per_page,
                      total: pagination.total,
                      totalPages: pagination.last_page,
                    }
                  : undefined
              }
              onPageChange={handlePageChange}
              emptyState={{
                title: "No committee decisions found",
                description: "Get started by creating your first committee decision",
                action: (
                  <Button
                    onClick={() => router.push("/governance/committee-decisions/create")}
                  >
                    Create Decision
                  </Button>
                ),
              }}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Committee Decision"
        description={`Are you sure you want to delete the decision "${deleteDialogState.decisionInfo}"? This action cannot be undone and will remove the committee decision from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default CommitteeDecisions;

