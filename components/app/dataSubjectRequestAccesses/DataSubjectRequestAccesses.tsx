"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetDataSubjectRequestAccessesQuery,
  useDeleteDataSubjectRequestAccessMutation,
} from "@/app/lib/features/dataSubjectRequestAccessesApi";
import type {
  DataSubjectRequestAccess,
  DSARFilters,
} from "@/interfaces/DataSubjectRequestAccess";
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

const DataSubjectRequestAccesses: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<DSARFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    id: number | null;
    code: string;
  }>({
    isOpen: false,
    id: null,
    code: "",
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
    useGetDataSubjectRequestAccessesQuery(queryParams);
  const [deleteRequest, { isLoading: isDeleting }] =
    useDeleteDataSubjectRequestAccessMutation();

  const requests = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEditClick = (
    e: React.MouseEvent,
    item: DataSubjectRequestAccess
  ) => {
    e.stopPropagation();
    router.push(`/privacy/dsar/${item.id}/edit`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    item: DataSubjectRequestAccess
  ) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      id: item.id,
      code: item.request_code,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.id) {
      try {
        await deleteRequest(deleteDialogState.id).unwrap();
        setDeleteDialogState({
          isOpen: false,
          id: null,
          code: "",
        });
      } catch (error) {
        console.error("Failed to delete DSAR:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        id: null,
        code: "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<DataSubjectRequestAccess>[] = [
    {
      accessorKey: "request_code",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Request Code
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "subject_identifier",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Subject Identifier
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "request_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Request Type
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
        const label = formatFieldValue(code);
        return (
          <div className="h-[24px] px-3 flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium capitalize">
            {label}
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Priority
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatFieldValue(getValue() as string)}
        </div>
      ),
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
      accessorKey: "remaining_days",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Remaining Days
        </div>
      ),
      cell: ({ getValue }) => {
        const value = getValue() as number | null | undefined;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {value != null ? String(value) : "N/A"}
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
                Data Subject Request Accesses
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage DSAR requests lifecycle
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Filters can be wired later, keeping space for DynamicFilter */}
              <Button
                onClick={() => router.push("/privacy/dsar/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New DSAR
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={requests}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) => router.push(`/privacy/dsar/${row.id}/details`)}
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
                title: "No DSAR requests found",
                description: "Get started by creating your first DSAR request",
                action: (
                  <Button onClick={() => router.push("/privacy/dsar/create")}>
                    Create DSAR
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
        title="Delete DSAR Request"
        description={`Are you sure you want to delete "${deleteDialogState.code}"? This action cannot be undone and will remove the request from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default DataSubjectRequestAccesses;


