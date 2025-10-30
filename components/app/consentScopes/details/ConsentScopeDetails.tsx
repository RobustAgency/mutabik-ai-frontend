"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetConsentScopeQuery, useDeleteConsentScopeMutation } from "@/app/lib/features/consentScopesApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import ConsentScopeFormReadOnly from "./ConsentScopeFormReadOnly";

interface ConsentScopeDetailsProps {
  scopeId: string;
}

const ConsentScopeDetails: React.FC<ConsentScopeDetailsProps> = ({ scopeId }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: scope, isLoading, error } = useGetConsentScopeQuery(scopeId);
  const [deleteScope, { isLoading: isDeleting }] = useDeleteConsentScopeMutation();

  const handleDelete = async () => {
    try {
      await deleteScope(scopeId).unwrap();
      router.push("/privacy/consent/scopes");
    } catch (error) {
      console.error("Failed to delete consent scope:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/privacy/consent/scopes/${scopeId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading consent scope details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !scope) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Failed to load consent scope details</p>
            <Button onClick={() => router.push("/privacy/consent/scopes")} className="bg-[#4FD58F] text-white">
              Back to Consent Scopes
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
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Consent Scope Details</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">View consent scope information</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleEdit} className="border-[#E4E7EC] text-[#667085]">Edit</Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(true)} className="border-[#E4E7EC] text-[#667085]">Delete</Button>
            </div>
          </div>

          <CardContent className="space-y-6">
            <ConsentScopeFormReadOnly scope={scope} />
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Consent Scope"
        description={`Are you sure you want to delete this consent scope for dataset "${scope.dataset_id}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default ConsentScopeDetails;

