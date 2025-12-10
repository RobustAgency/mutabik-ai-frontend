"use client";

import React, { useState } from 'react';
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

interface AiModelVersionModalFormProps {
    onSuccess?: (version: any) => void;
    onCancel?: () => void;
}

const AiModelVersionModalForm: React.FC<AiModelVersionModalFormProps> = ({
    onSuccess,
    onCancel,
}) => {
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValidationErrors({});

        if (!validateForm()) {
            return;
        }

        try {
            const result = await createAiModelVersion(formData);

            if (onSuccess && result) {
                onSuccess(result);
            }
        } catch (err: any) {
            if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
            }
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {Object.keys(validationErrors).length > 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <p className="font-semibold mb-2">Please fix the following errors:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {Object.entries(validationErrors).map(([field, errors]) => (
                                <li key={field}>
                                    <span className="font-medium capitalize">
                                        {field.replace(/_/g, " ")}:
                                    </span>{" "}
                                    {errors[0]}
                                </li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            <VersionBasicInfo
                formData={formData}
                setFormData={setFormData}
                errors={validationErrors}
            />
            <VersionTechnical
                formData={formData}
                setFormData={setFormData}
                errors={validationErrors}
            />
            <VersionDeployment
                formData={formData}
                setFormData={setFormData}
                errors={validationErrors}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-[#4FD58F] hover:bg-[#3fc77f]"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Version"}
                </Button>
            </div>
        </form>
    );
};

export default AiModelVersionModalForm;

