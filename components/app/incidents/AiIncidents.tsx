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
} from "@/app/lib/features/aiIncidentsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

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
      accessorKey: "category",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Category
        </div>
      ),
      cell: ({ getValue }) => {
        const categoryCode = (getValue() as string) || "";
        const labelMap: Record<string, string> = {
          safety: "Safety",
          privacy: "Privacy",
          security: "Security",
          bias_fairness: "Bias/Fairness",
          reliability: "Reliability",
          availability: "Availability",
          legal_compliance: "Legal Compliance",
          vendor: "Vendor",
          other: "Other",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {labelMap[categoryCode] || categoryCode}
          </div>
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
        const severityCode = (getValue() as string) || "";
        const labelMap: Record<string, string> = {
          sev1_critical: "Sev1 Critical",
          sev2_high: "Sev2 High",
          sev3_medium: "Sev3 Medium",
          sev4_low: "Sev4 Low",
          near_miss: "Near Miss",
        };
        const colorMap: Record<string, string> = {
          sev1_critical: "bg-[#FEE2E2] text-[#DC2626]",
          sev2_high: "bg-[#FED7AA] text-[#EA580C]",
          sev3_medium: "bg-[#FEF3C7] text-[#D97706]",
          sev4_low: "bg-[#DBEAFE] text-[#1D4ED8]",
          near_miss: "bg-[#F3F4F6] text-[#6B7280]",
        };
        const label = labelMap[severityCode] || severityCode;
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${
              colorMap[severityCode] || "bg-[#F2F4F7] text-[#667085]"
            }`}
          >
            {label}
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
        const code = (getValue() as string) || "";
        const labelMap: Record<string, string> = {
          open: "Open",
          contained: "Contained",
          monitoring: "Monitoring",
          resolved: "Resolved",
          closed: "Closed",
        };
        const statusColors: Record<string, string> = {
          open: "bg-[#FEE2E2] text-[#DC2626]",
          contained: "bg-[#FEF3C7] text-[#D97706]",
          monitoring: "bg-[#DBEAFE] text-[#1D4ED8]",
          resolved: "bg-[#ECFDF3] text-[#047857]",
          closed: "bg-[#F3F4F6] text-[#6B7280]",
        };
        return (
          <div
            className={`h-[24px] flex items-center justify-center rounded-full text-xs font-medium px-2 ${
              statusColors[code] || "bg-[#F2F4F7] text-[#667085]"
            }`}
          >
            {labelMap[code] || code}
          </div>
        );
      },
    },
    {
      accessorKey: "ic_owner",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          IC Owner
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "declared_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Declared At
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4E7EC] pb-4">
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
                className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
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

