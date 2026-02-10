"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetDataSubjectRequestAccessQuery,
  useDeleteDataSubjectRequestAccessMutation,
} from "@/app/lib/features/dataSubjectRequestAccessesApi";
import { useGetOrganizationUsersQuery } from "@/app/lib/features/usersApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateShort } from "@/lib/helpers/date";
import type { DataSubjectRequestAccess } from "@/interfaces/DataSubjectRequestAccess";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

interface DSARDetailsProps {
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

const DSARDetails: React.FC<DSARDetailsProps> = ({ id }) => {
  const router = useRouter();
  const numericId = Number(id);

  const { data: request, isLoading } = useGetDataSubjectRequestAccessQuery(
    numericId,
    {
      skip: Number.isNaN(numericId),
    }
  );
  const [deleteRequest, { isLoading: isDeleting }] =
    useDeleteDataSubjectRequestAccessMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const { data: usersResponse } = useGetOrganizationUsersQuery({
    per_page: 100,
  });
  const users = usersResponse?.data ?? [];

  const getUserName = (userId: number | null | undefined): string => {
    if (!userId) return "N/A";
    const user = users.find((u) => u.id === userId);
    return user ? `${user.name} (${user.email})` : `User #${userId}`;
  };

  const handleDelete = async () => {
    if (!request) return;
    try {
      await deleteRequest(request.id).unwrap();
      setDeleteDialogOpen(false);
      router.push("/privacy/dsar");
    } catch (e) {
      console.error("Failed to delete DSAR:", e);
    }
  };

  if (Number.isNaN(numericId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent>
            <p className="text-[#667085]">Invalid DSAR ID</p>
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
            <p className="text-[#667085]">Loading DSAR request...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-between">
            <p className="text-[#667085]">DSAR request not found</p>
            <Button onClick={() => router.push("/privacy/dsar")}>
              Back to DSAR
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
                  DSAR {request.request_code}
                </h1>
                <p className="font-sans text-sm text-[#667085]">
                  Subject: {request.subject_identifier}
                </p>
              </div>
              <div className="flex gap-2">
                <PermissionGate permission={PERMISSIONS.DSAR_EDIT}>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/privacy/dsar/${request.id}/edit`)}
                  >
                    Edit
                  </Button>
                </PermissionGate>
                <PermissionGate permission={PERMISSIONS.DSAR_DELETE}>
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
                  onClick={() => router.push("/privacy/dsar")}
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
                    <span className="font-medium">Request Type:</span>{" "}
                    {formatFieldValue(request.request_type)}
                  </div>
                  <div>
                    <span className="font-medium">Subject Identifier:</span>{" "}
                    {request.subject_identifier}
                  </div>
                  <div>
                    <span className="font-medium">Subject Name:</span>{" "}
                    {request.subject_name || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Subject Realm:</span>{" "}
                    {formatFieldValue(request.subject_realm)}
                  </div>
                  <div>
                    <span className="font-medium">Request Source:</span>{" "}
                    {formatFieldValue(request.request_source)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Status & Priority
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {formatFieldValue(request.status)}
                  </div>
                  <div>
                    <span className="font-medium">Priority:</span>{" "}
                    {formatFieldValue(request.priority)}
                  </div>
                  <div>
                    <span className="font-medium">Is Overdue:</span>{" "}
                    {request.is_overdue ? "Yes" : "No"}
                  </div>
                  <div>
                    <span className="font-medium">Remaining Days:</span>{" "}
                    {request.remaining_days ?? "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Records Found:</span>{" "}
                    {request.records_found ?? "N/A"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Verification
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Verification Status:</span>{" "}
                    {formatFieldValue(request.verification_status)}
                  </div>
                  <div>
                    <span className="font-medium">Verification Method:</span>{" "}
                    {request.verification_method
                      ? formatFieldValue(request.verification_method)
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Verified By:</span>{" "}
                    {getUserName(request.verified_by)}
                  </div>
                  <div>
                    <span className="font-medium">Verification Date:</span>{" "}
                    {formatDate(request.verification_date)}
                  </div>
                  <div>
                    <span className="font-medium">Subject Key:</span>{" "}
                    {request.subject_key || "N/A"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Dates & Timeline
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Submitted Date:</span>{" "}
                    {formatDate(request.submitted_date)}
                  </div>
                  <div>
                    <span className="font-medium">Due Date:</span>{" "}
                    {formatDate(request.due_date)}
                  </div>
                  <div>
                    <span className="font-medium">Extended Due Date:</span>{" "}
                    {formatDate(request.extended_due_date)}
                  </div>
                  <div>
                    <span className="font-medium">Response Date:</span>{" "}
                    {formatDate(request.response_date)}
                  </div>
                  <div>
                    <span className="font-medium">Completed Date:</span>{" "}
                    {formatDate(request.completed_date)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Assignment
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Assigned To:</span>{" "}
                    {getUserName(request.assigned_to)}
                  </div>
                  <div>
                    <span className="font-medium">Assigned Date:</span>{" "}
                    {formatDate(request.assigned_date)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Response Details
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Response Method:</span>{" "}
                    {request.response_method
                      ? formatFieldValue(request.response_method)
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Response Format:</span>{" "}
                    {request.response_format
                      ? formatFieldValue(request.response_format)
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Response URI:</span>{" "}
                    {request.response_uri ? (
                      <a
                        href={request.response_uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2563EB] underline"
                      >
                        View response
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Jurisdiction:</span>{" "}
                    {request.jurisdiction || "N/A"}
                  </div>
                </div>
              </div>

              {request.request_details && (
                <div className="space-y-2 md:col-span-2">
                  <h2 className="font-sans font-medium text-sm text-[#475467]">
                    Request Details
                  </h2>
                  <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                    {request.request_details}
                  </p>
                </div>
              )}

              {request.requested_data_categories &&
                request.requested_data_categories.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="font-sans font-medium text-sm text-[#475467]">
                      Requested Data Categories
                    </h2>
                    <div className="text-sm text-[#667085]">
                      {request.requested_data_categories.join(", ")}
                    </div>
                  </div>
                )}

              {request.response_notes && (
                <div className="space-y-2">
                  <h2 className="font-sans font-medium text-sm text-[#475467]">
                    Response Notes
                  </h2>
                  <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                    {request.response_notes}
                  </p>
                </div>
              )}

              {request.rejection_reason && (
                <div className="space-y-2">
                  <h2 className="font-sans font-medium text-sm text-[#475467]">
                    Rejection Reason
                  </h2>
                  <p className="text-sm text-[#667085] whitespace-pre-line bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                    {request.rejection_reason}
                  </p>
                </div>
              )}

              {request.processing_activity_ids &&
                request.processing_activity_ids.length > 0 && (
                  <div className="space-y-2">
                    <h2 className="font-sans font-medium text-sm text-[#475467]">
                      Processing Activities
                    </h2>
                    <div className="text-sm text-[#667085]">
                      {request.processing_activity_ids.join(", ")}
                    </div>
                  </div>
                )}

              <div className="space-y-2">
                <h2 className="font-sans font-medium text-sm text-[#475467]">
                  Systems & Metadata
                </h2>
                <div className="text-sm text-[#667085] space-y-1">
                  <div>
                    <span className="font-medium">Systems Checked:</span>{" "}
                    {request.systems_checked.length > 0
                      ? request.systems_checked.join(", ")
                      : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Created At:</span>{" "}
                    {formatDate(request.created_at)}
                  </div>
                  <div>
                    <span className="font-medium">Updated At:</span>{" "}
                    {formatDate(request.updated_at)}
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
        title="Delete DSAR Request"
        description={`Are you sure you want to delete "${request.request_code}"? This action cannot be undone and will remove the request from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default DSARDetails;

