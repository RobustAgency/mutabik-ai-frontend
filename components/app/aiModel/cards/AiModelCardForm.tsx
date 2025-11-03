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
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";

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
    publication_status: "internal",
    owner_stakeholder_id: "",
    organizational_context: [] as any,
    intended_use: "",
    training_data_overview: "",
    bias_evaluation_methods: "",
    model_limitations: "",
    ethical_considerations: "",
    risk_summary: "",
    performance_summary: "",
    publication_date: "",
    last_review_date: "",
    next_review_date: "",
};

export default function AiModelCardForm({ mode, initial, onSubmit, loading }: AiModelCardFormProps) {
    const [formData, setFormData] = useState<CreateAiModelCardData>(() => ({ ...defaultState, ...initial }));
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const titleText = useMemo(() => (mode === "create" ? "New Model Version Card" : "Edit Model Version Card"), [mode]);

    const validate = (): boolean => {
        const next: Record<string, string[]> = {};
        if (!formData.version_id || String(formData.version_id).trim() === "") next.version_id = ["Model version is required"];
        if (!formData.title?.trim()) next.title = ["Title is required"];
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(formData);
    };

    const { data: versions = [] } = useGetAiModelVersionsQuery({ per_page: 100 });
    const { data: models = [] } = useGetAiModelsQuery();
    const versionOptions = versions.map((v: any) => ({
        id: v.id,
        label: `${v.ai_model?.name ?? "Model"} • v${v.version_number ?? v.version ?? v.id}`,
    }));

    const setForm = (next: Partial<CreateAiModelCardData>) => setFormData((s) => ({ ...s, ...next }));

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white mx-auto px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
                    <div>
                        <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                            New Model Version Card
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
                        <WorkflowStatusSection formData={formData} setFormData={setForm} />
                        <CoreContentSection formData={formData} setFormData={setForm} />
                        <DatesReviewsSection formData={formData} setFormData={setForm} />
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}


