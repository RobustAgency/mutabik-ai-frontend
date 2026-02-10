"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetDataProtectionImpactAssessmentsQuery,
  useDeleteDataProtectionImpactAssessmentMutation,
} from "@/app/lib/features/dataProtectionImpactAssessmentsApi";
import type {
  DataProtectionImpactAssessment,
  DPIAFilters,
} from "@/interfaces/DataProtectionImpactAssessment";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

const formatFieldValue = (value: string | null | undefined): string => {
  if (!value) return "N/A";
  if (value === "us_ca") return "US/CA";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const DPIAList: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<DPIAFilters>({});
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
    useGetDataProtectionImpactAssessmentsQuery(queryParams);
  const [deleteDPIA, { isLoading: isDeleting }] =
    useDeleteDataProtectionImpactAssessmentMutation();

  const records = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEditClick = (
    e: React.MouseEvent,
    dpia: DataProtectionImpactAssessment
  ) => {
    e.stopPropagation();
    router.push(`/privacy/dpia/${dpia.id}/edit`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    dpia: DataProtectionImpactAssessment
  ) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      id: dpia.id,
      code: dpia.dpia_code,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.id) {
      try {
        await deleteDPIA(deleteDialogState.id).unwrap();
        setDeleteDialogState({
          isOpen: false,
          id: null,
          code: "",
        });
      } catch (error) {
        console.error("Failed to delete DPIA:", error);
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

  const columns: ColumnDef<DataProtectionImpactAssessment>[] = [
    {
      accessorKey: "dpia_code",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          DPIA Code
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "dpia_name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Name
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "risk_level",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Risk Level
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatFieldValue(getValue() as string)}
        </div>
      ),
    },
    {
      accessorKey: "stage",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Stage
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
      accessorKey: "next_review_date",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Next Review
        </div>
      ),
      cell: ({ getValue }) => {
        const rawDate = getValue() as string | null;
        const formatted = formatDateShort(rawDate);
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {formatted || "N/A"}
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
            <PermissionGate permission={PERMISSIONS.DPIA_EDIT}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => handleEditClick(e, row.original)}
              >
                Edit
              </Button>
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.DPIA_DELETE}>
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
                Data Protection Impact Assessments
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage DPIAs lifecycle and risk assessments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <PermissionGate permission={PERMISSIONS.DPIA_CREATE}>
                <Button
                  onClick={() => router.push("/privacy/dpia/create")}
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  New DPIA
                </Button>
              </PermissionGate>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={records}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) => router.push(`/privacy/dpia/${row.id}/details`)}
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
                title: "No DPIAs found",
                description:
                  "Get started by creating your first Data Protection Impact Assessment",
                action: (
                  <PermissionGate permission={PERMISSIONS.DPIA_CREATE}>
                    <Button onClick={() => router.push("/privacy/dpia/create")}>
                      Create DPIA
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
        title="Delete DPIA"
        description={`Are you sure you want to delete "${deleteDialogState.code}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default DPIAList;


