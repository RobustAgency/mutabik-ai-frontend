"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useAiModelVersions } from "@/hooks/app/useAiModelVersions";
import { AiModelVersion, AiModelVersionFilters } from "@/service/app/aiModelVersions";
import { formatDate } from "@/lib/helpers/ui";
import { DynamicFilter } from "@/components/custom/DynamicFilter";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Helper function to format category names safely
const formatCategory = (value: unknown): string => {
    if (typeof value !== 'string' || value.length === 0) return "-";
    return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const AiModelVersions: React.FC = () => {
    const router = useRouter();
    const [filters, setFilters] = React.useState<AiModelVersionFilters>({});
    const { aiModelVersions, loading, deleteAiModelVersion } = useAiModelVersions(filters);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [versionToDelete, setVersionToDelete] = React.useState<AiModelVersion | null>(null);

    // Removed unused handler

    const handleDeleteConfirm = async () => {
        if (versionToDelete) {
            await deleteAiModelVersion(versionToDelete.id);
            setDeleteDialogOpen(false);
            setVersionToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setVersionToDelete(null);
    };

    const columns: ColumnDef<AiModelVersion>[] = [
        {
            accessorKey: "id",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    ID
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {getValue() as string}
                </div>
            ),
        },
        {
            accessorKey: "version_number",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Version
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-semibold text-sm leading-5 tracking-normal text-[#1D2939]">
                    {getValue() as string}
                </div>
            ),
        },
        {
            accessorKey: "ai_model_id",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Model ID
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
                    {getValue() as number}
                </div>
            ),
        },
        {
            accessorKey: "version_type",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Type
                </div>
            ),
            cell: ({ getValue }) => {
                const type = getValue() as string;
                const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
                let badgeClasses = baseClasses;

                switch (type) {
                    case 'major':
                        badgeClasses += " bg-purple-100 text-purple-800";
                        break;
                    case 'minor':
                        badgeClasses += " bg-blue-100 text-blue-800";
                        break;
                    case 'patch':
                        badgeClasses += " bg-gray-100 text-gray-800";
                        break;
                    case 'experimental':
                        badgeClasses += " bg-orange-100 text-orange-800";
                        break;
                    default:
                        badgeClasses += " bg-gray-100 text-gray-800";
                }

                return (
                    <span className={badgeClasses}>
                        {formatCategory(type)}
                    </span>
                );
            },
        },
        {
            accessorKey: "architecture_type",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Architecture
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {formatCategory(getValue() as string)}
                </div>
            ),
        },
        {
            accessorKey: "deployment_status",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Operational
                </div>
            ),
            cell: ({ getValue }) => {
                const status = getValue() as string;
                const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
                let badgeClasses = baseClasses;

                switch (status) {
                    case 'deployed':
                        badgeClasses += " bg-green-100 text-green-800";
                        break;
                    case 'deploying':
                        badgeClasses += " bg-blue-100 text-blue-800";
                        break;
                    case 'failed':
                        badgeClasses += " bg-red-100 text-red-800";
                        break;
                    case 'rollback':
                        badgeClasses += " bg-amber-100 text-amber-800";
                        break;
                    default:
                        badgeClasses += " bg-gray-100 text-gray-800";
                }

                return (
                    <span className={badgeClasses}>
                        {formatCategory(status)}
                    </span>
                );
            },
        },
        {
            accessorKey: "lifecycle_stage",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Lifecycle
                </div>
            ),
            cell: ({ getValue }) => {
                const stage = getValue() as string;
                const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
                let badgeClasses = baseClasses;

                switch (stage) {
                    case 'production':
                        badgeClasses += " bg-green-100 text-green-800";
                        break;
                    case 'staging':
                        badgeClasses += " bg-blue-100 text-blue-800";
                        break;
                    case 'testing':
                        badgeClasses += " bg-amber-100 text-amber-800";
                        break;
                    case 'development':
                        badgeClasses += " bg-gray-100 text-gray-800";
                        break;
                    case 'deprecated':
                        badgeClasses += " bg-red-100 text-red-800";
                        break;
                    case 'retired':
                        badgeClasses += " bg-gray-100 text-gray-800";
                        break;
                    default:
                        badgeClasses += " bg-gray-100 text-gray-800";
                }

                return (
                    <span className={badgeClasses}>
                        {formatCategory(stage)}
                    </span>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Created
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                    {formatDate(getValue() as string)}
                </div>
            ),
        },
    ];

    return (
        <>
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
                <CardContent className="flex flex-col flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">All Model Versions</h2>
                        <div className="flex items-center gap-4">
                            <DynamicFilter
                                filterType="ai-model-versions"
                                filters={filters}
                                onFiltersChange={(newFilters) => setFilters(newFilters as AiModelVersionFilters)}
                            />
                            <Button
                                onClick={() => router.push("/core-assets/ai-models/versions/create")}
                                className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
                            >
                                New AI Model Version
                            </Button>
                        </div>
                    </div>
                    <Card className="bg-white w-full rounded-xl border-0 py-0">
                        <DataTable
                            columns={columns}
                            data={aiModelVersions ?? []}
                            variant="projects"
                            loading={loading}
                            onRowClick={(row) => router.push(`/core-assets/ai-models/versions/${row.id}`)}
                            emptyState={{
                                title: "No model versions found",
                                description: "Get started by creating your first AI model version",
                                action: (
                                    <Button onClick={() => router.push("/core-assets/ai-models/versions/create")}>
                                        Create Model Version
                                    </Button>
                                )
                            }}
                        />
                    </Card>
                </CardContent>
            </Card>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Model Version</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete version <strong>{(versionToDelete as any)?.version_number}</strong>?
                            This action cannot be undone and will permanently remove the model version.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleDeleteCancel}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AiModelVersions;
