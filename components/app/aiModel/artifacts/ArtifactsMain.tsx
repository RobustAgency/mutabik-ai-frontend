"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    useGetAiModelArtifactsQuery,
    useDeleteAiModelArtifactMutation,
} from "@/app/lib/features/aiModelArtifactsApi";
import { Trash2, ExternalLink } from "lucide-react";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateISO } from "@/lib/helpers/date";

const ArtifactsMain = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [perPage] = useState(15);
    const [deleteDialogState, setDeleteDialogState] = useState<{
        isOpen: boolean;
        artifactId: number | string | null;
        artifactUri: string;
    }>({
        isOpen: false,
        artifactId: null,
        artifactUri: "",
    });

    const { data, isLoading, refetch } = useGetAiModelArtifactsQuery({
        page,
        per_page: perPage,
    });

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
            } catch (error) {
                // Error is handled by the mutation's onQueryStarted
            }
        }
    };

    const artifacts = data?.data || [];
    const totalPages = data?.last_page || 1;

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
                    <CardContent className="flex flex-col flex-1 gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                                All AI Model Artifacts
                            </h2>
                            <Button
                                onClick={() => router.push("/core-assets/ai-models/artifacts/create")}
                                className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
                            >
                                New Artifact
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading ? (
                                <div className="col-span-full text-sm text-muted-foreground">
                                    Loading...
                                </div>
                            ) : artifacts.length === 0 ? (
                                <div className="col-span-full text-sm text-muted-foreground">
                                    No artifacts found
                                </div>
                            ) : (
                                artifacts.map((artifact) => (
                                    <Card
                                        key={artifact.id}
                                        className="rounded-2xl border border-[#E4E7EC] bg-white shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <CardContent className="p-6 flex flex-col gap-4">
                                            {/* Header with artifact ID and type */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-[#101828] leading-7">
                                                        {artifact.artifact_id || `Artifact #${artifact.id}`}
                                                    </h3>
                                                    <p className="text-sm text-[#667085] mt-1">
                                                        {getArtifactTypeLabel(artifact.artifact_type)}
                                                    </p>
                                                </div>
                                                <span className="px-2.5 py-0.5 rounded-md bg-[#EFF8FF] text-[#175CD3] text-xs font-medium">
                                                    {artifact.artifact_type}
                                                </span>
                                            </div>

                                            {/* URI */}
                                            <div className="space-y-1">
                                                <span className="text-xs text-[#667085]">URI</span>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-[#475467] leading-5 truncate">
                                                        {artifact.uri}
                                                    </p>
                                                    {artifact.uri && (
                                                        <a
                                                            href={artifact.uri}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[#175CD3] hover:underline"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Model Version Info */}
                                            {artifact.ai_model_version && (
                                                <div className="space-y-1">
                                                    <span className="text-xs text-[#667085]">Model Version</span>
                                                    <p className="text-sm text-[#475467] leading-5">
                                                        {artifact.ai_model_version.ai_model?.name || "N/A"} • v
                                                        {artifact.ai_model_version.version || artifact.ai_model_version.id}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Metadata */}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-[#667085] text-xs">Size</span>
                                                    <span className="text-[#101828] font-medium mt-1">
                                                        {formatBytes(artifact.size_bytes)}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[#667085] text-xs">Created</span>
                                                    <span className="text-[#101828] font-medium mt-1">
                                                        {formatDate(artifact.created_at)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Checksum */}
                                            {artifact.checksum && (
                                                <div className="space-y-1">
                                                    <span className="text-xs text-[#667085]">Checksum</span>
                                                    <p className="text-sm text-[#475467] leading-5 font-mono truncate">
                                                        {artifact.checksum}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Notes */}
                                            {artifact.notes && (
                                                <div className="space-y-1">
                                                    <span className="text-xs text-[#667085]">Notes</span>
                                                    <p className="text-sm text-[#475467] leading-5 line-clamp-2">
                                                        {artifact.notes}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-3 pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.push(
                                                            `/core-assets/ai-models/artifacts/${artifact.id}`
                                                        )
                                                    }
                                                    className="flex-1 h-10 border-[#D0D5DD] text-[#344054] hover:bg-[#F9FAFB]"
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteClick(artifact.id, artifact.uri)
                                                    }
                                                    className="h-10 border-[#D0D5DD] text-[#DC2626] hover:bg-[#FEF2F2] hover:border-[#DC2626]"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between gap-4 pt-4">
                                <div className="text-sm text-[#667085]">
                                    Showing {data?.from || 0} to {data?.to || 0} of {data?.total || 0}{" "}
                                    artifacts
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="h-10 border-[#D0D5DD] text-[#344054]"
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-[#344054]">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="h-10 border-[#D0D5DD] text-[#344054]"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
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
