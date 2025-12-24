"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetRegulatorySubmissionsQuery,
  useDeleteRegulatorySubmissionMutation,
} from "@/app/lib/features/regulatorySubmissionsApi";
import type {
  RegulatorySubmission,
  RegulatorySubmissionFilters,
  RegulatorySubmissionStatusEnum,
  RegulatorySubmissionTypeEnum,
} from "@/interfaces/RegulatorySubmission";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";

const formatDate = (dateString: string | null | undefined): string =>
  formatDateShort(dateString);

const formatFieldValue = (value: string | null | undefined): string => {
  if (!value) return "N/A";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const RegulatorySubmissions: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<RegulatorySubmissionFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    id: number | null;
    label: string;
  }>({
    isOpen: false,
    id: null,
    label: "",
  });

  const queryParams = React.useMemo(
    () => ({
      ...filters,
      page: currentPage,
      per_page: 15,
    }),
    [filters, currentPage]
  );

  const { data, isLoading } = useGetRegulatorySubmissionsQuery(queryParams);
  const [deleteSubmission, { isLoading: isDeleting }] =
    useDeleteRegulatorySubmissionMutation();

  const submissions = data?.data ?? [];
  const pagination = data?.meta;

  const handleEditClick = (
    e: React.MouseEvent,
    item: RegulatorySubmission
  ) => {
    e.stopPropagation();
    router.push(`/regulatory-submissions/${item.id}/edit`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    item: RegulatorySubmission
  ) => {
    e.stopPropagation();
    const label = item.tracking_id || item.authority || `Submission #${item.id}`;
    setDeleteDialogState({
      isOpen: true,
      id: item.id,
      label,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.id) {
      try {
        await deleteSubmission(deleteDialogState.id).unwrap();
        setDeleteDialogState({
          isOpen: false,
          id: null,
          label: "",
        });
      } catch (error) {
        console.error("Failed to delete regulatory submission:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        id: null,
        label: "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<RegulatorySubmission>[] = [
    {
      accessorKey: "authority",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Authority
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "tracking_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Tracking ID
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "submission_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Type
        </div>
      ),
      cell: ({ getValue }) => {
        const type = (getValue() as RegulatorySubmissionTypeEnum) || "";
        const label = formatFieldValue(type);
        return (
          <div className="h-[24px] px-3 flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium capitalize">
            {label}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => {
        const status = (getValue() as RegulatorySubmissionStatusEnum) || "";
        const label = formatFieldValue(status);
        const colorMap: Record<RegulatorySubmissionStatusEnum, string> = {
          draft: "bg-gray-100 text-gray-700",
          submitted: "bg-blue-100 text-blue-700",
          acknowledged: "bg-purple-100 text-purple-700",
          approved: "bg-green-100 text-green-700",
          rejected: "bg-red-100 text-red-700",
          closed: "bg-gray-200 text-gray-700",
        };
        return (
          <div
            className={`h-[24px] px-3 flex items-center justify-center rounded-full text-xs font-medium capitalize ${colorMap[status] || "bg-gray-100 text-gray-700"}`}
          >
            {label}
          </div>
        );
      },
    },
    {
      accessorKey: "renewal_due_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Renewal Due
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
      accessorKey: "submitted_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Submitted At
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
                Regulatory Submissions
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage regulatory submissions and compliance filings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/regulatory-submissions/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Submission
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={submissions}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/regulatory-submissions/${row.id}/details`)
              }
              pagination={
                pagination
                  ? {
                      page: pagination.current_page,
                      limit: pagination.per_page,
                      total: pagination.total,
                      totalPages: pagination.last_page || 1,
                    }
                  : undefined
              }
              onPageChange={handlePageChange}
              emptyState={{
                title: "No regulatory submissions found",
                description: "Get started by creating your first regulatory submission",
                action: (
                  <Button
                    onClick={() => router.push("/regulatory-submissions/create")}
                  >
                    Create Submission
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
        title="Delete Regulatory Submission"
        description={`Are you sure you want to delete "${deleteDialogState.label}"? This action cannot be undone and will remove the submission from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default RegulatorySubmissions;

