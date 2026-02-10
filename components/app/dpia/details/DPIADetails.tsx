"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetDataProtectionImpactAssessmentQuery,
  useDeleteDataProtectionImpactAssessmentMutation,
} from "@/app/lib/features/dataProtectionImpactAssessmentsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

interface DPIADetailsProps {
  id: string;
}

const formatFieldValue = (value: string | null | undefined): string => {
  if (!value) return "N/A";
  if (value === "us_ca") return "US/CA";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (value: string | null | undefined): string =>
  formatDateShort(value);

const DPIADetails: React.FC<DPIADetailsProps> = ({ id }) => {
  const router = useRouter();
  const numericId = Number(id);

  const { data: dpia, isLoading } = useGetDataProtectionImpactAssessmentQuery(
    numericId,
    {
      skip: Number.isNaN(numericId),
    }
  );
  const [deleteDPIA, { isLoading: isDeleting }] =
    useDeleteDataProtectionImpactAssessmentMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    if (!dpia) return;
    try {
      await deleteDPIA(dpia.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/privacy/dpia");
    } catch (e) {
      console.error("Failed to delete DPIA:", e);
    }
  };

  if (Number.isNaN(numericId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid DPIA ID</p>
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
            <p className="text-[#667085]">Loading DPIA...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dpia) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">DPIA not found</p>
            <Button onClick={() => router.push("/privacy/dpia")}>
              Back to DPIAs
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
                  {dpia.dpia_code} - {dpia.dpia_name}
                </h1>
                <p className="font-sans text-sm text-[#667085]">
                  Risk Level: {formatFieldValue(dpia.risk_level)} | Stage:{" "}
                  {formatFieldValue(dpia.stage)} | Status:{" "}
                  {formatFieldValue(dpia.status)}
                </p>
              </div>
              <div className="flex gap-2">
                <PermissionGate permission={PERMISSIONS.DPIA_EDIT}>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/privacy/dpia/${dpia.id}/edit`)}
                  >
                    Edit
                  </Button>
                </PermissionGate>
                <PermissionGate permission={PERMISSIONS.DPIA_DELETE}>
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
                  onClick={() => router.push("/privacy/dpia")}
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
                    <span className="font-medium">DPIA Code:</span>{" "}
                    {dpia.dpia_code}
                  </div>
                  <div>
                    <span className="font-medium">Name:</span> {dpia.dpia_name}
                  </div>
                  <div>
                    <span className="font-medium">Linked Asset Type:</span>{" "}
                    {formatFieldValue(dpia.linked_asset_type)}
                  </div>
                  <div>
                    <span className="font-medium">ROPA ID:</span> {dpia.ropa_id}
                  </div>
                  {dpia.linked_ai_model_id && (
                    <div>
                      <span className="font-medium">Linked AI Model ID:</span>{" "}
                      {dpia.linked_ai_model_id}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Automated Trigger:</span>{" "}
                    {dpia.automated_trigger ? "Yes" : "No"}
                  </div>
                  <div>
                    <span className="font-medium">Trigger Reason:</span>{" "}
                    {dpia.trigger_reason}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Risk & Stage
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Risk Level:</span>{" "}
                    {formatFieldValue(dpia.risk_level)}
                  </div>
                  <div>
                    <span className="font-medium">Risk Score:</span>{" "}
                    {dpia.risk_score}
                  </div>
                  <div>
                    <span className="font-medium">Stage:</span>{" "}
                    {formatFieldValue(dpia.stage)}
                  </div>
                  <div>
                    <span className="font-medium">Completion:</span>{" "}
                    {dpia.completion_percentage}%
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {formatFieldValue(dpia.status)}
                  </div>
                  {dpia.residual_risk_level && (
                    <div>
                      <span className="font-medium">Residual Risk Level:</span>{" "}
                      {formatFieldValue(dpia.residual_risk_level)}
                    </div>
                  )}
                </div>
              </div>

              {dpia.necessity_justification && (
                <div className="space-y-2 md:col-span-2">
                  <h2 className="font-sans font-medium text-sm text-[#475467]">
                    Necessity Justification
                  </h2>
                  <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                    {dpia.necessity_justification}
                  </p>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Proportionality Assessment
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {dpia.proportionality_assessment}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Alternatives Considered
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {dpia.alternatives_considered}
                </p>
              </div>

              {dpia.identified_risks && (
                <div className="space-y-2 md:col-span-2">
                  <h2 className="font-sans font-medium text-sm text-[#475467]">
                    Identified Risks
                  </h2>
                  <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                    {dpia.identified_risks}
                  </p>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Likelihood Assessment
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {dpia.likelihood_assessment}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Impact Assessment
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {dpia.impact_assessment}
                </p>
              </div>

              {dpia.mitigation_measures && (
                <div className="space-y-2 md:col-span-2">
                  <h2 className="font-sans font-medium text-sm text-[#475467]">
                    Mitigation Measures
                  </h2>
                  <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                    {dpia.mitigation_measures}
                  </p>
                </div>
              )}

              {dpia.dpo_consulted && (
                <div className="space-y-2 md:col-span-2">
                  <h2 className="font-sans font-medium text-sm text-[#475467]">
                    DPO Consultation
                  </h2>
                  <div className="text-sm text-[#667085] space-y-1 bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                    <div>
                      <span className="font-medium">DPO Consulted:</span> Yes
                    </div>
                    {dpia.dpo_consultation_date && (
                      <div>
                        <span className="font-medium">Consultation Date:</span>{" "}
                        {formatDate(dpia.dpo_consultation_date)}
                      </div>
                    )}
                    {dpia.consultation_method && (
                      <div>
                        <span className="font-medium">Consultation Method:</span>{" "}
                        {dpia.consultation_method}
                      </div>
                    )}
                    {dpia.dpo_advice && (
                      <div className="mt-2">
                        <span className="font-medium">DPO Advice:</span>
                        <p className="mt-1 whitespace-pre-line">
                          {dpia.dpo_advice}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Stakeholders & Consultation
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Stakeholders Consulted:</span>{" "}
                    {dpia.stakeholders_consulted &&
                    dpia.stakeholders_consulted.length > 0
                      ? `${dpia.stakeholders_consulted.length} stakeholder(s)`
                      : "None"}
                  </div>
                  <div>
                    <span className="font-medium">Data Subjects Consulted:</span>{" "}
                    {dpia.data_subjects_consulted ? "Yes" : "No"}
                  </div>
                  {dpia.stakeholder_feedback && (
                    <div className="mt-2">
                      <span className="font-medium">Stakeholder Feedback:</span>
                      <p className="mt-1 whitespace-pre-line bg-[#F9FAFB] p-2 rounded border border-[#E5E7EB]">
                        {dpia.stakeholder_feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Approval & Review
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  {dpia.final_decision && (
                    <div>
                      <span className="font-medium">Final Decision:</span>{" "}
                      {formatFieldValue(dpia.final_decision)}
                    </div>
                  )}
                  {dpia.approval_date && (
                    <div>
                      <span className="font-medium">Approval Date:</span>{" "}
                      {formatDate(dpia.approval_date)}
                    </div>
                  )}
                  {dpia.approved_by && (
                    <div>
                      <span className="font-medium">Approved By (User ID):</span>{" "}
                      {dpia.approved_by}
                    </div>
                  )}
                  {dpia.conditions && (
                    <div className="mt-2">
                      <span className="font-medium">Conditions:</span>
                      <p className="mt-1 whitespace-pre-line bg-[#F9FAFB] p-2 rounded border border-[#E5E7EB]">
                        {dpia.conditions}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Review Frequency:</span>{" "}
                    {dpia.review_frequency_months} months
                  </div>
                  {dpia.next_review_date && (
                    <div>
                      <span className="font-medium">Next Review Date:</span>{" "}
                      {formatDate(dpia.next_review_date)}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Applicable Jurisdictions
                </h2>
                <div className="text-sm text-[#667085]">
                  {dpia.applicable_jurisdictions &&
                  dpia.applicable_jurisdictions.length > 0
                    ? dpia.applicable_jurisdictions
                        .map((j) => formatFieldValue(j))
                        .join(", ")
                    : "N/A"}
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
        title="Delete DPIA"
        description="Are you sure you want to delete this DPIA? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default DPIADetails;

