"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetDataSourceQuery, useDeleteDataSourceMutation } from "@/app/lib/features/dataSourcesApi";
import { EntityDetailsLayout } from "@/components/custom/EntityDetailsLayout";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import DataSourceFormReadOnly from "./DataSourceFormReadOnly";

interface DataSourceDetailsProps {
    dataSourceId: string;
}

const DataSourceDetails: React.FC<DataSourceDetailsProps> = ({
    dataSourceId,
}) => {
    const router = useRouter();

    const { data: dataSource, isLoading, error } = useGetDataSourceQuery(dataSourceId);
    const [deleteDataSource, { isLoading: isDeleting }] = useDeleteDataSourceMutation();

    // Use delete confirmation hook
    const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
        deleteMutation: async (id: string) => {
            await deleteDataSource(id).unwrap();
        },
        isDeleting,
        entityTypeName: "Data Source",
        onSuccess: () => router.push("/core-assets/data/sources"),
    });

    const handleEdit = () => {
        router.push(`/core-assets/data/sources/${dataSourceId}/edit`);
    };

    const handleDelete = () => {
        if (dataSource) {
            openDeleteDialog(dataSourceId, dataSource.name);
        }
    };

    return (
        <>
            <EntityDetailsLayout
                title="Data Source Details"
                description="View and manage data source information"
                loading={isLoading}
                error={error ? "Failed to load data source details" : null}
                onEdit={handleEdit}
                onDelete={handleDelete}
            >
                {dataSource && <DataSourceFormReadOnly dataSource={dataSource} />}
            </EntityDetailsLayout>

            <DeleteConfirmationDialog />
        </>
    );
};

export default DataSourceDetails;

