"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/custom/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
    useGetAiModelArtifactsQuery,
    useDeleteAiModelArtifactMutation,
    AiModelArtifactFilters,
} from "@/app/lib/features/aiModelArtifactsApi";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateISO } from "@/lib/helpers/date";
import { AiModelArtifact } from "@/service/app/aiModelArtifacts";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const ArtifactsMain = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [perPage] = useState(15);
    const [filters, setFilters] = useState<AiModelArtifactFilters>({});
    const [deleteDialogState, setDeleteDialogState] = useState<{
        isOpen: boolean;
        artifactId: number | string | null;
        artifactUri: string;
    }>({
        isOpen: false,
        artifactId: null,
        artifactUri: "",
    });

    const queryParams = useMemo(() => ({
        ...filters,
        page,
        per_page: perPage,
    }), [filters, page, perPage]);

    const { data, isLoading, refetch } = useGetAiModelArtifactsQuery(queryParams);

    const [deleteArtifact, { isLoading: isDeleting }] =
        useDeleteAiModelArtifactMutation();

    const formatDate = (dateString: string | null) => (dateString ? formatDateISO(dateString) : "N/A");

    const formatBytes = (bytes: number | null | undefined) => {
        if (!bytes) return "N/A";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        if (bytes < 1024 * 1024 * 1024)
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    const getArtifactTypeLabel = (type: string) => {
        const typeMap: Record<string, string> = {
            model_binary: "Model Binary",
            tokenizer: "Tokenizer",
            prompt_pack: "Prompt Pack",
            index: "Index",
            feature_store_export: "Feature Store Export",
            config: "Config",
            docker_image: "Docker Image",
            sbom: "SBOM",
        };
        return typeMap[type] || type;
    };

    const handleDeleteClick = (id: number | string, uri: string) => {
        setDeleteDialogState({
            isOpen: true,
            artifactId: id,
            artifactUri: uri,
        });
    };

    const handleCancelDelete = () => {
        setDeleteDialogState({
            isOpen: false,
            artifactId: null,
            artifactUri: "",
        });
    };

    const handleConfirmDelete = async () => {
        if (deleteDialogState.artifactId) {
            try {
                await deleteArtifact(deleteDialogState.artifactId).unwrap();
                setDeleteDialogState({
                    isOpen: false,
                    artifactId: null,
                    artifactUri: "",
                });
                refetch();
            } catch {
                // Error is handled by the mutation's onQueryStarted
            }
        }
    };

    const artifacts = data?.data || [];

    const columns: ColumnDef<AiModelArtifact>[] = [
        {
            accessorKey: "display_id",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Artifact ID
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans text-sm leading-5 tracking-normal text-[#1D2939]">
                    {getValue() as string}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Name
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans text-sm leading-5 tracking-normal text-[#1D2939]">
                    {String(getValue() || "N/A")}
                </div>
            ),
        },
        {
            accessorKey: "artifact_type",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Type
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans font-medium text-sm leading-5 tracking-normal text-[#1D2939]">
                    {getArtifactTypeLabel(String(getValue()))}
                </div>
            ),
        },
        {
            accessorKey: "uri",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    URI
                </div>
            ),
            cell: ({ getValue }) => {
                const uri = String(getValue() || "");
                return (
                    <div className="font-sans text-sm leading-5 tracking-normal text-[#667085] flex items-center gap-2 truncate max-w-[420px]">
                        <span className="truncate">{uri}</span>
                        {uri ? (
                            <a
                                href={uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#175CD3] hover:underline whitespace-nowrap"
                            >
                                Open
                            </a>
                        ) : null}
                    </div>
                );
            },
        },
        {
            accessorKey: "checksum",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Checksum
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-mono text-sm leading-5 tracking-normal text-[#667085] truncate max-w-[260px]">
                    {String(getValue() || "-")}
                </div>
            ),
        },
        {
            accessorKey: "size_bytes",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Size
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans text-sm leading-5 tracking-normal text-[#667085]">
                    {formatBytes(getValue() as number | null | undefined)}
                </div>
            ),
        },
        {
            accessorKey: "created_at",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085]">
                    Created
                </div>
            ),
            cell: ({ getValue }) => (
                <div className="font-sans text-sm leading-5 tracking-normal text-[#667085]">
                    {formatDate(String(getValue() ?? ""))}
                </div>
            ),
        },
        {
            id: "actions",
            header: () => (
                <div className="font-sans font-medium text-[12px] leading-4 tracking-normal text-[#667085] text-right">
                    Actions
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-2">
                    {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/core-assets/ai-models/artifacts/${row.original.id}`);
                        }}
                        className="h-8 border-[#D0D5DD] text-[#344054] hover:bg-[#F9FAFB]"
                    >
                        View
                    </Button> */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(row.original.id, row.original.uri);
                        }}
                        className="h-8 border-[#D0D5DD] text-[#DC2626] hover:bg-[#FEF2F2] hover:border-[#DC2626]"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
                    <CardContent className="flex flex-col flex-1 gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                                All AI Model Artifacts
                            </h2>
                            <div className="flex items-center gap-3">
                                <DynamicFilter
                                    filterType="ai-model-artifacts"
                                    filters={filters}
                                    onFiltersChange={(newFilters) => {
                                        setFilters(newFilters as AiModelArtifactFilters);
                                        setPage(1); // Reset to first page when filters change
                                    }}
                                />
                                <Button
                                    onClick={() => router.push("/core-assets/ai-models/artifacts/create")}
                                    className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-4"
                                >
                                    New Artifact
                                </Button>
                            </div>
                        </div>
                        <DataTable
                            columns={columns}
                            data={artifacts}
                            variant="projects"
                            loading={isLoading}
                            onRowClick={(row) => router.push(`/core-assets/ai-models/artifacts/${row.id}`)}
                            pagination={
                                data
                                    ? {
                                        page: data.current_page,
                                        limit: data.per_page,
                                        total: data.total,
                                        totalPages: data.last_page,
                                    }
                                    : undefined
                            }
                            onPageChange={(newPage) => setPage(newPage)}
                            emptyState={{
                                title: "No artifacts found",
                                description: "Get started by creating your first artifact",
                                action: (
                                    <Button onClick={() => router.push("/core-assets/ai-models/artifacts/create")}>New Artifact</Button>
                                ),
                            }}
                        />
                    </CardContent>
                </Card>
            </div>

            <ConfirmationDialog
                isOpen={deleteDialogState.isOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Artifact"
                description={`Are you sure you want to delete this artifact? This action cannot be undone and will remove the artifact from the system permanently.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
                loadingText="Deleting..."
            />
        </>
    );
};

export default ArtifactsMain;
