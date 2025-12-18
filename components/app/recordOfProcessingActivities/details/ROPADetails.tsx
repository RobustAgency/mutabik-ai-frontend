"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetRecordOfProcessingActivityQuery,
  useDeleteRecordOfProcessingActivityMutation,
} from "@/app/lib/features/recordOfProcessingActivitiesApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";

interface ROPADetailsProps {
  activityId: string;
}

const formatFieldValue = (value: string | null | undefined): string => {
  if (!value) return "N/A";
  // Handle special cases
  if (value === "ai/ml") return "AI/ML";
  if (value === "us_ca") return "US/CA";
  // Convert snake_case to Title Case
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ROPADetails: React.FC<ROPADetailsProps> = ({ activityId }) => {
  const router = useRouter();
  const idNum = Number(activityId);
  const { data: activity, isLoading } = useGetRecordOfProcessingActivityQuery(
    idNum,
    { skip: Number.isNaN(idNum) }
  );
  const [deleteActivity, { isLoading: isDeleting }] =
    useDeleteRecordOfProcessingActivityMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    if (!activity) return;
    try {
      await deleteActivity(activity.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/privacy/ropa");
    } catch (e) {
      console.error("Failed to delete processing activity:", e);
    }
  };

  if (Number.isNaN(idNum)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid activity ID</p>
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
            <p className="text-[#667085]">Loading processing activity...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">Processing activity not found</p>
            <Button onClick={() => router.push("/privacy/ropa")}>
              Back to ROPA
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusLabelMap: Record<string, string> = {
    draft: "Draft",
    active: "Active",
    under_review: "Under Review",
    archived: "Archived",
  };

  const statusColors: Record<string, string> = {
    draft: "bg-[#F2F4F7] text-[#667085]",
    active: "bg-[#ECFDF3] text-[#047857]",
    under_review: "bg-[#FEF3C7] text-[#D97706]",
    archived: "bg-[#F3F4F6] text-[#6B7280]",
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                  {activity.activity_name}
                </h1>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/privacy/ropa/${activity.id}/edit`)
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
                <Button onClick={() => router.push("/privacy/ropa")}>
                  Back
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855] mb-4">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#667085]">Status</p>
                    <div
                      className={`inline-block h-[24px] px-3 rounded-full text-xs font-medium ${
                        statusColors[activity.status] ||
                        "bg-[#F2F4F7] text-[#667085]"
                      }`}
                    >
                      {statusLabelMap[activity.status] || activity.status}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">Purpose</p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {activity.purpose}
                    </p>
                  </div>
                  {activity.detailed_purpose && (
                    <div>
                      <p className="text-sm text-[#667085]">Detailed Purpose</p>
                      <p className="text-sm font-medium text-[#1D2939]">
                        {activity.detailed_purpose}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-[#667085]">Owner Team</p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {formatFieldValue(activity.owner_team)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">Controller Role</p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {formatFieldValue(activity.controller_role)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">Version</p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {activity.version}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855] mb-4">
                  Data Categories & Subjects
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#667085]">
                      Data Subject Categories
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {activity.data_subject_categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-1 bg-[#F2F4F7] text-[#667085] rounded text-xs"
                        >
                          {formatFieldValue(cat)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">Data Categories</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {activity.data_categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-1 bg-[#F2F4F7] text-[#667085] rounded text-xs"
                        >
                          {formatFieldValue(cat)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">Contains PII</p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {activity.contains_pii ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855] mb-4">
                  Legal Basis & Consent
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#667085]">Lawful Basis</p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {formatFieldValue(activity.lawful_basis)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">Consent Required</p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {activity.consent_required ? "Yes" : "No"}
                    </p>
                  </div>
                  {activity.consent_required &&
                    activity.consent_coverage_percent !== null && (
                      <div>
                        <p className="text-sm text-[#667085]">
                          Consent Coverage
                        </p>
                        <p className="text-sm font-medium text-[#1D2939]">
                          {activity.consent_coverage_percent}%
                        </p>
                      </div>
                    )}
                  {activity.legitimate_interest_assessment && (
                    <div>
                      <p className="text-sm text-[#667085]">
                        Legitimate Interest Assessment
                      </p>
                      <p className="text-sm font-medium text-[#1D2939]">
                        {activity.legitimate_interest_assessment}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855] mb-4">
                  DPIA Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#667085]">DPIA Required</p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {activity.dpia_required ? "Yes" : "No"}
                    </p>
                  </div>
                  {activity.dpia_required && (
                    <>
                      {activity.dpia_status && (
                        <div>
                          <p className="text-sm text-[#667085]">DPIA Status</p>
                          <p className="text-sm font-medium text-[#1D2939]">
                            {formatFieldValue(activity.dpia_status)}
                          </p>
                        </div>
                      )}
                      {activity.dpia_id && (
                        <div>
                          <p className="text-sm text-[#667085]">DPIA ID</p>
                          <p className="text-sm font-medium text-[#1D2939]">
                            {activity.dpia_id}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855] mb-4">
                  Retention & Security
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#667085]">Retention Period</p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {activity.retention_period}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">
                      Retention Justification
                    </p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {activity.retention_justification}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">Security Measures</p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {activity.security_measures}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855] mb-4">
                  International Transfers & Jurisdictions
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[#667085]">
                      Has International Transfers
                    </p>
                    <p className="text-sm font-medium text-[#1D2939]">
                      {activity.has_international_transfers ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">
                      Applicable Jurisdictions
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {activity.applicable_jurisdictions.map((jur) => (
                        <span
                          key={jur}
                          className="px-2 py-1 bg-[#F2F4F7] text-[#667085] rounded text-xs"
                        >
                          {jur}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855] mb-4">
                  Recipients
                </h3>
                <div className="space-y-3">
                  {activity.internal_recipients.length > 0 && (
                    <div>
                      <p className="text-sm text-[#667085]">
                        Internal Recipients
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {activity.internal_recipients.map((rec) => (
                          <span
                            key={rec}
                            className="px-2 py-1 bg-[#F2F4F7] text-[#667085] rounded text-xs"
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {activity.external_recipients.length > 0 && (
                    <div>
                      <p className="text-sm text-[#667085]">
                        External Recipients
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {activity.external_recipients.map((rec) => (
                          <span
                            key={rec}
                            className="px-2 py-1 bg-[#F2F4F7] text-[#667085] rounded text-xs"
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855] mb-4">
                  Review Schedule
                </h3>
                <div className="space-y-3">
                  {activity.last_reviewed_date && (
                    <div>
                      <p className="text-sm text-[#667085]">
                        Last Reviewed Date
                      </p>
                      <p className="text-sm font-medium text-[#1D2939]">
                        {formatDateShort(activity.last_reviewed_date)}
                      </p>
                    </div>
                  )}
                  {activity.next_review_date && (
                    <div>
                      <p className="text-sm text-[#667085]">Next Review Date</p>
                      <p className="text-sm font-medium text-[#1D2939]">
                        {formatDateShort(activity.next_review_date)}
                      </p>
                    </div>
                  )}
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
        title="Delete Processing Activity"
        description={`Are you sure you want to delete "${activity.activity_name}"? This action cannot be undone and will remove the processing activity from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default ROPADetails;

