"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetComplianceEvidenceQuery,
  useDeleteComplianceEvidenceMutation,
} from "@/app/lib/features/complianceEvidenceApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";
import type { ComplianceEvidence } from "@/interfaces/ComplianceEvidence";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

interface ComplianceEvidenceDetailsProps {
  id: string;
}

const formatFieldValue = (value: string | null | undefined): string => {
  if (!value) return "N/A";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (value: string | null | undefined): string =>
  formatDateShort(value);

const ComplianceEvidenceDetails: React.FC<ComplianceEvidenceDetailsProps> = ({
  id,
}) => {
  const router = useRouter();
  const numericId = Number(id);

  const { data: evidence, isLoading } = useGetComplianceEvidenceQuery(numericId, {
    skip: Number.isNaN(numericId),
  });
  const [deleteEvidence, { isLoading: isDeleting }] =
    useDeleteComplianceEvidenceMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    if (!evidence) return;
    try {
      await deleteEvidence(evidence.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/compliance-evidences");
    } catch (e) {
      console.error("Failed to delete compliance evidence:", e);
    }
  };

  if (Number.isNaN(numericId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid compliance evidence ID</p>
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
            <p className="text-[#667085]">Loading compliance evidence...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">Compliance evidence not found</p>
            <Button onClick={() => router.push("/compliance-evidences")}>
              Back to Compliance Evidences
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
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                  Evidence #{evidence.id}
                </h1>
                <p className="font-sans text-sm text-[#667085]">
                  {evidence.control?.reference || `Control #${evidence.control_id}`}
                </p>
              </div>
              <div className="flex gap-2">
                <PermissionGate permission={PERMISSIONS.COMPLIANCE_EVIDENCES_EDIT}>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/compliance-evidences/${evidence.id}/edit`)
                    }
                  >
                    Edit
                  </Button>
                </PermissionGate>
                <PermissionGate permission={PERMISSIONS.COMPLIANCE_EVIDENCES_DELETE}>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </PermissionGate>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/compliance-evidences")}
                >
                  Back to list
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Basic Information
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Control:</span>{" "}
                    {evidence.control?.reference || `Control #${evidence.control_id}`}
                  </div>
                  {evidence.requirement && (
                    <div>
                      <span className="font-medium">Requirement:</span>{" "}
                      {evidence.requirement.reference}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Artifact Type:</span>{" "}
                    {formatFieldValue(evidence.artifact_type)}
                  </div>
                  <div>
                    <span className="font-medium">Review Outcome:</span>{" "}
                    {evidence.review_outcome
                      ? formatFieldValue(evidence.review_outcome)
                      : "N/A"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Collection Information
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Sampling Method:</span>{" "}
                    {evidence.sampling_method}
                  </div>
                  <div>
                    <span className="font-medium">Collection Period Start:</span>{" "}
                    {formatDate(evidence.collection_period_start)}
                  </div>
                  <div>
                    <span className="font-medium">Collection Period End:</span>{" "}
                    {formatDate(evidence.collection_period_end)}
                  </div>
                  {evidence.collected_by_user && (
                    <div>
                      <span className="font-medium">Collected By:</span>{" "}
                      {evidence.collected_by_user.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Artifact URI
                </h2>
                <a
                  href={evidence.artifact_uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {evidence.artifact_uri}
                </a>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Sample IDs
                </h2>
                <div className="text-sm text-[#667085]">
                  {evidence.sample_ids.length > 0
                    ? evidence.sample_ids.join(", ")
                    : "N/A"}
                </div>
              </div>

              {evidence.reviewed_by_user && (
                <div className="space-y-2">
                  <h2 className="font-sans font-medium text-sm text-[#475467]">
                    Review Information
                  </h2>
                  <div className="text-sm text-[#667085] space-y-1">
                    <div>
                      <span className="font-medium">Reviewed By:</span>{" "}
                      {evidence.reviewed_by_user.name}
                    </div>
                    {evidence.reviewed_at && (
                      <div>
                        <span className="font-medium">Reviewed At:</span>{" "}
                        {formatDate(evidence.reviewed_at)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Metadata
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Hash Checksum:</span>{" "}
                    {evidence.hash_checksum}
                  </div>
                  <div>
                    <span className="font-medium">Created At:</span>{" "}
                    {formatDate(evidence.created_at)}
                  </div>
                  <div>
                    <span className="font-medium">Updated At:</span>{" "}
                    {formatDate(evidence.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Compliance Evidence"
        description={`Are you sure you want to delete evidence #${evidence.id}? This action cannot be undone and will remove the evidence from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default ComplianceEvidenceDetails;

