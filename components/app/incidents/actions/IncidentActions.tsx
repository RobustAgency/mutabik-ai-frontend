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
} from "@/app/lib/features/incidentActionsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

const IncidentActions: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    actionId: number | null;
  }>({
    isOpen: false,
    actionId: null,
  });

  const { data, isLoading } = useGetIncidentActionsQuery({
    page: currentPage,
    per_page: 15,
  });
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
      accessorKey: "ai_incident_id",
      header: "Incident ID",
      cell: ({ getValue }) => `#${getValue() as number}`,
    },
    {
      accessorKey: "action_type",
      header: "Action Type",
      cell: ({ getValue }) => {
        const type = getValue() as string;
        return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      },
    },
    {
      accessorKey: "performed_by",
      header: "Performed By",
    },
    {
      accessorKey: "validation_result",
      header: "Validation",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="outline" className="text-[#667085]" onClick={(e) => handleDeleteClick(e, row.original)}>
          Remove
        </Button>
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
                Incident Actions
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage incident response actions
              </p>
            </div>
            <Button
              onClick={() => router.push("/governance/incidents/actions/create")}
              className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
            >
              New Action
            </Button>
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

