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
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import StakeholderModalForm from "@/components/app/stakeholders/create/StakeholderModalForm";
import { HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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
    // Fetch data from APIs
    const { data: stakeholdersResponse, isLoading: stakeholdersLoading, error: stakeholdersError } = useGetStakeholdersQuery({ per_page: 100 });
    const stakeholders = stakeholdersResponse?.data || [];

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
                    Ownership & Responsibility
                </h2>
                <hr className="border-gray-200" />
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Ownership Category */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Ownership Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        key={`ownership-category-${formData.ownership_category || "none"}`}
                        value={formData.ownership_category}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                ownership_category: value as FormDataType["ownership_category"],
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("ownership_category") || hasError("ownership_type") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Select Ownership Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                            <SelectItem value="joint">Joint</SelectItem>
                            <SelectItem value="open_source">Open Source</SelectItem>
                        </SelectContent>
                    </Select>
                    {(hasError("ownership_category") || hasError("ownership_type")) && (
                        <p className="text-sm text-red-500">{getError("ownership_category") || getError("ownership_type")}</p>
                    )}
                </div>

                {/* Responsible Organization Role */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <Label className="text-sm text-[#344054] font-medium">
                            Responsible Organization Role <span className="text-red-500">*</span>
                        </Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">Defines our legal function e.g., Developer or Deployer.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Select
                        key={`responsible-org-role-${formData.responsible_org_role || "none"}`}
                        value={formData.responsible_org_role}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                responsible_org_role: value as FormDataType["responsible_org_role"],
                            }))
                        }
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("responsible_org_role") || hasError("organizational_role") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="deployer">Deployer</SelectItem>
                            <SelectItem value="importer">Importer</SelectItem>
                            <SelectItem value="provider">Provider</SelectItem>
                            <SelectItem value="integrator">Integrator</SelectItem>
                        </SelectContent>
                    </Select>
                    {(hasError("responsible_org_role") || hasError("organizational_role")) && (
                        <p className="text-sm text-red-500">{getError("responsible_org_role") || getError("organizational_role")}</p>
                    )}
                </div>

                {/* Business Owner */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Business Owner
                    </Label>
                    <SelectWithInlineCreate
                        key={`business_owner_id-${formData.business_owner_id || "none"}`}
                        value={formData.business_owner_id ? String(formData.business_owner_id) : ""}
                        onValueChange={(value) => {
                            setFormData((prev) => ({ ...prev, business_owner_id: value || null }));
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
                        placeholder={stakeholdersLoading ? "Loading stakeholders..." : "Select business owner..."}
                        triggerClassName={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("business_owner_id") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}
                        error={hasError("business_owner_id")}
                    />
                    {hasError("business_owner_id") && (
                        <p className="text-sm text-red-500">{getError("business_owner_id")}</p>
                    )}
                    {hasApiError(stakeholdersError) && (
                        <p className="text-sm text-red-500">Failed to load stakeholders. Check API connection.</p>
                    )}
                </div>

                {/* Model Steward / Custodian */}
                <div className="flex flex-col gap-1">
                    <Label className="text-sm text-[#344054] font-medium">
                        Model Steward / Custodian
                    </Label>
                    <SelectWithInlineCreate
                        key={`steward_custodian_id-${formData.steward_custodian_id || "none"}`}
                        value={formData.steward_custodian_id ? String(formData.steward_custodian_id) : ""}
                        onValueChange={(value) => {
                            setFormData((prev) => ({ ...prev, steward_custodian_id: value || null }));
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
                        placeholder={stakeholdersLoading ? "Loading custodians..." : "Select steward..."}
                        triggerClassName={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("steward_custodian_id") || hasError("custodian_id") ? "border-red-500" : "border-[#D0D5DD]"
                            } bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}
                        error={hasError("steward_custodian_id") || hasError("custodian_id")}
                    />
                    {(hasError("steward_custodian_id") || hasError("custodian_id")) && (
                        <p className="text-sm text-red-500">{getError("steward_custodian_id") || getError("custodian_id")}</p>
                    )}
                    {hasApiError(stakeholdersError) && (
                        <p className="text-sm text-red-500">Failed to load custodians. Check API connection.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnershipGovernance;
