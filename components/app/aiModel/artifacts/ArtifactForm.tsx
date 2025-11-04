"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload, FileText, X } from "lucide-react";
import { ArtifactType, type CreateAiModelArtifactData } from "@/service/app/aiModelArtifacts";

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
    const [formData, setFormData] = useState<{
        file: File | null;
        artifact_type: string;
    }>({
        file: null,
        artifact_type: "",
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const validate = (): boolean => {
        const next: Record<string, string[]> = {};
        if (!formData.file) {
            next.file = ["CSV file is required"];
        } else {
            // Validate file type
            if (!formData.file.name.endsWith(".csv")) {
                next.file = ["File must be a CSV file"];
            }
        }
        if (!formData.artifact_type) {
            next.artifact_type = ["Artifact type is required"];
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        if (!formData.file) return;

        await onSubmit({
            file: formData.file,
            artifact_type: formData.artifact_type,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.name.endsWith(".csv")) {
                setErrors((prev) => ({
                    ...prev,
                    file: ["File must be a CSV file"],
                }));
                return;
            }
            setFormData((prev) => ({ ...prev, file }));
            setErrors((prev) => {
                const next = { ...prev };
                delete next.file;
                return next;
            });
        }
    };

    const handleRemoveFile = () => {
        setFormData((prev) => ({ ...prev, file: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            if (!file.name.endsWith(".csv")) {
                setErrors((prev) => ({
                    ...prev,
                    file: ["File must be a CSV file"],
                }));
                return;
            }
            setFormData((prev) => ({ ...prev, file }));
            setErrors((prev) => {
                const next = { ...prev };
                delete next.file;
                return next;
            });
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
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
                            Upload a CSV file containing artifact information
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => {
                            if (formRef.current) {
                                formRef.current.requestSubmit();
                            }
                        }}
                        className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload Artifact"}
                    </Button>
                </div>

                <form
                    ref={formRef}
                    id="artifact-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {Object.entries(errors).map(([k, v]) => (
                                    <div key={k} className="text-sm">
                                        {k.replace(/_/g, " ")}: {v[0]}
                                    </div>
                                ))}
                            </AlertDescription>
                        </Alert>
                    )}

                    <CardContent className="space-y-8">
                        {/* Artifact Type */}
                        <div className="space-y-2">
                            <Label htmlFor="artifact_type">Artifact Type *</Label>
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
                                    className={
                                        errors.artifact_type ? "border-destructive" : ""
                                    }
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
                                <p className="text-sm text-destructive">
                                    {errors.artifact_type[0]}
                                </p>
                            )}
                        </div>

                        {/* CSV File Upload */}
                        <div className="space-y-2">
                            <Label>CSV File *</Label>
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="border-2 border-dashed border-[#D0D5DD] rounded-lg p-8 text-center hover:border-[#9CB9FF] transition-colors cursor-pointer"
                                onClick={openFileDialog}
                            >
                                {formData.file ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                                            <FileText className="h-8 w-8 text-[#175CD3]" />
                                            <div className="flex-1 text-left">
                                                <p className="text-sm font-medium text-[#101828]">
                                                    {formData.file.name}
                                                </p>
                                                <p className="text-xs text-[#667085]">
                                                    {(formData.file.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveFile();
                                                }}
                                                className="h-8 w-8 p-0 hover:bg-[#FEF2F2]"
                                            >
                                                <X className="h-4 w-4 text-[#DC2626]" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-[#667085]">
                                            Click to change file or drag and drop
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="bg-white w-max rounded-full p-2 mx-auto mb-2">
                                            <Upload className="h-5 w-5 text-[#175CD3]" />
                                        </div>
                                        <p className="text-sm text-[#667085]">
                                            <span className="text-[#175CD3] cursor-pointer">
                                                Click to upload
                                            </span>{" "}
                                            or drag and drop
                                        </p>
                                        <p className="text-xs text-[#667085] mt-1">
                                            CSV file (max 10 MB)
                                        </p>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {errors.file && (
                                <p className="text-sm text-destructive">{errors.file[0]}</p>
                            )}
                            <div className="text-xs text-[#667085] mt-2">
                                <p className="font-medium mb-1">CSV Format:</p>
                                <p className="font-mono text-xs bg-[#F9FAFB] p-2 rounded">
                                    model_version_id,uri,checksum,size_bytes,notes
                                </p>

                            </div>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}

