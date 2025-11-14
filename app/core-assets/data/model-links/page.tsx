"use client";



import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetModelDatasetLinksQuery, useDeleteModelDatasetLinkMutation, ModelDatasetLink, ModelDatasetLinkFilters } from "@/app/lib/features/modelDatasetLinksApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const ModelDatasetLinksPage: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = React.useState<ModelDatasetLinkFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    linkId: string | null;
    linkName: string;
  }>({
    isOpen: false,
    linkId: null,
    linkName: "",
  });

  const [deleteLink, { isLoading: isDeleting }] = useDeleteModelDatasetLinkMutation();
  const { data: links, isLoading } = useGetModelDatasetLinksQuery(filters);

  const handleDeleteClick = (e: React.MouseEvent, link: ModelDatasetLink) => {
    e.stopPropagation();
    const modelName = link.ai_model?.name || link.ai_model_id;
    const versionNumber = link.ai_model_version?.version_number || link.ai_model_version_id.toString();
    setDeleteDialogState({
      isOpen: true,
      linkId: link.id,
      linkName: `${modelName} (${versionNumber}) - ${link.role}`,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.linkId) {
      try {
        await deleteLink(deleteDialogState.linkId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          linkId: null,
          linkName: "",
        });
      } catch (error) {
        console.error("Failed to delete link:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        linkId: null,
        linkName: "",
      });
    }
  };

  const columns: ColumnDef<ModelDatasetLink>[] = [
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
        const role = getValue() as string;
        return (
          <div className="h-[24px] flex items-center justify-center rounded-full bg-[#ECF3FF] text-[#465FFF] text-xs font-medium px-2">
            {role}
          </div>
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
      accessorKey: "eligibility_status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Eligibility
        </div>
      ),
      cell: ({ getValue }) => {
        const status = getValue() as string | null;
        if (!status) return <span className="text-[#667085]">—</span>;
        const colorMap: Record<string, string> = {
          eligible: "bg-[#ECFDF3] text-[#039855]",
          eligible_with_conditions: "bg-[#FEF3F2] text-[#F79009]",
          not_eligible: "bg-[#FEF3F2] text-[#F04438]",
        };
        return (
          <div className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${colorMap[status] || "bg-[#F2F4F7] text-[#667085]"}`}>
            {status.replace(/_/g, " ")}
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
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">Model-Dataset Links</h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">Traceability between AI models and data snapshots</p>
            </div>
            <div className="flex items-center gap-4">
              <DynamicFilter
                filterType="ai-model-datasets"
                filters={filters}
                onFiltersChange={(newFilters) => setFilters(newFilters as ModelDatasetLinkFilters)}
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
              data={links ?? []}
              variant="projects"
              loading={isLoading}
              emptyState={{
                title: "No model-dataset links found",
                description: "Links establish traceability for audit and reproducibility",
              }}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Model-Dataset Link"
        description={`Are you sure you want to delete link "${deleteDialogState.linkName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default ModelDatasetLinksPage;

