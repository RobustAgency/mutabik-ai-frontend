"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetDataSourceQuery, useDeleteDataSourceMutation } from "@/app/lib/features/dataSourcesApi";
import { EntityDetailsLayout } from "@/components/custom/EntityDetailsLayout";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import DataSourceFormReadOnly from "./DataSourceFormReadOnly";
import { usePermissions } from "@/hooks/app/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";

interface DataSourceDetailsProps {
    dataSourceId: string;
}

const DataSourceDetails: React.FC<DataSourceDetailsProps> = ({
    dataSourceId,
}) => {
    const router = useRouter();
    const { hasPermission } = usePermissions();
    const numericId = Number(dataSourceId);

    const { data: dataSource, isLoading, error } = useGetDataSourceQuery(numericId);
    const [deleteDataSource, { isLoading: isDeleting }] = useDeleteDataSourceMutation();

    // Use delete confirmation hook
    const { openDeleteDialog, DeleteConfirmationDialog } = useDeleteConfirmation({
        deleteMutation: async (id: number) => {
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
            openDeleteDialog(numericId, dataSource.name);
        }
    };

    return (
        <>
            <EntityDetailsLayout
                title="Data Source Details"
                description="View and manage data source information"
                loading={isLoading}
                error={error ? "Failed to load data source details" : null}
                onEdit={hasPermission(PERMISSIONS.DATA_SOURCES_EDIT) ? handleEdit : undefined}
                onDelete={hasPermission(PERMISSIONS.DATA_SOURCES_DELETE) ? handleDelete : undefined}
            >
                {dataSource && <DataSourceFormReadOnly dataSource={dataSource} />}
            </EntityDetailsLayout>

            <DeleteConfirmationDialog />
        </>
    );
};

export default DataSourceDetails;

