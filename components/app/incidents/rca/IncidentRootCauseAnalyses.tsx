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
  IncidentRootCauseAnalysisFilters,
  RcaMethod,
} from "@/app/lib/features/incidentRootCauseAnalysesApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

const IncidentRootCauseAnalyses: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<IncidentRootCauseAnalysisFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    rcaId: number | null;
  }>({
    isOpen: false,
    rcaId: null,
  });

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data, isLoading } = useGetIncidentRootCauseAnalysesQuery(queryParams);
  const [deleteRCA, { isLoading: isDeleting }] = useDeleteIncidentRootCauseAnalysisMutation();

  const rcas = data?.data ?? [];
  const pagination = data?.pagination;

  const columns: ColumnDef<IncidentRootCauseAnalysis>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          RCA ID
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.display_id || `#${row.original.id}`}
        </div>
      ),
    },
    {
      accessorKey: "ai_incident_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Incident ID
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          #{getValue() as number}
        </div>
      ),
    },
    {
      accessorKey: "rca_method",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Method
        </div>
      ),
      cell: ({ getValue }) => {
        const method = getValue() as RcaMethod;
        const labels: Record<RcaMethod, string> = {
          [RcaMethod.FIVE_WHYS]: "5 Whys",
          [RcaMethod.FISHBONE]: "Fishbone",
          [RcaMethod.FAULT_TREE]: "Fault Tree",
          [RcaMethod.EVENT_CAUSAL]: "Event Causal",
          [RcaMethod.CHANGE]: "Change",
          [RcaMethod.TIMELINE]: "Timeline",
          [RcaMethod.BARRIER]: "Barrier",
          [RcaMethod.COMBINED]: "Combined",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
            {labels[method] || method}
          </div>
        );
      },
    },
    {
      accessorKey: "lead_analyst",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Lead Analyst
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "approved_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Approved At
        </div>
      ),
      cell: ({ getValue }) => {
        const date = getValue() as string | null | undefined;
        if (!date) return "Not approved";
        try {
          return new Date(date).toLocaleDateString();
        } catch {
          return date;
        }
      },
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
          <PermissionGate permission={PERMISSIONS.INCIDENT_RCA_EDIT}>
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
          </PermissionGate>
          <PermissionGate permission={PERMISSIONS.INCIDENT_RCA_DELETE}>
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
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
        <CardContent className="flex flex-col flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                Root Cause Analyses
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage incident RCA records
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="incident-root-cause-analyses"
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters as IncidentRootCauseAnalysisFilters);
                  setCurrentPage(1);
                }}
              />
              <PermissionGate permission={PERMISSIONS.INCIDENT_RCA_CREATE}>
                <Button
                  onClick={() => router.push("/governance/incidents/rca/create")}
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  New RCA
                </Button>
              </PermissionGate>
            </div>
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
              onRowClick={(row) => {
                router.push(`/governance/incidents/rca/${row.id}/details`);
              }}
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

