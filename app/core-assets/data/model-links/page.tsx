"use client";



import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useGetModelDatasetLinksQuery, useDeleteModelDatasetLinkMutation, ModelDatasetLink } from "@/app/lib/features/modelDatasetLinksApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

const ModelDatasetLinksPage: React.FC = () => {
  const router = useRouter();
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
  const { data: links, isLoading } = useGetModelDatasetLinksQuery();

  const handleDeleteClick = (e: React.MouseEvent, link: ModelDatasetLink) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      linkId: link.id,
      linkName: `${link.ai_model_version_id} - ${link.role}`,
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
      accessorKey: "model_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Model ID
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "model_version_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Version ID
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
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
      accessorKey: "snapshot_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Snapshot ID
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
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
            <Button
              onClick={() => router.push("/core-assets/data/model-links/create")}
              className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
            >
              New Link
            </Button>
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

