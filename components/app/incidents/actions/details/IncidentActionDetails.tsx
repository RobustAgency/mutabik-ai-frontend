"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetIncidentActionQuery,
  useDeleteIncidentActionMutation,
  type IncidentAction,
} from "@/app/lib/features/incidentActionsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import IncidentActionFormReadOnly from "./IncidentActionFormReadOnly";

interface IncidentActionDetailsProps {
  actionId: string;
}

const IncidentActionDetails: React.FC<IncidentActionDetailsProps> = ({
  actionId,
}) => {
  const router = useRouter();
  const idNum = Number(actionId);
  const { data: action, isLoading } = useGetIncidentActionQuery(idNum, {
    skip: Number.isNaN(idNum),
  });
  const [deleteAction, { isLoading: isDeleting }] =
    useDeleteIncidentActionMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!action) return;
    try {
      await deleteAction(action.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/governance/incidents/actions");
    } catch (e) {
      console.error("Failed to delete action:", e);
    }
  };

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid action ID</p>
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
            <p className="text-[#667085]">Loading action...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!action) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">Action not found</p>
            <Button onClick={() => router.push("/governance/incidents/actions")}>
              Back to Actions
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
                Incident Action Details
              </h1>
              <p className="font-sans text-sm text-[#667085] mt-1">
                View and manage incident action information
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/governance/incidents/actions/${action.id}/edit`)
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
              <Button onClick={() => router.push("/governance/incidents/actions")}>
                Back
              </Button>
            </div>
          </div>

          <IncidentActionFormReadOnly action={action} />
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Incident Action"
        description={`Are you sure you want to delete this action? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default IncidentActionDetails;

