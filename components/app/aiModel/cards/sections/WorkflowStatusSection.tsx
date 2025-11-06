"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateAiModelCardData } from "@/service/app/aiModelCards";

interface WorkflowStatusSectionProps {
    formData: CreateAiModelCardData;
    setFormData: (next: Partial<CreateAiModelCardData>) => void;
    errors?: Record<string, string[]>;
}

const STATUS = ["draft", "in_review", "approved", "published", "archived"] as const;
const PUBLICATION = ["not_published", "published_internal", "published_public"] as const;

export default function WorkflowStatusSection({ formData, setFormData, errors = {} }: WorkflowStatusSectionProps) {
    const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
    const getError = (fieldName: string) => errors[fieldName]?.[0];

    return (
        <div className="space-y-4">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
                <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
                    Workflow & Status
                </h2>
                <hr className="border-gray-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Status <span className="text-red-500">*</span></Label>
                    <Select value={formData.status || ""} onValueChange={(v) => setFormData({ status: v })}>
                        <SelectTrigger className={hasError("status") ? "border-red-500" : "w-full"}>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS.map((x) => (
                                <SelectItem key={x} value={x}>{x.replace(/_/g, " ")}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasError("status") && (
                        <p className="text-sm text-red-500">{getError("status")}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Publication Status <span className="text-red-500">*</span></Label>
                    <Select value={formData.publication_status || ""} onValueChange={(v) => setFormData({ publication_status: v })}>
                        <SelectTrigger className={hasError("publication_status") ? "border-red-500" : "w-full"}>
                            <SelectValue placeholder="Select publication" />
                        </SelectTrigger>
                        <SelectContent>
                            {PUBLICATION.map((x) => (
                                <SelectItem key={x} value={x}>{x.replace(/_/g, " ")}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasError("publication_status") && (
                        <p className="text-sm text-red-500">{getError("publication_status")}</p>
                    )}
                </div>
            </div>
        </div>
    );
}


