"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateAiModelCardData } from "@/service/app/aiModelCards";

interface BasicInfoSectionProps {
    formData: CreateAiModelCardData;
    setFormData: (next: Partial<CreateAiModelCardData>) => void;
    versionOptions: { id: string | number; label: string }[];
    modelOptions: { id: string | number; label: string }[];
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

export default function BasicInfoSection({ formData, setFormData, versionOptions, modelOptions }: BasicInfoSectionProps) {
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
                    <Label>Parent Model</Label>
                    <Select value={String(formData.ai_model_id ?? "")} onValueChange={(v) => setFormData({ ai_model_id: v, version_id: undefined, ai_model_version_id: "" })}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select parent model" />
                        </SelectTrigger>
                        <SelectContent>
                            {modelOptions.map((opt) => (
                                <SelectItem key={opt.id} value={String(opt.id)}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Model Version</Label>
                    <Select value={String(formData.version_id ?? formData.ai_model_version_id ?? "")} onValueChange={(v) => setFormData({ version_id: v, ai_model_version_id: String(v) })}>
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
                    <Label>Version</Label>
                    <Input value={formData.version || ""} onChange={(e) => setFormData({ version: e.target.value })} placeholder="e.g., 2.1" />
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
                    <Label>Card Owner Email</Label>
                    <Input type="email" value={formData.owner_email || ""} onChange={(e) => setFormData({ owner_email: e.target.value })} placeholder="owner@example.com" />
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
                    <Label>Completeness Score</Label>
                    <Input type="number" min={0} max={100} value={formData.completeness_score ?? 0} onChange={(e) => setFormData({ completeness_score: Number(e.target.value) })} placeholder="0 - 100" />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <Label>Model Overview</Label>
                    <Textarea value={formData.model_overview || ""} onChange={(e) => setFormData({ model_overview: e.target.value })} placeholder="Enter description..." />
                </div>
            </div>
        </div>
    );
}


