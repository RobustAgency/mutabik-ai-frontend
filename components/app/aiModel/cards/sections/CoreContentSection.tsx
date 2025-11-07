"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { CreateAiModelCardData } from "@/service/app/aiModelCards";

interface CoreContentSectionProps {
    formData: CreateAiModelCardData;
    setFormData: (next: Partial<CreateAiModelCardData>) => void;
    errors?: Record<string, string[]>;
}

export default function CoreContentSection({ formData, setFormData, errors = {} }: CoreContentSectionProps) {
    const [organizationalContextInput, setOrganizationalContextInput] = React.useState('');

    const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
    const getError = (fieldName: string) => errors[fieldName]?.[0];

    const set = (k: keyof CreateAiModelCardData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ [k]: e.target.value } as any);

    const handleOrgContextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrganizationalContextInput(e.target.value);
    };

    const handleOrgContextKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newContext = organizationalContextInput.trim();

            if (newContext.length > 0) {
                setFormData({
                    organizational_context: [
                        ...(Array.isArray(formData.organizational_context) ? formData.organizational_context : []),
                        newContext
                    ]
                });
                // Clear input for next entry
                setOrganizationalContextInput('');
            }
        }
    };

    const removeOrgContext = (index: number) => {
        setFormData({
            organizational_context: (Array.isArray(formData.organizational_context) ? formData.organizational_context : []).filter((_, i) => i !== index)
        });
    };
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
                    <Label>Organizational Context</Label>
                    <Input
                        type="text"
                        value={organizationalContextInput}
                        onChange={handleOrgContextInputChange}
                        onKeyPress={handleOrgContextKeyPress}
                        placeholder='Type context and press Enter'
                        className="w-full"
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                        {(Array.isArray(formData.organizational_context) ? formData.organizational_context : []).map((context, index) => (
                            <div
                                key={index}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                                {context}
                                <button
                                    type="button"
                                    onClick={() => removeOrgContext(index)}
                                    className="text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Intended Use <span className="text-red-500">*</span></Label>
                    <Textarea
                        value={formData.intended_use || ""}
                        onChange={set("intended_use")}
                        placeholder="Enter description..."
                        className={`min-h-32 resize-none ${hasError("intended_use") ? "border-red-500" : ""}`}
                    />
                    {hasError("intended_use") && (
                        <p className="text-sm text-red-500">{getError("intended_use")}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Training Data Overview <span className="text-red-500">*</span></Label>
                    <Textarea
                        value={formData.training_data_overview || ""}
                        onChange={set("training_data_overview")}
                        placeholder="Enter description..."
                        className={`min-h-32 resize-none ${hasError("training_data_overview") ? "border-red-500" : ""}`}
                    />
                    {hasError("training_data_overview") && (
                        <p className="text-sm text-red-500">{getError("training_data_overview")}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Bias Evaluation Methods <span className="text-red-500">*</span></Label>
                    <Textarea
                        value={formData.bias_evaluation_methods || ""}
                        onChange={set("bias_evaluation_methods")}
                        placeholder="Enter description..."
                        className={`min-h-32 resize-none ${hasError("bias_evaluation_methods") ? "border-red-500" : ""}`}
                    />
                    {hasError("bias_evaluation_methods") && (
                        <p className="text-sm text-red-500">{getError("bias_evaluation_methods")}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Model Limitations <span className="text-red-500">*</span></Label>
                    <Textarea
                        value={formData.model_limitations || ""}
                        onChange={set("model_limitations")}
                        placeholder="Enter description..."
                        className={`min-h-32 resize-none ${hasError("model_limitations") ? "border-red-500" : ""}`}
                    />
                    {hasError("model_limitations") && (
                        <p className="text-sm text-red-500">{getError("model_limitations")}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Ethical Considerations <span className="text-red-500">*</span></Label>
                    <Textarea
                        value={formData.ethical_considerations || ""}
                        onChange={set("ethical_considerations")}
                        placeholder="Enter description..."
                        className={`min-h-32 resize-none ${hasError("ethical_considerations") ? "border-red-500" : ""}`}
                    />
                    {hasError("ethical_considerations") && (
                        <p className="text-sm text-red-500">{getError("ethical_considerations")}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Risk Summary <span className="text-red-500">*</span></Label>
                    <Textarea
                        value={formData.risk_summary || ""}
                        onChange={set("risk_summary")}
                        placeholder="Enter description..."
                        className={`min-h-32 resize-none ${hasError("risk_summary") ? "border-red-500" : ""}`}
                    />
                    {hasError("risk_summary") && (
                        <p className="text-sm text-red-500">{getError("risk_summary")}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Performance Summary <span className="text-red-500">*</span></Label>
                    <Textarea
                        value={formData.performance_summary || ""}
                        onChange={set("performance_summary")}
                        placeholder="Enter description..."
                        className={`min-h-32 resize-none ${hasError("performance_summary") ? "border-red-500" : ""}`}
                    />
                    {hasError("performance_summary") && (
                        <p className="text-sm text-red-500">{getError("performance_summary")}</p>
                    )}
                </div>
            </div>
        </div>
    );
}


