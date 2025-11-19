"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetDatasetSubjectPopulationsQuery, useDeleteDatasetSubjectPopulationMutation, DatasetSubjectPopulationFilters } from "@/app/lib/features/datasetSubjectPopulationApi";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const DatasetSubjectPopulationList = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<DatasetSubjectPopulationFilters>({});
  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    populationId: string | null;
    populationName: string;
  }>({
    isOpen: false,
    populationId: null,
    populationName: "",
  });

  const queryParams = useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data: populationData, isLoading } = useGetDatasetSubjectPopulationsQuery(queryParams);
  const [deletePopulation, { isLoading: isDeleting }] = useDeleteDatasetSubjectPopulationMutation();

  const handleEditClick = (e: React.MouseEvent, population: any) => {
    e.stopPropagation();
    router.push(`/core-assets/data/subject-population/${population.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, population: any) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      populationId: String(population.id),
      populationName: `${population.dataset?.name || 'Dataset'} - ${population.subject_realm}`,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.populationId) {
      try {
        await deletePopulation(deleteDialogState.populationId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          populationId: null,
          populationName: "",
        });
      } catch (error) {
        console.error("Failed to delete dataset subject population:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        populationId: null,
        populationName: "",
      });
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Subject Population ID
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "dataset",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Dataset
        </div>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">{row.original.dataset?.name || "—"}</p>
          <p className="font-sans font-normal text-xs leading-4 tracking-normal text-[#667085]">ID: {row.original.dataset_id}</p>
        </div>
      ),
    },
    {
      accessorKey: "snapshot",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Snapshot
        </div>
      ),
      cell: ({ row }) => (
        row.original.snapshot ? (
          <div>
            <p className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">{row.original.snapshot.version_tag}</p>
            <p className="font-sans font-normal text-xs leading-4 tracking-normal text-[#667085]">ID: {row.original.snapshot_id}</p>
          </div>
        ) : (
          <span className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">—</span>
        )
      ),
    },
    {
      accessorKey: "subject_realm",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Subject Realm
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "jurisdiction",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Jurisdiction
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "subjects_total",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Total Subjects
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-semibold text-sm leading-5 tracking-normal text-[#039855]">
          {(getValue() as number).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "as_of",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          As Of
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
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">Dataset Subject Population</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Denominator facts by dataset/snapshot/realm/jurisdiction</p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="dataset-subject-populations"
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters as DatasetSubjectPopulationFilters);
                  setCurrentPage(1); // Reset to first page when filters change
                }}
              />
              <Button
                onClick={() => router.push("/core-assets/data/subject-population/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                + Add Population Record
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-4">
            <DataTable
              columns={columns}
              data={populationData?.data || []}
              variant="projects"
              loading={isLoading}
              onRowClick={(population) => router.push(`/core-assets/data/subject-population/${population.id}/details`)}
              pagination={
                populationData
                  ? {
                    page: populationData.current_page,
                    limit: populationData.per_page,
                    total: populationData.total,
                    totalPages: populationData.last_page,
                  }
                  : undefined
              }
              onPageChange={setCurrentPage}
              emptyState={{
                title: "No population records found",
                description: "Population records define subject counts by dataset, snapshot, realm, and jurisdiction",
              }}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Dataset Subject Population"
        description={`Are you sure you want to delete population record "${deleteDialogState.populationName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default DatasetSubjectPopulationList;

