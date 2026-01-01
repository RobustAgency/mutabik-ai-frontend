"use client";



import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetModelDatasetLinksQuery, ModelDatasetLink, ModelDatasetLinkFilters, Role } from "@/app/lib/features/modelDatasetLinksApi";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import { Badge } from "@/components/ui/badge";

const ModelDatasetLinksPage: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<ModelDatasetLinkFilters>({});

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data: linksData, isLoading } = useGetModelDatasetLinksQuery(queryParams);
  const links = linksData?.data || [];
  const pagination = linksData?.pagination;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const columns: ColumnDef<ModelDatasetLink>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Model-Dataset Link ID
        </div>
      ),
      cell: ({ getValue, row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string || `MDL-${String(row.original.id).padStart(6, '0')}`}
        </div>
      ),
    },
    {
      accessorKey: "ai_model_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Model
        </div>
      ),
      cell: ({ row }) => {
        const modelName = row.original.ai_model?.name;
        const modelId = row.original.ai_model_id;
        return (
          <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
            {modelName || modelId}
          </div>
        );
      },
    },
    {
      accessorKey: "ai_model_version_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Version
        </div>
      ),
      cell: ({ row }) => {
        const versionNumber = row.original.ai_model_version?.version_number;
        const versionId = row.original.ai_model_version_id;
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {versionNumber || versionId}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Role
        </div>
      ),
      cell: ({ getValue }) => {
        const role = getValue() as Role | string;
        const roleStr = String(role);
        const roleLabel = roleStr.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        return (
          <Badge variant="light" color="info" className="capitalize">
            {roleLabel}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dataset_snapshot_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Snapshot
        </div>
      ),
      cell: ({ row }) => {
        const snapshotVersion = row.original.dataset_snapshot?.version_tag;
        const snapshotId = row.original.dataset_snapshot_id;
        const datasetName = row.original.dataset?.name;

        if (!snapshotId) {
          return <span className="text-[#667085]">—</span>;
        }

        // Show version tag if available, otherwise show ID, with dataset name if available
        const displayValue = snapshotVersion || snapshotId;
        const prefix = datasetName ? `${datasetName} - ` : "";

        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {prefix}{displayValue}
          </div>
        );
      },
    },
    {
      accessorKey: "linkage_status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => {
        const status = getValue() as string | null;
        if (!status) return <span className="text-[#667085]">—</span>;
        const statusMap: Record<string, { label: string; variant: "filled" | "outlined" | "light"; color: "default" | "success" | "warning" | "error" | "info" }> = {
          pending_approval: { label: "Pending Approval", variant: "outlined", color: "warning" },
          approved: { label: "Approved", variant: "filled", color: "success" },
          active: { label: "Active", variant: "filled", color: "success" },
          deprecated: { label: "Deprecated", variant: "outlined", color: "warning" },
          archived: { label: "Archived", variant: "outlined", color: "default" },
        };
        const statusInfo = statusMap[status] || { label: status.replace(/_/g, " "), variant: "outlined" as const, color: "default" as const };
        return (
          <div className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${
            statusInfo.color === "success" ? "bg-[#ECFDF3] text-[#039855]" :
            statusInfo.color === "warning" ? "bg-[#FEF3F2] text-[#F79009]" :
            "bg-[#F2F4F7] text-[#667085]"
          }`}>
            {statusInfo.label}
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
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/core-assets/data/model-links/${row.original.id}/edit`);
              }}
            >
              Edit
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
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">Model-Dataset Links</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Traceability between AI models and data snapshots</p>
            </div>
            <div className="flex items-center gap-4">
              <DynamicFilter
                filterType="ai-model-datasets"
                filters={filters}
                onFiltersChange={(newFilters) => {
                setFilters(newFilters as ModelDatasetLinkFilters);
                setCurrentPage(1); // Reset to first page when filters change
              }}
              />
              <Button
                onClick={() => router.push("/core-assets/data/model-links/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Link
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-4">
            <DataTable
              columns={columns}
              data={links}
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
              onRowClick={(row) => router.push(`/core-assets/data/model-links/${row.id}`)}
              emptyState={{
                title: "No model-dataset links found",
                description: "Links establish traceability for audit and reproducibility",
              }}
            />
          </Card>
        </CardContent>
      </Card>
    </>
  );
};

export default ModelDatasetLinksPage;

