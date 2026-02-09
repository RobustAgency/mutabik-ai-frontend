"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetDatasetSubjectPopulationQuery, useDeleteDatasetSubjectPopulationMutation } from "@/app/lib/features/datasetSubjectPopulationApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import DatasetSubjectPopulationFormReadOnly from "./DatasetSubjectPopulationFormReadOnly";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

interface DatasetSubjectPopulationDetailsProps {
  populationId: string;
}

const DatasetSubjectPopulationDetails: React.FC<DatasetSubjectPopulationDetailsProps> = ({ populationId }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: population, isLoading, error } = useGetDatasetSubjectPopulationQuery(populationId);
  const [deletePopulation, { isLoading: isDeleting }] = useDeleteDatasetSubjectPopulationMutation();

  const handleDelete = async () => {
    try {
      await deletePopulation(populationId).unwrap();
      router.push("/core-assets/data/subject-population");
    } catch (error) {
      console.error("Failed to delete subject population:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/core-assets/data/subject-population/${populationId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex items-center justify-center py-20">
            <p className="text-[#667085]">Loading subject population details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !population) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[#667085]">Failed to load subject population details</p>
            <Button onClick={() => router.push("/core-assets/data/subject-population")} className="bg-[#4FD58F] text-white">
              Back to Subject Population
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
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Subject Population Details</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">View subject population information</p>
            </div>
            <div className="flex gap-3">
              <PermissionGate permission={PERMISSIONS.DATASET_SUBJECT_POPULATIONS_EDIT}>
                <Button variant="outline" onClick={handleEdit} className="border-[#E4E7EC] text-[#667085]">Edit</Button>
              </PermissionGate>
              <PermissionGate permission={PERMISSIONS.DATASET_SUBJECT_POPULATIONS_DELETE}>
                <Button variant="outline" onClick={() => setShowDeleteDialog(true)} className="border-[#E4E7EC] text-[#667085]">Delete</Button>
              </PermissionGate>
            </div>
          </div>

          <CardContent className="space-y-6">
            <DatasetSubjectPopulationFormReadOnly population={population} />
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Subject Population"
        description="Are you sure you want to delete this subject population record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default DatasetSubjectPopulationDetails;

