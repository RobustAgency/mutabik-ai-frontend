"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CreateAiModelCardData } from "@/service/app/aiModelCards";

interface DatesReviewsSectionProps {
    formData: CreateAiModelCardData;
    setFormData: (next: Partial<CreateAiModelCardData>) => void;
}

export default function DatesReviewsSection({ formData, setFormData }: DatesReviewsSectionProps) {
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
                    <Input type="date" placeholder="YYYY-MM-DD" value={formData.last_review_date || ""} onChange={set("last_review_date")} />
                </div>
                <div className="space-y-2">
                    <Label>Next Review Date</Label>
                    <Input type="date" placeholder="YYYY-MM-DD" value={formData.next_review_date || ""} onChange={set("next_review_date")} />
                </div>
            </div>
        </div>
    );
}


