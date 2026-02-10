"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetDatasetsQuery, useDeleteDatasetMutation, DatasetFilters, Dataset, Purpose, OwnerTeam, DataSteward, Status, ContainPersonalData } from "@/app/lib/features/datasetsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import { Badge } from "@/components/ui/badge";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

const Datasets: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<DatasetFilters>({});

  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    datasetId: number | null;
    datasetName: string;
  }>({
    isOpen: false,
    datasetId: null,
    datasetName: "",
  });

  const [deleteDataset, { isLoading: isDeleting }] = useDeleteDatasetMutation();

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data: datasetsData, isLoading } = useGetDatasetsQuery(queryParams);
  const datasets = datasetsData?.data || [];
  const pagination = datasetsData?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditClick = (e: React.MouseEvent, dataset: Dataset) => {
    e.stopPropagation();
    router.push(`/core-assets/data/registry/${dataset.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, dataset: Dataset) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      datasetId: dataset.id,
      datasetName: dataset.name,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.datasetId) {
      try {
        await deleteDataset(deleteDialogState.datasetId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          datasetId: null,
          datasetName: "",
        });
      } catch (error) {
        console.error("Failed to delete dataset:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        datasetId: null,
        datasetName: "",
      });
    }
  };

  const formatOwnerTeam = (team: OwnerTeam | string | null) => {
    if (!team) return "N/A";
    return String(team)
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDataSteward = (steward: DataSteward | string | null) => {
    if (!steward) return "N/A";
    return String(steward)
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatPurpose = (purpose: Purpose | string | null) => {
    if (!purpose) return "N/A";
    return String(purpose)
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusBadge = (status: Status | string | null) => {
    if (!status) return <Badge variant="outlined" color="default">N/A</Badge>;
    
    const statusStr = String(status);
    const statusMap: Record<string, { label: string; variant: "filled" | "outlined" | "light"; color: "default" | "success" | "warning" | "error" | "info" }> = {
      [Status.DRAFT]: { label: "Draft", variant: "outlined", color: "default" },
      [Status.ACTIVE]: { label: "Active", variant: "filled", color: "success" },
      [Status.UNDER_REVIEW]: { label: "Under Review", variant: "outlined", color: "info" },
      [Status.DEPRECATED]: { label: "Deprecated", variant: "outlined", color: "default" },
      [Status.ARCHIVED]: { label: "Archived", variant: "outlined", color: "default" },
    };

    const statusInfo = statusMap[statusStr] || { label: statusStr, variant: "outlined" as const, color: "default" as const };
    return <Badge variant={statusInfo.variant} color={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  const getContainsPersonalDataBadge = (containsPersonalData: ContainPersonalData | string | null) => {
    if (!containsPersonalData) return <Badge variant="outlined" color="default">N/A</Badge>;
    
    const value = String(containsPersonalData);
    if (value === ContainPersonalData.YES) {
      return <Badge variant="light" color="error">Yes</Badge>;
    } else if (value === ContainPersonalData.NO) {
      return <Badge variant="outlined" color="default">No</Badge>;
    } else {
      return <Badge variant="outlined" color="default">Unknown</Badge>;
    }
  };

  const columns: ColumnDef<Dataset>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Dataset ID
        </div>
      ),
      cell: ({ getValue, row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string || `DS-${String(row.original.id).padStart(6, '0')}`}
        </div>
      ),
    },
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
      accessorKey: "purpose",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Purpose
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatPurpose(row.original.purpose)}
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
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatOwnerTeam(row.original.owner_team)}
        </div>
      ),
    },
    {
      accessorKey: "data_steward",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Data Steward
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {formatDataSteward(row.original.data_steward)}
        </div>
      ),
    },
    {
      accessorKey: "sensitivity",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Sensitivity
        </div>
      ),
      cell: ({ row }) => {
        const sensitivity = row.original.sensitivity;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {sensitivity || "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "contains_personal_data",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Contains Personal Data
        </div>
      ),
      cell: ({ row }) => getContainsPersonalDataBadge(row.original.contains_personal_data),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ row }) => getStatusBadge(row.original.status),
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
            <PermissionGate permission={PERMISSIONS.DATASETS_EDIT}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => handleEditClick(e, row.original)}
              >
                Edit
              </Button>
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.DATASETS_DELETE}>
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
        <CardContent className="flex flex-col flex-1 py-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">Datasets Registry</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Privacy posture and structure registry for AI eligibility</p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="datasets"
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(newFilters as DatasetFilters)}
              />
              <PermissionGate permission={PERMISSIONS.DATASETS_CREATE}>
                <Button
                  onClick={() => router.push("/core-assets/data/registry/create")}
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  New Dataset
                </Button>
              </PermissionGate>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={datasets ?? []}
              variant="projects"
              loading={isLoading}
              serverSide={true}
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
              onRowClick={(row) =>
                router.push(`/core-assets/data/registry/${row.id}/details`)
              }
              emptyState={{
                title: "No datasets found",
                description: "Get started by creating your first dataset",
                action: (
                  <PermissionGate permission={PERMISSIONS.DATASETS_CREATE}>
                    <Button
                      onClick={() =>
                        router.push("/core-assets/data/registry/create")
                      }
                    >
                      Create Dataset
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
        title="Delete Dataset"
        description={`Are you sure you want to delete "${deleteDialogState.datasetName}"? This action cannot be undone and will remove the dataset from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default Datasets;
