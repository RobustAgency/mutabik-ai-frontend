"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetDatasetSnapshotQuery, useDeleteDatasetSnapshotMutation } from "@/app/lib/features/datasetSnapshotsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import DatasetSnapshotFormReadOnly from "./DatasetSnapshotFormReadOnly";

interface DatasetSnapshotDetailsProps {
    snapshotId: string;
}

const DatasetSnapshotDetails: React.FC<DatasetSnapshotDetailsProps> = ({ snapshotId }) => {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data: snapshot, isLoading, error } = useGetDatasetSnapshotQuery(snapshotId);
    const [deleteSnapshot, { isLoading: isDeleting }] = useDeleteDatasetSnapshotMutation();

    const handleDelete = async () => {
        try {
            await deleteSnapshot(snapshotId).unwrap();
            router.push("/core-assets/data/snapshots");
        } catch (error) {
            console.error("Failed to delete snapshot:", error);
        }
    };

    const handleEdit = () => {
        router.push(`/core-assets/data/snapshots/${snapshotId}/edit`);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex items-center justify-center py-20">
                        <p className="text-[#667085]">Loading snapshot details...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !snapshot) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                        <p className="text-[#667085]">Failed to load snapshot details</p>
                        <Button onClick={() => router.push("/core-assets/data/snapshots")} className="bg-[#4FD58F] text-white">
                            Back to Snapshots
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
                            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Snapshot Details</h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">View and manage snapshot information</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleEdit} className="border-[#E4E7EC] text-[#667085]">Edit</Button>
                            <Button variant="outline" onClick={() => setShowDeleteDialog(true)} className="border-[#E4E7EC] text-[#667085]">Delete</Button>
                        </div>
                    </div>

                    <CardContent className="space-y-6">
                        <DatasetSnapshotFormReadOnly snapshot={snapshot} />
                    </CardContent>
                </Card>
            </div>

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Snapshot"
                description={`Are you sure you want to delete "${snapshot.version_tag}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
                loadingText="Deleting..."
            />
        </>
    );
};

export default DatasetSnapshotDetails;


