"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MetadataSectionProps {
    formData: {
        notes: string;
    };
    errors: Record<string, string[]>;
    onFieldChange: (field: string, value: string) => void;
    onErrorClear: (field: string) => void;
}

export default function MetadataSection({
    formData,
    errors,
    onFieldChange,
    onErrorClear,
}: MetadataSectionProps) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="font-sans font-semibold text-base text-[#1D2939] mb-1">
                    Metadata
                </h2>
                <p className="text-xs text-[#667085]">Additional information about the artifact</p>
            </div>

            <div className="space-y-4">
                {/* Description / Notes */}
                <div className="space-y-2">
                    <Label htmlFor="notes">Description / Notes</Label>
                    <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => {
                            onFieldChange("notes", e.target.value);
                            onErrorClear("notes");
                        }}
                        placeholder="Additional notes about this artifact..."
                        className={`min-h-32 resize-none ${errors.notes ? "border-red-500" : ""}`}
                    />
                    {errors.notes && (
                        <p className="text-sm text-red-500">{errors.notes[0]}</p>
                    )}
                    <p className="text-xs text-[#667085]">Maximum 1000 characters</p>
                </div>
            </div>
        </div>
    );
}

