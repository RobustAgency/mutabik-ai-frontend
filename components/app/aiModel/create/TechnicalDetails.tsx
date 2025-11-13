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
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import { useAiModelVersions } from "@/hooks/app/useAiModelVersions";
import AiModelVersionModalForm from "../versions/AiModelVersionModalForm";

interface TechnicalDetailsProps {
    formData: FormDataType;
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    errors?: Record<string, string[]>;
}

const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({
    formData,
    setFormData,
    errors = {},
}) => {
    // Helper to check if field has error
    const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
    const getError = (fieldName: string) => errors[fieldName]?.[0];

    // Fetch AI Model Versions
    const { aiModelVersions, loading: isLoadingVersions } = useAiModelVersions();

    // Check if production version is required
    const isProductionVersionRequired = formData.operational_status === "production";

    return (
        <div className="space-y-6 w-full">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
                <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
                    Technical
                </h2>
                <hr className="border-gray-200" />
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Operational Status */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Operational Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.operational_status}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                operational_status: value as FormDataType["operational_status"],
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("operational_status") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Production" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="not_deployed">Not Deployed</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="testing">Testing</SelectItem>
                            <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasError("operational_status") && (
                        <p className="text-sm text-red-500">{getError("operational_status")}</p>
                    )}
                </div>

                {/* Business Status */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Business Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.business_status}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                business_status: value as FormDataType["business_status"],
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("business_status") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Active" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="deprecated">Deprecated</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasError("business_status") && (
                        <p className="text-sm text-red-500">{getError("business_status")}</p>
                    )}
                </div>

                {/* Risk Classification */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Regulatory Classification <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.regulatory_risk_classification}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                regulatory_risk_classification: value as FormDataType["regulatory_risk_classification"],
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("regulatory_risk_classification") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Limited Risk" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="minimal_risk">Minimal Risk</SelectItem>
                            <SelectItem value="limited_risk">Limited Risk</SelectItem>
                            <SelectItem value="high_risk">High Risk (EU AI Act)</SelectItem>
                            <SelectItem value="unacceptable_risk">Unacceptable Risk</SelectItem>
                            <SelectItem value="sector_specific">Sector Specific</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasError("regulatory_risk_classification") && (
                        <p className="text-sm text-red-500">{getError("regulatory_risk_classification")}</p>
                    )}
                </div>

                {/* Current Version - Required when operational_status is production, optional otherwise */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Current Version {isProductionVersionRequired && <span className="text-red-500">*</span>}
                    </Label>
                    <SelectWithInlineCreate
                        value={formData.current_version_id || ""}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                current_version_id: value || null,
                            }))
                        }
                        options={aiModelVersions.map((version) => ({
                            id: version.id,
                            label: `${version.ai_model?.name || "Model"} • ${version.version_number || version.id}`,
                            value: String(version.id),
                        }))}
                        isLoading={isLoadingVersions}
                        isEmpty={!isLoadingVersions && aiModelVersions.length === 0}
                        entityName="AI Model Version"
                        modalForm={AiModelVersionModalForm}
                        placeholder="Select a current version..."
                        triggerClassName={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("current_version_id") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}
                        error={hasError("current_version_id")}
                    />
                    {hasError("current_version_id") && (
                        <p className="text-sm text-red-500">{getError("current_version_id")}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechnicalDetails;