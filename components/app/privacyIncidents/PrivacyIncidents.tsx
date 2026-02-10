"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetPrivacyIncidentsQuery,
  useDeletePrivacyIncidentMutation,
} from "@/app/lib/features/privacyIncidentsApi";
import type {
  PrivacyIncident,
  PrivacyIncidentFilters,
} from "@/interfaces/PrivacyIncident";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

const formatDate = (dateString: string | null | undefined): string =>
  formatDateShort(dateString);

const formatFieldValue = (value: string | null | undefined): string => {
  if (!value) return "N/A";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const PrivacyIncidents: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<PrivacyIncidentFilters>({});
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

  const { data, isLoading } = useGetPrivacyIncidentsQuery(queryParams);
  const [deleteIncident, { isLoading: isDeleting }] =
    useDeletePrivacyIncidentMutation();

  const incidents = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEditClick = (
    e: React.MouseEvent,
    item: PrivacyIncident
  ) => {
    e.stopPropagation();
    router.push(`/privacy/privacy-incidents/${item.id}/edit`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    item: PrivacyIncident
  ) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      id: item.id,
      code: item.incident_code,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.id) {
      try {
        await deleteIncident(deleteDialogState.id).unwrap();
        setDeleteDialogState({
          isOpen: false,
          id: null,
          code: "",
        });
      } catch (error) {
        console.error("Failed to delete privacy incident:", error);
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

  const columns: ColumnDef<PrivacyIncident>[] = [
    {
      accessorKey: "incident_code",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Incident Code
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "incident_title",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Title
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "incident_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Type
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatFieldValue(getValue() as string)}
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
      cell: ({ getValue }) => {
        const level = (getValue() as string) || "";
        const label = formatFieldValue(level);
        const colorClass =
          level === "severe"
            ? "bg-red-100 text-red-700"
            : level === "high"
            ? "bg-orange-100 text-orange-700"
            : level === "medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700";
        return (
          <div
            className={`h-[24px] px-3 flex items-center justify-center rounded-full text-xs font-medium capitalize ${colorClass}`}
          >
            {label}
          </div>
        );
      },
    },
    {
      accessorKey: "is_breach",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Breach
        </div>
      ),
      cell: ({ getValue }) => {
        const isBreach = getValue() as boolean;
        return (
          <div
            className={`h-[24px] px-3 flex items-center justify-center rounded-full text-xs font-medium ${
              isBreach
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {isBreach ? "Yes" : "No"}
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
      accessorKey: "detected_date",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Detected Date
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
            <PermissionGate permission={PERMISSIONS.PRIVACY_INCIDENTS_EDIT}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => handleEditClick(e, row.original)}
              >
                Edit
              </Button>
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.PRIVACY_INCIDENTS_DELETE}>
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
                Privacy Incidents
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage privacy and data breach incidents
              </p>
            </div>
            <div className="flex items-center gap-3">
              <PermissionGate permission={PERMISSIONS.PRIVACY_INCIDENTS_CREATE}>
                <Button
                  onClick={() => router.push("/privacy/privacy-incidents/create")}
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  New Incident
                </Button>
              </PermissionGate>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={incidents}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/privacy/privacy-incidents/${row.id}/details`)
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
                title: "No privacy incidents found",
                description: "Get started by creating your first privacy incident",
                action: (
                  <PermissionGate permission={PERMISSIONS.PRIVACY_INCIDENTS_CREATE}>
                    <Button
                      onClick={() => router.push("/privacy/privacy-incidents/create")}
                    >
                      Create Incident
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
        title="Delete Privacy Incident"
        description={`Are you sure you want to delete "${deleteDialogState.code}"? This action cannot be undone and will remove the incident from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default PrivacyIncidents;

