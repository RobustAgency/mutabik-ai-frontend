"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetDataSourceQuery, useDeleteDataSourceMutation } from "@/app/lib/features/dataSourcesApi";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import DataSourceFormReadOnly from "./DataSourceFormReadOnly";

interface DataSourceDetailsProps {
    dataSourceId: string;
}

const DataSourceDetails: React.FC<DataSourceDetailsProps> = ({
    dataSourceId,
}) => {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data: dataSource, isLoading, error } = useGetDataSourceQuery(dataSourceId);
    const [deleteDataSource, { isLoading: isDeleting }] = useDeleteDataSourceMutation();

    const handleDelete = async () => {
        try {
            await deleteDataSource(dataSourceId).unwrap();
            router.push("/core-assets/data/sources");
        } catch (error) {
            console.error("Failed to delete data source:", error);
        }
    };

    const handleEdit = () => {
        router.push(`/core-assets/data/sources/${dataSourceId}/edit`);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex items-center justify-center py-20">
                        <p className="text-[#667085]">Loading data source details...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !dataSource) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                        <p className="text-[#667085]">Failed to load data source details</p>
                        <Button
                            onClick={() => router.push("/core-assets/data/sources")}
                            className="bg-[#4FD58F] text-white"
                        >
                            Back to Data Sources
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
                                Data Source Details
                            </h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                                View and manage data source information
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleEdit}
                                className="border-[#E4E7EC] text-[#667085]"
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(true)}
                                className="border-[#E4E7EC] text-[#667085]"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>

                    <CardContent className="space-y-6">
                        <DataSourceFormReadOnly dataSource={dataSource} />
                    </CardContent>
                </Card>
            </div>

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Data Source"
                description={`Are you sure you want to delete "${dataSource.name}"? This action cannot be undone and will remove the data source from the system permanently.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
                loadingText="Deleting..."
            />
        </>
    );
};

export default DataSourceDetails;

