"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CreateAiModelCardData } from "@/service/app/aiModelCards";

interface DatesReviewsSectionProps {
    formData: CreateAiModelCardData;
    setFormData: (next: Partial<CreateAiModelCardData>) => void;
    errors?: Record<string, string[]>;
}

export default function DatesReviewsSection({ formData, setFormData, errors = {} }: DatesReviewsSectionProps) {
    const hasError = (fieldName: string) => errors[fieldName] && errors[fieldName].length > 0;
    const getError = (fieldName: string) => errors[fieldName]?.[0];

    const set = (k: keyof CreateAiModelCardData) => (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ [k]: e.target.value } as any);
    return (
        <div className="space-y-4">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
                <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
                    Dates & Reviews
                </h2>
                <hr className="border-gray-200" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Publication Date</Label>
                    <Input type="date" placeholder="YYYY-MM-DD" value={formData.publication_date || ""} onChange={set("publication_date")} />
                </div>
                <div className="space-y-2">
                    <Label>Last Review Date</Label>
                    <Input type="date"
                        placeholder="YYYY-MM-DD"
                        value={formData.last_review_date || ""}
                        onChange={set("last_review_date")}
                        max={formData.next_review_date || undefined}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Next Review Date</Label>
                    <Input type="date"
                        placeholder="YYYY-MM-DD"
                        value={formData.next_review_date || ""}
                        min={formData.last_review_date || undefined}
                        onChange={set("next_review_date")}
                        className={hasError("next_review_date") ? "border-red-500" : ""}
                    />
                    {hasError("next_review_date") && (
                        <p className="text-sm text-red-500">{getError("next_review_date")}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        Created By <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="email"
                        placeholder="creator@example.com"
                        value={formData.created_by || ""}
                        onChange={(e) => setFormData({ created_by: e.target.value })}
                        className={hasError("created_by") ? "border-red-500" : ""}
                    />
                    {hasError("created_by") && (
                        <p className="text-sm text-red-500">{getError("created_by")}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Updated By</Label>
                    <Input
                        type="email"
                        placeholder="updater@example.com"
                        value={formData.updated_by || ""}
                        onChange={(e) => setFormData({ updated_by: e.target.value || null })}
                        className={hasError("updated_by") ? "border-red-500" : ""}
                    />
                    {hasError("updated_by") && (
                        <p className="text-sm text-red-500">{getError("updated_by")}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
