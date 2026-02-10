"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetIncidentActionsQuery,
  useDeleteIncidentActionMutation,
  IncidentAction,
  IncidentActionFilters,
  ActionType,
  ExecutionStatus,
  ValidationResult,
} from "@/app/lib/features/incidentActionsApi";
import { useGetStakeholderQuery } from "@/app/lib/features/stakeholdersApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

// Component to display stakeholder name
const PerformedByCell: React.FC<{ performedById: number }> = ({
  performedById,
}) => {
  const { data: stakeholder, isLoading } = useGetStakeholderQuery(
    performedById,
    { skip: !performedById }
  );

  if (isLoading) {
    return (
      <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
        Loading...
      </div>
    );
  }

  return (
    <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
      {stakeholder?.display_name || `ID: ${performedById}`}
    </div>
  );
};

const IncidentActions: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<IncidentActionFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    actionId: number | null;
  }>({
    isOpen: false,
    actionId: null,
  });

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data, isLoading } = useGetIncidentActionsQuery(queryParams);
  const [deleteAction, { isLoading: isDeleting }] = useDeleteIncidentActionMutation();

  const actions = data?.data ?? [];
  const pagination = data?.pagination;

  const handleDeleteClick = (e: React.MouseEvent, action: IncidentAction) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      actionId: action.id,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.actionId) {
      try {
        await deleteAction(deleteDialogState.actionId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          actionId: null,
        });
      } catch (error) {
        console.error("Failed to delete action:", error);
      }
    }
  };

  const columns: ColumnDef<IncidentAction>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Action ID
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
      accessorKey: "action_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Action Type
        </div>
      ),
      cell: ({ getValue }) => {
        const type = getValue() as ActionType;
        const labels: Record<ActionType, string> = {
          [ActionType.KILL_SWITCH]: "Kill Switch",
          [ActionType.MODEL_ROLLBACK]: "Model Rollback",
          [ActionType.DATA_ISOLATION]: "Data Isolation",
          [ActionType.ACCESS_REVOCATION]: "Access Revocation",
          [ActionType.SYSTEM_PATCH]: "System Patch",
          [ActionType.CONFIGURATION_CHANGE]: "Configuration Change",
          [ActionType.COMMUNICATION_NOTIFICATION]: "Communication/Notification",
          [ActionType.INVESTIGATION]: "Investigation",
          [ActionType.CONTAINMENT]: "Containment",
          [ActionType.ERADICATION]: "Eradication",
          [ActionType.RECOVERY]: "Recovery",
          [ActionType.DOCUMENTATION]: "Documentation",
          [ActionType.OTHER]: "Other",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
            {labels[type] || type}
          </div>
        );
      },
    },
    {
      accessorKey: "execution_status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => {
        const status = getValue() as ExecutionStatus;
        const labels: Record<ExecutionStatus, string> = {
          [ExecutionStatus.PLANNED]: "Planned",
          [ExecutionStatus.IN_PROGRESS]: "In Progress",
          [ExecutionStatus.COMPLETED]: "Completed",
          [ExecutionStatus.FAILED]: "Failed",
          [ExecutionStatus.ROLLED_BACK]: "Rolled Back",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
            {labels[status] || status}
          </div>
        );
      },
    },
    {
      accessorKey: "performed_by",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Performed By
        </div>
      ),
      cell: ({ row }) => {
        const action = row.original;
        return <PerformedByCell performedById={action.performed_by} />;
      },
    },
    {
      accessorKey: "validation_result",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Validation
        </div>
      ),
      cell: ({ getValue }) => {
        const result = getValue() as ValidationResult;
        const labels: Record<ValidationResult, string> = {
          [ValidationResult.PENDING]: "Pending",
          [ValidationResult.PARTIALLY_EFFECTIVE]: "Partially Effective",
          [ValidationResult.EFFECTIVE]: "Effective",
          [ValidationResult.INEFFECTIVE]: "Ineffective",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
            {labels[result] || result}
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
      cell: ({ row }) => (
        <div className="flex gap-2">
          <PermissionGate permission={PERMISSIONS.INCIDENT_ACTIONS_EDIT}>
            <Button
              variant="outline"
              className="text-[#667085]"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/governance/incidents/actions/${row.original.id}/edit`);
              }}
            >
              Edit
            </Button>
          </PermissionGate>
          <PermissionGate permission={PERMISSIONS.INCIDENT_ACTIONS_DELETE}>
            <Button variant="outline" className="text-[#667085]" onClick={(e) => handleDeleteClick(e, row.original)}>
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
                Incident Actions
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage incident response actions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="incident-actions"
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters as IncidentActionFilters);
                  setCurrentPage(1);
                }}
              />
              <PermissionGate permission={PERMISSIONS.INCIDENT_ACTIONS_CREATE}>
                <Button
                  onClick={() => router.push("/governance/incidents/actions/create")}
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  New Action
                </Button>
              </PermissionGate>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={actions}
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
                router.push(`/governance/incidents/actions/${row.id}/details`);
              }}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, actionId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Incident Action"
        description="Are you sure you want to delete this action?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default IncidentActions;

