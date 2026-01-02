"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetAiIncidentQuery, useDeleteAiIncidentMutation } from "@/app/lib/features/aiIncidentsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import AiIncidentFormReadOnly from "./AiIncidentFormReadOnly";

interface AiIncidentDetailsProps {
  incidentId: string;
}

const AiIncidentDetails: React.FC<AiIncidentDetailsProps> = ({ incidentId }) => {
  const router = useRouter();
  const idNum = Number(incidentId);
  const { data: incident, isLoading } = useGetAiIncidentQuery(idNum, { skip: Number.isNaN(idNum) });
  const [deleteIncident, { isLoading: isDeleting }] = useDeleteAiIncidentMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!incident) return;
    try {
      await deleteIncident(incident.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/governance/incidents");
    } catch (e) {
      console.error("Failed to delete incident:", e);
    }
  };

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid incident ID</p>
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
            <p className="text-[#667085]">Loading incident...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">Incident not found</p>
            <Button onClick={() => router.push("/governance/incidents")}>Back to Incidents</Button>
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
                AI Incident Details
              </h1>
              <p className="font-sans text-sm text-[#667085] mt-1">
                View and manage AI incident information
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push(`/governance/incidents/${incident.id}/edit`)}>
                Edit
              </Button>
              <Button variant="outline" className="text-destructive" onClick={() => setDeleteDialogOpen(true)}>
                Delete
              </Button>
              <Button onClick={() => router.push("/governance/incidents")}>Back</Button>
            </div>
          </div>

          <AiIncidentFormReadOnly incident={incident} />
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete AI Incident"
        description={`Are you sure you want to delete "${incident.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default AiIncidentDetails;
