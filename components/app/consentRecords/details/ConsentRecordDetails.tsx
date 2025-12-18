"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetConsentRecordQuery,
  useDeleteConsentRecordMutation,
} from "@/app/lib/features/consentRecordsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";

interface ConsentRecordDetailsProps {
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

const ConsentRecordDetails: React.FC<ConsentRecordDetailsProps> = ({ id }) => {
  const router = useRouter();
  const numericId = Number(id);

  const { data: record, isLoading } = useGetConsentRecordQuery(numericId, {
    skip: Number.isNaN(numericId),
  });
  const [deleteRecord, { isLoading: isDeleting }] =
    useDeleteConsentRecordMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    if (!record) return;
    try {
      await deleteRecord(record.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/privacy/consent/records");
    } catch (e) {
      console.error("Failed to delete consent record:", e);
    }
  };

  if (Number.isNaN(numericId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid consent record ID</p>
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
            <p className="text-[#667085]">Loading consent record...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">Consent record not found</p>
            <Button onClick={() => router.push("/privacy/consent/records")}>
              Back to Consent Records
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
                  Consent {record.consent_code}
                </h1>
                <p className="font-sans text-sm text-[#667085]">
                  Subject: {record.subject_key}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/privacy/consent/records/${record.id}/edit`)
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
                  onClick={() => router.push("/privacy/consent/records")}
                >
                  Back to list
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Subject Information
                </h2>
                <div className="text-sm text-[#667085]">
                  <div>
                    <span className="font-medium">Subject Key:</span>{" "}
                    {record.subject_key}
                  </div>
                  <div>
                    <span className="font-medium">Realm:</span>{" "}
                    {formatFieldValue(record.subject_realm)}
                  </div>
                  <div>
                    <span className="font-medium">Age Group:</span>{" "}
                    {record.subject_age_group || "N/A"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Processing & Status
                </h2>
                <div className="text-sm text-[#667085]">
                  <div>
                    <span className="font-medium">Purpose:</span>{" "}
                    {formatFieldValue(record.purpose)}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {formatFieldValue(record.status)}
                  </div>
                  <div>
                    <span className="font-medium">Lifecycle Stage:</span>{" "}
                    {formatFieldValue(record.lifecycle_stage)}
                  </div>
                  <div>
                    <span className="font-medium">Consent Version:</span>{" "}
                    {record.consent_version}
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Consent Text
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {record.consent_text}
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Timing
                </h2>
                <div className="text-sm text-[#667085]">
                  <div>
                    <span className="font-medium">Effective From:</span>{" "}
                    {formatDate(record.effective_from)}
                  </div>
                  <div>
                    <span className="font-medium">Effective To:</span>{" "}
                    {formatDate(record.effective_to)}
                  </div>
                  <div>
                    <span className="font-medium">Obtained Date:</span>{" "}
                    {formatDate(record.obtained_date)}
                  </div>
                  <div>
                    <span className="font-medium">Withdrawal Date:</span>{" "}
                    {formatDate(record.withdrawal_date)}
                  </div>
                  <div>
                    <span className="font-medium">Last Refreshed:</span>{" "}
                    {formatDate(record.last_refreshed_date)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Metadata
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Source System:</span>{" "}
                    {formatFieldValue(record.source_system)}
                  </div>
                  <div>
                    <span className="font-medium">Language:</span>{" "}
                    {record.language.toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium">Jurisdiction:</span>{" "}
                    {formatFieldValue(record.jurisdiction)}
                  </div>
                  <div>
                    <span className="font-medium">IP Address:</span>{" "}
                    {record.ip_address || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">User Agent:</span>{" "}
                    {record.user_agent || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Evidence URI:</span>{" "}
                    {record.evidence_uri ? (
                      <a
                        href={record.evidence_uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2563EB] underline"
                      >
                        View evidence
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Data Categories & Withdrawal
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Data Categories:</span>{" "}
                    {record.data_categories.length
                      ? record.data_categories
                          .map((c) => formatFieldValue(c))
                          .join(", ")
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Can Withdraw:</span>{" "}
                    {record.can_withdraw ? "Yes" : "No"}
                  </div>
                  <div>
                    <span className="font-medium">Withdrawal Method:</span>{" "}
                    {record.withdrawal_method}
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
        title="Delete Consent Record"
        description="Are you sure you want to delete this consent record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default ConsentRecordDetails;


