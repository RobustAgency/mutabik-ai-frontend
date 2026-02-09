"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetVendorQuery, useDeleteVendorMutation } from "@/app/lib/features/vendorsApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import VendorFormReadOnly from "./VendorFormReadOnly";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/constants/permissions";

interface VendorDetailsProps {
    vendorId: string | number;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({
    vendorId,
}) => {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data: vendor, isLoading, error } = useGetVendorQuery(vendorId);
    const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorMutation();

    const handleDelete = async () => {
        if (!vendor) return;
        try {
            await deleteVendor(vendor.id).unwrap();
            router.push("/core-assets/vendors");
        } catch (error) {
            console.error("Failed to delete vendor:", error);
        }
    };

    const handleEdit = () => {
        router.push(`/core-assets/vendors/${vendorId}/edit`);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex items-center justify-center py-20">
                        <p className="text-[#667085]">Loading vendor details...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !vendor) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                        <p className="text-[#667085]">Failed to load vendor details</p>
                        <Button
                            onClick={() => router.push("/core-assets/vendors")}
                            className="bg-[#4FD58F] text-white"
                        >
                            Back to Vendors
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
                                Vendor Details
                            </h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                                View and manage vendor information
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <PermissionGate permission={PERMISSIONS.VENDORS_EDIT}>
                                <Button
                                    onClick={handleEdit}
                                    className="flex gap-2 rounded-full border bg-white text-[#1D2939] hover:bg-gray-50"
                                >
                                    Edit
                                </Button>
                            </PermissionGate>
                            <PermissionGate permission={PERMISSIONS.VENDORS_DELETE}>
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
                        <VendorFormReadOnly vendor={vendor} />
                    </CardContent>
                </Card>
            </div>

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Vendor"
                description={`Are you sure you want to delete "${vendor.vendor_name}"? This action cannot be undone and will remove the vendor from the system permanently.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
                loadingText="Deleting..."
            />
        </>
    );
};

export default VendorDetails;


