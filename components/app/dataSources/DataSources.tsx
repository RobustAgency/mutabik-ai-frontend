"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetDataSourcesQuery, useDeleteDataSourceMutation, DataSourceFilters } from "@/app/lib/features/dataSourcesApi";
import { DataSource } from "@/app/lib/features/dataSourcesApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const DataSources: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = React.useState<DataSourceFilters>({});

  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    dataSourceId: string | null;
    dataSourceName: string;
  }>({
    isOpen: false,
    dataSourceId: null,
    dataSourceName: "",
  });

  const [deleteDataSource, { isLoading: isDeleting }] = useDeleteDataSourceMutation();

  const { data: dataSources, isLoading } = useGetDataSourcesQuery(filters);

  const handleEditClick = (e: React.MouseEvent, dataSource: DataSource) => {
    e.stopPropagation(); // Prevent row click navigation
    router.push(`/core-assets/data/sources/${dataSource.id}/edit`);
  };

  // Handler for delete button click
  const handleDeleteClick = (e: React.MouseEvent, dataSource: DataSource) => {
    e.stopPropagation(); // Prevent row click navigation
    setDeleteDialogState({
      isOpen: true,
      dataSourceId: dataSource.id,
      dataSourceName: dataSource.name,
    });
  };

  // Handler for confirm delete
  const handleConfirmDelete = async () => {
    if (deleteDialogState.dataSourceId) {
      try {
        await deleteDataSource(deleteDialogState.dataSourceId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          dataSourceId: null,
          dataSourceName: "",
        });
      } catch (error) {
        console.error("Failed to delete data source:", error);
      }
    }
  };

  // Handler for cancel delete
  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        dataSourceId: null,
        dataSourceName: "",
      });
    }
  };

  const columns: ColumnDef<DataSource>[] = [
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
      accessorKey: "system_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          System Type
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "residency",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Residency
        </div>
      ),
      cell: ({ getValue }) => {
        const residency = getValue() as string;
        return (
          <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2">
            {residency}
          </div>
        );
      },
    },
    {
      accessorKey: "classification",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Classification
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "hosting_model",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Hosting
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "cloud_provider",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Cloud Provider
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
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">Data Sources</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Systems of record for dataset lineage and hosting guardrails</p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="data-sources"
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(newFilters as DataSourceFilters)}
              />
              <Button
                onClick={() => router.push("/core-assets/data/sources/create")}
                className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Data Source
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-4">
            <DataTable
              columns={columns}
              data={dataSources ?? []}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) =>
                router.push(`/core-assets/data/sources/${row.id}/details`)
              }
              emptyState={{
                title: "No data sources found",
                description: "Get started by creating your first data source",
                action: (
                  <Button
                    onClick={() =>
                      router.push("/core-assets/data/sources/create")
                    }
                  >
                    Create Data Source
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
        title="Delete Data Source"
        description={`Are you sure you want to delete "${deleteDialogState.dataSourceName}"? This action cannot be undone and will remove the data source from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default DataSources;

