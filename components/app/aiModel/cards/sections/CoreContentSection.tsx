"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateAiModelCardData } from "@/service/app/aiModelCards";

interface CoreContentSectionProps {
    formData: CreateAiModelCardData;
    setFormData: (next: Partial<CreateAiModelCardData>) => void;
}

export default function CoreContentSection({ formData, setFormData }: CoreContentSectionProps) {
    const set = (k: keyof CreateAiModelCardData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ [k]: e.target.value } as any);
    return (
        <div className="space-y-4">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
                <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
                    Core Content
                </h2>
                <hr className="border-gray-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Organizational Context (JSON or narrative)</Label>
                    <Textarea value={formData.organizational_context || ""} onChange={set("organizational_context")} placeholder="Enter description..." />
                </div>
                <div className="space-y-2">
                    <Label>Intended Use</Label>
                    <Textarea value={formData.intended_use || ""} onChange={set("intended_use")} placeholder="Enter description..." />
                </div>
                <div className="space-y-2">
                    <Label>Training Data Overview</Label>
                    <Textarea value={formData.training_data_overview || ""} onChange={set("training_data_overview")} placeholder="Enter description..." />
                </div>
                <div className="space-y-2">
                    <Label>Bias Evaluation Methods</Label>
                    <Textarea value={formData.bias_evaluation_methods || ""} onChange={set("bias_evaluation_methods")} placeholder="Enter description..." />
                </div>
                <div className="space-y-2">
                    <Label>Model Limitations</Label>
                    <Textarea value={formData.model_limitations || ""} onChange={set("model_limitations")} placeholder="Enter description..." />
                </div>
                <div className="space-y-2">
                    <Label>Ethical Considerations</Label>
                    <Textarea value={formData.ethical_considerations || ""} onChange={set("ethical_considerations")} placeholder="Enter description..." />
                </div>
                <div className="space-y-2">
                    <Label>Risk Summary</Label>
                    <Textarea value={formData.risk_summary || ""} onChange={set("risk_summary")} placeholder="Enter description..." />
                </div>
                <div className="space-y-2">
                    <Label>Performance Summary</Label>
                    <Textarea value={formData.performance_summary || ""} onChange={set("performance_summary")} placeholder="Enter description..." />
                </div>
            </div>
        </div>
    );
}


