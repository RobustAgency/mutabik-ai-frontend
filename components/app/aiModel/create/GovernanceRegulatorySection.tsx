"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormDataType } from "../types/aiModelTypes";
import { HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface GovernanceRegulatorySectionProps {
    formData: FormDataType;
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    errors?: Record<string, string[]>;
}

const GovernanceRegulatorySection: React.FC<GovernanceRegulatorySectionProps> = ({
    formData,
    setFormData,
    errors = {},
}) => {
    // Helper to check if field has error
    const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
    const getError = (fieldName: string) => errors[fieldName]?.[0];

    return (
        <div className="space-y-6 w-full">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
                <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
                    Governance & Regulatory Classification
                </h2>
                <hr className="border-gray-200" />
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Criticality Level */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <Label className="text-sm text-[#344054] font-medium">
                            Criticality Level
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">Business impact classification.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Select
                        value={formData.criticality_level || ""}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                criticality_level: value ? (value as FormDataType["criticality_level"]) : null,
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("criticality_level") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Select Criticality Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasError("criticality_level") && (
                        <p className="text-sm text-red-500">{getError("criticality_level")}</p>
                    )}
                </div>

                {/* Regulatory Risk Tier */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <Label className="text-sm text-[#344054] font-medium">
                            Regulatory Risk Tier
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">Organization-wide regulatory risk rating.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Select
                        value={formData.regulatory_risk_tier || ""}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                regulatory_risk_tier: value ? (value as FormDataType["regulatory_risk_tier"]) : null,
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("regulatory_risk_tier") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Select Regulatory Risk Tier" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="minimal_risk">Minimal Risk</SelectItem>
                            <SelectItem value="limited_risk">Limited Risk</SelectItem>
                            <SelectItem value="high_risk">High-Risk</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasError("regulatory_risk_tier") && (
                        <p className="text-sm text-red-500">{getError("regulatory_risk_tier")}</p>
                    )}
                </div>

                {/* EU AI Category */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <Label className="text-sm text-[#344054] font-medium">
                            EU AI Category
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">EU AI Act legal classification (Minimal, Limited, High, Unacceptable).</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Select
                        value={formData.eu_ai_category || ""}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                eu_ai_category: value ? (value as FormDataType["eu_ai_category"]) : null,
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("eu_ai_category") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Select EU AI Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="minimal_risk">Minimal Risk</SelectItem>
                            <SelectItem value="limited_risk">Limited Risk</SelectItem>
                            <SelectItem value="high_risk">High-Risk</SelectItem>
                            <SelectItem value="unacceptable_risk">Unacceptable / Prohibited Risk</SelectItem>
                            <SelectItem value="not_applicable">Not Applicable</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasError("eu_ai_category") && (
                        <p className="text-sm text-red-500">{getError("eu_ai_category")}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GovernanceRegulatorySection;

