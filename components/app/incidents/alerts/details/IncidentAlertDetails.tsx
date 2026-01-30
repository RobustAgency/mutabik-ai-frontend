"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetIncidentAlertQuery,
  useDeleteIncidentAlertMutation,
  AlertSourceType,
} from "@/app/lib/features/incidentAlertsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import IncidentAlertFormReadOnly from "./IncidentAlertFormReadOnly";

interface IncidentAlertDetailsProps {
  alertId: string;
}

const SOURCE_TYPE_LABELS: Record<AlertSourceType, string> = {
  [AlertSourceType.MONITORING_RULE]: "Monitoring Rule",
  [AlertSourceType.KRI_THRESHOLD]: "KRI Threshold",
  [AlertSourceType.MANUAL_REPORT]: "Manual Report",
  [AlertSourceType.AUTOMATED_SCAN]: "Automated Scan",
  [AlertSourceType.USER_COMPLAINT]: "User Complaint",
  [AlertSourceType.EXTERNAL_REPORT]: "External Report",
};

const IncidentAlertDetails: React.FC<IncidentAlertDetailsProps> = ({ alertId }) => {
  const router = useRouter();
  const idNum = Number(alertId);
  const { data: alert, isLoading } = useGetIncidentAlertQuery(idNum, { skip: Number.isNaN(idNum) });
  const [deleteAlert, { isLoading: isDeleting }] = useDeleteIncidentAlertMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!alert) return;
    try {
      await deleteAlert(alert.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/governance/incidents/alerts");
    } catch (e) {
      console.error("Failed to delete alert:", e);
    }
  };

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid alert ID</p>
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
            <p className="text-[#667085]">Loading alert...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">Alert not found</p>
            <Button onClick={() => router.push("/governance/incidents/alerts")}>Back to Alerts</Button>
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
                Incident Alert Details
              </h1>
              <p className="font-sans text-sm text-[#667085] mt-1">
                View and manage incident alert information
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(`/governance/incidents/alerts/${alert.id}/edit`)}>
                Edit
              </Button>
              <Button variant="outline" className="text-destructive" onClick={() => setDeleteDialogOpen(true)}>
                Delete
              </Button>
              <Button onClick={() => router.push("/governance/incidents/alerts")}>Back</Button>
            </div>
          </div>

          <IncidentAlertFormReadOnly alert={alert} />
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Incident Alert"
        description={`Are you sure you want to delete this alert? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default IncidentAlertDetails;

