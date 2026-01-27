"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetRegulatorySubmissionQuery,
  useDeleteRegulatorySubmissionMutation,
} from "@/app/lib/features/regulatorySubmissionsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";

interface RegulatorySubmissionDetailsProps {
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

const RegulatorySubmissionDetails: React.FC<RegulatorySubmissionDetailsProps> = ({
  id,
}) => {
  const router = useRouter();
  const numericId = Number(id);

  const { data: submission, isLoading } = useGetRegulatorySubmissionQuery(numericId, {
    skip: Number.isNaN(numericId),
  });
  const [deleteSubmission, { isLoading: isDeleting }] =
    useDeleteRegulatorySubmissionMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    if (!submission) return;
    try {
      await deleteSubmission(submission.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/regulatory-submissions");
    } catch (e) {
      console.error("Failed to delete regulatory submission:", e);
    }
  };

  if (Number.isNaN(numericId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid regulatory submission ID</p>
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
            <p className="text-[#667085]">Loading regulatory submission...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">Regulatory submission not found</p>
            <Button onClick={() => router.push("/regulatory-submissions")}>
              Back to Regulatory Submissions
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
                  {submission.tracking_id}
                </h1>
                <p className="font-sans text-sm text-[#667085]">
                  {submission.authority}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/regulatory-submissions/${submission.id}/edit`)
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
                  onClick={() => router.push("/regulatory-submissions")}
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
                    <span className="font-medium">Authority:</span>{" "}
                    {submission.authority}
                  </div>
                  <div>
                    <span className="font-medium">Submission Type:</span>{" "}
                    {formatFieldValue(submission.submission_type)}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {formatFieldValue(submission.status)}
                  </div>
                  <div>
                    <span className="font-medium">Jurisdiction:</span>{" "}
                    {submission.jurisdiction.join(", ")}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Dates & Timeline
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Submitted At:</span>{" "}
                    {formatDate(submission.submitted_at)}
                  </div>
                  <div>
                    <span className="font-medium">Renewal Due At:</span>{" "}
                    {formatDate(submission.renewal_due_at)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Content Summary
                </h2>
                <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                  {submission.content_summary}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Commitments
                </h2>
                <ul className="list-disc list-inside text-sm text-[#667085] space-y-1">
                  {submission.commitments.map((commitment, index) => (
                    <li key={index}>{commitment}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Related Information
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  {submission.framework && (
                    <div>
                      <span className="font-medium">Framework:</span>{" "}
                      {submission.framework.name}
                    </div>
                  )}
                  {submission.ai_model && (
                    <div>
                      <span className="font-medium">AI Model:</span>{" "}
                      {submission.ai_model.name}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Evidence Bundle IDs:</span>{" "}
                    {submission.evidence_bundle_ids.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Documents URI:</span>{" "}
                    <a
                      href={submission.documents_uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {submission.documents_uri}
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Metadata
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Created At:</span>{" "}
                    {formatDate(submission.created_at)}
                  </div>
                  <div>
                    <span className="font-medium">Updated At:</span>{" "}
                    {formatDate(submission.updated_at)}
                  </div>
                  {submission.submitted_by_user && (
                    <div>
                      <span className="font-medium">Submitted By:</span>{" "}
                      {submission.submitted_by_user.name}
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
        title="Delete Regulatory Submission"
        description={`Are you sure you want to delete "${submission.tracking_id}"? This action cannot be undone and will remove the submission from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default RegulatorySubmissionDetails;

