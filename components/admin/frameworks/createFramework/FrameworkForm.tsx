"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useFrameworkMutations } from "@/hooks/admin/useFrameworks";
import {
    validateTextField,
    createValidationErrors,
} from "@/lib/utils/validation";
import {
    Framework,
    CreateFrameworkRequest,
    UpdateFrameworkRequest
} from "@/interfaces/Framework";
import Breadcrumbs from "@/components/custom/Breadcrumbs";
import FormErrorAlert from "@/components/admin/shared/FormErrorAlert";
import FormActions from "@/components/admin/shared/FormActions";
import NameVersionFields from "./fields/NameVersionFields";
import JurisdictionsScopeFields from "./fields/JurisdictionsScopeFields";
import StatusEffectiveDateFields from "./fields/StatusEffectiveDateFields";
import SourceUrlField from "./fields/SourceUrlField";

interface FrameworkFormProps {
    framework?: Framework | null;
    isEditing?: boolean;
    onCancel?: () => void;
    serverErrors?: Record<string, string[]>;
    onSubmit?: (payload: CreateFrameworkRequest | UpdateFrameworkRequest) => Promise<void>;
}

export default function FrameworkForm({ framework, isEditing = false, onCancel, serverErrors, onSubmit }: FrameworkFormProps) {
    const breadcrumbItems = [
        { label: 'Frameworks', href: '/admin/compliance-library/frameworks' },
        { label: isEditing ? 'Edit' : 'Create' },
    ];

    // Basic form state aligned with backend validation contract
    const [formData, setFormData] = useState<CreateFrameworkRequest>({
        name: "",
        version: "",
        jurisdictions: [],
        scope: "",
        status: "draft",
        effective_date: new Date().toISOString().split('T')[0],
        source_url: "",
    });

    const [jurisdictionInput, setJurisdictionInput] = useState<string>("");

    // Validation errors state
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const { creating, updating, createFramework, updateFramework } = useFrameworkMutations();

    // Memoized callback functions
    const handleInputChange = useCallback(<K extends keyof CreateFrameworkRequest>(
        field: K,
        value: CreateFrameworkRequest[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    // Initialize form with existing framework data
    useEffect(() => {
        if (framework && isEditing && framework.id) {
            setFormData({
                name: framework.name || "",
                version: framework.version || "",
                jurisdictions: Array.isArray((framework as any).jurisdictions)
                    ? (framework as any).jurisdictions
                    : typeof (framework as any).jurisdictions === 'string'
                        ? (framework as any).jurisdictions.split(',').map((j: string) => j.trim()).filter(Boolean)
                        : [],
                scope: (framework as any).scope || "",
                status: ((framework as any).status as CreateFrameworkRequest['status']) || "draft",
                effective_date: (framework as any).effective_date
                    ? String((framework as any).effective_date).split('T')[0]
                    : new Date().toISOString().split('T')[0],
                source_url: (framework as any).source_url || "",
            });

            setJurisdictionInput(
                Array.isArray((framework as any).jurisdictions)
                    ? (framework as any).jurisdictions.join(', ')
                    : typeof (framework as any).jurisdictions === 'string'
                        ? (framework as any).jurisdictions
                        : ""
            );
        }
    }, [framework, framework?.id, isEditing]); // Only re-run when framework ID changes or editing mode changes

    const isValidUrl = (value: string) => {
        try {
            const url = new URL(value);
            return !!url.protocol && !!url.host;
        } catch {
            return false;
        }
    };

    // Form validation using shared utilities + API contract
    const validateForm = (): boolean => {
        const fieldErrors: Record<string, string[]> = {
            name: validateTextField(formData.name, {
                required: true,
                minLength: 2,
                maxLength: 255,
                messages: {
                    required: "Name is required",
                    minLength: "Name must be at least 2 characters",
                    maxLength: "Name must be at most 255 characters",
                },
            }),
            version: validateTextField(formData.version, {
                required: true,
                maxLength: 50,
                messages: {
                    required: "Version is required",
                    maxLength: "Version must be at most 50 characters",
                },
            }),
            scope: validateTextField(formData.scope, {
                required: true,
                messages: { required: "Scope is required" },
            }),
            source_url: validateTextField(formData.source_url, {
                required: true,
                maxLength: 255,
                messages: {
                    required: "Source URL is required",
                    maxLength: "Source URL must be at most 255 characters",
                },
            }),
        };

        const errors = createValidationErrors(fieldErrors);
        if (jurisdictionInput.trim().length === 0) {
            errors.jurisdictions = ["At least one jurisdiction is required"];
        }
        if (formData.source_url && !isValidUrl(formData.source_url)) {
            errors.source_url = ["Enter a valid URL (e.g., https://example.com)"];
        }
        if (!formData.effective_date) {
            errors.effective_date = ["Effective date is required"];
        }
        if (!formData.status) {
            errors.status = ["Status is required"];
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        // Client-side validation
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const cleanedJurisdictions = jurisdictionInput
            .split(',')
            .map((j) => j.trim())
            .filter(Boolean);

        const finalRequestData: CreateFrameworkRequest = {
            ...formData,
            jurisdictions: cleanedJurisdictions,
        };

        try {
            if (onSubmit) {
                await onSubmit(finalRequestData);
            } else if (isEditing && framework) {
                await updateFramework(framework.id, finalRequestData as UpdateFrameworkRequest);
            } else {
                await createFramework(finalRequestData as CreateFrameworkRequest);
            }
        } catch (err: any) {
            // Handle backend validation errors
            if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    const isLoading = creating || updating;
    const combinedErrors = { ...validationErrors, ...(serverErrors || {}) };

    return (
        <div className="min-h-screen bg-[#FAFAFA] px-2 flex flex-col items-start">
            {/* Breadcrumb */}
            <Breadcrumbs items={breadcrumbItems} />

            {/* Heading */}
            <h1 className="text-3xl text-[#171717] font-bold mt-4 mb-6">
                {isEditing ? 'Edit Framework' : 'Create Framework'}
            </h1>

            <div className="flex flex-col md:flex-row gap-6 w-full">
                {/* Main Form Card */}
                <Card className="flex-1 border-0 rounded-xl py-0 bg-transparent!">
                    <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                        <FormErrorAlert errors={combinedErrors} />

                        <Card className="bg-white p-6">
                            <div className="space-y-6">
                                <NameVersionFields
                                    formData={formData}
                                    errors={combinedErrors}
                                    onInputChange={handleInputChange}
                                />

                                <JurisdictionsScopeFields
                                    formData={formData}
                                    jurisdictionInput={jurisdictionInput}
                                    errors={combinedErrors}
                                    onInputChange={handleInputChange}
                                    onJurisdictionInputChange={setJurisdictionInput}
                                />

                                <StatusEffectiveDateFields
                                    formData={formData}
                                    errors={combinedErrors}
                                    onInputChange={handleInputChange}
                                />

                                <SourceUrlField
                                    formData={formData}
                                    errors={combinedErrors}
                                    onInputChange={handleInputChange}
                                />
                            </div>
                        </Card>

                        <FormActions
                            isLoading={isLoading}
                            isEditing={isEditing}
                            onCancel={onCancel}
                        />
                    </form>
                </Card>
            </div>
        </div>
    );
}

