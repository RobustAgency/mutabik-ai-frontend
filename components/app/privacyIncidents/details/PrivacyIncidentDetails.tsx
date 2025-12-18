"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetPrivacyIncidentQuery,
  useDeletePrivacyIncidentMutation,
} from "@/app/lib/features/privacyIncidentsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";
import type { PrivacyIncident } from "@/interfaces/PrivacyIncident";

interface PrivacyIncidentDetailsProps {
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

const PrivacyIncidentDetails: React.FC<PrivacyIncidentDetailsProps> = ({
  id,
}) => {
  const router = useRouter();
  const numericId = Number(id);

  const { data: incident, isLoading } = useGetPrivacyIncidentQuery(numericId, {
    skip: Number.isNaN(numericId),
  });
  const [deleteIncident, { isLoading: isDeleting }] =
    useDeletePrivacyIncidentMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    if (!incident) return;
    try {
      await deleteIncident(incident.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/privacy/privacy-incidents");
    } catch (e) {
      console.error("Failed to delete privacy incident:", e);
    }
  };

  if (Number.isNaN(numericId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid privacy incident ID</p>
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
            <p className="text-[#667085]">Loading privacy incident...</p>
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
            <p className="text-[#667085]">Privacy incident not found</p>
            <Button onClick={() => router.push("/privacy/privacy-incidents")}>
              Back to Privacy Incidents
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
                  {incident.incident_code}
                </h1>
                <p className="font-sans text-sm text-[#667085]">
                  {incident.incident_title}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/privacy/privacy-incidents/${incident.id}/edit`)
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/privacy/privacy-incidents")}
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
                    <span className="font-medium">Incident Type:</span>{" "}
                    {formatFieldValue(incident.incident_type)}
                  </div>
                  <div>
                    <span className="font-medium">Risk Level:</span>{" "}
                    {formatFieldValue(incident.risk_level)}
                  </div>
                  <div>
                    <span className="font-medium">Is Breach:</span>{" "}
                    {incident.is_breach ? "Yes" : "No"}
                  </div>
                  {incident.breach_criteria_met &&
                    incident.breach_criteria_met.length > 0 && (
                      <div>
                        <span className="font-medium">Breach Criteria:</span>{" "}
                        {incident.breach_criteria_met
                          .map((c) => formatFieldValue(c))
                          .join(", ")}
                      </div>
                    )}
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {formatFieldValue(incident.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Dates & Timeline
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Detected Date:</span>{" "}
                    {formatDate(incident.detected_date)}
                  </div>
                  <div>
                    <span className="font-medium">Occurred Date:</span>{" "}
                    {formatDate(incident.occurred_date)}
                  </div>
                  <div>
                    <span className="font-medium">Notification Deadline:</span>{" "}
                    {formatDate(incident.notification_deadline)}
                  </div>
                  {incident.hours_to_deadline !== null && (
                    <div>
                      <span className="font-medium">Hours to Deadline:</span>{" "}
                      {incident.hours_to_deadline}
                    </div>
                  )}
                  {incident.resolution_date && (
                    <div>
                      <span className="font-medium">Resolution Date:</span>{" "}
                      {formatDate(incident.resolution_date)}
                    </div>
                  )}
                  {incident.days_to_resolution !== null && (
                    <div>
                      <span className="font-medium">Days to Resolution:</span>{" "}
                      {incident.days_to_resolution}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Incident Description
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {incident.incident_description}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  What Happened
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {incident.what_happened}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  How Discovered
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {incident.how_discovered}
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Data Affected
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Data Compromised:</span>{" "}
                    {incident.data_compromised}
                  </div>
                  <div>
                    <span className="font-medium">Data Categories:</span>{" "}
                    {incident.data_categories_affected
                      .map((c) => formatFieldValue(c))
                      .join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Estimated Affected:</span>{" "}
                    {incident.estimated_affected_subjects}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Notification
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Required:</span>{" "}
                    {formatFieldValue(incident.notification_required)}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {formatFieldValue(incident.notification_status)}
                  </div>
                  <div>
                    <span className="font-medium">Authority Notified:</span>{" "}
                    {incident.authority_notified ? "Yes" : "No"}
                  </div>
                  {incident.authority_notified && (
                    <>
                      <div>
                        <span className="font-medium">Authority Date:</span>{" "}
                        {formatDate(incident.authority_notification_date)}
                      </div>
                      <div>
                        <span className="font-medium">Supervisory Authority:</span>{" "}
                        {incident.supervisory_authority || "N/A"}
                      </div>
                    </>
                  )}
                  <div>
                    <span className="font-medium">Subjects Notified:</span>{" "}
                    {incident.subjects_notified ? "Yes" : "No"}
                  </div>
                  {incident.subjects_notified && (
                    <>
                      <div>
                        <span className="font-medium">Subject Date:</span>{" "}
                        {formatDate(incident.subject_notification_date)}
                      </div>
                      <div>
                        <span className="font-medium">Method:</span>{" "}
                        {incident.notification_method
                          ? formatFieldValue(incident.notification_method)
                          : "N/A"}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Immediate Actions
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {incident.immediate_actions}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Mitigation Measures
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {incident.mitigation_measures}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Preventive Measures
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {incident.preventive_measures}
                </p>
              </div>

              {incident.root_cause_analysis && (
                <div className="space-y-2 md:col-span-2">
                  <h2 className="font-sans font-medium text-sm text-[#475467]">
                    Root Cause Analysis
                  </h2>
                  <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                    {incident.root_cause_analysis}
                  </p>
                </div>
              )}

              {incident.lessons_learned && (
                <div className="space-y-2 md:col-span-2">
                  <h2 className="font-sans font-medium text-sm text-[#475467]">
                    Lessons Learned
                  </h2>
                  <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                    {incident.lessons_learned}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Related Information
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Affected Systems:</span>{" "}
                    {incident.affected_systems.length > 0
                      ? incident.affected_systems.join(", ")
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Third Party Involved:</span>{" "}
                    {incident.third_party_involved ? "Yes" : "No"}
                  </div>
                  {incident.responsible_party && (
                    <div>
                      <span className="font-medium">Responsible Party:</span>{" "}
                      {incident.responsible_party}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Metadata
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Created At:</span>{" "}
                    {formatDate(incident.created_at)}
                  </div>
                  <div>
                    <span className="font-medium">Updated At:</span>{" "}
                    {formatDate(incident.updated_at)}
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
        title="Delete Privacy Incident"
        description={`Are you sure you want to delete "${incident.incident_code}"? This action cannot be undone and will remove the incident from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default PrivacyIncidentDetails;

