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
import { artifactTypeOptions as artifactTypeOptionsList } from "./constants/artifactConstants";
import { checksumAlgorithmOptions } from "./constants/artifactConstants";
import {
    validateTextField,
    validateNumericField,
    validateUrl,
    createValidationErrors,
} from "@/lib/utils/validation";

interface ArtifactModalFormProps {
    onSuccess?: (artifact: any) => void;
    onCancel?: () => void;
}

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
        checksum_algorithm: string;
        size_bytes: string;
        artifact_type: string;
        custom_artifact_type: string;
        notes: string;
    }>({
        ai_model_version_id: "",
        name: "",
        uri: "",
        checksum_algorithm: "",
        size_bytes: "",
        artifact_type: "",
        custom_artifact_type: "",
        notes: "",
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const validateForm = (): boolean => {
        const fieldErrors: Record<string, string[]> = {
            ai_model_version_id: validateTextField(formData.ai_model_version_id, {
                required: true,
                messages: { required: "Version is required" },
            }),
            name: validateTextField(formData.name, {
                required: true,
                maxLength: 255,
                messages: {
                    required: "Name is required",
                    maxLength: "Name must be 255 characters or less",
                },
            }),
            uri: [
                ...validateTextField(formData.uri, {
                    required: true,
                    maxLength: 2048,
                    messages: {
                        required: "URI is required",
                        maxLength: "URI must be 2048 characters or less",
                    },
                }),
                ...validateUrl(formData.uri, "Please enter a valid URL/URI"),
            ],
            artifact_type: validateTextField(formData.artifact_type, {
                required: true,
                messages: { required: "Artifact type is required" },
            }),
            notes: validateTextField(formData.notes, {
                maxLength: 1000,
                messages: { maxLength: "Notes must be 1000 characters or less" },
            }),
        };

        if (formData.artifact_type === "other") {
            const customErrors = validateTextField(formData.custom_artifact_type, {
                required: true,
                maxLength: 255,
                messages: {
                    required: "Custom artifact type is required",
                    maxLength: "Custom artifact type must be 255 characters or less",
                },
            });
            if (customErrors.length) {
                fieldErrors.custom_artifact_type = customErrors;
            }
        }

        if (formData.size_bytes) {
            const numericErrors = validateNumericField(Number(formData.size_bytes), {
                min: 1,
                messages: { min: "Size must be an integer greater than or equal to 1" },
            });
            if (numericErrors.length) {
                fieldErrors.size_bytes = numericErrors;
            }
        }

        const errors = createValidationErrors(fieldErrors);
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
                uri: formData.uri || null,
                file: null, // Modal form doesn't support file upload
                checksum_algorithm: formData.checksum_algorithm && formData.checksum_algorithm !== "none" 
                    ? formData.checksum_algorithm 
                    : null,
                // checksum_value: null, // Backend calculates this automatically
                environment: null,
                file_format: null,
                size_bytes: formData.size_bytes ? parseInt(formData.size_bytes, 10) : null,
                artifact_type: formData.artifact_type === "other" ? formData.custom_artifact_type : formData.artifact_type,
                notes: formData.notes || null,
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
                                {artifactTypeOptionsList.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {hasError("artifact_type") && (
                            <p className="text-sm text-red-500">{getError("artifact_type")}</p>
                        )}
                        {formData.artifact_type === "other" && (
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

                    {/* Checksum Algorithm */}
                    <div className="space-y-2">
                        <Label htmlFor="checksum_algorithm">
                            Checksum Algorithm
                        </Label>
                        <Select
                            value={formData.checksum_algorithm || undefined}
                            onValueChange={(value) => {
                                setFormData((prev) => ({ ...prev, checksum_algorithm: value }));
                                setValidationErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.checksum_algorithm;
                                    return next;
                                });
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select checksum algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                                {checksumAlgorithmOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {hasError("checksum_algorithm") && (
                            <p className="text-sm text-red-500">{getError("checksum_algorithm")}</p>
                        )}
                    </div>
                </div>

                {/* Size Bytes */}
                <div className="space-y-2">
                    <Label htmlFor="size_bytes">
                        Size (bytes)
                    </Label>
                    <Input
                        id="size_bytes"
                        type="number"
                        min="1"
                        value={formData.size_bytes}
                        onChange={(e) => {
                            setFormData((prev) => ({ ...prev, size_bytes: e.target.value }));
                            setValidationErrors((prev) => {
                                const next = { ...prev };
                                delete next.size_bytes;
                                return next;
                            });
                        }}
                        placeholder="Enter size in bytes"
                        className={hasError("size_bytes") ? "border-red-500" : ""}
                    />
                    {hasError("size_bytes") && (
                        <p className="text-sm text-red-500">{getError("size_bytes")}</p>
                    )}
                    <p className="text-xs text-[#667085]">Must be an integer greater than or equal to 1</p>
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


