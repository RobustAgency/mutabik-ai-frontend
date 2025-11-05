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
} from "@/app/lib/features/incidentAlertsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";

const IncidentAlerts: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    alertId: number | null;
  }>({
    isOpen: false,
    alertId: null,
  });

  const { data, isLoading } = useGetIncidentAlertsQuery({
    page: currentPage,
    per_page: 15,
  });
  const [deleteAlert, { isLoading: isDeleting }] = useDeleteIncidentAlertMutation();

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

  const columns: ColumnDef<IncidentAlert>[] = [
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
      accessorKey: "source_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Source Type
        </div>
      ),
      cell: ({ getValue }) => {
        const sourceType = (getValue() as string) || "";
        const labelMap: Record<string, string> = {
          kri: "KRI",
          monitoring_rule: "Monitoring Rule",
          human_report: "Human Report",
          vendor_notice: "Vendor Notice",
          security_tool: "Security Tool",
          other: "Other",
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
            <Button
              variant={"outline"}
              className="text-[#667085]"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/governance/incidents/alerts/${row.original.id}/edit`);
              }}
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
                Incident Alerts
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage incident alert signals
              </p>
            </div>
            <Button
              onClick={() => router.push("/governance/incidents/alerts/create")}
              className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
            >
              New Alert
            </Button>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={alerts}
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
              onPageChange={handlePageChange}
              emptyState={{
                title: "No alerts found",
                description: "Get started by creating your first alert",
                action: (
                  <Button
                    onClick={() => router.push("/governance/incidents/alerts/create")}
                  >
                    Create Alert
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

