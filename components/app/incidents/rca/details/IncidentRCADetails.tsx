"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";
import {
  useGetIncidentRootCauseAnalysisQuery,
  useDeleteIncidentRootCauseAnalysisMutation,
} from "@/app/lib/features/incidentRootCauseAnalysesApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import IncidentRCAFormReadOnly from "./IncidentRCAFormReadOnly";

interface IncidentRCADetailsProps {
  rcaId: string;
}

const IncidentRCADetails: React.FC<IncidentRCADetailsProps> = ({
  rcaId,
}) => {
  const router = useRouter();
  const idNum = Number(rcaId);
  const { data: rca, isLoading } = useGetIncidentRootCauseAnalysisQuery(idNum, {
    skip: Number.isNaN(idNum),
  });
  const [deleteRCA, { isLoading: isDeleting }] =
    useDeleteIncidentRootCauseAnalysisMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!rca) return;
    try {
      await deleteRCA(rca.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/governance/incidents/rca");
    } catch (e) {
      console.error("Failed to delete RCA:", e);
    }
  };

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid RCA ID</p>
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
            <p className="text-[#667085]">Loading RCA...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!rca) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">RCA not found</p>
            <Button onClick={() => router.push("/governance/incidents/rca")}>
              Back to RCAs
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
                Root Cause Analysis Details
              </h1>
              <p className="font-sans text-sm text-[#667085] mt-1">
                View and manage root cause analysis information
              </p>
            </div>
            <div className="flex gap-2">
              <PermissionGate permission={PERMISSIONS.INCIDENT_RCA_EDIT}>
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/governance/incidents/rca/${rca.id}/edit`)
                  }
                >
                  Edit
                </Button>
              </PermissionGate>
              <PermissionGate permission={PERMISSIONS.INCIDENT_RCA_DELETE}>
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </PermissionGate>
              <Button onClick={() => router.push("/governance/incidents/rca")}>
                Back
              </Button>
            </div>
          </div>

          <IncidentRCAFormReadOnly rca={rca} />
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Root Cause Analysis"
        description={`Are you sure you want to delete this root cause analysis? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default IncidentRCADetails;

