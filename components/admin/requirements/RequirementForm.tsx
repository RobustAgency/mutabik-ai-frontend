"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import Breadcrumbs from "@/components/custom/Breadcrumbs";
import { useRequirement, useRequirementMutations, useRequirements } from "@/hooks/admin/useRequirements";
import { useFrameworks } from "@/hooks/admin/useFrameworks";
import {
    CreateRequirementRequest,
    Requirement,
    RequirementCategory,
    RequirementPriority,
} from "@/interfaces/Requirement";
import { toast } from "react-toastify";
import FormErrorAlert from "@/components/admin/shared/FormErrorAlert";
import FormActions from "@/components/admin/shared/FormActions";
import ReferenceFrameworkFields from "./fields/ReferenceFrameworkFields";
import CategoryPriorityFields from "./fields/CategoryPriorityFields";
import ApplicabilityField from "./fields/ApplicabilityField";
import EffectiveDatesFields from "./fields/EffectiveDatesFields";
import SupersedesFields from "./fields/SupersedesFields";
import TagsField from "./fields/TagsField";
import RequirementTextField from "./fields/RequirementTextField";

interface RequirementFormProps {
    requirementId?: string;
    mode: "create" | "edit";
    serverErrors?: Record<string, string[]>;
    onSubmit?: (payload: CreateRequirementRequest) => Promise<void>;
}

const CATEGORY_OPTIONS: { value: RequirementCategory; label: string }[] = [
    { value: "safety", label: "Safety" },
    { value: "transparency", label: "Transparency" },
    { value: "data_oversight", label: "Data Oversight" },
    { value: "security", label: "Security" },
    { value: "governance", label: "Governance" },
    { value: "risk", label: "Risk" },
    { value: "testing", label: "Testing" },
    { value: "documentation", label: "Documentation" },
    { value: "privacy", label: "Privacy" },
    { value: "human_rights", label: "Human Rights" },
    { value: "other", label: "Other" },
];

const PRIORITY_OPTIONS: { value: RequirementPriority; label: string }[] = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];

