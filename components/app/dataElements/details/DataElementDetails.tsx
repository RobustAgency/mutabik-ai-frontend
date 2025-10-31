"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetDataElementQuery, useDeleteDataElementMutation } from "@/app/lib/features/dataElementsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import DataElementFormReadOnly from "./DataElementFormReadOnly";

interface DataElementDetailsProps {
  elementId: string;
}

const DataElementDetails: React.FC<DataElementDetailsProps> = ({ elementId }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: element, isLoading, error } = useGetDataElementQuery(elementId);
  const [deleteDataElement, { isLoading: isDeleting }] = useDeleteDataElementMutation();

  const handleDelete = async () => {
    try {
      await deleteDataElement(elementId).unwrap();
      router.push("/core-assets/data/elements");
    } catch (error) {
      console.error("Failed to delete data element:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/core-assets/data/elements/${elementId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading data element details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !element) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Failed to load data element details</p>
            <Button onClick={() => router.push("/core-assets/data/elements")} className="bg-[#4FD58F] text-white">
              Back to Data Elements
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
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Data Element Details</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">View and manage data element information</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleEdit} className="border-[#E4E7EC] text-[#667085]">Edit</Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(true)} className="border-[#E4E7EC] text-[#667085]">Delete</Button>
            </div>
          </div>

          <CardContent className="space-y-6">
            <DataElementFormReadOnly element={element} />
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Data Element"
        description={`Are you sure you want to delete "${element.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default DataElementDetails;

