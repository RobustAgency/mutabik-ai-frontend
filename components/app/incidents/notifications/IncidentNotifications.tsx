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
  AudienceType,
  Channel,
  DeliveryStatus,
} from "@/app/lib/features/incidentNotificationsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

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
      accessorKey: "id",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Notification ID
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
      accessorKey: "audience_type",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Audience
        </div>
      ),
      cell: ({ getValue }) => {
        const type = getValue() as AudienceType;
        const labels: Record<AudienceType, string> = {
          [AudienceType.INTERNAL_EXECUTIVE]: "Internal Executive",
          [AudienceType.INTERNAL_TECHNICAL]: "Internal Technical",
          [AudienceType.DATA_PROTECTION_AUTHORITY]: "Data Protection Authority",
          [AudienceType.AFFECTED_DATA_SUBJECTS]: "Affected Data Subjects",
          [AudienceType.EXTERNAL_PARTNERS]: "External Partners",
          [AudienceType.MEDIA_PUBLIC]: "Media/Public",
          [AudienceType.BOARD_AUDIT_COMMITTEE]: "Board/Audit Committee",
          [AudienceType.LEGAL_COMPLIANCE]: "Legal/Compliance",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
            {labels[type] || type}
          </div>
        );
      },
    },
    {
      accessorKey: "channel",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Channel
        </div>
      ),
      cell: ({ getValue }) => {
        const channel = getValue() as Channel;
        const labels: Record<Channel, string> = {
          [Channel.EMAIL]: "Email",
          [Channel.SMS]: "SMS",
          [Channel.PORTAL_NOTIFICATION]: "Portal Notification",
          [Channel.SLACK_TEAMS]: "Slack/Teams",
          [Channel.FORMAL_LETTER]: "Formal Letter",
          [Channel.PRESS_RELEASE]: "Press Release",
          [Channel.REGULATORY_FILING]: "Regulatory Filing",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
            {labels[channel] || channel}
          </div>
        );
      },
    },
    {
      accessorKey: "delivery_status",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Status
        </div>
      ),
      cell: ({ getValue }) => {
        const status = getValue() as DeliveryStatus;
        const labels: Record<DeliveryStatus, string> = {
          [DeliveryStatus.DRAFT]: "Draft",
          [DeliveryStatus.SENT]: "Sent",
          [DeliveryStatus.DELIVERED]: "Delivered",
          [DeliveryStatus.ACKNOWLEDGED]: "Acknowledged",
          [DeliveryStatus.FAILED]: "Failed",
        };
        return (
          <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#1D2939]">
            {labels[status] || status}
          </div>
        );
      },
    },
    {
      accessorKey: "sent_at",
      header: () => (
        <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
          Sent At
        </div>
      ),
      cell: ({ getValue }) => {
        const date = getValue() as string;
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
          <PermissionGate permission={PERMISSIONS.INCIDENT_NOTIFICATIONS_EDIT}>
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
          </PermissionGate>
          <PermissionGate permission={PERMISSIONS.INCIDENT_NOTIFICATIONS_DELETE}>
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
              <PermissionGate permission={PERMISSIONS.INCIDENT_NOTIFICATIONS_CREATE}>
                <Button
                  onClick={() => router.push("/governance/incidents/notifications/create")}
                  className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                >
                  Send Notification
                </Button>
              </PermissionGate>
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
              onRowClick={(row) => {
                router.push(`/governance/incidents/notifications/${row.id}/details`);
              }}
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

