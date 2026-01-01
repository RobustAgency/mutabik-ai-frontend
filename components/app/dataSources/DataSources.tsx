"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetDataSourcesQuery, useDeleteDataSourceMutation, DataSourceFilters, DataSourceStatus, OwnerTeam } from "@/app/lib/features/dataSourcesApi";
import { DataSource } from "@/app/lib/features/dataSourcesApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import { Badge } from "@/components/ui/badge";

const DataSources: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<DataSourceFilters>({});

  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    dataSourceId: number | null;
    dataSourceName: string;
  }>({
    isOpen: false,
    dataSourceId: null,
    dataSourceName: "",
  });

  const [deleteDataSource, { isLoading: isDeleting }] = useDeleteDataSourceMutation();

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data, isLoading } = useGetDataSourcesQuery(queryParams);
  const dataSources = data?.data || [];
  const pagination = data?.pagination;

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const getStatusBadge = (status: DataSourceStatus | null) => {
    if (!status) {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          N/A
        </Badge>
      );
    }

    const statusColors: Record<DataSourceStatus, string> = {
      [DataSourceStatus.DRAFT]: "bg-gray-100 text-gray-800",
      [DataSourceStatus.ACTIVE]: "bg-green-100 text-green-800",
      [DataSourceStatus.UNDER_REVIEW]: "bg-yellow-100 text-yellow-800",
      [DataSourceStatus.DEPRECATED]: "bg-orange-100 text-orange-800",
      [DataSourceStatus.ARCHIVED]: "bg-slate-100 text-slate-800",
    };

    const statusLabels: Record<DataSourceStatus, string> = {
      [DataSourceStatus.DRAFT]: "Draft",
      [DataSourceStatus.ACTIVE]: "Active",
      [DataSourceStatus.UNDER_REVIEW]: "Under Review",
      [DataSourceStatus.DEPRECATED]: "Deprecated",
      [DataSourceStatus.ARCHIVED]: "Archived",
    };

    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  const formatOwnerTeam = (team: OwnerTeam | string | null) => {
    if (!team) return "N/A";
    return String(team)
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const columns: ColumnDef<DataSource>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Data Source ID
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.display_id || `DS-${String(row.original.id).padStart(6, "0")}`}
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
      accessorKey: "data_domains",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Data Domains
        </div>
      ),
      cell: ({ row }) => {
        const domains = row.original.data_domains || [];
        if (domains.length === 0) {
          return (
            <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
              N/A
            </div>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {domains.slice(0, 2).map((domain, index) => (
              <Badge key={index} variant="outlined" className="text-xs">
                {domain.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
            ))}
            {domains.length > 2 && (
              <Badge variant="outlined" className="text-xs">
                +{domains.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "residency",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Residency
        </div>
      ),
      cell: ({ getValue }) => {
        const residency = (getValue() as string)?.toUpperCase() || "N/A";
        return (
          <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2">
            {residency}
          </div>
        );
      },
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
      accessorKey: "criticality_level",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Criticality Level
        </div>
      ),
      cell: ({ getValue }) => {
        const level = getValue() as string | null;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {level ? level.charAt(0).toUpperCase() + level.slice(1) : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "hosting_model",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Hosting
        </div>
      ),
      cell: ({ getValue }) => {
        const model = getValue() as string;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {model.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Data Source
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={dataSources ?? []}
              variant="projects"
              loading={isLoading}
              serverSide={true}
              onRowClick={(row) =>
                router.push(`/core-assets/data/sources/${row.id}/details`)
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

