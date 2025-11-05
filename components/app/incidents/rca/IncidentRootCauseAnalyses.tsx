"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetIncidentRootCauseAnalysesQuery,
  useDeleteIncidentRootCauseAnalysisMutation,
  IncidentRootCauseAnalysis,
} from "@/app/lib/features/incidentRootCauseAnalysesApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

const IncidentRootCauseAnalyses: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    rcaId: number | null;
  }>({
    isOpen: false,
    rcaId: null,
  });

  const { data, isLoading } = useGetIncidentRootCauseAnalysesQuery({
    page: currentPage,
    per_page: 15,
  });
  const [deleteRCA, { isLoading: isDeleting }] = useDeleteIncidentRootCauseAnalysisMutation();

  const rcas = data?.data ?? [];
  const pagination = data?.pagination;

  const columns: ColumnDef<IncidentRootCauseAnalysis>[] = [
    {
      accessorKey: "ai_incident_id",
      header: "Incident ID",
      cell: ({ getValue }) => `#${getValue() as number}`,
    },
    {
      accessorKey: "rca_method",
      header: "Method",
      cell: ({ getValue }) => {
        const method = getValue() as string;
        return method.replace(/_/g, " ").toUpperCase();
      },
    },
    {
      accessorKey: "approved_by",
      header: "Approved By",
    },
    {
      accessorKey: "approved_at",
      header: "Approved At",
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-[#667085]"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/governance/incidents/rca/${row.original.id}/edit`);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            className="text-[#667085]"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogState({ isOpen: true, rcaId: row.original.id });
            }}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        <CardContent className="flex flex-col flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4E7EC] pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                Root Cause Analyses
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage incident RCA records
              </p>
            </div>
            <Button
              onClick={() => router.push("/governance/incidents/rca/create")}
              className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
            >
              New RCA
            </Button>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={rcas}
              variant="projects"
              loading={isLoading}
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
              onPageChange={setCurrentPage}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, rcaId: null })}
        onConfirm={async () => {
          if (deleteDialogState.rcaId) {
            await deleteRCA(deleteDialogState.rcaId).unwrap();
            setDeleteDialogState({ isOpen: false, rcaId: null });
          }
        }}
        title="Delete RCA"
        description="Are you sure you want to delete this root cause analysis?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default IncidentRootCauseAnalyses;

