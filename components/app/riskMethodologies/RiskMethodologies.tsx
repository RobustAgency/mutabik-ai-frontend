"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import {
  useGetRiskMethodologiesQuery,
  useDeleteRiskMethodologyMutation,
} from "@/app/lib/features/riskMethodologyApi";
import { RiskMethodology } from "@/interfaces/RiskMethodology";
import { formatDate } from "@/utils/formatDate";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";

export default function RiskMethodologies() {
  const router = useRouter();
  const { data: methodologies = [], isLoading } = useGetRiskMethodologiesQuery();
  const [deleteMethodology, { isLoading: isDeleting }] =
    useDeleteRiskMethodologyMutation();

  const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
    deleteMutation: async (id: string) => {
      await deleteMethodology(Number(id)).unwrap();
    },
    isDeleting,
    entityTypeName: "Risk Methodology",
  });

  const handleEditClick = (e: React.MouseEvent, methodology: RiskMethodology) => {
    e.stopPropagation();
    router.push(
      `/risk-compliance/ai-risk-management/methodologies/${methodology.id}/edit`
    );
  };

  const handleDeleteClick = (e: React.MouseEvent, methodology: RiskMethodology) => {
    e.stopPropagation();
    openDeleteDialog(String(methodology.id), methodology.name);
  };

  const columns: ColumnDef<RiskMethodology>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Name
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {row.original.name}
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
          {row.original.owner_team}
        </div>
      ),
    },
    {
      accessorKey: "effective_from",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Effective From
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.effective_from ? formatDate(row.original.effective_from) : "-"}
        </div>
      ),
    },
    {
      accessorKey: "effective_to",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Effective To
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.effective_to ? formatDate(row.original.effective_to) : "Current"}
        </div>
      ),
    },
    {
      accessorKey: "acceptance_thresholds",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Acceptance Thresholds
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.acceptance_thresholds}
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
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-[#667085]"
            onClick={(e) => handleEditClick(e, row.original)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            className="text-[#667085] hover:bg-red-50 hover:text-red-600"
            onClick={(e) => handleDeleteClick(e, row.original)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const handleRowClick = (methodology: RiskMethodology) => {
    router.push(`/risk-compliance/ai-risk-management/methodologies/${methodology.id}/details`);
  };

  return (
    <>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
            Risk Methodologies
          </h2>
          <Button
            onClick={() =>
              router.push("/risk-compliance/ai-risk-management/methodologies/create")
            }
            className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
          >
            Create Risk Methodology
          </Button>
        </div>
        <Card className="bg-white w-full rounded-xl border-0 py-0">
          <DataTable
            columns={columns}
            data={methodologies}
            loading={isLoading}
            onRowClick={handleRowClick}
            emptyState={{
              title: "No Risk Methodologies found",
              description: "Get started by creating your first risk methodology",
              action: (
                <Button
                  onClick={() =>
                    router.push("/risk-compliance/ai-risk-management/methodologies/create")
                  }
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  Create Risk Methodology
                </Button>
              ),
            }}
          />
        </Card>
      </Card>
      <DeleteConfirmationDialog />
    </>
  );
}

