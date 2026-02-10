"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetStakeholderQuery, useDeleteStakeholderMutation } from "@/app/lib/features/stakeholdersApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import StakeholderFormReadOnly from "./StakeholderFormReadOnly";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

interface StakeholderDetailsProps {
    stakeholderId: string | number;
}

const StakeholderDetails: React.FC<StakeholderDetailsProps> = ({
    stakeholderId,
}) => {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data: stakeholder, isLoading, error } = useGetStakeholderQuery(stakeholderId);
    const [deleteStakeholder, { isLoading: isDeleting }] = useDeleteStakeholderMutation();

    const handleDelete = async () => {
        try {
            await deleteStakeholder(stakeholderId).unwrap();
            router.push("/core-assets/stakeholders");
        } catch (error) {
            console.error("Failed to delete stakeholder:", error);
        }
    };

    const handleEdit = () => {
        router.push(`/core-assets/stakeholders/${stakeholderId}/edit`);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex items-center justify-center py-20">
                        <p className="text-[#667085]">Loading stakeholder details...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !stakeholder) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                        <p className="text-[#667085]">Failed to load stakeholder details</p>
                        <Button
                            onClick={() => router.push("/core-assets/stakeholders")}
                            className="bg-[#4FD58F] text-white"
                        >
                            Back to Stakeholders
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
                            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                                Stakeholder Details
                            </h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                                View and manage stakeholder information
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <PermissionGate permission={PERMISSIONS.STAKEHOLDERS_EDIT}>
                                <Button
                                    onClick={handleEdit}
                                    className="flex gap-2 rounded-full border bg-white text-[#1D2939] hover:bg-gray-50"
                                >
                                    Edit
                                </Button>
                            </PermissionGate>
                            <PermissionGate permission={PERMISSIONS.STAKEHOLDERS_DELETE}>
                                <Button
                                    onClick={() => setShowDeleteDialog(true)}
                                    className="flex gap-2 rounded-full border bg-red-50 text-red-600 hover:bg-red-100"
                                >
                                    Delete
                                </Button>
                            </PermissionGate>
                        </div>
                    </div>

                    <CardContent className="space-y-10 w-full">
                        <StakeholderFormReadOnly stakeholder={stakeholder} />
                    </CardContent>
                </Card>
            </div>

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Stakeholder"
                description={`Are you sure you want to delete "${stakeholder.display_name}"? This action cannot be undone and will remove the stakeholder from the system permanently.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
                loadingText="Deleting..."
            />
        </>
    );
};

export default StakeholderDetails;

