"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetIncidentNotificationQuery,
  useDeleteIncidentNotificationMutation,
} from "@/app/lib/features/incidentNotificationsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import IncidentNotificationFormReadOnly from "./IncidentNotificationFormReadOnly";

interface IncidentNotificationDetailsProps {
  notificationId: string;
}

const IncidentNotificationDetails: React.FC<IncidentNotificationDetailsProps> = ({
  notificationId,
}) => {
  const router = useRouter();
  const idNum = Number(notificationId);
  const { data: notification, isLoading } = useGetIncidentNotificationQuery(idNum, {
    skip: Number.isNaN(idNum),
  });
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteIncidentNotificationMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!notification) return;
    try {
      await deleteNotification(notification.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/governance/incidents/notifications");
    } catch (e) {
      console.error("Failed to delete notification:", e);
    }
  };

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid notification ID</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Loading notification...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">Notification not found</p>
            <Button onClick={() => router.push("/governance/incidents/notifications")}>
              Back to Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Incident Notification Details
              </h1>
              <p className="font-sans text-sm text-[#667085] mt-1">
                View and manage incident notification information
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/governance/incidents/notifications/${notification.id}/edit`)
                }
              >
                Edit
              </Button>
              <Button
                variant="outline"
                className="text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
              <Button onClick={() => router.push("/governance/incidents/notifications")}>
                Back
              </Button>
            </div>
          </div>

          <IncidentNotificationFormReadOnly notification={notification} />
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Incident Notification"
        description={`Are you sure you want to delete this notification? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default IncidentNotificationDetails;