export default function RequirementForm({ requirementId, mode, serverErrors, onSubmit }: RequirementFormProps) {
    const router = useRouter();
    const { requirement, loading: loadingRequirement } = useRequirement(requirementId || "");
    const { frameworks } = useFrameworks({ page: 1, per_page: 100 });
    const { requirements: requirementList } = useRequirements({ per_page: 100 });
    const { createRequirement, updateRequirement, creating, updating } = useRequirementMutations();

    const [formData, setFormData] = useState<CreateRequirementRequest>({
        reference: "",
        requirement_text: "",
        category: "safety",
        applicability: "",
        effective_from: "",
        effective_to: "",
        supersedes_req_id: undefined,
        superseded_by_req_id: undefined,
        priority: "medium",
        tags: [],
        framework_id: 0,
    });
    const [tagsInput, setTagsInput] = useState<string>("");
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const frameworkOptions = useMemo(
        () =>
            frameworks?.map((fw) => ({
                value: fw.id.toString(),
                label: fw.name || fw.id.toString(),
            })) || [],
        [frameworks]
    );

    const requirementOptions = useMemo(
        () =>
            (requirementList || [])
                .filter((req: Requirement) => !requirementId || String(req.id) !== String(requirementId))
                .map((req: Requirement) => ({
                    value: req.id.toString(),
                    label: req.reference || `Requirement #${req.id}`,
                })),
        [requirementList, requirementId]
    );

    useEffect(() => {
        if (mode === "edit" && requirement) {
            setFormData({
                reference: requirement.reference || "",
                requirement_text: requirement.requirement_text || "",
                category: requirement.category,
                applicability: requirement.applicability || "",
                effective_from: requirement.effective_from || "",
                effective_to: requirement.effective_to || "",
                supersedes_req_id: requirement.supersedes_req_id ?? undefined,
                superseded_by_req_id: requirement.superseded_by_req_id ?? undefined,
                priority: requirement.priority,
                tags: requirement.tags || [],
                framework_id: requirement.framework_id,
            });
            setTagsInput((requirement.tags || []).join(", "));
        }
    }, [mode, requirement]);

    const handleInputChange = useCallback(<K extends keyof CreateRequirementRequest>(
        field: K,
        value: CreateRequirementRequest[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        if (!formData.reference?.trim()) {
            errors.reference = ["Reference is required"];
        } else if (formData.reference.length > 255) {
            errors.reference = ["Reference must be at most 255 characters"];
        }

        if (!formData.category) {
            errors.category = ["Category is required"];
        }

        if (!formData.applicability?.trim()) {
            errors.applicability = ["Applicability is required"];
        } else if (formData.applicability.length > 255) {
            errors.applicability = ["Applicability must be at most 255 characters"];
        }

        if (!formData.priority) {
            errors.priority = ["Priority is required"];
        }

        if (!formData.framework_id || Number(formData.framework_id) === 0) {
            errors.framework_id = ["Framework is required"];
        }

        if (formData.effective_from && isNaN(Date.parse(formData.effective_from))) {
            errors.effective_from = ["Effective from must be a valid date"];
        }
        if (formData.effective_to && isNaN(Date.parse(formData.effective_to))) {
            errors.effective_to = ["Effective to must be a valid date"];
        }

        if (tagsInput.trim()) {
            const tagsArray = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
            const invalidTag = tagsArray.find((t) => t.length > 50);
            if (invalidTag) {
                errors.tags = ["Each tag must be at most 50 characters"];
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const combinedErrors = { ...validationErrors, ...(serverErrors || {}) };
    const isLoading = creating || updating;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const tags = tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        const payload: CreateRequirementRequest = {
            ...formData,
            tags,
            framework_id: Number(formData.framework_id),
            supersedes_req_id: formData.supersedes_req_id ? Number(formData.supersedes_req_id) : undefined,
            superseded_by_req_id: formData.superseded_by_req_id ? Number(formData.superseded_by_req_id) : undefined,
        };

        try {
            if (onSubmit) {
                await onSubmit(payload);
            } else if (mode === "create") {
                await createRequirement(payload);
            } else if (requirementId) {
                await updateRequirement(requirementId, payload);
            }
        } catch (err: any) {
            if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
            const message = err?.data?.message || "Failed to save requirement";
            toast.error(message);
        }
    };

    const handleCancel = () => {
        router.push("/admin/compliance-library/requirements");
    };

    if (mode === "edit" && loadingRequirement) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] px-2 flex flex-col items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] px-6 py-6">
            <Breadcrumbs items={[
                { label: 'Requirements', href: '/admin/compliance-library/requirements' },
                { label: mode === 'create' ? 'Create Requirement' : 'Edit Requirement' },
            ]} />

            <div className="mt-6 mb-8">
                <h1 className="text-3xl text-[#171717] font-bold">
                    {mode === "create" ? "Create Requirement" : "Edit Requirement"}
                </h1>
            </div>

            <div className="">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormErrorAlert errors={combinedErrors} />

                        <Card className="bg-white shadow-none p-6 space-y-6">
                            <ReferenceFrameworkFields
                                formData={formData}
                                errors={combinedErrors}
                                frameworkOptions={frameworkOptions}
                                isLoading={isLoading}
                                onInputChange={handleInputChange}
                            />

                            <CategoryPriorityFields
                                formData={formData}
                                errors={combinedErrors}
                                categoryOptions={CATEGORY_OPTIONS}
                                priorityOptions={PRIORITY_OPTIONS}
                                isLoading={isLoading}
                                onInputChange={handleInputChange}
                            />

                            <ApplicabilityField
                                formData={formData}
                                errors={combinedErrors}
                                isLoading={isLoading}
                                onInputChange={handleInputChange}
                            />

                            <EffectiveDatesFields
                                formData={formData}
                                errors={combinedErrors}
                                isLoading={isLoading}
                                onInputChange={handleInputChange}
                            />

                            <SupersedesFields
                                formData={formData}
                                errors={combinedErrors}
                                requirementOptions={requirementOptions}
                                isLoading={isLoading}
                                onInputChange={handleInputChange}
                            />

                            <TagsField
                                tagsInput={tagsInput}
                                errors={combinedErrors}
                                isLoading={isLoading}
                                onTagsInputChange={setTagsInput}
                            />

                            <RequirementTextField
                                formData={formData}
                                isLoading={isLoading}
                                onInputChange={handleInputChange}
                            />
                        </Card>

                        <FormActions
                            isLoading={isLoading}
                            isEditing={mode === "edit"}
                            onCancel={handleCancel}
                            submitLabel={isLoading ? (mode === "create" ? "Creating..." : "Updating...") : (mode === "create" ? "Create" : "Update")}
                            submitClassName="bg-primary text-white px-6 h-10 rounded-lg font-medium"
                            cancelClassName="px-6 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
