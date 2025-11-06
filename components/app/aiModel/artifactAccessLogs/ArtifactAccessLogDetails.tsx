"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetArtifactAccessLogQuery } from "@/app/lib/features/artifactAccessLogsApi";
import { ArrowLeft } from "lucide-react";
import { formatDateISO } from "@/lib/helpers/date";
import { AccessAction, AccessContext } from "@/service/app/artifactAccessLogs";

interface ArtifactAccessLogDetailsProps {
    logId: number | string;
}

const ArtifactAccessLogDetails: React.FC<ArtifactAccessLogDetailsProps> = ({ logId }) => {
    const router = useRouter();
    const { data: log, isLoading, error } = useGetArtifactAccessLogQuery(logId);

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

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
                    <CardContent className="py-8 text-center">
                        <p className="text-sm text-[#667085]">Loading...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !log) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
                    <CardContent className="py-8 text-center">
                        <p className="text-sm text-red-500">Error loading access log or log not found</p>
                        <Button
                            onClick={() => router.push("/core-assets/ai-models/artifact-access-logs")}
                            variant="outline"
                            className="mt-4"
                        >
                            Back to List
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
                <CardContent className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push("/core-assets/ai-models/artifact-access-logs")}
                                className="h-10 border-[#D0D5DD] text-[#344054]"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                                    Access Log #{log.id}
                                </h1>
                                <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                                    Artifact access log details
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Artifact Information */}
                        <div className="space-y-4">
                            <h2 className="font-sans font-semibold text-base tracking-normal text-[#1D2939]">
                                Artifact Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs text-[#667085]">Artifact ID</span>
                                    <p className="text-sm font-medium text-[#101828] mt-1">
                                        {log.artifact?.artifact_id || `Artifact #${log.artifact_id}`}
                                    </p>
                                </div>
                                {log.artifact?.artifact_type && (
                                    <div>
                                        <span className="text-xs text-[#667085]">Artifact Type</span>
                                        <p className="text-sm text-[#475467] mt-1">
                                            {log.artifact.artifact_type}
                                        </p>
                                    </div>
                                )}
                                {log.artifact?.uri && (
                                    <div>
                                        <span className="text-xs text-[#667085]">URI</span>
                                        <p className="text-sm text-[#475467] mt-1 break-all">
                                            {log.artifact.uri}
                                        </p>
                                    </div>
                                )}
                                {log.artifact?.ai_model_version?.ai_model?.name && (
                                    <div>
                                        <span className="text-xs text-[#667085]">Model</span>
                                        <p className="text-sm text-[#475467] mt-1">
                                            {log.artifact.ai_model_version.ai_model.name} • v
                                            {log.artifact.ai_model_version.version || log.artifact.ai_model_version.id}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Access Information */}
                        <div className="space-y-4">
                            <h2 className="font-sans font-semibold text-base tracking-normal text-[#1D2939]">
                                Access Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs text-[#667085]">Accessor</span>
                                    <p className="text-sm font-medium text-[#101828] mt-1">
                                        {log.accessor_stakeholder?.display_name || "N/A"}
                                    </p>
                                    {log.accessor_stakeholder?.email && (
                                        <p className="text-xs text-[#667085] mt-1">
                                            {log.accessor_stakeholder.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <span className="text-xs text-[#667085]">Action</span>
                                    <p className="mt-1">
                                        <span className="px-2 py-1 rounded-md bg-[#EFF8FF] text-[#175CD3] text-xs font-medium">
                                            {getActionLabel(log.action)}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-[#667085]">Context</span>
                                    <p className="text-sm text-[#475467] mt-1">
                                        {getContextLabel(log.context)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-[#667085]">Timestamp</span>
                                    <p className="text-sm text-[#475467] mt-1">
                                        {formatDateISO(log.ts)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4 md:col-span-2">
                            <h2 className="font-sans font-semibold text-base tracking-normal text-[#1D2939]">
                                Additional Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {log.ip_or_agent && (
                                    <div>
                                        <span className="text-xs text-[#667085]">IP or Agent</span>
                                        <p className="text-sm text-[#475467] mt-1 break-all">
                                            {log.ip_or_agent}
                                        </p>
                                    </div>
                                )}
                                {log.request_id && (
                                    <div>
                                        <span className="text-xs text-[#667085]">Request ID</span>
                                        <p className="text-sm text-[#475467] mt-1 break-all">
                                            {log.request_id}
                                        </p>
                                    </div>
                                )}
                                {log.reason && (
                                    <div className="md:col-span-2">
                                        <span className="text-xs text-[#667085]">Reason</span>
                                        <p className="text-sm text-[#475467] mt-1">
                                            {log.reason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="space-y-4 md:col-span-2">
                            <h2 className="font-sans font-semibold text-base tracking-normal text-[#1D2939]">
                                Metadata
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <span className="text-xs text-[#667085]">Created At</span>
                                    <p className="text-sm text-[#475467] mt-1">
                                        {formatDateISO(log.created_at)}
                                    </p>
                                </div>
                                {log.updated_at && (
                                    <div>
                                        <span className="text-xs text-[#667085]">Updated At</span>
                                        <p className="text-sm text-[#475467] mt-1">
                                            {formatDateISO(log.updated_at)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ArtifactAccessLogDetails;

