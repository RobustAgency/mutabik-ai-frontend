"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  useGetIncidentNotificationsQuery,
  useDeleteIncidentNotificationMutation,
  IncidentNotification,
  IncidentNotificationFilters,
} from "@/app/lib/features/incidentNotificationsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const IncidentNotifications: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<IncidentNotificationFilters>({});
  const [deleteDialogState, setDeleteDialogState] = React.useState<{
    isOpen: boolean;
    notificationId: number | null;
  }>({
    isOpen: false,
    notificationId: null,
  });

  const queryParams = React.useMemo(() => ({
    ...filters,
    page: currentPage,
    per_page: 15,
  }), [filters, currentPage]);

  const { data, isLoading } = useGetIncidentNotificationsQuery(queryParams);
  const [deleteNotification, { isLoading: isDeleting }] = useDeleteIncidentNotificationMutation();

  const notifications = data?.data ?? [];
  const pagination = data?.pagination;

  const columns: ColumnDef<IncidentNotification>[] = [
    {
      accessorKey: "ai_incident_id",
      header: "Incident ID",
      cell: ({ getValue }) => `#${getValue() as number}`,
    },
    {
      accessorKey: "audience_type",
      header: "Audience",
      cell: ({ getValue }) => {
        const type = getValue() as string;
        return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      },
    },
    {
      accessorKey: "channel",
      header: "Channel",
      cell: ({ getValue }) => {
        const channel = getValue() as string;
        return channel.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      },
    },
    {
      accessorKey: "notified_at",
      header: "Notified At",
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
              router.push(`/governance/incidents/notifications/${row.original.id}/edit`);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            className="text-[#667085]"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogState({ isOpen: true, notificationId: row.original.id });
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
                Incident Notifications
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Manage stakeholder notifications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DynamicFilter
                filterType="incident-notifications"
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters as IncidentNotificationFilters);
                  setCurrentPage(1);
                }}
              />
              <Button
                onClick={() => router.push("/governance/incidents/notifications/create")}
                className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
              >
                Send Notification
              </Button>
            </div>
          </div>
          <Card className="bg-white w-full rounded-xl border-0 py-0">
            <DataTable
              columns={columns}
              data={notifications}
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
        onClose={() => setDeleteDialogState({ isOpen: false, notificationId: null })}
        onConfirm={async () => {
          if (deleteDialogState.notificationId) {
            await deleteNotification(deleteDialogState.notificationId).unwrap();
            setDeleteDialogState({ isOpen: false, notificationId: null });
          }
        }}
        title="Delete Notification"
        description="Are you sure you want to delete this notification?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default IncidentNotifications;

