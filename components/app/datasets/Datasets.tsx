"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetDatasetsQuery, useDeleteDatasetMutation, DatasetFilters } from "@/app/lib/features/datasetsApi";
import { Dataset } from "@/app/lib/features/datasetsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const Datasets: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = React.useState<DatasetFilters>({});

  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    datasetId: string | null;
    datasetName: string;
  }>({
    isOpen: false,
    datasetId: null,
    datasetName: "",
  });

  const [deleteDataset, { isLoading: isDeleting }] = useDeleteDatasetMutation();

  const { data: datasets, isLoading } = useGetDatasetsQuery(filters);

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

  const columns: ColumnDef<Dataset>[] = [
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
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
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
      cell: ({ getValue }) => {
        const sensitivity = getValue() as string;
        return (
          <div className="h-[24px] flex items-center justify-center rounded-full bg-[#FEF3F2] text-[#F04438] text-xs font-medium px-2">
            {sensitivity}
          </div>
        );
      },
    },
    {
      accessorKey: "contains_pii",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Contains PII
        </div>
      ),
      cell: ({ getValue }) => {
        const containsPii = getValue() as string;
        return (
          <div className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${containsPii === "Yes" ? "bg-[#FEF3F2] text-[#F04438]" : "bg-[#F2F4F7] text-[#667085]"
            }`}>
            {containsPii}
          </div>
        );
      },
    },
    {
      accessorKey: "lawful_basis",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Lawful Basis
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {(getValue() as string) || "—"}
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4E7EC] pb-4">
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
              <Button
                onClick={() => router.push("/core-assets/data/registry/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Dataset
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-4">
            <DataTable
              columns={columns}
              data={datasets ?? []}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/core-assets/data/registry/${row.id}/details`)
              }
              emptyState={{
                title: "No datasets found",
                description: "Get started by creating your first dataset",
                action: (
                  <Button
                    onClick={() =>
                      router.push("/core-assets/data/registry/create")
                    }
                  >
                    Create Dataset
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

