"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetUserConsentQuery, useDeleteUserConsentMutation } from "@/app/lib/features/userConsentsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import UserConsentFormReadOnly from "./UserConsentFormReadOnly";

interface UserConsentDetailsProps {
  consentId: string;
}

const UserConsentDetails: React.FC<UserConsentDetailsProps> = ({ consentId }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: consent, isLoading, error } = useGetUserConsentQuery(consentId);
  const [deleteConsent, { isLoading: isDeleting }] = useDeleteUserConsentMutation();

  const handleDelete = async () => {
    try {
      await deleteConsent(consentId).unwrap();
      router.push("/privacy/consent/consents");
    } catch (error) {
      console.error("Failed to delete consent:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/privacy/consent/consents/${consentId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading consent details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !consent) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Failed to load consent details</p>
            <Button onClick={() => router.push("/privacy/consent/consents")} className="bg-[#4FD58F] text-white">
              Back to Consents
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
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">User Consent Details</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">View consent information</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleEdit} className="border-[#E4E7EC] text-[#667085]">Edit</Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(true)} className="border-[#E4E7EC] text-[#667085]">Delete</Button>
            </div>
          </div>

          <CardContent className="space-y-6">
            <UserConsentFormReadOnly consent={consent} />
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete User Consent"
        description={`Are you sure you want to delete consent for "${consent.subject_key}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default UserConsentDetails;

