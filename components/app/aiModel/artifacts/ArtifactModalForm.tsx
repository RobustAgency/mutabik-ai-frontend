"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateAiModelArtifactMutation } from '@/app/lib/features/aiModelArtifactsApi';
import { toast } from "react-toastify";
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
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { useAiModelVersions } from "@/hooks/app/useAiModelVersions";
import AiModelVersionModalForm from "../versions/AiModelVersionModalForm";
import { ArtifactType } from "@/service/app/aiModelArtifacts";

interface ArtifactModalFormProps {
    onSuccess?: (artifact: any) => void;
    onCancel?: () => void;
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
    { value: "others", label: "Others" },
];

const ArtifactModalForm: React.FC<ArtifactModalFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [createAiModelArtifact, { isLoading: loading }] = useCreateAiModelArtifactMutation();
    const { aiModelVersions, loading: isLoadingVersions } = useAiModelVersions();

    const [formData, setFormData] = useState<{
        ai_model_version_id: string;
        name: string;
        uri: string;
        checksum: string;
        size_bytes: string;
        artifact_type: string;
        custom_artifact_type: string;
        notes: string;
        created_by: string;
    }>({
        ai_model_version_id: "",
        name: "",
        uri: "",
        checksum: "",
        size_bytes: "",
        artifact_type: "",
        custom_artifact_type: "",
        notes: "",
        created_by: "",
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        if (!formData.ai_model_version_id) {
            errors.ai_model_version_id = ["Version is required"];
        }

        if (!formData.name) {
            errors.name = ["Name is required"];
        } else if (formData.name.length > 255) {
            errors.name = ["Name must be 255 characters or less"];
        }

        if (!formData.uri) {
            errors.uri = ["URI is required"];
        } else {
            try {
                new URL(formData.uri);
            } catch {
                errors.uri = ["Please enter a valid URL/URI"];
            }
            if (formData.uri.length > 2048) {
                errors.uri = ["URI must be 2048 characters or less"];
            }
        }

        if (!formData.checksum) {
            errors.checksum = ["Checksum is required"];
        } else if (formData.checksum.length > 255) {
            errors.checksum = ["Checksum must be 255 characters or less"];
        }

        if (!formData.size_bytes) {
            errors.size_bytes = ["Size in bytes is required"];
        } else {
            const size = parseInt(formData.size_bytes, 10);
            if (isNaN(size) || size < 0) {
                errors.size_bytes = ["Size must be a non-negative integer"];
            }
        }

        if (!formData.artifact_type) {
            errors.artifact_type = ["Artifact type is required"];
        } else if (formData.artifact_type === "others") {
            if (!formData.custom_artifact_type) {
                errors.custom_artifact_type = ["Custom artifact type is required"];
            } else if (formData.custom_artifact_type.length > 255) {
                errors.custom_artifact_type = ["Custom artifact type must be 255 characters or less"];
            }
        }

        if (formData.notes && formData.notes.length > 1000) {
            errors.notes = ["Notes must be 1000 characters or less"];
        }

        if (formData.created_by) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.created_by)) {
                errors.created_by = ["Please enter a valid email address"];
            }
            if (formData.created_by.length > 255) {
                errors.created_by = ["Email must be 255 characters or less"];
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValidationErrors({});

        if (!validateForm()) {
            return;
        }

        try {
            const result = await createAiModelArtifact({
                ai_model_version_id: parseInt(formData.ai_model_version_id, 10),
                name: formData.name,
                uri: formData.uri,
                checksum: formData.checksum,
                size_bytes: parseInt(formData.size_bytes, 10),
                artifact_type: formData.artifact_type === "others" ? formData.custom_artifact_type : formData.artifact_type,
                notes: formData.notes || null,
                created_by: formData.created_by || null,
            }).unwrap();

            if (onSuccess) {
                // The API returns { error: boolean, message: string, data?: ArtifactAccessLog }
                // We need to pass the artifact data to onSuccess
                if (result?.data) {
                    onSuccess(result.data);
                } else if (!result.error) {
                    // If no data but success, try to extract from result
                    onSuccess(result as any);
                }
            }
        } catch (err: any) {
            if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
            } else {
                toast.error("Failed to create artifact");
            }
        }
    };

    const hasError = (fieldName: string) => validationErrors[fieldName] && validationErrors[fieldName].length > 0;
    const getError = (fieldName: string) => validationErrors[fieldName]?.[0];

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {Object.keys(validationErrors).length > 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <p className="font-semibold mb-2">Please fix the following errors:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {Object.entries(validationErrors).map(([field, errors]) => (
                                <li key={field}>
                                    <span className="font-medium capitalize">
                                        {field.replace(/_/g, " ")}:
                                    </span>{" "}
                                    {errors[0]}
                                </li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData((prev) => ({ ...prev, name: e.target.value }));
                            setValidationErrors((prev) => {
                                const next = { ...prev };
                                delete next.name;
                                return next;
                            });
                        }}
                        placeholder="Enter artifact name"
                        className={hasError("name") ? "border-red-500" : ""}
                    />
                    {hasError("name") && (
                        <p className="text-sm text-red-500">{getError("name")}</p>
                    )}
                    <p className="text-xs text-[#667085]">Maximum 255 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Version ID */}
                    <div className="space-y-2">
                        <Label htmlFor="ai_model_version_id">
                            Model Version <span className="text-red-500">*</span>
                        </Label>
                        <SelectWithInlineCreate
                            value={formData.ai_model_version_id}
                            onValueChange={(value) => {
                                setFormData((prev) => ({ ...prev, ai_model_version_id: value }));
                                setValidationErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.ai_model_version_id;
                                    return next;
                                });
                            }}
                            options={aiModelVersions.map((version) => ({
                                id: version.id,
                                label: `${version.ai_model?.name || "Model"} • ${version.version_number || version.id}`,
                                value: String(version.id),
                            }))}
                            isLoading={isLoadingVersions}
                            isEmpty={!isLoadingVersions && aiModelVersions.length === 0}
                            entityName="AI Model Version"
                            modalForm={AiModelVersionModalForm}
                            placeholder="Select a model version..."
                            triggerClassName={`w-full ${hasError("ai_model_version_id") ? "border-red-500" : ""}`}
                            error={hasError("ai_model_version_id")}
                        />
                        {hasError("ai_model_version_id") && (
                            <p className="text-sm text-red-500">{getError("ai_model_version_id")}</p>
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
                                setFormData((prev) => ({
                                    ...prev,
                                    artifact_type: value,
                                    custom_artifact_type: value === "others" ? prev.custom_artifact_type : "",
                                }));
                                setValidationErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.artifact_type;
                                    delete next.custom_artifact_type;
                                    return next;
                                });
                            }}
                        >
                            <SelectTrigger
                                className={`w-full ${hasError("artifact_type") ? "border-red-500" : ""}`}
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
                        {hasError("artifact_type") && (
                            <p className="text-sm text-red-500">{getError("artifact_type")}</p>
                        )}
                        {formData.artifact_type === "others" && (
                            <div className="mt-2">
                                <Input
                                    id="custom_artifact_type"
                                    type="text"
                                    value={formData.custom_artifact_type}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, custom_artifact_type: e.target.value }));
                                        setValidationErrors((prev) => {
                                            const next = { ...prev };
                                            delete next.custom_artifact_type;
                                            return next;
                                        });
                                    }}
                                    placeholder="Enter custom artifact type"
                                    className={hasError("custom_artifact_type") ? "border-red-500" : ""}
                                />
                                {hasError("custom_artifact_type") && (
                                    <p className="text-sm text-red-500 mt-1">{getError("custom_artifact_type")}</p>
                                )}
                                <p className="text-xs text-[#667085] mt-1">Maximum 255 characters</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* URL */}
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
                                setValidationErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.uri;
                                    return next;
                                });
                            }}
                            placeholder="https://example.com/artifact"
                            className={hasError("uri") ? "border-red-500" : ""}
                        />
                        {hasError("uri") && (
                            <p className="text-sm text-red-500">{getError("uri")}</p>
                        )}
                    </div>

                    {/* Checksum */}
                    <div className="space-y-2">
                        <Label htmlFor="checksum">
                            Checksum <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="checksum"
                            type="text"
                            value={formData.checksum}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, checksum: e.target.value }));
                                setValidationErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.checksum;
                                    return next;
                                });
                            }}
                            placeholder="SHA-256 hash"
                            className={hasError("checksum") ? "border-red-500" : ""}
                        />
                        {hasError("checksum") && (
                            <p className="text-sm text-red-500">{getError("checksum")}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Size Bytes */}
                    <div className="space-y-2">
                        <Label htmlFor="size_bytes">
                            Size (bytes) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="size_bytes"
                            type="number"
                            min="0"
                            value={formData.size_bytes}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, size_bytes: e.target.value }));
                                setValidationErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.size_bytes;
                                    return next;
                                });
                            }}
                            placeholder="0"
                            className={hasError("size_bytes") ? "border-red-500" : ""}
                        />
                        {hasError("size_bytes") && (
                            <p className="text-sm text-red-500">{getError("size_bytes")}</p>
                        )}
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
                                setValidationErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.created_by;
                                    return next;
                                });
                            }}
                            placeholder="creator@example.com"
                            className={hasError("created_by") ? "border-red-500" : ""}
                        />
                        {hasError("created_by") && (
                            <p className="text-sm text-red-500">{getError("created_by")}</p>
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
                            setValidationErrors((prev) => {
                                const next = { ...prev };
                                delete next.notes;
                                return next;
                            });
                        }}
                        placeholder="Additional notes about this artifact..."
                        className={`min-h-32 resize-none ${hasError("notes") ? "border-red-500" : ""}`}
                    />
                    {hasError("notes") && (
                        <p className="text-sm text-red-500">{getError("notes")}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-[#4FD58F] hover:bg-[#3fc77f]"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Artifact"}
                </Button>
            </div>
        </form>
    );
};

export default ArtifactModalForm;

