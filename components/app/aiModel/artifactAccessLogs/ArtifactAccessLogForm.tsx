"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
    AccessAction,
    AccessContext,
    type CreateArtifactAccessLogData,
} from "@/service/app/artifactAccessLogs";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { useGetAiModelArtifactsQuery } from "@/app/lib/features/aiModelArtifactsApi";
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";
import StakeholderModalForm from "@/components/app/stakeholders/create/StakeholderModalForm";
import ArtifactModalForm from "@/components/app/aiModel/artifacts/ArtifactModalForm";

interface ArtifactAccessLogFormProps {
    onSubmit: (data: CreateArtifactAccessLogData) => Promise<void> | void;
    loading?: boolean;
}

const actionOptions = [
    { value: AccessAction.READ, label: "Read" },
    { value: AccessAction.WRITE, label: "Write" },
    { value: AccessAction.DOWNLOAD, label: "Download" },
    { value: AccessAction.DELETE, label: "Delete" },
    { value: AccessAction.UPDATE, label: "Update" },
    { value: AccessAction.EXECUTE, label: "Execute" },
];

const contextOptions = [
    { value: AccessContext.API, label: "API" },
    { value: AccessContext.WEB, label: "Web" },
    { value: AccessContext.CLI, label: "CLI" },
    { value: AccessContext.BATCH, label: "Batch" },
    { value: AccessContext.SCHEDULED, label: "Scheduled" },
    { value: AccessContext.MANUAL, label: "Manual" },
];

