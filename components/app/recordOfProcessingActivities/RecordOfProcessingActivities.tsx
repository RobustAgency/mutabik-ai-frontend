"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetRecordOfProcessingActivitiesQuery,
  useDeleteRecordOfProcessingActivityMutation,
} from "@/app/lib/features/recordOfProcessingActivitiesApi";
import type {
  RecordOfProcessingActivity,
  ROPAFilters,
} from "@/interfaces/RecordOfProcessingActivity";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

const formatDate = (dateString: string | null | undefined): string =>
  formatDateShort(dateString);

const formatFieldValue = (value: string | null | undefined): string => {
  if (!value) return "N/A";
  // Handle special cases
  if (value === "ai/ml") return "AI/ML";
  if (value === "us_ca") return "US/CA";
  // Convert snake_case to Title Case
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const RecordOfProcessingActivities: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<ROPAFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    activityId: number | null;
    activityName: string;
  }>({
    isOpen: false,
    activityId: null,
    activityName: "",
  });

  const queryParams = React.useMemo(
    () => ({
      ...filters,
      page: currentPage,
      per_page: 15,
    }),
    [filters, currentPage]
  );

  const { data, isLoading } =
    useGetRecordOfProcessingActivitiesQuery(queryParams);
  const [deleteActivity, { isLoading: isDeleting }] =
    useDeleteRecordOfProcessingActivityMutation();

  const activities = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEditClick = (
    e: React.MouseEvent,
    activity: RecordOfProcessingActivity
  ) => {
    e.stopPropagation();
    router.push(`/privacy/ropa/${activity.id}/edit`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    activity: RecordOfProcessingActivity
  ) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      activityId: activity.id,
      activityName: activity.activity_name,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.activityId) {
      try {
        await deleteActivity(deleteDialogState.activityId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          activityId: null,
          activityName: "",
        });
      } catch (error) {
        console.error("Failed to delete processing activity:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        activityId: null,
        activityName: "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<RecordOfProcessingActivity>[] = [
    {
      accessorKey: "activity_name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Activity Name
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "purpose",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Purpose
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085] max-w-md truncate">
          {getValue() as string}
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
          {formatFieldValue(getValue() as string)}
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
        const code = (getValue() as string) || "";
        const labelMap: Record<string, string> = {
          draft: "Draft",
          active: "Active",
          under_review: "Under Review",
          archived: "Archived",
        };
        const statusColors: Record<string, string> = {
          draft: "bg-[#F2F4F7] text-[#667085]",
          active: "bg-[#ECFDF3] text-[#047857]",
          under_review: "bg-[#FEF3C7] text-[#D97706]",
          archived: "bg-[#F3F4F6] text-[#6B7280]",
        };
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${
              statusColors[code] || "bg-[#F2F4F7] text-[#667085]"
            }`}
          >
            {labelMap[code] || code}
          </div>
        );
      },
    },
    {
      accessorKey: "next_review_date",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Next Review
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
            <PermissionGate permission={PERMISSIONS.ROPA_EDIT}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => handleEditClick(e, row.original)}
              >
                Edit
              </Button>
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.ROPA_DELETE}>
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
                Record of Processing Activities
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage and track data processing activities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <PermissionGate permission={PERMISSIONS.ROPA_CREATE}>
                <Button
                  onClick={() => router.push("/privacy/ropa/create")}
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  New Activity
                </Button>
              </PermissionGate>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={activities}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/privacy/ropa/${row.id}/details`)
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
                title: "No processing activities found",
                description: "Get started by creating your first processing activity",
                action: (
                  <PermissionGate permission={PERMISSIONS.ROPA_CREATE}>
                    <Button
                      onClick={() => router.push("/privacy/ropa/create")}
                    >
                      Create Activity
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
        title="Delete Processing Activity"
        description={`Are you sure you want to delete "${deleteDialogState.activityName}"? This action cannot be undone and will remove the processing activity from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default RecordOfProcessingActivities;

