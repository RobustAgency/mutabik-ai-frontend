"use client";

import React from "react";
import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface IntegritySecuritySectionProps {
    formData: {
        checksum_algorithm: string;
        // checksum_value: string; // Backend calculates this automatically
    };
    errors: Record<string, string[]>;
    uploadedFile: File | null;
    isCalculatingChecksum: boolean;
    checksumAlgorithmOptions: { value: string; label: string }[];
    onChecksumAlgorithmChange: (value: string) => void;
    onFieldChange: (field: string, value: string) => void;
    onErrorClear: (field: string) => void;
}

export default function IntegritySecuritySection({
    formData,
    errors,
    uploadedFile,
    isCalculatingChecksum,
    checksumAlgorithmOptions,
    onChecksumAlgorithmChange,
    onFieldChange,
    onErrorClear,
}: IntegritySecuritySectionProps) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="font-sans font-semibold text-base text-[#1D2939] mb-1">
                    Integrity & Security
                </h2>
                <p className="text-xs text-[#667085]">Checksum verification for artifact integrity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Checksum Algorithm */}
                <div className="space-y-2">
                    <Label htmlFor="checksum_algorithm" title="Hash algorithm for integrity verification.">
                        Checksum Algorithm
                    </Label>
                    <Select
                        value={formData.checksum_algorithm || undefined}
                        onValueChange={onChecksumAlgorithmChange}
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
                    {/* <p className="text-xs text-[#667085]">Backend will calculate the checksum value automatically</p> */}
                </div>

                {/* Checksum Value - Display only, calculated by backend */}
                {/* 
                <div className="space-y-2">
                    <Label htmlFor="checksum_value" title="Hash string validating the artifact integrity.">
                        Checksum Value {formData.checksum_algorithm !== "none" && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                        id="checksum_value"
                        type="text"
                        value={formData.checksum_value}
                        onChange={(e) => {
                            onFieldChange("checksum_value", e.target.value);
                            onErrorClear("checksum_value");
                        }}
                        placeholder={isCalculatingChecksum ? "Calculating..." : "Enter checksum value"}
                        className={errors.checksum_value ? "border-red-500" : ""}
                        disabled={formData.checksum_algorithm === "none" || isCalculatingChecksum || !!uploadedFile}
                    />
                    {errors.checksum_value && (
                        <p className="text-sm text-red-500">{errors.checksum_value[0]}</p>
                    )}
                    {isCalculatingChecksum && (
                        <p className="text-xs text-[#667085]">Calculating checksum...</p>
                    )}
                    {uploadedFile && !isCalculatingChecksum && (
                        <p className="text-xs text-[#667085]">Auto-calculated from uploaded file</p>
                    )}
                    <p className="text-xs text-[#667085]">Maximum 255 characters</p>
                </div>
                */}
            </div>
        </div>
    );
}

