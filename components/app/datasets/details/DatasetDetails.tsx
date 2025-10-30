"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetDatasetQuery, useDeleteDatasetMutation } from "@/app/lib/features/datasetsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import DatasetFormReadOnly from "./DatasetFormReadOnly";

interface DatasetDetailsProps {
    datasetId: string;
}

const DatasetDetails: React.FC<DatasetDetailsProps> = ({ datasetId }) => {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data: dataset, isLoading, error } = useGetDatasetQuery(datasetId);
    const [deleteDataset, { isLoading: isDeleting }] = useDeleteDatasetMutation();

    const handleDelete = async () => {
        try {
            await deleteDataset(datasetId).unwrap();
            router.push("/core-assets/data/registry");
        } catch (error) {
            console.error("Failed to delete dataset:", error);
        }
    };

    const handleEdit = () => {
        router.push(`/core-assets/data/registry/${datasetId}/edit`);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex items-center justify-center py-20">
                        <p className="text-[#667085]">Loading dataset details...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !dataset) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                        <p className="text-[#667085]">Failed to load dataset details</p>
                        <Button onClick={() => router.push("/core-assets/data/registry")} className="bg-[#4FD58F] text-white">
                            Back to Datasets
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
                            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Dataset Details</h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">View and manage dataset information</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleEdit} className="border-[#E4E7EC] text-[#667085]">Edit</Button>
                            <Button variant="outline" onClick={() => setShowDeleteDialog(true)} className="border-[#E4E7EC] text-[#667085]">Delete</Button>
                        </div>
                    </div>

                    <CardContent className="space-y-6">
                        <DatasetFormReadOnly dataset={dataset} />
                    </CardContent>
                </Card>
            </div>

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Dataset"
                description={`Are you sure you want to delete "${dataset.name}"? This action cannot be undone and will remove the dataset from the system permanently.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
                loadingText="Deleting..."
            />
        </>
    );
};

export default DatasetDetails;

