"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetCorrectivePreventiveActionsQuery,
  useDeleteCorrectivePreventiveActionMutation,
  CorrectivePreventiveAction,
  CorrectivePreventiveActionFilters,
  SourceType,
  CapaType,
  Priority,
  OwnerTeam,
  Status,
  VerificationResult,
} from "@/app/lib/features/correctivePreventiveActionsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const CorrectivePreventiveActions: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<CorrectivePreventiveActionFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    capaId: number | null;
  }>({
    isOpen: false,
    capaId: null,
  });

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data, isLoading } = useGetCorrectivePreventiveActionsQuery(queryParams);
  const [deleteCapa, { isLoading: isDeleting }] = useDeleteCorrectivePreventiveActionMutation();

  const capas = data?.data ?? [];
  const pagination = data?.pagination;

  const columns: ColumnDef<CorrectivePreventiveAction>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          CAPA ID
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.display_id || `#${row.original.id}`}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Title
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "source_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Source
        </div>
      ),
      cell: ({ getValue }) => {
        const type = getValue() as SourceType;
        const labels: Record<SourceType, string> = {
          [SourceType.INCIDENT]: "Incident",
          [SourceType.RCA]: "RCA",
          [SourceType.AUDIT_FINDING]: "Audit Finding",
          [SourceType.RISK_ASSESSMENT]: "Risk Assessment",
          [SourceType.CUSTOMER_COMPLAINT]: "Customer Complaint",
          [SourceType.REGULATORY_REQUIREMENT]: "Regulatory Requirement",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
            {labels[type] || type}
          </div>
        );
      },
    },
    {
      accessorKey: "capa_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Type
        </div>
      ),
      cell: ({ getValue }) => {
        const type = getValue() as CapaType;
        const labels: Record<CapaType, string> = {
          [CapaType.CORRECTIVE]: "Corrective",
          [CapaType.PREVENTIVE]: "Preventive",
          [CapaType.BOTH]: "Both",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
            {labels[type] || type}
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Priority
        </div>
      ),
      cell: ({ getValue }) => {
        const priority = getValue() as Priority;
        const labels: Record<Priority, string> = {
          [Priority.LOW]: "Low",
          [Priority.MEDIUM]: "Medium",
          [Priority.HIGH]: "High",
          [Priority.CRITICAL]: "Critical",
        };
        const colors: Record<Priority, string> = {
          [Priority.CRITICAL]: "bg-red-100 text-red-800",
          [Priority.HIGH]: "bg-orange-100 text-orange-800",
          [Priority.MEDIUM]: "bg-yellow-100 text-yellow-800",
          [Priority.LOW]: "bg-blue-100 text-blue-800",
        };
        return (
          <div className={`inline-flex px-2 py-1 rounded-full text-xs ${colors[priority] || ""}`}>
            {labels[priority] || priority}
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
      cell: ({ getValue }) => {
        const status = getValue() as Status;
        const labels: Record<Status, string> = {
          [Status.NEW]: "New",
          [Status.IN_PROGRESS]: "In Progress",
          [Status.BLOCKED]: "Blocked",
          [Status.PENDING_VERIFICATION]: "Pending Verification",
          [Status.CLOSED]: "Closed",
          [Status.OVERDUE]: "Overdue",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
            {labels[status] || status}
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
      cell: ({ getValue }) => {
        const team = getValue() as OwnerTeam;
        const labels: Record<OwnerTeam, string> = {
          [OwnerTeam.AI_GOVERNANCE]: "AI Governance",
          [OwnerTeam.DATA_PRIVACY_OFFICE]: "Data Privacy Office",
          [OwnerTeam.DATA_GOVERNANCE]: "Data Governance",
          [OwnerTeam.ML_ENGINEERING]: "ML Engineering",
          [OwnerTeam.DATA_ENGINEERING]: "Data Engineering",
          [OwnerTeam.INFORMATION_SECURITY]: "Information Security",
          [OwnerTeam.LEGAL]: "Legal",
          [OwnerTeam.COMPLIANCE]: "Compliance",
          [OwnerTeam.EXECUTIVE_LEADERSHIP]: "Executive Leadership",
          [OwnerTeam.PRODUCT]: "Product",
          [OwnerTeam.CUSTOMER_SUCCESS]: "Customer Success",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
            {labels[team] || team}
          </div>
        );
      },
    },
    {
      accessorKey: "due_date",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Due Date
        </div>
      ),
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
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
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/governance/incidents/capa/${row.original.id}/edit`);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            className="text-[#667085]"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogState({ isOpen: true, capaId: row.original.id });
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                Corrective & Preventive Actions (CAPA)
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage remediation and hardening tasks
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="corrective-preventive-actions"
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters as CorrectivePreventiveActionFilters);
                  setCurrentPage(1);
                }}
              />
              <Button
                onClick={() => router.push("/governance/incidents/capa/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                Create CAPA
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={capas}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) => {
                router.push(`/governance/incidents/capa/${row.id}/details`);
              }}
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
        onClose={() => setDeleteDialogState({ isOpen: false, capaId: null })}
        onConfirm={async () => {
          if (deleteDialogState.capaId) {
            await deleteCapa(deleteDialogState.capaId).unwrap();
            setDeleteDialogState({ isOpen: false, capaId: null });
          }
        }}
        title="Delete CAPA"
        description="Are you sure you want to delete this CAPA?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default CorrectivePreventiveActions;

