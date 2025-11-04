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

interface BasicInfoProps {
    formData: FormDataType;
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    errors?: Record<string, string[]>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, setFormData, errors = {} }) => {
    const [nameInput, setNameInput] = useState(formData.name);
    const [descriptionInput, setDescriptionInput] = useState(formData.description || "");

    useEffect(() => {
        setNameInput(formData.name);
        setDescriptionInput(formData.description || "");
    }, [formData]);

    // Helper to check if field has error
    const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
    const getError = (fieldName: string) => errors[fieldName]?.[0];

    return (
        <div className="space-y-6 w-full">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
                <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
                    Basic Info
                </h2>
                <hr className="border-gray-200" />
            </div>

            <div className="gap-6 w-full flex flex-col">
                {/* Name + Primary Category */}
                <div className="flex flex-col md:flex-row w-full gap-6">
                    <div className="flex flex-col gap-2 w-full">
                        <Label>
                            Name <span className="text-red-500">*</span>
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
                        <Label>
                            Primary Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.primary_category}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, primary_category: value as FormDataType["primary_category"] }))
                            }
                        >
                            <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("primary_category") ? "border-red-500" : "border-[#D0D5DD]"
                                } bg-[#FFFFFF] focus:border-[#D0D5DD] focus:-ring-0`}>
                                <SelectValue placeholder="Deep Learning" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="traditional_ml">Traditional ML</SelectItem>
                                <SelectItem value="deep_learning">Deep Learning</SelectItem>
                                <SelectItem value="generative_ai">Generative AI</SelectItem>
                                <SelectItem value="ai_agents">AI Agents</SelectItem>
                                <SelectItem value="specialized_ai">Specialized AI</SelectItem>
                                <SelectItem value="foundation_models">Foundation Models</SelectItem>
                                <SelectItem value="multimodal_ai">Multimodal AI</SelectItem>
                            </SelectContent>
                        </Select>
                        {hasError("primary_category") && (
                            <p className="text-sm text-red-500">{getError("primary_category")}</p>
                        )}
                    </div>
                </div>

                {/* Description + Model Type */}
                <div className="flex flex-col md:flex-row w-full gap-6">
                    <div className="flex flex-col gap-2 w-full min-w-0">
                        <Label>
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            value={descriptionInput}
                            onChange={(e) => setDescriptionInput(e.target.value)}
                            onBlur={() => setFormData((prev) => ({ ...prev, description: descriptionInput }))}
                            placeholder="Enter a description..."
                            className={`placeholder:text-muted-foreground border dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-[74px] resize-none focus:outline-none focus:ring-0 focus:border-transparent ${hasError("description") ? "border-red-500" : "border-[#D0D5DD]"}`}
                        />
                        {hasError("description") && (
                            <p className="text-sm text-red-500">{getError("description")}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 w-full min-w-0">
                        <Label>
                            Model Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, type: value as FormDataType["type"] }))
                            }
                        >
                            <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("model_type") ? "border-red-500" : "border-[#D0D5DD]"
                                } bg-[#FFFFFF] focus:border-[#D0D5DD] focus:-ring-0`}>
                                <SelectValue placeholder="Classification" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="classification">Classification</SelectItem>
                                <SelectItem value="regression">Regression</SelectItem>
                                <SelectItem value="clustering">Clustering</SelectItem>
                                <SelectItem value="generation">Generation</SelectItem>
                                <SelectItem value="translation">Translation</SelectItem>
                                <SelectItem value="summarization">Summarization</SelectItem>
                                <SelectItem value="question_answering">Question Answering</SelectItem>
                                <SelectItem value="recommendation">Recommendation</SelectItem>
                                <SelectItem value="optimization">Optimization</SelectItem>
                                <SelectItem value="forecasting">Forecasting</SelectItem>
                            </SelectContent>
                        </Select>
                        {hasError("type") && (
                            <p className="text-sm text-red-500">{getError("type")}</p>
                        )}
                    </div>
                </div>

                {/* Domain Specialization + Creator Email */}
                <div className="flex flex-col md:flex-row w-full gap-6">
                    <div className="flex flex-col gap-2 w-full">
                        <Label>
                            Domain Specialization <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.domain_specialization}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, domain_specialization: value as FormDataType["domain_specialization"] }))
                            }
                        >
                            <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("domain_specialization") ? "border-red-500" : "border-[#D0D5DD]"
                                } bg-[#FFFFFF] focus:border-[#D0D5DD] focus:-ring-0`}>
                                <SelectValue placeholder="General" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="legal">Legal</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="hr">Human Resources</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="automotive">Automotive</SelectItem>
                                <SelectItem value="energy">Energy</SelectItem>
                                <SelectItem value="telecom">Telecommunications</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                            </SelectContent>
                        </Select>
                        {hasError("domain_specialization") && (
                            <p className="text-sm text-red-500">{getError("domain_specialization")}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <Label>
                            Creator Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            required
                            type="email"
                            value={formData.creator_email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, creator_email: e.target.value }))}
                            placeholder="creator@example.com"
                            className={`h-[44px] w-full px-4 rounded-lg border ${hasError("creator_email") ? "border-red-500" : "border-[#D0D5DD]"
                                } focus:border-[#D0D5DD] focus:-ring-0`}
                        />
                        {hasError("creator_email") && (
                            <p className="text-sm text-red-500">{getError("created_by")}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;