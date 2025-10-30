"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateAiModelCardData } from "@/service/app/aiModelCards";

interface WorkflowStatusSectionProps {
    formData: CreateAiModelCardData;
    setFormData: (next: Partial<CreateAiModelCardData>) => void;
}

const STATUS = ["draft", "in_review", "approved", "published", "archived"] as const;
const PUBLICATION = ["not_published", "published_internal", "published_public"] as const;

export default function WorkflowStatusSection({ formData, setFormData }: WorkflowStatusSectionProps) {
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
                    <Label>Status</Label>
                    <Select value={formData.status || ""} onValueChange={(v) => setFormData({ status: v })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS.map((x) => (
                                <SelectItem key={x} value={x}>{x.replace(/_/g, " ")}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Publication Status</Label>
                    <Select value={formData.publication_status || ""} onValueChange={(v) => setFormData({ publication_status: v })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select publication" />
                        </SelectTrigger>
                        <SelectContent>
                            {PUBLICATION.map((x) => (
                                <SelectItem key={x} value={x}>{x.replace(/_/g, " ")}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Workflow Stage</Label>
                    <Select value={formData.workflow_stage || ""} onValueChange={(v) => setFormData({ workflow_stage: v })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Creation/Review/etc." />
                        </SelectTrigger>
                        <SelectContent>
                            {["creation", "technical_review", "ethics_review"].map((x) => (
                                <SelectItem key={x} value={x}>{x}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}


