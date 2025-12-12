"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateAiModelCardData } from "@/service/app/aiModelCards";
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import StakeholderModalForm from "@/components/app/stakeholders/create/StakeholderModalForm";
import AiModelVersionModalForm from "@/components/app/aiModel/versions/AiModelVersionModalForm";

interface BasicInfoSectionProps {
    formData: CreateAiModelCardData;
    setFormData: (next: Partial<CreateAiModelCardData>) => void;
    versionOptions: { id: string | number; label: string }[];
    errors?: Record<string, string[]>;
}

const CREATOR_ROLES = [
    { value: "internal_team", label: "Internal team" },
    { value: "vendor_provided", label: "Vendor provided" },
    { value: "community_contributed", label: "Community contributed" },
    { value: "auto_generated", label: "Auto generated" },
];

const CARD_FORMATS = [
    { value: "standard", label: "Standard" },
    { value: "regulatory", label: "Regulatory" },
    { value: "industry_specific", label: "Industry specific" },
    { value: "custom", label: "Custom" },
];

export default function BasicInfoSection({ formData, setFormData, versionOptions, errors = {} }: BasicInfoSectionProps) {
    const { data: stakeholders = [], isLoading: stakeholdersLoading, error: stakeholdersError } = useGetStakeholdersQuery();

    // Helper to check if field has error
    const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
    const getError = (fieldName: string) => errors[fieldName]?.[0];

    // Helper to check if there's an API error
    const hasApiError = (error: unknown) => error !== undefined;
    return (
        <div className="space-y-4">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
                <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
                    Basic Info
                </h2>
                <hr className="border-gray-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Model Version <span className="text-red-500">*</span></Label>
                    <SelectWithInlineCreate
                        value={String(formData.version_id ?? "")}
                        onValueChange={(v) => setFormData({ version_id: v })}
                        options={versionOptions.map((opt) => ({
                            id: opt.id,
                            label: opt.label,
                            value: String(opt.id),
                        }))}
                        isLoading={false}
                        isEmpty={versionOptions.length === 0}
                        entityName="Model Version"
                        modalForm={AiModelVersionModalForm}
                        placeholder="Select version"
                        error={hasError("version_id")}
                    />
                    {hasError("version_id") && (
                        <p className="text-sm text-red-500">{getError("version_id")}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Card Title <span className="text-red-500">*</span></Label>
                    <Input
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ title: e.target.value })}
                        placeholder="Title (min 10 characters)"
                        className={hasError("title") ? "border-red-500" : ""}
                    />
                    {hasError("title") && (
                        <p className="text-sm text-red-500">{getError("title")}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Creator Role <span className="text-red-500">*</span></Label>
                    <Select
                    key={`creator-role-${formData.creator_role || "none"}`}
                    value={formData.creator_role || ""} onValueChange={(v) => setFormData({ creator_role: v })}>
                        <SelectTrigger className={hasError("creator_role") ? "w-full border-red-500" : "w-full"}>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {CREATOR_ROLES.map((x) => (
                                <SelectItem key={x.value} value={x.value}>{x.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasError("creator_role") && (
                        <p className="text-sm text-red-500">{getError("creator_role")}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Card Format <span className="text-red-500">*</span></Label>
                    <Select
                    key={`card-format-${formData.format || "none"}`}
                    value={formData.format || ""} onValueChange={(v) => setFormData({ format: v })}>
                        <SelectTrigger className={hasError("format") ? "w-full border-red-500" : "w-full"}>
                            <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                            {CARD_FORMATS.map((x) => (
                                <SelectItem key={x.value} value={x.value}>{x.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasError("format") && (
                        <p className="text-sm text-red-500">{getError("format")}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Model Owner / Custodian <span className="text-red-500">*</span></Label>
                    <SelectWithInlineCreate
                        value={String(formData.owner_stakeholder_id || "")}
                        onValueChange={(value) => {
                            setFormData({ owner_stakeholder_id: value });
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

                <div className="space-y-2">
                    <Label>Model Overview <span className="text-red-500">*</span></Label>
                    <Textarea
                        value={formData.model_overview || ""}
                        onChange={(e) => setFormData({ model_overview: e.target.value })}
                        placeholder="Enter description..."
                        className={`min-h-32 resize-none ${hasError("model_overview") ? "border-red-500" : ""}`}
                    />
                    {hasError("model_overview") && (
                        <p className="text-sm text-red-500">{getError("model_overview")}</p>
                    )}
                </div>
            </div>
        </div>
    );
}


