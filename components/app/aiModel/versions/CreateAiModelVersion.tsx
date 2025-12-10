"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAiModelVersions } from '@/hooks/app/useAiModelVersions';
import { CreateAiModelVersionData } from '@/service/app/aiModelVersions';
import VersionBasicInfo from './sections/VersionBasicInfo';
import VersionTechnical from './sections/VersionTechnical';
import VersionDeployment from './sections/VersionDeployment';
import {
    validateTextField,
    validateNumericField,
    createValidationErrors,
} from "@/lib/utils/validation";

const CreateAiModelVersion: React.FC = () => {
    const router = useRouter();
    const { createAiModelVersion, loading } = useAiModelVersions();

    const [formData, setFormData] = useState<CreateAiModelVersionData>({
        // Core identifiers
        version_number: '',
        version: '',
        version_type: 'minor',
        ai_model_id: 0,
        description: '',
        release_date: null,
        release_notes: '',

        // Version metadata
        version_role: 'original_release',
        version_source: 'internal_development',
        our_involvement: 'full_development',

        // Technical characteristics
        architecture_type: 'transformer',
        model_file_size_gb: null,
        training_duration_hours: null,
        complexity_level: 'low',
        parameter_count: null,

        // Modalities
        input_modalities: [],
        output_modalities: [],

        // Deployment / lifecycle / compliance
        deployment_status: 'not_deployed',
        lifecycle_stage: 'development',
        deployment_environments: [],
        customizations_applied: [],
        approval_status: null,
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const validateForm = (): boolean => {
        const fieldErrors: Record<string, string[]> = {
            ai_model_id: validateTextField(formData.ai_model_id ? String(formData.ai_model_id) : "", {
                required: true,
                messages: { required: "AI Model is required" },
            }),
            version_number: validateTextField(formData.version_number, {
                required: true,
                pattern: /^\d+\.\d+\.\d+$/,
                messages: {
                    required: "Version number is required",
                    pattern: "Version number must follow semantic versioning (major.minor.patch), e.g. 1.2.0",
                },
            }),
            version_type: validateTextField(formData.version_type, {
                required: true,
                messages: { required: "Version type is required" },
            }),
            architecture_type: validateTextField(formData.architecture_type, {
                required: true,
                messages: { required: "Architecture type is required" },
            }),
            complexity_level: validateTextField(formData.complexity_level, {
                required: true,
                messages: { required: "Complexity level is required" },
            }),
            version_role: validateTextField(formData.version_role, {
                required: true,
                messages: { required: "Version role is required" },
            }),
            version_source: validateTextField(formData.version_source, {
                required: true,
                messages: { required: "Version source is required" },
            }),
            our_involvement: validateTextField(formData.our_involvement, {
                required: true,
                messages: { required: "Our involvement is required" },
            }),
            deployment_status: validateTextField(formData.deployment_status, {
                required: true,
                messages: { required: "Deployment status is required" },
            }),
            lifecycle_stage: validateTextField(formData.lifecycle_stage, {
                required: true,
                messages: { required: "Lifecycle stage is required" },
            }),
            approval_status: validateTextField(formData.approval_status ?? "", {
                required: true,
                messages: { required: "Approval status is required." },
            }),
        };

        if (formData.model_file_size_gb !== null && formData.model_file_size_gb !== undefined) {
            const sizeErrors = validateNumericField(formData.model_file_size_gb, {
                min: 0,
                messages: { min: "Model file size must be >= 0" },
            });
            if (sizeErrors.length) {
                fieldErrors.model_file_size_gb = sizeErrors;
            }
        }

        if (formData.deployment_status && formData.lifecycle_stage) {
            const allowedLifecycleByDeployment: Record<string, string[]> = {
                not_deployed: ['design', 'development'],
                testing: ['development', 'validation'],
                staging: ['validation', 'deployment'],
                production: ['deployment', 'monitoring'],
                retired: ['retired'],
            };
            const allowed = allowedLifecycleByDeployment[formData.deployment_status] || [];
            if (!allowed.includes(formData.lifecycle_stage)) {
                fieldErrors.lifecycle_stage = [
                    ...(fieldErrors.lifecycle_stage ?? []),
                    "Lifecycle stage must be logically consistent with deployment status.",
                ];
            }
        }

        if (
            formData.deployment_status === 'production' &&
            formData.approval_status !== 'approved_for_production'
        ) {
            fieldErrors.approval_status = [
                ...(fieldErrors.approval_status ?? []),
                "When deployment status is Production, approval status must be 'Approved for Production'.",
            ];
        }

        const errors = createValidationErrors(fieldErrors);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Map server field names to form field names for error display
    const mapServerErrorsToFormFields = (serverErrors: Record<string, string[]>) => {
        const fieldMapping: Record<string, string> = {
            'version_number': 'version_number',
            'model_file_size_gb': 'model_file_size_gb',
            'architecture_type': 'architecture_type',
            'complexity_level': 'complexity_level',
            'deployment_status': 'deployment_status',
            'lifecycle_stage': 'lifecycle_stage',
            'version_type': 'version_type',
            'ai_model_id': 'ai_model_id',
            'version_role': 'version_role',
            'version_source': 'version_source',
            'our_involvement': 'our_involvement',
            'approval_status': 'approval_status',
            // Backend field names (for error mapping)
            'release_role': 'version_role',
            'source_type': 'version_source',
            'org_involvement': 'our_involvement'
        };

        const mappedErrors: Record<string, string[]> = {};
        Object.entries(serverErrors).forEach(([serverField, errors]) => {
            const formField = fieldMapping[serverField] || serverField;
            mappedErrors[formField] = errors;
        });
        return mappedErrors;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            const result = await createAiModelVersion(formData);
            if (result) {
                router.push('/core-assets/ai-models/versions');
                return;
            }
        } catch (error: any) {
            console.log("🚀 ~ handleSave ~ error:", error)
            // Handle backend validation errors
            if (error?.data?.errors) {
                console.log("🚀 ~ Server errors:", error.data.errors);
                const mappedErrors = mapServerErrorsToFormFields(error.data.errors);
                console.log("🚀 ~ Mapped errors:", mappedErrors);
                setValidationErrors(mappedErrors);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSave}>
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
                        <div>
                            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                                Add a new Model Version
                            </h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                                Fill all the details below of your Model Version
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Model Version'}
                        </Button>
                    </div>

                    <CardContent className="space-y-10 w-full">
                        {Object.keys(validationErrors).length > 0 && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <p className="font-semibold mb-2">Please fix the following errors:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {Object.entries(validationErrors).map(([field, errors]) => (
                                            <li key={field}>
                                                <span className="font-medium capitalize">{field.replace(/_/g, ' ')}:</span> {errors[0]}
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <VersionBasicInfo formData={formData} setFormData={setFormData} errors={validationErrors} />
                        <VersionTechnical formData={formData} setFormData={setFormData} errors={validationErrors} />
                        <VersionDeployment formData={formData} setFormData={setFormData} errors={validationErrors} />
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default CreateAiModelVersion;
