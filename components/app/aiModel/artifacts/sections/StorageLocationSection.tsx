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

interface StorageLocationSectionProps {
    formData: {
        uri: string;
        environment: string;
        file_format: string;
        size_bytes: string;
    };
    errors: Record<string, string[]>;
    uploadedFile: File | null;
    environmentOptions: { value: string; label: string }[];
    fileFormatOptions: { value: string; label: string }[];
    onFieldChange: (field: string, value: string) => void;
    onErrorClear: (field: string) => void;
}

export default function StorageLocationSection({
    formData,
    errors,
    uploadedFile,
    environmentOptions,
    fileFormatOptions,
    onFieldChange,
    onErrorClear,
}: StorageLocationSectionProps) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="font-sans font-semibold text-base text-[#1D2939] mb-1">
                    Storage & Location
                </h2>
                <p className="text-xs text-[#667085]">Where the artifact is stored</p>
            </div>

            <div className="space-y-4">
                {/* Artifact URI / Location */}
                <div className="space-y-2">
                    <Label htmlFor="uri" title="URL or path where the artifact is stored.">
                        Artifact URI / Location
                    </Label>
                    <Input
                        id="uri"
                        type="url"
                        value={formData.uri}
                        onChange={(e) => {
                            onFieldChange("uri", e.target.value);
                            onErrorClear("uri");
                            onErrorClear("file_upload");
                        }}
                        placeholder="https://example.com/artifact"
                        className={errors.uri ? "border-red-500" : ""}
                        disabled={!!uploadedFile}
                    />
                    {errors.uri && (
                        <p className="text-sm text-red-500">{errors.uri[0]}</p>
                    )}
                    {uploadedFile ? (
                        <p className="text-xs text-[#667085]">URI disabled when file is uploaded</p>
                    ) : (
                        <p className="text-xs text-[#667085]">Either URI or File Upload is required</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Environment */}
                    <div className="space-y-2">
                        <Label htmlFor="environment">
                            Environment
                        </Label>
                        <Select
                            value={formData.environment}
                            onValueChange={(value) => {
                                onFieldChange("environment", value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select environment" />
                            </SelectTrigger>
                            <SelectContent>
                                {environmentOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* File Format */}
                    <div className="space-y-2">
                        <Label htmlFor="file_format" title="File extension or storage format.">
                            File Format
                        </Label>
                        <Select
                            value={formData.file_format}
                            onValueChange={(value) => {
                                onFieldChange("file_format", value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select file format" />
                            </SelectTrigger>
                            <SelectContent>
                                {fileFormatOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Size (bytes) */}
                <div className="space-y-2">
                    <Label htmlFor="size_bytes" title="Total size in bytes.">
                        Size (bytes)
                    </Label>
                    <Input
                        id="size_bytes"
                        type="number"
                        min="1"
                        value={formData.size_bytes}
                        onChange={(e) => {
                            onFieldChange("size_bytes", e.target.value);
                            onErrorClear("size_bytes");
                        }}
                        placeholder="Enter size in bytes"
                        className={errors.size_bytes ? "border-red-500" : ""}
                        readOnly={!!uploadedFile}
                    />
                    {errors.size_bytes && (
                        <p className="text-sm text-red-500">{errors.size_bytes[0]}</p>
                    )}
                    <p className="text-xs text-[#667085]">Must be an integer greater than or equal to 1</p>
                </div>
            </div>
        </div>
    );
}

