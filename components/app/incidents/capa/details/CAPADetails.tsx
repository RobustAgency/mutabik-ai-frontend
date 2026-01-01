"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetCorrectivePreventiveActionQuery,
  useDeleteCorrectivePreventiveActionMutation,
  type CorrectivePreventiveAction,
} from "@/app/lib/features/correctivePreventiveActionsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import CAPAFormReadOnly from "./CAPAFormReadOnly";

interface CAPADetailsProps {
  capaId: string;
}

const CAPADetails: React.FC<CAPADetailsProps> = ({ capaId }) => {
  const router = useRouter();
  const idNum = Number(capaId);
  const { data: capa, isLoading } = useGetCorrectivePreventiveActionQuery(idNum, {
    skip: Number.isNaN(idNum),
  });
  const [deleteCAPA, { isLoading: isDeleting }] =
    useDeleteCorrectivePreventiveActionMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!capa) return;
    try {
      await deleteCAPA(capa.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/governance/incidents/capa");
    } catch (e) {
      console.error("Failed to delete CAPA:", e);
    }
  };

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid CAPA ID</p>
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
            <p className="text-[#667085]">Loading CAPA...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!capa) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">CAPA not found</p>
            <Button onClick={() => router.push("/governance/incidents/capa")}>
              Back to CAPAs
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
                Corrective/Preventive Action Details
              </h1>
              <p className="font-sans text-sm text-[#667085] mt-1">
                View and manage CAPA information
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/governance/incidents/capa/${capa.id}/edit`)
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
              <Button onClick={() => router.push("/governance/incidents/capa")}>
                Back
              </Button>
            </div>
          </div>

          <CAPAFormReadOnly capa={capa} />
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete CAPA"
        description={`Are you sure you want to delete this CAPA? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default CAPADetails;
