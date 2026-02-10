"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetAiCommitteesQuery,
  useDeleteAiCommitteeMutation,
} from "@/app/lib/features/aiCommitteesApi";
import type {
  AiCommittee,
  AiCommitteeFilters,
} from "@/interfaces/AiCommittee";
import {
  AiCommitteeType,
  AiCommitteeCadence,
} from "@/interfaces/AiCommittee";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

const formatDate = (dateString: string | null | undefined): string =>
  formatDateShort(dateString);

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

const AiCommittees: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<AiCommitteeFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    committeeId: number | null;
    committeeName: string;
  }>({
    isOpen: false,
    committeeId: null,
    committeeName: "",
  });

  const queryParams = React.useMemo(
    () => ({
      ...filters,
      page: currentPage,
      per_page: 15,
    }),
    [filters, currentPage]
  );

  const { data, isLoading } = useGetAiCommitteesQuery(queryParams);
  const [deleteCommittee, { isLoading: isDeleting }] =
    useDeleteAiCommitteeMutation();

  const committees = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEditClick = (
    e: React.MouseEvent,
    committee: AiCommittee
  ) => {
    e.stopPropagation();
    router.push(`/governance/ai-committees/${committee.id}/edit`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    committee: AiCommittee
  ) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      committeeId: committee.id,
      committeeName: committee.name,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.committeeId) {
      try {
        await deleteCommittee(deleteDialogState.committeeId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          committeeId: null,
          committeeName: "",
        });
      } catch (error) {
        console.error("Failed to delete AI Committee:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        committeeId: null,
        committeeName: "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<AiCommittee>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Name
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Type
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatType(getValue() as AiCommitteeType)}
        </div>
      ),
    },
    {
      accessorKey: "cadence",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Cadence
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatCadence(getValue() as AiCommitteeCadence)}
        </div>
      ),
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
      accessorKey: "active",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => {
        const isActive = getValue() as boolean;
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${
              isActive
                ? "bg-[#ECFDF3] text-[#047857]"
                : "bg-[#F2F4F7] text-[#667085]"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
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
            <PermissionGate permission={PERMISSIONS.AI_COMMITTEES_EDIT}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => handleEditClick(e, row.original)}
              >
                Edit
              </Button>
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.AI_COMMITTEES_DELETE}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => handleDeleteClick(e, row.original)}
              >
                Remove
              </Button>
            </PermissionGate>
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
                AI Committees
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage and track AI governance committees
              </p>
            </div>
            <div className="flex items-center gap-3">
              <PermissionGate permission={PERMISSIONS.AI_COMMITTEES_CREATE}>
                <Button
                  onClick={() => router.push("/governance/ai-committees/create")}
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  New Committee
                </Button>
              </PermissionGate>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={committees}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/governance/ai-committees/${row.id}/details`)
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
                title: "No AI committees found",
                description: "Get started by creating your first AI committee",
                action: (
                  <PermissionGate permission={PERMISSIONS.AI_COMMITTEES_CREATE}>
                    <Button
                      onClick={() => router.push("/governance/ai-committees/create")}
                    >
                      Create Committee
                    </Button>
                  </PermissionGate>
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
        title="Delete AI Committee"
        description={`Are you sure you want to delete "${deleteDialogState.committeeName}"? This action cannot be undone and will remove the AI committee from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default AiCommittees;

