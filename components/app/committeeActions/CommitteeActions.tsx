"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetCommitteeActionsQuery,
  useDeleteCommitteeActionMutation,
} from "@/app/lib/features/committeeActionsApi";
import type {
  CommitteeAction,
  CommitteeActionFilters,
} from "@/interfaces/CommitteeAction";
import {
  ActionType,
  Status,
  VerificationResult,
} from "@/interfaces/CommitteeAction";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";

const formatDate = (dateString: string | null | undefined): string =>
  formatDateShort(dateString);

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

const CommitteeActions: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<CommitteeActionFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    actionId: number | null;
    actionTitle: string;
  }>({
    isOpen: false,
    actionId: null,
    actionTitle: "",
  });

  const queryParams = React.useMemo(
    () => ({
      ...filters,
      page: currentPage,
      per_page: 15,
    }),
    [filters, currentPage]
  );

  const { data, isLoading } = useGetCommitteeActionsQuery(queryParams);
  const [deleteAction, { isLoading: isDeleting }] =
    useDeleteCommitteeActionMutation();

  const actions = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEditClick = (
    e: React.MouseEvent,
    action: CommitteeAction
  ) => {
    e.stopPropagation();
    router.push(`/governance/committee-actions/${action.id}/edit`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    action: CommitteeAction
  ) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      actionId: action.id,
      actionTitle: action.title,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.actionId) {
      try {
        await deleteAction(deleteDialogState.actionId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          actionId: null,
          actionTitle: "",
        });
      } catch (error) {
        console.error("Failed to delete Committee Action:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        actionId: null,
        actionTitle: "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<CommitteeAction>[] = [
    {
      accessorKey: "title",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Title
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "action_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Action Type
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatActionType(getValue() as ActionType)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => {
        const status = getValue() as Status;
        const statusColors: Record<Status, string> = {
          [Status.NEW]: "bg-[#EFF4FF] text-[#2970FF]",
          [Status.IN_PROGRESS]: "bg-[#FEF3C7] text-[#D97706]",
          [Status.BLOCKED]: "bg-[#FEE2E2] text-[#DC2626]",
          [Status.COMPLETED]: "bg-[#ECFDF3] text-[#047857]",
          [Status.CANCELLED]: "bg-[#F2F4F7] text-[#667085]",
        };
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${
              statusColors[status] || "bg-[#F2F4F7] text-[#667085]"
            }`}
          >
            {formatStatus(status)}
          </div>
        );
      },
    },
    {
      accessorKey: "assignee.name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Assignee
        </div>
      ),
      cell: ({ row }) => {
        const assignee = row.original.assignee;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {assignee?.name || "Unknown"}
          </div>
        );
      },
    },
    {
      accessorKey: "due_date",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Due Date
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
      accessorKey: "verification_result",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Verification
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatVerificationResult(getValue() as VerificationResult)}
        </div>
      ),
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
                Committee Actions
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage and track committee actions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/governance/committee-actions/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Action
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={actions}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/governance/committee-actions/${row.id}/details`)
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
                title: "No committee actions found",
                description: "Get started by creating your first committee action",
                action: (
                  <Button
                    onClick={() => router.push("/governance/committee-actions/create")}
                  >
                    Create Action
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
        title="Delete Committee Action"
        description={`Are you sure you want to delete the action "${deleteDialogState.actionTitle}"? This action cannot be undone and will remove the committee action from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default CommitteeActions;