export default function ArtifactAccessLogForm({
    onSubmit,
    loading,
}: ArtifactAccessLogFormProps) {
    const { data: artifactsData, isLoading: isLoadingArtifacts } = useGetAiModelArtifactsQuery({ per_page: 100 });
    const { data: stakeholders = [], isLoading: isLoadingStakeholders } = useGetStakeholdersQuery();
    
    const artifacts = artifactsData?.data || [];

    const [formData, setFormData] = useState<{
        artifact_id: string;
        accessor_stakeholder_id: string;
        action: string;
        context: string;
        ts: string;
        ip_or_agent: string;
        request_id: string;
        reason: string;
    }>({
        artifact_id: "",
        accessor_stakeholder_id: "",
        action: "",
        context: "",
        ts: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
        ip_or_agent: "",
        request_id: "",
        reason: "",
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const validate = (): boolean => {
        const next: Record<string, string[]> = {};

        if (!formData.artifact_id) {
            next.artifact_id = ["Artifact is required"];
        }

        if (!formData.accessor_stakeholder_id) {
            next.accessor_stakeholder_id = ["Accessor stakeholder is required"];
        }

        if (!formData.action) {
            next.action = ["Action is required"];
        }

        if (!formData.context) {
            next.context = ["Context is required"];
        }

        if (!formData.ts) {
            next.ts = ["Timestamp is required"];
        } else {
            // Validate timestamp format
            const timestamp = new Date(formData.ts);
            if (isNaN(timestamp.getTime())) {
                next.ts = ["Please enter a valid timestamp"];
            }
        }

        if (formData.ip_or_agent && formData.ip_or_agent.length > 255) {
            next.ip_or_agent = ["IP or Agent must be 255 characters or less"];
        }

        if (formData.request_id && formData.request_id.length > 255) {
            next.request_id = ["Request ID must be 255 characters or less"];
        }

        if (formData.reason && formData.reason.length > 255) {
            next.reason = ["Reason must be 255 characters or less"];
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // Convert timestamp to ISO string with timezone
        const timestamp = new Date(formData.ts).toISOString();

        await onSubmit({
            artifact_id: parseInt(formData.artifact_id, 10),
            accessor_stakeholder_id: parseInt(formData.accessor_stakeholder_id, 10),
            action: formData.action,
            context: formData.context,
            ts: timestamp,
            ip_or_agent: formData.ip_or_agent || null,
            request_id: formData.request_id || null,
            reason: formData.reason || null,
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
                    <div>
                        <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                            New Artifact Access Log
                        </h1>
                        <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                            Create a new artifact access log entry
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Access Log"}
                    </Button>
                </div>

                <form id="access-log-form" onSubmit={handleSubmit} className="space-y-6">
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <p className="font-semibold mb-2">Please fix the following errors:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    {Object.entries(errors).map(([field, fieldErrors]) => (
                                        <li key={field}>
                                            <span className="font-medium capitalize">
                                                {field.replace(/_/g, " ")}:
                                            </span>{" "}
                                            {fieldErrors[0]}
                                        </li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Artifact ID */}
                            <div className="space-y-2">
                                <Label htmlFor="artifact_id">
                                    Artifact <span className="text-red-500">*</span>
                                </Label>
                                <SelectWithInlineCreate
                                    value={formData.artifact_id}
                                    onValueChange={(value) => {
                                        setFormData((prev) => ({ ...prev, artifact_id: value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.artifact_id;
                                            return next;
                                        });
                                    }}
                                    options={artifacts.map((artifact) => ({
                                        id: artifact.id,
                                        label: `${artifact.artifact_id || `Artifact #${artifact.id}`} - ${artifact.artifact_type}`,
                                        value: String(artifact.id),
                                    }))}
                                    isLoading={isLoadingArtifacts}
                                    isEmpty={!isLoadingArtifacts && artifacts.length === 0}
                                    entityName="AI Model Artifact"
                                    modalForm={ArtifactModalForm}
                                    placeholder="Select artifact..."
                                    triggerClassName={`w-full ${errors.artifact_id ? "border-red-500" : ""}`}
                                    error={!!errors.artifact_id}
                                />
                                {errors.artifact_id && (
                                    <p className="text-sm text-red-500">{errors.artifact_id[0]}</p>
                                )}
                            </div>

                            {/* Accessor Stakeholder ID */}
                            <div className="space-y-2">
                                <Label htmlFor="accessor_stakeholder_id">
                                    Accessor Stakeholder <span className="text-red-500">*</span>
                                </Label>
                                <SelectWithInlineCreate
                                    value={formData.accessor_stakeholder_id}
                                    onValueChange={(value) => {
                                        setFormData((prev) => ({ ...prev, accessor_stakeholder_id: value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.accessor_stakeholder_id;
                                            return next;
                                        });
                                    }}
                                    options={stakeholders.map((stakeholder) => ({
                                        id: stakeholder.id,
                                        label: stakeholder.display_name,
                                        value: String(stakeholder.id),
                                    }))}
                                    isLoading={isLoadingStakeholders}
                                    isEmpty={!isLoadingStakeholders && stakeholders.length === 0}
                                    entityName="Stakeholder"
                                    modalForm={StakeholderModalForm}
                                    placeholder="Select stakeholder..."
                                    triggerClassName={`w-full ${errors.accessor_stakeholder_id ? "border-red-500" : ""}`}
                                    error={!!errors.accessor_stakeholder_id}
                                />
                                {errors.accessor_stakeholder_id && (
                                    <p className="text-sm text-red-500">{errors.accessor_stakeholder_id[0]}</p>
                                )}
                            </div>

                            {/* Action */}
                            <div className="space-y-2">
                                <Label htmlFor="action">
                                    Action <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.action}
                                    onValueChange={(value) => {
                                        setFormData((prev) => ({ ...prev, action: value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.action;
                                            return next;
                                        });
                                    }}
                                >
                                    <SelectTrigger
                                        className={`w-full ${errors.action ? "border-red-500" : ""}`}
                                    >
                                        <SelectValue placeholder="Select action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {actionOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.action && (
                                    <p className="text-sm text-red-500">{errors.action[0]}</p>
                                )}
                            </div>

                            {/* Context */}
                            <div className="space-y-2">
                                <Label htmlFor="context">
                                    Context <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.context}
                                    onValueChange={(value) => {
                                        setFormData((prev) => ({ ...prev, context: value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.context;
                                            return next;
                                        });
                                    }}
                                >
                                    <SelectTrigger
                                        className={`w-full ${errors.context ? "border-red-500" : ""}`}
                                    >
                                        <SelectValue placeholder="Select context" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contextOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.context && (
                                    <p className="text-sm text-red-500">{errors.context[0]}</p>
                                )}
                            </div>

                            {/* Timestamp */}
                            <div className="space-y-2">
                                <Label htmlFor="ts">
                                    Timestamp <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="ts"
                                    type="datetime-local"
                                    value={formData.ts}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, ts: e.target.value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.ts;
                                            return next;
                                        });
                                    }}
                                    className={errors.ts ? "border-red-500" : ""}
                                />
                                {errors.ts && (
                                    <p className="text-sm text-red-500">{errors.ts[0]}</p>
                                )}
                            </div>

                            {/* IP or Agent */}
                            <div className="space-y-2">
                                <Label htmlFor="ip_or_agent">IP or Agent</Label>
                                <Input
                                    id="ip_or_agent"
                                    type="text"
                                    value={formData.ip_or_agent}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, ip_or_agent: e.target.value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.ip_or_agent;
                                            return next;
                                        });
                                    }}
                                    placeholder="192.168.1.1 or User-Agent string"
                                    className={errors.ip_or_agent ? "border-red-500" : ""}
                                />
                                {errors.ip_or_agent && (
                                    <p className="text-sm text-red-500">{errors.ip_or_agent[0]}</p>
                                )}
                                <p className="text-xs text-[#667085]">Maximum 255 characters</p>
                            </div>

                            {/* Request ID */}
                            <div className="space-y-2">
                                <Label htmlFor="request_id">Request ID</Label>
                                <Input
                                    id="request_id"
                                    type="text"
                                    value={formData.request_id}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, request_id: e.target.value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.request_id;
                                            return next;
                                        });
                                    }}
                                    placeholder="Request identifier"
                                    className={errors.request_id ? "border-red-500" : ""}
                                />
                                {errors.request_id && (
                                    <p className="text-sm text-red-500">{errors.request_id[0]}</p>
                                )}
                                <p className="text-xs text-[#667085]">Maximum 255 characters</p>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Textarea
                                id="reason"
                                value={formData.reason}
                                onChange={(e) => {
                                    setFormData((prev) => ({ ...prev, reason: e.target.value }));
                                    setErrors((prev) => {
                                        const next = { ...prev };
                                        delete next.reason;
                                        return next;
                                    });
                                }}
                                placeholder="Reason for access..."
                                rows={3}
                                className={errors.reason ? "border-red-500" : ""}
                            />
                            {errors.reason && (
                                <p className="text-sm text-red-500">{errors.reason[0]}</p>
                            )}
                            <p className="text-xs text-[#667085]">Maximum 255 characters</p>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}

