"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetDatasetSnapshotsQuery, useDeleteDatasetSnapshotMutation, DatasetSnapshot, DatasetSnapshotFilters, ResidencyZone, Status, FileFormat } from "@/app/lib/features/datasetSnapshotsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import { Badge } from "@/components/ui/badge";

const DatasetSnapshotsPage: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<DatasetSnapshotFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    snapshotId: number | null;
    snapshotName: string;
  }>({
    isOpen: false,
    snapshotId: null,
    snapshotName: "",
  });

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data: snapshotsData, isLoading } = useGetDatasetSnapshotsQuery(queryParams);
  const snapshots = snapshotsData?.data || [];
  const pagination = snapshotsData?.pagination;
  const [deleteSnapshot, { isLoading: isDeleting }] = useDeleteDatasetSnapshotMutation();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (e: React.MouseEvent, snapshot: DatasetSnapshot) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      snapshotId: snapshot.id,
      snapshotName: snapshot.version_tag,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.snapshotId !== null) {
      try {
        await deleteSnapshot(deleteDialogState.snapshotId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          snapshotId: null,
          snapshotName: "",
        });
      } catch (error) {
        console.error("Failed to delete snapshot:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        snapshotId: null,
        snapshotName: "",
      });
    }
  };

  const getStatusBadge = (status: Status | string | null) => {
    if (!status) return <Badge variant="outlined" color="default">N/A</Badge>;
    
    const statusStr = String(status);
    const statusMap: Record<string, { label: string; variant: "filled" | "outlined" | "light"; color: "default" | "success" | "warning" | "error" | "info" }> = {
      [Status.ACTIVE]: { label: "Active", variant: "filled", color: "success" },
      [Status.DEPRECATED]: { label: "Deprecated", variant: "outlined", color: "warning" },
      [Status.ARCHIVED]: { label: "Archived", variant: "outlined", color: "default" },
    };

    const statusInfo = statusMap[statusStr] || { label: statusStr.charAt(0).toUpperCase() + statusStr.slice(1), variant: "outlined" as const, color: "default" as const };
    return <Badge variant={statusInfo.variant} color={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  const getResidencyZoneBadge = (zone: ResidencyZone | string | null) => {
    if (!zone) return <Badge variant="outlined" color="default">N/A</Badge>;
    
    const zoneStr = String(zone);
    const variant: "filled" | "outlined" | "light" = "light";
    let colorClass = "text-gray-700 bg-gray-100";

    switch (zoneStr) {
      case ResidencyZone.EU:
      case ResidencyZone.UK:
        colorClass = "text-blue-700 bg-blue-100";
        break;
      case ResidencyZone.US:
        colorClass = "text-indigo-700 bg-indigo-100";
        break;
      case ResidencyZone.KSA:
      case ResidencyZone.AE:
      case ResidencyZone.QA:
      case ResidencyZone.JO:
      case ResidencyZone.MA:
      case ResidencyZone.BH:
        colorClass = "text-green-700 bg-green-100";
        break;
      case ResidencyZone.OTHER:
        colorClass = "text-purple-700 bg-purple-100";
        break;
      default:
        colorClass = "text-gray-700 bg-gray-100";
        break;
    }

    return <Badge variant={variant} className={colorClass}>{zoneStr}</Badge>;
  };

  const columns: ColumnDef<DatasetSnapshot>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Snapshot ID
        </div>
      ),
      cell: ({ getValue, row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string || `DSN-${String(row.original.id).padStart(6, '0')}`}
        </div>
      ),
    },
    {
      accessorKey: "version_tag",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Version Tag
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "dataset_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Dataset
        </div>
      ),
      cell: ({ row }) => {
        const datasetName = row.original.dataset?.name;
        const datasetId = row.original.dataset_id;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {datasetName || `Dataset ${datasetId}`}
          </div>
        );
      },
    },
    {
      accessorKey: "residency_zone",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Residency Zone
        </div>
      ),
      cell: ({ row }) => getResidencyZoneBadge(row.original.residency_zone),
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
      accessorKey: "row_count",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Row Count
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() ? (getValue() as number).toLocaleString() : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Created At
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {new Date(getValue() as string).toLocaleDateString()}
        </div>
      ),
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
        <CardContent className="flex flex-col flex-1 py-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">Dataset Snapshots</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Immutable snapshots for reproducible training/validation</p>
            </div>
            <div className="flex items-center gap-4">
              <DynamicFilter
                filterType="dataset-snapshots"
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters as DatasetSnapshotFilters);
                  setCurrentPage(1); // Reset to first page when filters change
                }}
              />
              <Button
                onClick={() => router.push("/core-assets/data/snapshots/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Snapshot
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-4">
            <DataTable
              columns={columns}
              data={snapshots}
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
              onRowClick={(row) => router.push(`/core-assets/data/snapshots/${row.id}`)}
              emptyState={{
                title: "No snapshots found",
                description: "Snapshots are created automatically when datasets are versioned",
              }}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Snapshot"
        description={`Are you sure you want to delete snapshot "${deleteDialogState.snapshotName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default DatasetSnapshotsPage;
