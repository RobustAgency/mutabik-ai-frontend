"use client";

import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface FileUploadSectionProps {
    uploadedFile: File | null;
    errors: Record<string, string[]>;
    hasUri: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: () => void;
}

export default function FileUploadSection({
    uploadedFile,
    errors,
    hasUri,
    onFileChange,
    onRemoveFile,
}: FileUploadSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-4">
            <div>
                <h2 className="font-sans font-semibold text-base text-[#1D2939] mb-1">
                    Optional File Upload
                </h2>
                <p className="text-xs text-[#667085]">Upload small artifacts directly (Max 25 MB)</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="file_upload" title="Upload small artifacts directly.">
                    Attach Artifact File
                </Label>
                {!uploadedFile ? (
                    <div className="border-2 border-dashed border-[#E4E7EC] rounded-lg p-6">
                        <input
                            ref={fileInputRef}
                            id="file_upload"
                            type="file"
                            onChange={onFileChange}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Upload className="h-8 w-8 text-[#667085]" />
                            <div className="text-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mb-2"
                                >
                                    Choose File
                                </Button>
                                <p className="text-xs text-[#667085]">
                                    or drag and drop
                                </p>
                                <p className="text-xs text-[#667085] mt-1">
                                    Recommended: 10-25 MB
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border border-[#E4E7EC] rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#1D2939]">{uploadedFile.name}</p>
                                <p className="text-xs text-[#667085]">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onRemoveFile}
                            className="text-red-500 hover:text-red-700"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                {errors.file_upload && (
                    <p className="text-sm text-red-500">{errors.file_upload[0]}</p>
                )}
                {!hasUri && !uploadedFile && (
                    <p className="text-xs text-[#667085]">Either URI or File Upload is required</p>
                )}
            </div>
        </div>
    );
}

