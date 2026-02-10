"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetConsentCoverageQuery, useDeleteConsentCoverageMutation } from "@/app/lib/features/consentCoverageApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import ConsentCoverageFormReadOnly from "./ConsentCoverageFormReadOnly";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

interface ConsentCoverageDetailsProps {
  coverageId: string;
}

const ConsentCoverageDetails: React.FC<ConsentCoverageDetailsProps> = ({ coverageId }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: coverage, isLoading, error } = useGetConsentCoverageQuery(coverageId);
  const [deleteCoverage, { isLoading: isDeleting }] = useDeleteConsentCoverageMutation();

  const handleDelete = async () => {
    try {
      await deleteCoverage(coverageId).unwrap();
      router.push("/privacy/consent/coverage");
    } catch (error) {
      console.error("Failed to delete consent coverage:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/privacy/consent/coverage/${coverageId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading consent coverage details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !coverage) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Failed to load consent coverage details</p>
            <Button onClick={() => router.push("/privacy/consent/coverage")} className="bg-[#4FD58F] text-white">
              Back to Consent Coverage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-6">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Consent Coverage Details</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">View consent coverage metrics</p>
            </div>
            <div className="flex gap-3">
              <PermissionGate permission={PERMISSIONS.CONSENT_COVERAGES_EDIT}>
                <Button variant="outline" onClick={handleEdit} className="border-[#E4E7EC] text-[#667085]">Edit</Button>
              </PermissionGate>
              <PermissionGate permission={PERMISSIONS.CONSENT_COVERAGES_DELETE}>
                <Button variant="outline" onClick={() => setShowDeleteDialog(true)} className="border-[#E4E7EC] text-[#667085]">Delete</Button>
              </PermissionGate>
            </div>
          </div>

          <CardContent className="space-y-6">
            <ConsentCoverageFormReadOnly coverage={coverage} />
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Consent Coverage"
        description={`Are you sure you want to delete this consent coverage record? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default ConsentCoverageDetails;

