"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetIncidentAlertsQuery,
  useDeleteIncidentAlertMutation,
  IncidentAlert,
  IncidentAlertFilters,
  AlertSourceType,
  AlertSeverity,
} from "@/app/lib/features/incidentAlertsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import { Badge } from "@/components/ui/badge";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

const IncidentAlerts: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<IncidentAlertFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    alertId: number | null;
  }>({
    isOpen: false,
    alertId: null,
  });

  const queryParams = React.useMemo(
    () => ({
      ...filters,
      page: currentPage,
      per_page: 15,
    }),
    [filters, currentPage]
  );

  const { data, isLoading } = useGetIncidentAlertsQuery(queryParams);
  const [deleteAlert, { isLoading: isDeleting }] =
    useDeleteIncidentAlertMutation();

  const alerts = data?.data ?? [];
  const pagination = data?.pagination;

  const handleDeleteClick = (e: React.MouseEvent, alert: IncidentAlert) => {
    e.stopPropagation();
    setDeleteDialogState({
      isOpen: true,
      alertId: alert.id,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialogState.alertId) {
      try {
        await deleteAlert(deleteDialogState.alertId).unwrap();
        setDeleteDialogState({
          isOpen: false,
          alertId: null,
        });
      } catch (error) {
        console.error("Failed to delete alert:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setDeleteDialogState({
        isOpen: false,
        alertId: null,
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const SEVERITY_LABELS: Record<AlertSeverity, string> = {
    [AlertSeverity.LOW]: "Low",
    [AlertSeverity.MEDIUM]: "Medium",
    [AlertSeverity.HIGH]: "High",
    [AlertSeverity.CRITICAL]: "Critical",
  };

  const SEVERITY_COLORS: Record<AlertSeverity, string> = {
    [AlertSeverity.LOW]: "bg-blue-100 text-blue-800",
    [AlertSeverity.MEDIUM]: "bg-yellow-100 text-yellow-800",
    [AlertSeverity.HIGH]: "bg-orange-100 text-orange-800",
    [AlertSeverity.CRITICAL]: "bg-red-100 text-red-800",
  };

  const columns: ColumnDef<IncidentAlert>[] = [
    {
      accessorKey: "display_id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Alert ID
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {row.original.display_id || `#${row.original.id}`}
        </div>
      ),
    },
    {
      id: "incident",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Incident
        </div>
      ),
      cell: ({ row }) => {
        const incident = row.original.ai_incident;
        return (
          <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
            {incident
              ? `${incident.display_id || `#${incident.id}`} - ${
                  incident.title
                }`
              : `#${row.original.ai_incident_id}`}
          </div>
        );
      },
    },
    {
      accessorKey: "alert_sensitivity",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Sensitivity
        </div>
      ),
      cell: ({ getValue }) => {
        const sensitivity = getValue() as AlertSeverity;
        return (
          <Badge className={SEVERITY_COLORS[sensitivity]}>
            {SEVERITY_LABELS[sensitivity]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "source_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Source Type
        </div>
      ),
      cell: ({ getValue }) => {
        const sourceType = getValue() as AlertSourceType;
        const labelMap: Record<AlertSourceType, string> = {
          [AlertSourceType.MONITORING_RULE]: "Monitoring Rule",
          [AlertSourceType.KRI_THRESHOLD]: "KRI Threshold",
          [AlertSourceType.MANUAL_REPORT]: "Manual Report",
          [AlertSourceType.AUTOMATED_SCAN]: "Automated Scan",
          [AlertSourceType.USER_COMPLAINT]: "User Complaint",
          [AlertSourceType.EXTERNAL_REPORT]: "External Report",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
            {labelMap[sourceType] || sourceType}
          </div>
        );
      },
    },
    {
      accessorKey: "first_seen_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          First Seen
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
          {new Date(getValue() as string).toLocaleString()}
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
            <PermissionGate permission={PERMISSIONS.INCIDENT_ALERTS_EDIT}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `/governance/incidents/alerts/${row.original.id}/edit`
                  );
                }}
              >
                Edit
              </Button>
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.INCIDENT_ALERTS_DELETE}>
              <Button
                variant={"outline"}
                className="text-[#667085]"
                onClick={(e) => handleDeleteClick(e, row.original)}
              >
                Remove
              </Button>
            </PermissionGate>
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
                Incident Alerts
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage incident alert signals
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="incident-alerts"
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters as IncidentAlertFilters);
                  setCurrentPage(1);
                }}
              />
              <PermissionGate permission={PERMISSIONS.INCIDENT_ALERTS_CREATE}>
                <Button
                  onClick={() =>
                    router.push("/governance/incidents/alerts/create")
                  }
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  New Alert
                </Button>
              </PermissionGate>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={alerts}
              variant="projects"
              loading={isLoading}
              serverSide={true}
              onRowClick={(row) =>
                router.push(`/governance/incidents/alerts/${row.id}/details`)
              }
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
                title: "No alerts found",
                description: "Get started by creating your first alert",
                action: (
                  <PermissionGate permission={PERMISSIONS.INCIDENT_ALERTS_CREATE}>
                    <Button
                      onClick={() =>
                        router.push("/governance/incidents/alerts/create")
                      }
                    >
                      Create Alert
                    </Button>
                  </PermissionGate>
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
        title="Delete Incident Alert"
        description="Are you sure you want to delete this alert? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default IncidentAlerts;
