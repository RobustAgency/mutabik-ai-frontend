"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormDataType } from "../types/aiModelTypes";
import { HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface BasicInfoProps {
    formData: FormDataType;
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    errors?: Record<string, string[]>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, setFormData, errors = {} }) => {
    const [nameInput, setNameInput] = useState(formData.name);
    const [modelPurposeInput, setModelPurposeInput] = useState(formData.model_purpose || "");

    useEffect(() => {
        setNameInput(formData.name);
        setModelPurposeInput(formData.model_purpose || "");
    }, [formData]);

    // Helper to check if field has error
    const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
    const getError = (fieldName: string) => errors[fieldName]?.[0];

    return (
        <div className="space-y-6 w-full">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
                <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
                    Basic Information
                </h2>
                <hr className="border-gray-200" />
            </div>

            <div className="gap-6 w-full flex flex-col">
                {/* Model Name + Model Category */}
                <div className="flex flex-col md:flex-row w-full gap-6">
                    <div className="flex flex-col gap-2 w-full">
                        <Label className="text-sm text-[#344054] font-medium">
                            Model Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            required
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onBlur={() => setFormData((prev) => ({ ...prev, name: nameInput }))}
                            placeholder="CustomerServiceNLP"
                            className={`h-[44px] w-full px-4 rounded-lg border ${hasError("name") ? "border-red-500" : "border-[#D0D5DD]"
                                } focus:border-[#D0D5DD] focus:-ring-0`}
                        />
                        {hasError("name") && (
                            <p className="text-sm text-red-500">{getError("name")}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-1">
                            <Label className="text-sm text-[#344054] font-medium">
                                Model Category <span className="text-red-500">*</span>
                            </Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs">Defines the architectural family (ML, GenAI, Agentic).</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Select
                            value={formData.model_category}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, model_category: value as FormDataType["model_category"] }))
                            }
                        >
                            <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("category") || hasError("model_category") ? "border-red-500" : "border-[#D0D5DD]"
                                } bg-[#FFFFFF] focus:border-[#D0D5DD] focus:-ring-0`}>
                                <SelectValue placeholder="Select Model Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="traditional_ml">Traditional ML</SelectItem>
                                <SelectItem value="statistical_classical_model">Statistical / Classical Model</SelectItem>
                                <SelectItem value="rule_based_expert_system">Rule-based / Expert System</SelectItem>
                                <SelectItem value="hybrid_rules_ml">Hybrid (Rules + ML)</SelectItem>
                                <SelectItem value="generative_ai_foundation_llm">Generative AI – Foundation / LLM</SelectItem>
                                <SelectItem value="generative_ai_fine_tuned_domain_model">Generative AI – Fine-tuned / Domain Model</SelectItem>
                                <SelectItem value="generative_ai_multimodal">Generative AI – Multimodal</SelectItem>
                                <SelectItem value="agentic_ai_agent">Agentic AI / AI Agent</SelectItem>
                                <SelectItem value="autonomous_decision_system">Autonomous Decision System</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {(hasError("category") || hasError("model_category")) && (
                            <p className="text-sm text-red-500">{getError("category") || getError("model_category")}</p>
                        )}
                    </div>
                </div>

                {/* Model Type + Technical Domain */}
                <div className="flex flex-col md:flex-row w-full gap-6">
                    <div className="flex flex-col gap-2 w-full">
                        <Label className="text-sm text-[#344054] font-medium">
                            Model Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, type: value as FormDataType["type"] }))
                            }
                        >
                            <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("type") ? "border-red-500" : "border-[#D0D5DD]"
                                } bg-[#FFFFFF] focus:border-[#D0D5DD] focus:-ring-0`}>
                                <SelectValue placeholder="Select Model Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="classification">Classification</SelectItem>
                                <SelectItem value="regression">Regression</SelectItem>
                                <SelectItem value="clustering">Clustering</SelectItem>
                                <SelectItem value="nlp_model">NLP Model</SelectItem>
                                <SelectItem value="computer_vision_model">Computer Vision Model</SelectItem>
                                <SelectItem value="time_series_forecasting">Time-Series Forecasting</SelectItem>
                                <SelectItem value="recommendation_model">Recommendation Model</SelectItem>
                                <SelectItem value="llm">LLM</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {hasError("type") && (
                            <p className="text-sm text-red-500">{getError("type")}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-1">
                            <Label className="text-sm text-[#344054] font-medium">
                                Technical Domain <span className="text-red-500">*</span>
                            </Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs">Technical specialization such as NLP or CV.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Select
                            value={formData.technical_domain}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, technical_domain: value as FormDataType["technical_domain"] }))
                            }
                        >
                            <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("technical_domain") ? "border-red-500" : "border-[#D0D5DD]"
                                } bg-[#FFFFFF] focus:border-[#D0D5DD] focus:-ring-0`}>
                                <SelectValue placeholder="Select Technical Domain" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="nlp">NLP</SelectItem>
                                <SelectItem value="computer_vision">Computer Vision</SelectItem>
                                <SelectItem value="time_series">Time-Series</SelectItem>
                                <SelectItem value="tabular_structured_data">Tabular / Structured Data</SelectItem>
                                <SelectItem value="multimodal">Multimodal</SelectItem>
                                <SelectItem value="anomaly_detection">Anomaly Detection</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {hasError("technical_domain") && (
                            <p className="text-sm text-red-500">{getError("technical_domain")}</p>
                        )}
                    </div>
                </div>

                {/* Model Purpose / Intended Use */}
                <div className="flex flex-col gap-2 w-full">
                    <Label className="text-sm text-[#344054] font-medium">
                        Model Purpose / Intended Use
                    </Label>
                    <Textarea
                        value={modelPurposeInput}
                        onChange={(e) => setModelPurposeInput(e.target.value)}
                        onBlur={() => setFormData((prev) => ({ ...prev, model_purpose: modelPurposeInput || null }))}
                        placeholder="Describe the intended use and purpose of this AI model..."
                        className={`min-h-32 resize-none ${hasError("purpose") || hasError("model_purpose") ? "border-red-500" : "border-[#D0D5DD]"}`}
                    />
                    {(hasError("purpose") || hasError("model_purpose")) && (
                        <p className="text-sm text-red-500">{getError("purpose") || getError("model_purpose")}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;
