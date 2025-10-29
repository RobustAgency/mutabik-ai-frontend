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
import { FormDataType } from "../types/aiModelTypes";

interface OwnershipGovernanceProps {
    formData: FormDataType;
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    errors?: Record<string, string[]>;
}

const OwnershipGovernance: React.FC<OwnershipGovernanceProps> = ({
    formData,
    setFormData,
    errors = {},
}) => {
    const [sourceOrgInput, setSourceOrgInput] = useState(formData.source_organization || "");
    const [modelOwnerInput, setModelOwnerInput] = useState(formData.model_owner || "");
    const [vendorInput, setVendorInput] = useState(formData.vendor_id || "");

    useEffect(() => {
        setSourceOrgInput(formData.source_organization || "");
        setModelOwnerInput(formData.model_owner || "");
        setVendorInput(formData.vendor_id || "");
    }, [formData]);

    // Helper to check if field has error
    const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
    const getError = (fieldName: string) => errors[fieldName]?.[0];

    return (
        <div className="space-y-6 w-full">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
                <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
                    Ownership
                </h2>
                <hr className="border-gray-200" />
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {/* Organizational Role */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Organizational Role <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.organizational_role}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                organizational_role: value as FormDataType["organizational_role"],
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("organizational_role") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Developer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="importer">Importer</SelectItem>
                            <SelectItem value="deployer">Deployer</SelectItem>
                            <SelectItem value="integrator">Integrator</SelectItem>
                            <SelectItem value="consumer">Consumer</SelectItem>
                            <SelectItem value="collaborator">Collaborator</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasError("organizational_role") && (
                        <p className="text-sm text-red-500">{getError("organizational_role")}</p>
                    )}
                </div>

                {/* Ownership Type */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Ownership Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.ownership_type}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                ownership_type: value as FormDataType["ownership_type"],
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("ownership_type") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Internal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                            <SelectItem value="joint">Joint</SelectItem>
                            <SelectItem value="licensed">Licensed</SelectItem>
                            <SelectItem value="open_source">Open Source</SelectItem>
                            <SelectItem value="saas">SaaS</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasError("ownership_type") && (
                        <p className="text-sm text-red-500">{getError("ownership_type")}</p>
                    )}
                </div>

                {/* Current Owner */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Current Owner
                    </Label>
                    <Select
                        value="internal"
                        onValueChange={() => { }}
                    >
                        <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0">
                            <SelectValue placeholder="Internal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                            <SelectItem value="joint">Joint</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Development Source */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Development Source <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.development_source}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                development_source: value as FormDataType["development_source"],
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("development_source") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Internal Development" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="internal_development">Internal Development</SelectItem>
                            <SelectItem value="external_vendor">External Vendor</SelectItem>
                            <SelectItem value="open_source_community">Open Source Community</SelectItem>
                            <SelectItem value="cloud_provider">Cloud Provider</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasError("development_source") && (
                        <p className="text-sm text-red-500">{getError("development_source")}</p>
                    )}
                </div>

                {/* Source Organization */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Source Organization
                    </Label>
                    <Select
                        value="internal"
                        onValueChange={() => { }}
                    >
                        <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0">
                            <SelectValue placeholder="Internal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Additional Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Source Organization / Stakeholder */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Source Organization / Stakeholder
                    </Label>
                    <Input
                        value={sourceOrgInput}
                        onChange={(e) => setSourceOrgInput(e.target.value)}
                        onBlur={() => setFormData((prev) => ({ ...prev, source_organization: sourceOrgInput }))}
                        placeholder="e.g., Internal AI Team, OpenAI, AWS"
                        className="h-[44px] rounded-md border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus-visible:ring-0 focus-visible:border-[#D0D5DD]"
                    />
                </div>

                {/* Model Owner / Custodian */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Model Owner / Custodian
                    </Label>
                    <Input
                        value={modelOwnerInput}
                        onChange={(e) => setModelOwnerInput(e.target.value)}
                        onBlur={() => setFormData((prev) => ({ ...prev, model_owner: modelOwnerInput }))}
                        placeholder="e.g., Sarah Chen - AI Product Lead"
                        className="h-[44px] rounded-md border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus-visible:ring-0 focus-visible:border-[#D0D5DD]"
                    />
                </div>

                {/* Vendor */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Vendor (if applicable)
                    </Label>
                    <Input
                        value={vendorInput}
                        onChange={(e) => setVendorInput(e.target.value)}
                        onBlur={() => setFormData((prev) => ({ ...prev, vendor_id: vendorInput }))}
                        placeholder="e.g., OpenAI, AWS, Google Cloud"
                        className="h-[44px] rounded-md border border-[#D0D5DD] text-sm text-[#101828] placeholder:text-[#98A2B3] focus-visible:ring-0 focus-visible:border-[#D0D5DD]"
                    />
                </div>
            </div>
        </div>
    );
};

export default OwnershipGovernance;