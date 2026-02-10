"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetPdpProcessingRegisterQuery, useDeletePdpProcessingRegisterMutation } from "@/app/lib/features/pdpProcessingRegisterApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import PdpProcessingRegisterFormReadOnly from "./PdpProcessingRegisterFormReadOnly";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

interface PdpProcessingRegisterDetailsProps {
  registerId: string;
}

const PdpProcessingRegisterDetails: React.FC<PdpProcessingRegisterDetailsProps> = ({ registerId }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: register, isLoading, error } = useGetPdpProcessingRegisterQuery(registerId);
  const [deleteRegister, { isLoading: isDeleting }] = useDeletePdpProcessingRegisterMutation();

  const handleDelete = async () => {
    try {
      await deleteRegister(registerId).unwrap();
      router.push("/privacy/pdp-register");
    } catch (error) {
      console.error("Failed to delete register:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/privacy/pdp-register/${registerId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading register details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !register) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Failed to load register details</p>
            <Button onClick={() => router.push("/privacy/pdp-register")} className="bg-[#4FD58F] text-white">
              Back to Registers
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
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">PDP Processing Register Details</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">View and manage processing activity record</p>
            </div>
            <div className="flex gap-3">
              <PermissionGate permission={PERMISSIONS.PDP_PROCESSING_REGISTERS_EDIT}>
                <Button variant="outline" onClick={handleEdit} className="border-[#E4E7EC] text-[#667085]">Edit</Button>
              </PermissionGate>
              <PermissionGate permission={PERMISSIONS.PDP_PROCESSING_REGISTERS_DELETE}>
                <Button variant="outline" onClick={() => setShowDeleteDialog(true)} className="border-[#E4E7EC] text-[#667085]">Delete</Button>
              </PermissionGate>
            </div>
          </div>

          <CardContent className="space-y-6">
            <PdpProcessingRegisterFormReadOnly register={register} />
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Processing Register"
        description={`Are you sure you want to delete "${register.purpose}"? This action cannot be undone and will remove the processing register from the system permanently.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default PdpProcessingRegisterDetails;

