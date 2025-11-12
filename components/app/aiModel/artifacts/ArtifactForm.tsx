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
import { ArtifactType, type CreateAiModelArtifactData } from "@/service/app/aiModelArtifacts";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { useAiModelVersions } from "@/hooks/app/useAiModelVersions";
import AiModelVersionModalForm from "../versions/AiModelVersionModalForm";

interface ArtifactFormProps {
    onSubmit: (data: CreateAiModelArtifactData) => Promise<void> | void;
    loading?: boolean;
}

const artifactTypeOptions = [
    { value: ArtifactType.MODEL_BINARY, label: "Model Binary" },
    { value: ArtifactType.TOKENIZER, label: "Tokenizer" },
    { value: ArtifactType.PROMPT_PACK, label: "Prompt Pack" },
    { value: ArtifactType.INDEX, label: "Index" },
    { value: ArtifactType.FEATURE_STORE_EXPORT, label: "Feature Store Export" },
    { value: ArtifactType.CONFIG, label: "Config" },
    { value: ArtifactType.DOCKER_IMAGE, label: "Docker Image" },
    { value: ArtifactType.SBOM, label: "SBOM" },
];

export default function ArtifactForm({ onSubmit, loading }: ArtifactFormProps) {
    const { aiModelVersions, loading: isLoadingVersions } = useAiModelVersions();

    const [formData, setFormData] = useState<{
        ai_model_version_id: string;
        uri: string;
        checksum: string;
        size_bytes: string;
        artifact_type: string;
        notes: string;
        created_by: string;
    }>({
        ai_model_version_id: "",
        uri: "",
        checksum: "",
        size_bytes: "",
        artifact_type: "",
        notes: "",
        created_by: "",
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const validate = (): boolean => {
        const next: Record<string, string[]> = {};

        if (!formData.ai_model_version_id) {
            next.ai_model_version_id = ["Version is required"];
        }

        if (!formData.uri) {
            next.uri = ["URI is required"];
        } else {
            try {
                new URL(formData.uri);
            } catch {
                next.uri = ["Please enter a valid URL/URI"];
            }
            if (formData.uri.length > 2048) {
                next.uri = ["URI must be 2048 characters or less"];
            }
        }

        // Checksum is optional
        if (formData.checksum && formData.checksum.length > 255) {
            next.checksum = ["Checksum must be 255 characters or less"];
        }

        // Size bytes is optional
        if (formData.size_bytes) {
            const size = parseInt(formData.size_bytes, 10);
            if (isNaN(size) || size < 0) {
                next.size_bytes = ["Size must be a non-negative integer"];
            }
        }

        if (!formData.artifact_type) {
            next.artifact_type = ["Artifact type is required"];
        }

        if (formData.notes && formData.notes.length > 1000) {
            next.notes = ["Notes must be 1000 characters or less"];
        }

        if (formData.created_by) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.created_by)) {
                next.created_by = ["Please enter a valid email address"];
            }
            if (formData.created_by.length > 255) {
                next.created_by = ["Email must be 255 characters or less"];
            }
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        await onSubmit({
            ai_model_version_id: parseInt(formData.ai_model_version_id, 10),
            uri: formData.uri,
            checksum: formData.checksum || null,
            size_bytes: formData.size_bytes ? parseInt(formData.size_bytes, 10) : null,
            artifact_type: formData.artifact_type,
            notes: formData.notes || null,
            created_by: formData.created_by || null,
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
                    <div>
                        <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                            New AI Model Artifact
                        </h1>
                        <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                            Create a new artifact for an AI model version
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Artifact"}
                    </Button>
                </div>

                <form
                    id="artifact-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
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
                        {/* Version ID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="version_id">
                                    Model Version <span className="text-red-500">*</span>
                                </Label>
                                <SelectWithInlineCreate
                                    value={formData.ai_model_version_id}
                                    onValueChange={(value) => {
                                        setFormData((prev) => ({ ...prev, ai_model_version_id: value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.ai_model_version_id;
                                            return next;
                                        });
                                    }}
                                    options={aiModelVersions.map((version) => ({
                                        id: version.id,
                                        label: `${version.ai_model?.name || "Model"} • ${version.version_number}`,
                                        value: String(version.id),
                                    }))}
                                    isLoading={isLoadingVersions}
                                    isEmpty={!isLoadingVersions && aiModelVersions.length === 0}
                                    entityName="AI Model Version"
                                    modalForm={AiModelVersionModalForm}
                                    placeholder="Select a model version..."
                                    triggerClassName={`w-full ${errors.ai_model_version_id ? "border-red-500" : ""}`}
                                    error={!!errors.ai_model_version_id}
                                />
                                {errors.ai_model_version_id && (
                                    <p className="text-sm text-red-500">{errors.ai_model_version_id[0]}</p>
                                )}
                            </div>

                            {/* Artifact Type */}
                            <div className="space-y-2">
                                <Label htmlFor="artifact_type">
                                    Artifact Type <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.artifact_type}
                                    onValueChange={(value) => {
                                        setFormData((prev) => ({ ...prev, artifact_type: value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.artifact_type;
                                            return next;
                                        });
                                    }}
                                >
                                    <SelectTrigger
                                        className={`w-full ${errors.artifact_type ? "border-red-500" : ""}`}
                                    >
                                        <SelectValue placeholder="Select artifact type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {artifactTypeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.artifact_type && (
                                    <p className="text-sm text-red-500">{errors.artifact_type[0]}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* URI */}
                            <div className="space-y-2">
                                <Label htmlFor="uri">
                                    URI <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="uri"
                                    type="url"
                                    value={formData.uri}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, uri: e.target.value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.uri;
                                            return next;
                                        });
                                    }}
                                    placeholder="https://example.com/artifact"
                                    className={errors.uri ? "border-red-500" : ""}
                                />
                                {errors.uri && (
                                    <p className="text-sm text-red-500">{errors.uri[0]}</p>
                                )}
                            </div>

                            {/* Checksum */}
                            <div className="space-y-2">
                                <Label htmlFor="checksum">
                                    Checksum
                                </Label>
                                <Input
                                    id="checksum"
                                    type="text"
                                    value={formData.checksum}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, checksum: e.target.value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.checksum;
                                            return next;
                                        });
                                    }}
                                    placeholder="SHA-256 hash"
                                    className={errors.checksum ? "border-red-500" : ""}
                                />
                                {errors.checksum && (
                                    <p className="text-sm text-red-500">{errors.checksum[0]}</p>
                                )}
                                <p className="text-xs text-[#667085]">Maximum 255 characters</p>
                            </div>


                            {/* Size Bytes */}
                            <div className="space-y-2">
                                <Label htmlFor="size_bytes">
                                    Size (bytes)
                                </Label>
                                <Input
                                    id="size_bytes"
                                    type="number"
                                    min="0"
                                    value={formData.size_bytes}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, size_bytes: e.target.value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.size_bytes;
                                            return next;
                                        });
                                    }}
                                    placeholder="0"
                                    className={errors.size_bytes ? "border-red-500" : ""}
                                />
                                {errors.size_bytes && (
                                    <p className="text-sm text-red-500">{errors.size_bytes[0]}</p>
                                )}
                                <p className="text-xs text-[#667085]">Must be a non-negative integer</p>
                            </div>

                            {/* Created By */}
                            <div className="space-y-2">
                                <Label htmlFor="created_by">Created By</Label>
                                <Input
                                    id="created_by"
                                    type="email"
                                    value={formData.created_by}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, created_by: e.target.value }));
                                        setErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.created_by;
                                            return next;
                                        });
                                    }}
                                    placeholder="creator@example.com"
                                    className={errors.created_by ? "border-red-500" : ""}
                                />
                                {errors.created_by && (
                                    <p className="text-sm text-red-500">{errors.created_by[0]}</p>
                                )}
                            </div>
                        </div>


                        {/* Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => {
                                    setFormData((prev) => ({ ...prev, notes: e.target.value }));
                                    setErrors((prev) => {
                                        const next = { ...prev };
                                        delete next.notes;
                                        return next;
                                    });
                                }}
                                placeholder="Additional notes about this artifact..."
                                className={`min-h-32 resize-none ${errors.notes ? "border-red-500" : ""}`}
                            />
                            {errors.notes && (
                                <p className="text-sm text-red-500">{errors.notes[0]}</p>
                            )}
                            <p className="text-xs text-[#667085]">Maximum 1000 characters</p>
                        </div>


                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
