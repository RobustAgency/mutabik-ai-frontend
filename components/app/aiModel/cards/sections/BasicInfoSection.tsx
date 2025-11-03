"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateAiModelCardData } from "@/service/app/aiModelCards";
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";

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
                    <Label>Model Version</Label>
                    <Select value={String(formData.version_id ?? "")} onValueChange={(v) => setFormData({ version_id: v })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select version" />
                        </SelectTrigger>
                        <SelectContent>
                            {versionOptions.map((opt) => (
                                <SelectItem key={opt.id} value={String(opt.id)}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Card Title</Label>
                    <Input value={formData.title || ""} onChange={(e) => setFormData({ title: e.target.value })} placeholder="Title" />
                </div>

                <div className="space-y-2">
                    <Label>Creator Role</Label>
                    <Select value={formData.creator_role || ""} onValueChange={(v) => setFormData({ creator_role: v })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {CREATOR_ROLES.map((x) => (
                                <SelectItem key={x.value} value={x.value}>{x.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Card Format</Label>
                    <Select value={formData.format || ""} onValueChange={(v) => setFormData({ format: v })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                            {CARD_FORMATS.map((x) => (
                                <SelectItem key={x.value} value={x.value}>{x.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Model Owner / Custodian <span className="text-red-500">*</span></Label>
                    <Select
                        value={String(formData.owner_stakeholder_id || "")}
                        onValueChange={(value) => {
                            setFormData({ owner_stakeholder_id: value });
                        }}
                        disabled={stakeholdersLoading || stakeholders.length === 0}
                    >
                        <SelectTrigger className={`w-full gap-2 opacity-100 px-4 py-5.5 rounded-lg border ${hasError("owner_stakeholder_id") ? "border-red-500" : "border-[#D0D5DD]"} bg-[#FFFFFF] cursor-pointer focus:border-[#D0D5DD] focus:-ring-0`}>
                            <SelectValue placeholder={
                                stakeholdersLoading
                                    ? "Loading custodians..."
                                    : stakeholdersError
                                        ? "Error loading custodians"
                                        : stakeholders.length === 0
                                            ? "No custodians available"
                                            : formData.owner_stakeholder_id
                                                ? stakeholders.find((s) => String(s.id) === String(formData.owner_stakeholder_id))?.display_name || "Select owner..."
                                                : "Select owner..."
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {stakeholders.length > 0 ? (
                                stakeholders.map((custodian) => (
                                    <SelectItem key={custodian.id} value={String(custodian.id)}>
                                        {custodian.display_name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="px-2 py-1.5 text-sm text-gray-500">
                                    {stakeholdersError ? "Failed to load custodians" : "No custodians available"}
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                    {hasError("owner_stakeholder_id") && (
                        <p className="text-sm text-red-500">{getError("owner_stakeholder_id")}</p>
                    )}
                    {hasApiError(stakeholdersError) && (
                        <p className="text-sm text-red-500">Failed to load custodians. Check API connection.</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Model Overview</Label>
                    <Textarea value={formData.model_overview || ""} onChange={(e) => setFormData({ model_overview: e.target.value })} placeholder="Enter description..." />
                </div>
            </div>
        </div>
    );
}


