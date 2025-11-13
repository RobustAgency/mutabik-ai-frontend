"use client";



import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetDatasetSnapshotsQuery, useDeleteDatasetSnapshotMutation, DatasetSnapshot, DatasetSnapshotFilters } from "@/app/lib/features/datasetSnapshotsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const DatasetSnapshotsPage: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = React.useState<DatasetSnapshotFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    snapshotId: string | null;
    snapshotName: string;
  }>({
    isOpen: false,
    snapshotId: null,
    snapshotName: "",
  });

  const [deleteSnapshot, { isLoading: isDeleting }] = useDeleteDatasetSnapshotMutation();
  const { data: snapshots, isLoading } = useGetDatasetSnapshotsQuery(filters);

  const handleDeleteClick = (e: React.MouseEvent, snapshot: DatasetSnapshot) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      snapshotId: snapshot.id,
      snapshotName: snapshot.version_tag,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.snapshotId) {
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

  const columns: ColumnDef<DatasetSnapshot>[] = [
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
            {datasetName || datasetId}
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
      cell: ({ getValue }) => (
        <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2">
          {getValue() as string}
        </div>
      ),
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
          {getValue() ? (getValue() as number).toLocaleString() : "—"}
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
        <CardContent className="flex flex-col flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4E7EC] pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">Dataset Snapshots</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Immutable snapshots for reproducible training/validation</p>
            </div>
            <div className="flex items-center gap-4">
              <DynamicFilter
                filterType="dataset-snapshots"
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(newFilters as DatasetSnapshotFilters)}
              />
              <Button
                onClick={() => router.push("/core-assets/data/snapshots/create")}
                className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Snapshot
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-4">
            <DataTable
              columns={columns}
              data={snapshots ?? []}
              variant="projects"
              loading={isLoading}
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

