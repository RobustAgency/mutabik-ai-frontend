"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormDataType } from "../types/aiModelTypes";
import { useGetVendorsQuery } from "@/app/lib/features/vendorsApi";
import { useGetStakeholdersByTypeQuery } from "@/app/lib/features/stakeholdersApi";

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
    const [sourceOrgInput, setSourceOrgInput] = useState(formData.source_organization_id || "");
    const [modelOwnerInput, setModelOwnerInput] = useState(formData.custodian_id || "");
    const [vendorInput, setVendorInput] = useState(formData.vendor_id || "none");

    // Fetch data from APIs
    const { data: vendors = [], isLoading: vendorsLoading, error: vendorsError } = useGetVendorsQuery();
    const { data: stakeholders = [], isLoading: stakeholdersLoading, error: stakeholdersError } = useGetStakeholdersByTypeQuery('vendor_org');
    const { data: custodians = [], isLoading: custodiansLoading, error: custodiansError } = useGetStakeholdersByTypeQuery('person');

    useEffect(() => {
        setSourceOrgInput(formData.source_organization_id || "");
        setModelOwnerInput(formData.custodian_id || "");
        setVendorInput(formData.vendor_id || "none");
    }, [formData]);

    // Helper to check if field has error
    const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
    const getError = (fieldName: string) => errors[fieldName]?.[0];

    // Helper to check if there's an API error
    const hasApiError = (error: unknown) => error !== undefined;

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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


            </div>

            {/* Additional Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                {/* Source Organization / Stakeholder */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Source Organization / Stakeholder <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={sourceOrgInput || ""}
                        onValueChange={(value) => {
                            setSourceOrgInput(value);
                            setFormData((prev) => ({ ...prev, source_organization_id: value }));
                        }}
                        disabled={stakeholdersLoading}
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("source_organization_id") ? "border-red-500" : "border-[#D0D5DD]"} bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder={stakeholdersLoading ? "Loading..." : "Select stakeholder..."} />
                        </SelectTrigger>
                        <SelectContent>
                            {stakeholders.length > 0 ? (
                                stakeholders.map((stakeholder) => (
                                    <SelectItem key={stakeholder.id} value={stakeholder.id}>
                                        {stakeholder.display_name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-2 py-1.5 text-sm text-gray-500">
                                    No stakeholders available
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                    {hasError("source_organization_id") && (
                        <p className="text-sm text-red-500">{getError("source_organization_id")}</p>
                    )}
                    {hasApiError(stakeholdersError) && (
                        <p className="text-sm text-red-500">Failed to load stakeholders</p>
                    )}
                </div>

                {/* Current Owner / Custodian */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Model Owner / Custodian <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={modelOwnerInput || ""}
                        onValueChange={(value) => {
                            setModelOwnerInput(value);
                            setFormData((prev) => ({ ...prev, custodian_id: value }));
                        }}
                        disabled={custodiansLoading}
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("custodian_id") ? "border-red-500" : "border-[#D0D5DD]"} bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder={custodiansLoading ? "Loading..." : "Select owner..."} />
                        </SelectTrigger>
                        <SelectContent>
                            {custodians.length > 0 ? (
                                custodians.map((custodian) => (
                                    <SelectItem key={custodian.id} value={custodian.id}>
                                        {custodian.display_name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-2 py-1.5 text-sm text-gray-500">
                                    No custodians available
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                    {hasError("custodian_id") && (
                        <p className="text-sm text-red-500">{getError("custodian_id")}</p>
                    )}
                    {hasApiError(custodiansError) && (
                        <p className="text-sm text-red-500">Failed to load custodians</p>
                    )}
                </div>

                {/* Vendor */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Vendor (if applicable)
                    </Label>
                    <Select
                        value={vendorInput || "none"}
                        onValueChange={(value) => {
                            setVendorInput(value);
                            setFormData((prev) => ({
                                ...prev,
                                vendor_id: value === "none" ? null : value
                            }));
                        }}
                        disabled={vendorsLoading}
                    >
                        <SelectTrigger className="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0">
                            <SelectValue placeholder={vendorsLoading ? "Loading..." : "None / Internal"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None / Internal</SelectItem>
                            {vendors.length > 0 ? (
                                vendors.map((vendor) => (
                                    <SelectItem key={vendor.id} value={vendor.id}>
                                        {vendor.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-2 py-1.5 text-sm text-gray-500">
                                    No vendors available
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                    {hasApiError(vendorsError) && (
                        <p className="text-sm text-red-500">Failed to load vendors</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnershipGovernance;