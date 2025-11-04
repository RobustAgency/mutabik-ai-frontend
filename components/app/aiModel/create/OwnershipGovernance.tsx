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
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import VendorModalForm from "@/components/app/vendors/create/VendorModalForm";
import StakeholderModalForm from "@/components/app/stakeholders/create/StakeholderModalForm";

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
    const [vendorInput, setVendorInput] = useState(formData.vendor_id || "none");

    // Fetch data from APIs
    const { data: vendorsResponse, isLoading: vendorsLoading, error: vendorsError } = useGetVendorsQuery();
    const vendors = vendorsResponse?.data || [];
    const { data: stakeholders = [], isLoading: stakeholdersLoading, error: stakeholdersError } = useGetStakeholdersQuery();

    useEffect(() => {
        setVendorInput(formData.vendor_id || "none");
    }, [formData.vendor_id]);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    <SelectWithInlineCreate
                        value={String(formData.source_org_stakeholder_id || "")}
                        onValueChange={(value) => {
                            setFormData((prev) => ({ ...prev, source_org_stakeholder_id: value }));
                        }}
                        options={stakeholders.map((stakeholder) => ({
                            id: stakeholder.id,
                            label: stakeholder.display_name,
                            value: String(stakeholder.id),
                        }))}
                        isLoading={stakeholdersLoading}
                        isEmpty={!stakeholdersLoading && stakeholders.length === 0}
                        entityName="Stakeholder"
                        modalForm={StakeholderModalForm}
                        placeholder={stakeholdersLoading ? "Loading stakeholders..." : "Select stakeholder..."}
                        triggerClassName="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0"
                        error={hasError("source_org_stakeholder_id")}
                    />
                    {hasError("source_org_stakeholder_id") && (
                        <p className="text-sm text-red-500">{getError("source_org_stakeholder_id")}</p>
                    )}
                    {hasApiError(stakeholdersError) && (
                        <p className="text-sm text-red-500">Failed to load stakeholders. Check API connection.</p>
                    )}
                </div>

                {/* Current Owner / Custodian */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Model Owner / Custodian <span className="text-red-500">*</span>
                    </Label>
                    <SelectWithInlineCreate
                        value={String(formData.owner_stakeholder_id || "")}
                        onValueChange={(value) => {
                            setFormData((prev) => ({ ...prev, owner_stakeholder_id: value }));
                        }}
                        options={stakeholders.map((custodian) => ({
                            id: custodian.id,
                            label: custodian.display_name,
                            value: String(custodian.id),
                        }))}
                        isLoading={stakeholdersLoading}
                        isEmpty={!stakeholdersLoading && stakeholders.length === 0}
                        entityName="Stakeholder"
                        modalForm={StakeholderModalForm}
                        placeholder={stakeholdersLoading ? "Loading custodians..." : "Select owner..."}
                        triggerClassName="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0"
                        error={hasError("owner_stakeholder_id")}
                    />
                    {hasError("owner_stakeholder_id") && (
                        <p className="text-sm text-red-500">{getError("owner_stakeholder_id")}</p>
                    )}
                    {hasApiError(stakeholdersError) && (
                        <p className="text-sm text-red-500">Failed to load custodians. Check API connection.</p>
                    )}
                </div>

                {/* Vendor */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Vendor (if applicable)
                    </Label>
                    <SelectWithInlineCreate
                        value={vendorInput || "none"}
                        onValueChange={(value) => {
                            setVendorInput(value);
                            setFormData((prev) => ({
                                ...prev,
                                vendor_id: value === "none" ? null : value
                            }));
                        }}
                        options={[
                            { id: "none", label: "None / Internal", value: "none" },
                            ...vendors.map((vendor) => ({
                                id: vendor.id,
                                label: vendor.vendor_name,
                                value: String(vendor.id),
                            }))
                        ]}
                        isLoading={vendorsLoading}
                        isEmpty={!vendorsLoading && vendors.length === 0}
                        entityName="Vendor"
                        modalForm={VendorModalForm}
                        placeholder={vendorsLoading ? "Loading..." : "None / Internal"}
                        triggerClassName="w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0"
                    />
                    {hasApiError(vendorsError) && (
                        <p className="text-sm text-red-500">Failed to load vendors</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnershipGovernance;