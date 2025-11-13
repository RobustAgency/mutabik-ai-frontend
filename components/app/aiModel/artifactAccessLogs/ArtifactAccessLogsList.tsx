"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    useGetArtifactAccessLogsQuery,
    useDeleteArtifactAccessLogMutation,
} from "@/app/lib/features/artifactAccessLogsApi";
import { Trash2, Eye } from "lucide-react";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { formatDateISO } from "@/lib/helpers/date";
import { ArtifactAccessLogFilters } from "@/service/app/artifactAccessLogs";
import { DynamicFilter } from "@/components/custom/DynamicFilter";

const ArtifactAccessLogsList = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [perPage] = useState(15);
    const [filters, setFilters] = useState<ArtifactAccessLogFilters>({});
    const [deleteDialogState, setDeleteDialogState] = useState<{
        isOpen: boolean;
        logId: number | string | null;
    }>({
        isOpen: false,
        logId: null,
    });

    const queryParams = useMemo(() => ({
        ...filters,
        page,
        per_page: perPage,
    }), [filters, page, perPage]);

    const { data, isLoading, refetch } = useGetArtifactAccessLogsQuery(queryParams);

    const [deleteLog, { isLoading: isDeleting }] =
        useDeleteArtifactAccessLogMutation();

    const formatDate = (dateString: string | null) => (dateString ? formatDateISO(dateString) : "N/A");

    const getActionLabel = (action: string) => {
        const actionMap: Record<string, string> = {
            read: "Read",
            write: "Write",
            download: "Download",
            delete: "Delete",
            update: "Update",
            execute: "Execute",
        };
        return actionMap[action] || action;
    };

    const getContextLabel = (context: string) => {
        const contextMap: Record<string, string> = {
            api: "API",
            web: "Web",
            cli: "CLI",
            batch: "Batch",
            scheduled: "Scheduled",
            manual: "Manual",
        };
        return contextMap[context] || context;
    };

    const handleDeleteClick = (id: number | string) => {
        setDeleteDialogState({
            isOpen: true,
            logId: id,
        });
    };

    const handleCancelDelete = () => {
        setDeleteDialogState({
            isOpen: false,
            logId: null,
        });
    };

    const handleConfirmDelete = async () => {
        if (deleteDialogState.logId) {
            try {
                await deleteLog(deleteDialogState.logId).unwrap();
                setDeleteDialogState({
                    isOpen: false,
                    logId: null,
                });
                refetch();
            } catch {
                // Error is handled by the mutation's onQueryStarted
            }
        }
    };

    const logs = data?.data || [];
    const totalPages = data?.last_page || 1;

    return (
        <>
            <div className="max-w-7xl mx-auto">
                <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
                    <CardContent className="flex flex-col flex-1 gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                                Artifact Access Logs
                            </h2>
                            <div className="flex items-center gap-4">
                                <DynamicFilter
                                    filterType="artifact-access-logs"
                                    filters={filters}
                                    onFiltersChange={(newFilters) => {
                                        setFilters(newFilters as ArtifactAccessLogFilters);
                                        setPage(1); // Reset to first page when filters change
                                    }}
                                />
                                <Button
                                    onClick={() => router.push("/core-assets/ai-models/artifact-access-logs/create")}
                                    className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4"
                                >
                                    New Access Log
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-[#E4E7EC]">
                                        <th className="text-left py-3 px-4 text-xs font-medium text-[#667085]">
                                            Artifact
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-[#667085]">
                                            Accessor
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-[#667085]">
                                            Action
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-[#667085]">
                                            Context
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-[#667085]">
                                            Timestamp
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-[#667085]">
                                            IP/Agent
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-[#667085]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-sm text-[#667085]">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-sm text-[#667085]">
                                                No access logs found
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr
                                                key={log.id}
                                                className="border-b border-[#E4E7EC] hover:bg-[#F9FAFB]"
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-[#101828]">
                                                            {log.artifact?.artifact_id || `Artifact #${log.artifact_id}`}
                                                        </span>
                                                        {log.artifact?.ai_model_version?.ai_model?.name && (
                                                            <span className="text-xs text-[#667085]">
                                                                {log.artifact.ai_model_version.ai_model.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-[#101828]">
                                                            {log.accessor_stakeholder?.display_name || "N/A"}
                                                        </span>
                                                        {log.accessor_stakeholder?.email && (
                                                            <span className="text-xs text-[#667085]">
                                                                {log.accessor_stakeholder.email}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="px-2 py-1 rounded-md bg-[#EFF8FF] text-[#175CD3] text-xs font-medium">
                                                        {getActionLabel(log.action)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm text-[#475467]">
                                                        {getContextLabel(log.context)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm text-[#475467]">
                                                        {formatDate(log.ts)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-sm text-[#475467] truncate max-w-[200px]">
                                                        {log.ip_or_agent || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/core-assets/ai-models/artifact-access-logs/${log.id}`
                                                                )
                                                            }
                                                            className="h-8 border-[#D0D5DD] text-[#344054] hover:bg-[#F9FAFB]"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(log.id)}
                                                            className="h-8 border-[#D0D5DD] text-[#DC2626] hover:bg-[#FEF2F2] hover:border-[#DC2626]"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between gap-4 pt-4">
                                <div className="text-sm text-[#667085]">
                                    Showing {data?.from || 0} to {data?.to || 0} of {data?.total || 0}{" "}
                                    access logs
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
                title="Delete Access Log"
                description={`Are you sure you want to delete this access log? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
                loadingText="Deleting..."
            />
        </>
    );
};

export default ArtifactAccessLogsList;

