"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { CreateAiModelCardData } from "@/service/app/aiModelCards";
import BasicInfoSection from "./sections/BasicInfoSection";
import WorkflowStatusSection from "./sections/WorkflowStatusSection";
import CoreContentSection from "./sections/CoreContentSection";
import DatesReviewsSection from "./sections/DatesReviewsSection";
import { useGetAiModelVersionsQuery } from "@/app/lib/features/aiModelVersionsApi";

type Mode = "create" | "edit";

interface AiModelCardFormProps {
    mode: Mode;
    initial?: Partial<CreateAiModelCardData>;
    onSubmit: (data: CreateAiModelCardData) => Promise<void> | void;
    loading?: boolean;
}

const defaultState: CreateAiModelCardData = {
    version_id: "",
    title: "",
    creator_role: "",
    format: "",
    status: "draft",
    publication_status: "not_published",
    owner_stakeholder_id: "",
    organizational_context: null,
    model_overview: "",
    intended_use: "",
    training_data_overview: "",
    bias_evaluation_methods: "",
    model_limitations: "",
    ethical_considerations: "",
    risk_summary: "",
    performance_summary: "",
    publication_date: null,
    last_review_date: null,
    next_review_date: null,
    created_by: "",
    updated_by: null,
};

export default function AiModelCardForm({ mode, initial, onSubmit, loading }: AiModelCardFormProps) {
    const [formData, setFormData] = useState<CreateAiModelCardData>(() => ({ ...defaultState, ...initial }));
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const titleText = useMemo(() => (mode === "create" ? "New Model Version Card" : "Edit Model Version Card"), [mode]);

    const validate = (): boolean => {
        const next: Record<string, string[]> = {};

        // Required fields validation
        if (!formData.version_id || String(formData.version_id).trim() === "") {
            next.version_id = ["Model version is required"];
        }

        if (!formData.title?.trim()) {
            next.title = ["Title is required"];
        } else if (formData.title.trim().length < 10) {
            next.title = ["Title must be at least 10 characters"];
        } else if (formData.title.trim().length > 255) {
            next.title = ["Title must be at most 255 characters"];
        }

        if (!formData.creator_role?.trim()) {
            next.creator_role = ["Creator role is required"];
        }

        if (!formData.format?.trim()) {
            next.format = ["Card format is required"];
        }

        if (!formData.owner_stakeholder_id || String(formData.owner_stakeholder_id).trim() === "") {
            next.owner_stakeholder_id = ["Model owner is required"];
        }

        if (!formData.model_overview?.trim()) {
            next.model_overview = ["Model overview is required"];
        }

        if (!formData.intended_use?.trim()) {
            next.intended_use = ["Intended use is required"];
        }

        if (!formData.training_data_overview?.trim()) {
            next.training_data_overview = ["Training data overview is required"];
        }

        if (!formData.bias_evaluation_methods?.trim()) {
            next.bias_evaluation_methods = ["Bias evaluation methods is required"];
        }

        if (!formData.model_limitations?.trim()) {
            next.model_limitations = ["Model limitations is required"];
        }

        if (!formData.ethical_considerations?.trim()) {
            next.ethical_considerations = ["Ethical considerations is required"];
        }

        if (!formData.performance_summary?.trim()) {
            next.performance_summary = ["Performance summary is required"];
        }

        if (!formData.risk_summary?.trim()) {
            next.risk_summary = ["Risk summary is required"];
        }

        if (!formData.status?.trim()) {
            next.status = ["Status is required"];
        }

        if (!formData.publication_status?.trim()) {
            next.publication_status = ["Publication status is required"];
        }

        if (!formData.created_by?.trim()) {
            next.created_by = ["Created by email is required"];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.created_by.trim())) {
            next.created_by = ["Created by must be a valid email address"];
        }

        if (formData.updated_by && formData.updated_by.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.updated_by.trim())) {
            next.updated_by = ["Updated by must be a valid email address"];
        }

        if (formData.last_review_date && formData.next_review_date) {
            const lastReviewDate = new Date(formData.last_review_date);
            const nextReviewDate = new Date(formData.next_review_date);

            if (nextReviewDate < lastReviewDate) {
                next.next_review_date = ["Next review date cannot be before last review date"];
            }
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(formData);
    };

    const { data: versions = [] } = useGetAiModelVersionsQuery({ per_page: 100 });
    const versionOptions = versions.map((v: any) => ({
        id: v.id,
        label: `${v.ai_model?.name ?? "Model"} • ${v.version_number ?? v.id}`,
    }));

    const setForm = (next: Partial<CreateAiModelCardData>) => setFormData((s) => ({ ...s, ...next }));

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
                    <div>
                        <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                            {titleText}
                        </h1>
                        <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                            Fill all the details below of your Model Version Card
                        </p>
                    </div>
                    <Button
                        type="submit"
                        className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? "Saving..." : "Save Model Version Card"}
                    </Button>

                </div>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {Object.entries(errors).map(([k, v]) => (
                                    <div key={k} className="text-sm">{k.replace(/_/g, " ")}: {v[0]}</div>
                                ))}
                            </AlertDescription>
                        </Alert>
                    )}

                    <CardContent className="space-y-8">
                        <BasicInfoSection formData={formData} setFormData={setForm} versionOptions={versionOptions} errors={errors} />
                        <WorkflowStatusSection formData={formData} setFormData={setForm} errors={errors} />
                        <CoreContentSection formData={formData} setFormData={setForm} errors={errors} />
                        <DatesReviewsSection formData={formData} setFormData={setForm} errors={errors} />
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}


