"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiModelVersionModalForm from "../../versions/AiModelVersionModalForm";

interface BasicInformationSectionProps {
    formData: {
        ai_model_version_id: string;
        name: string;
        artifact_type: string;
        custom_artifact_type: string;
    };
    errors: Record<string, string[]>;
    aiModelVersions: any[];
    isLoadingVersions: boolean;
    artifactTypeOptions: { value: string; label: string }[];
    onFieldChange: (field: string, value: string) => void;
    onErrorClear: (field: string) => void;
}

export default function BasicInformationSection({
    formData,
    errors,
    aiModelVersions,
    isLoadingVersions,
    artifactTypeOptions,
    onFieldChange,
    onErrorClear,
}: BasicInformationSectionProps) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="font-sans font-semibold text-base text-[#1D2939] mb-1">
                    Basic Information
                </h2>
                <p className="text-xs text-[#667085]">Core details about the artifact</p>
            </div>

            <div className="space-y-4">
                {/* Artifact Name */}
                <div className="space-y-2">
                    <Label htmlFor="name" title="Friendly name for the artifact.">
                        Artifact Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                            onFieldChange("name", e.target.value);
                            onErrorClear("name");
                        }}
                        placeholder="Enter artifact name"
                        className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name[0]}</p>
                    )}
                    <p className="text-xs text-[#667085]">Maximum 255 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Model Version */}
                    <div className="space-y-2">
                        <Label htmlFor="version_id" title="Version this artifact belongs to.">
                            Model Version <span className="text-red-500">*</span>
                        </Label>
                        <SelectWithInlineCreate
                            value={formData.ai_model_version_id}
                            onValueChange={(value) => {
                                onFieldChange("ai_model_version_id", value);
                                onErrorClear("ai_model_version_id");
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
                        <Label htmlFor="artifact_type" title="Type of asset such as weights, configs, docs.">
                            Artifact Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            key={`artifact-type-${formData.artifact_type || "none"}`}
                            value={formData.artifact_type}
                            onValueChange={(value) => {
                                onFieldChange("artifact_type", value);
                                if (value !== "other") {
                                    onFieldChange("custom_artifact_type", "");
                                }
                                onErrorClear("artifact_type");
                                onErrorClear("custom_artifact_type");
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
                        {formData.artifact_type === "other" && (
                            <div className="mt-2">
                                <Input
                                    id="custom_artifact_type"
                                    type="text"
                                    value={formData.custom_artifact_type}
                                    onChange={(e) => {
                                        onFieldChange("custom_artifact_type", e.target.value);
                                        onErrorClear("custom_artifact_type");
                                    }}
                                    placeholder="Enter custom artifact type"
                                    className={errors.custom_artifact_type ? "border-red-500" : ""}
                                />
                                {errors.custom_artifact_type && (
                                    <p className="text-sm text-red-500 mt-1">{errors.custom_artifact_type[0]}</p>
                                )}
                                <p className="text-xs text-[#667085] mt-1">Maximum 255 characters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

