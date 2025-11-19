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
      accessorKey: "display_id",
      header: "CAPA ID",
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "capa_type",
      header: "Type",
      cell: ({ getValue }) => {
        const type = getValue() as string;
        return type.replace(/\b\w/g, (l) => l.toUpperCase());
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ getValue }) => {
        const priority = getValue() as string;
        const colors: Record<string, string> = {
          critical: "bg-red-100 text-red-800",
          high: "bg-orange-100 text-orange-800",
          medium: "bg-yellow-100 text-yellow-800",
          low: "bg-blue-100 text-blue-800",
        };
        return (
          <div className={`inline-flex px-2 py-1 rounded-full text-xs ${colors[priority] || ""}`}>
            {priority.replace(/\b\w/g, (l) => l.toUpperCase())}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      },
    },
    {
      accessorKey: "owner_team",
      header: "Owner Team",
      cell: ({ getValue }) => {
        const team = getValue() as string;
        return team.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      },
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4E7EC] pb-4">
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
              onRowClick={(row) => router.push(`/governance/incidents/capa/${row.id}/details`)}
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

