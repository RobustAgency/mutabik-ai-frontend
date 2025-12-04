"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { type CreateAiModelArtifactData } from "@/service/app/aiModelArtifacts";
import { useAiModelVersions } from "@/hooks/app/useAiModelVersions";

// Section Components
import BasicInformationSection from "./sections/BasicInformationSection";
import StorageLocationSection from "./sections/StorageLocationSection";
import IntegritySecuritySection from "./sections/IntegritySecuritySection";
import MetadataSection from "./sections/MetadataSection";
import FileUploadSection from "./sections/FileUploadSection";

// Utils and Constants
// import { calculateChecksum } from "./utils/checksumUtils";
import {
    artifactTypeOptions,
    environmentOptions,
    fileFormatOptions,
    checksumAlgorithmOptions,
    MAX_FILE_SIZE,
} from "./constants/artifactConstants";

interface ArtifactFormProps {
    onSubmit: (data: CreateAiModelArtifactData) => Promise<void> | void;
    loading?: boolean;
}

export default function ArtifactForm({ onSubmit, loading }: ArtifactFormProps) {
    const { aiModelVersions, loading: isLoadingVersions } = useAiModelVersions();

    const [formData, setFormData] = useState<{
        ai_model_version_id: string;
        name: string;
        artifact_type: string;
        custom_artifact_type: string;
        uri: string;
        environment: string;
        file_format: string;
        size_bytes: string;
        checksum_algorithm: string;
        // checksum_value: string; // Backend calculates this automatically
        notes: string;
    }>({
        ai_model_version_id: "",
        name: "",
        artifact_type: "",
        custom_artifact_type: "",
        uri: "",
        environment: "",
        file_format: "",
        size_bytes: "",
        checksum_algorithm: "",
        // checksum_value: "", // Backend calculates this automatically
        notes: "",
    });

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isCalculatingChecksum, setIsCalculatingChecksum] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    // Field change handler
    const handleFieldChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Error clear handler
    const handleErrorClear = (field: string) => {
        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    // Handle file upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            setErrors((prev) => ({
                ...prev,
                file_upload: ["File size must be 25 MB or less"],
            }));
            return;
        }

        setUploadedFile(file);
        setErrors((prev) => {
            const next = { ...prev };
            delete next.file_upload;
            delete next.uri;
            return next;
        });

        // Auto-calculate size
        setFormData((prev) => ({
            ...prev,
            size_bytes: String(file.size),
        }));

        // TODO: Backend will calculate checksums automatically
        // Checksum calculation temporarily disabled - backend handles it
        /* 
        if (formData.checksum_algorithm && formData.checksum_algorithm !== "none") {
            setIsCalculatingChecksum(true);
            try {
                const hash = await calculateChecksum(file, formData.checksum_algorithm);
                setFormData((prev) => ({
                    ...prev,
                    checksum_value: hash,
                }));
            } catch (error) {
                console.error("Error calculating checksum:", error);
                setErrors((prev) => ({
                    ...prev,
                    checksum_value: ["Failed to calculate checksum"],
                }));
            } finally {
                setIsCalculatingChecksum(false);
            }
        }
        */
    };

    const removeFile = () => {
        setUploadedFile(null);
        setFormData((prev) => ({
            ...prev,
            size_bytes: "",
            // checksum_value: "", // Backend calculates this automatically
        }));
    };

    // Handle checksum algorithm change
    // TODO: Backend will calculate checksums automatically
    // Temporarily disabled - backend handles checksum calculation
    const handleChecksumAlgorithmChange = async (value: string) => {
        setFormData((prev) => ({
            ...prev,
            checksum_algorithm: value,
            // checksum_value: value === "none" ? "" : prev.checksum_value, // Backend calculates this automatically
        }));
        setErrors((prev) => {
            const next = { ...prev };
            delete next.checksum_value;
            return next;
        });

        /* 
        // Recalculate checksum if file is uploaded and algorithm changed
        if (uploadedFile && value !== "none") {
            setIsCalculatingChecksum(true);
            try {
                const hash = await calculateChecksum(uploadedFile, value);
                setFormData((prev) => ({
                    ...prev,
                    checksum_value: hash,
                }));
            } catch (error) {
                console.error("Error calculating checksum:", error);
                setErrors((prev) => ({
                    ...prev,
                    checksum_value: ["Failed to calculate checksum"],
                }));
            } finally {
                setIsCalculatingChecksum(false);
            }
        }
        */
    };

    const validate = (): boolean => {
        const next: Record<string, string[]> = {};

        // Basic Information
        if (!formData.ai_model_version_id) {
            next.ai_model_version_id = ["Model Version is required"];
        }

        if (!formData.name) {
            next.name = ["Artifact Name is required"];
        } else if (formData.name.length > 255) {
            next.name = ["Artifact Name must be 255 characters or less"];
        }

        if (!formData.artifact_type) {
            next.artifact_type = ["Artifact Type is required"];
        } else if (formData.artifact_type === "other") {
            if (!formData.custom_artifact_type) {
                next.custom_artifact_type = ["Custom artifact type is required"];
            } else if (formData.custom_artifact_type.length > 255) {
                next.custom_artifact_type = ["Custom artifact type must be 255 characters or less"];
            }
        }

        // Storage & Location - URI OR File Upload must exist
        if (!formData.uri && !uploadedFile) {
            next.uri = ["Either URI or File Upload is required"];
            next.file_upload = ["Either URI or File Upload is required"];
        }

        if (formData.uri) {
            try {
                new URL(formData.uri);
            } catch {
                next.uri = ["Please enter a valid URL/URI"];
            }
            if (formData.uri.length > 2048) {
                next.uri = ["URI must be 2048 characters or less"];
            }
        }

        // Size bytes validation (nullable, but if provided must be >= 1)
        if (formData.size_bytes) {
            const size = parseInt(formData.size_bytes, 10);
            if (isNaN(size) || size < 1) {
                next.size_bytes = ["Size must be an integer greater than or equal to 1"];
            }
        }

        // Integrity & Security - Checksum validation disabled (backend calculates)
        // TODO: Backend will calculate checksums automatically
        /* 
        if (formData.checksum_algorithm && formData.checksum_algorithm !== "none") {
            if (!formData.checksum_value) {
                next.checksum_value = ["Checksum Value is required when algorithm is selected"];
            } else if (formData.checksum_value.length > 255) {
                next.checksum_value = ["Checksum Value must be 255 characters or less"];
            }
        }
        */

        // Metadata
        if (formData.notes && formData.notes.length > 1000) {
            next.notes = ["Notes must be 1000 characters or less"];
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // Prepare data for submission matching backend requirements
        // Note: Backend will calculate checksum value automatically based on the algorithm
        const submitData: CreateAiModelArtifactData = {
            ai_model_version_id: parseInt(formData.ai_model_version_id, 10),
            name: formData.name,
            uri: formData.uri || null,
            file: uploadedFile || null,
            checksum_algorithm: formData.checksum_algorithm && formData.checksum_algorithm !== "none" 
                ? formData.checksum_algorithm 
                : null,
            // checksum_value: null, // Backend calculates value automatically - not sent to backend
            environment: formData.environment || null,
            file_format: formData.file_format || null,
            size_bytes: formData.size_bytes ? parseInt(formData.size_bytes, 10) : null,
            artifact_type: formData.artifact_type === "other" ? formData.custom_artifact_type : formData.artifact_type,
            notes: formData.notes || null,
        };

        await onSubmit(submitData);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between mb-6">
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

                    <CardContent className="space-y-8">
                        {/* Basic Information */}
                        <BasicInformationSection
                            formData={{
                                ai_model_version_id: formData.ai_model_version_id,
                                name: formData.name,
                                artifact_type: formData.artifact_type,
                                custom_artifact_type: formData.custom_artifact_type,
                            }}
                            errors={errors}
                            aiModelVersions={aiModelVersions}
                            isLoadingVersions={isLoadingVersions}
                            artifactTypeOptions={artifactTypeOptions}
                            onFieldChange={handleFieldChange}
                            onErrorClear={handleErrorClear}
                        />

                        {/* Storage & Location */}
                        <StorageLocationSection
                            formData={{
                                uri: formData.uri,
                                environment: formData.environment,
                                file_format: formData.file_format,
                                size_bytes: formData.size_bytes,
                            }}
                            errors={errors}
                            uploadedFile={uploadedFile}
                            environmentOptions={environmentOptions}
                            fileFormatOptions={fileFormatOptions}
                            onFieldChange={handleFieldChange}
                            onErrorClear={handleErrorClear}
                        />

                        {/* Integrity & Security */}
                        <IntegritySecuritySection
                            formData={{
                                checksum_algorithm: formData.checksum_algorithm,
                                // checksum_value: formData.checksum_value, // Backend calculates this automatically
                            }}
                            errors={errors}
                            uploadedFile={uploadedFile}
                            isCalculatingChecksum={isCalculatingChecksum}
                            checksumAlgorithmOptions={checksumAlgorithmOptions}
                            onChecksumAlgorithmChange={handleChecksumAlgorithmChange}
                            onFieldChange={handleFieldChange}
                            onErrorClear={handleErrorClear}
                        />

                        {/* Metadata */}
                        <MetadataSection
                            formData={{
                                notes: formData.notes,
                            }}
                            errors={errors}
                            onFieldChange={handleFieldChange}
                            onErrorClear={handleErrorClear}
                        />

                        {/* Optional File Upload */}
                        <FileUploadSection
                            uploadedFile={uploadedFile}
                            errors={errors}
                            hasUri={!!formData.uri}
                            onFileChange={handleFileChange}
                            onRemoveFile={removeFile}
                        />
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
