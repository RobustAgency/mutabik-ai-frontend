"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetAiIncidentsQuery,
  useDeleteAiIncidentMutation,
  AiIncident,
  AiIncidentFilters,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  Domain,
} from "@/app/lib/features/aiIncidentsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import { Badge } from "@/components/ui/badge";

const AiIncidents: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<AiIncidentFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    incidentId: number | null;
    incidentTitle: string;
  }>({
    isOpen: false,
    incidentId: null,
    incidentTitle: "",
  });

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data, isLoading } = useGetAiIncidentsQuery(queryParams);
  const [deleteIncident, { isLoading: isDeleting }] = useDeleteAiIncidentMutation();

  const incidents = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEditClick = (e: React.MouseEvent, incident: AiIncident) => {
    e.stopPropagation();
    router.push(`/governance/incidents/${incident.id}/edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, incident: AiIncident) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      incidentId: incident.id,
      incidentTitle: incident.title,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.incidentId) {
      try {
        await deleteIncident(deleteDialogState.incidentId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          incidentId: null,
          incidentTitle: "",
        });
      } catch (error) {
        console.error("Failed to delete AI incident:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        incidentId: null,
        incidentTitle: "",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: ColumnDef<AiIncident>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Incident ID
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
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
      accessorKey: "incident_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Incident Type
        </div>
      ),
      cell: ({ getValue }) => {
        const type = getValue() as IncidentType | string | null;
        if (!type) return <span className="text-[#667085]">—</span>;
        const typeStr = String(type);
        const label = typeStr.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        return (
          <Badge variant="light" color="info" className="capitalize">
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "domain",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Domain
        </div>
      ),
      cell: ({ getValue }) => {
        const domain = getValue() as Domain | string | null;
        if (!domain) return <span className="text-[#667085]">—</span>;
        const domainStr = String(domain);
        const label = domainStr.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        return (
          <Badge variant="light" color="default" className="capitalize">
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "severity",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Severity
        </div>
      ),
      cell: ({ getValue }) => {
        const severity = getValue() as IncidentSeverity | string;
        const severityStr = String(severity);
        const severityMap: Record<string, { label: string; variant: "filled" | "outlined" | "light"; color: "default" | "success" | "warning" | "error" | "info" }> = {
          [IncidentSeverity.SEV1_CRITICAL]: { label: "Sev1 Critical", variant: "filled", color: "error" },
          [IncidentSeverity.SEV2_HIGH]: { label: "Sev2 High", variant: "filled", color: "warning" },
          [IncidentSeverity.SEV3_MEDIUM]: { label: "Sev3 Medium", variant: "outlined", color: "warning" },
          [IncidentSeverity.SEV4_LOW]: { label: "Sev4 Low", variant: "outlined", color: "info" },
        };
        const severityInfo = severityMap[severityStr] || { label: severityStr.replace(/_/g, " "), variant: "outlined" as const, color: "default" as const };
        return (
          <Badge variant={severityInfo.variant} color={severityInfo.color}>
            {severityInfo.label}
          </Badge>
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
        const status = getValue() as IncidentStatus | string;
        const statusStr = String(status);
        const statusMap: Record<string, { label: string; variant: "filled" | "outlined" | "light"; color: "default" | "success" | "warning" | "error" | "info" }> = {
          [IncidentStatus.OPEN]: { label: "Open", variant: "filled", color: "error" },
          [IncidentStatus.INVESTIGATING]: { label: "Investigating", variant: "outlined", color: "warning" },
          [IncidentStatus.CONTAINED]: { label: "Contained", variant: "outlined", color: "warning" },
          [IncidentStatus.MITIGATED]: { label: "Mitigated", variant: "outlined", color: "info" },
          [IncidentStatus.RESOLVED]: { label: "Resolved", variant: "filled", color: "success" },
          [IncidentStatus.CLOSED]: { label: "Closed", variant: "outlined", color: "default" },
          [IncidentStatus.REOPENED]: { label: "Reopened", variant: "outlined", color: "error" },
        };
        const statusInfo = statusMap[statusStr] || { label: statusStr.replace(/_/g, " "), variant: "outlined" as const, color: "default" as const };
        return (
          <Badge variant={statusInfo.variant} color={statusInfo.color}>
            {statusInfo.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "incident_commander",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Incident Commander
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Created At
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {new Date(getValue() as string).toLocaleDateString()}
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
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              className="text-[#667085]"
              onClick={(e) => handleEditClick(e, row.original)}
            >
              Edit
            </Button>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                AI Incidents
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage AI incidents and near-misses
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="ai-incidents"
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters as AiIncidentFilters);
                  setCurrentPage(1); // Reset to first page when filters change
                }}
              />
              <Button
                onClick={() => router.push("/governance/incidents/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                New Incident
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={incidents}
              variant="projects"
              loading={isLoading}
              onRowClick={(row) => router.push(`/governance/incidents/${row.id}/details`)}
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
              emptyState={{
                title: "No AI incidents found",
                description: "Get started by creating your first incident",
                action: (
                  <Button
                    onClick={() => router.push("/governance/incidents/create")}
                  >
                    Create Incident
                  </Button>
                ),
              }}
            />
          </Card>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogState.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete AI Incident"
        description={`Are you sure you want to delete "${deleteDialogState.incidentTitle}"? This action cannot be undone and will remove the incident from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default AiIncidents;

