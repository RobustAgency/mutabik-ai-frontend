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
        const errors: Record<string, string[]> = {};

        // Core identifiers validation
        if (!formData.ai_model_id || formData.ai_model_id <= 0) {
            errors.ai_model_id = ["AI Model is required"];
        }
        if (!formData.version_number?.trim()) {
            errors.version_number = ["Version number is required"];
        } else {
            const semverRegex = /^\d+\.\d+\.\d+$/;
            if (!semverRegex.test(formData.version_number.trim())) {
                errors.version_number = ["Version number must follow semantic versioning (major.minor.patch), e.g. 1.2.0"];
            }
        }
        if (!formData.version_type) {
            errors.version_type = ["Version type is required"];
        }

        // Technical characteristics validation
        if (!formData.architecture_type?.trim()) {
            errors.architecture_type = ["Architecture type is required"];
        }
        if (formData.model_file_size_gb !== null && formData.model_file_size_gb !== undefined && formData.model_file_size_gb < 0) {
            errors.model_file_size_gb = ["Model file size must be >= 0"];
        }
        if (!formData.complexity_level) {
            errors.complexity_level = ["Complexity level is required"];
        }
        if (!formData.version_role) {
            errors.version_role = ["Version role is required"];
        }
        if (!formData.version_source) {
            errors.version_source = ["Version source is required"];
        }
        if (!formData.our_involvement) {
            errors.our_involvement = ["Our involvement is required"];
        }

        // Deployment / lifecycle / compliance validation
        if (!formData.deployment_status) {
            errors.deployment_status = ["Deployment status is required"];
        }
        if (!formData.lifecycle_stage) {
            errors.lifecycle_stage = ["Lifecycle stage is required"];
        }

        // Lifecycle stage logical consistency with deployment status
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
                errors.lifecycle_stage = [
                    "Lifecycle stage must be logically consistent with deployment status.",
                ];
            }
        }

        // Approval status validation - always required, and must be Approved for Production when in production
        if (!formData.approval_status || !formData.approval_status.trim()) {
            errors.approval_status = ["Approval status is required."];
        } else if (
            formData.deployment_status === 'production' &&
            formData.approval_status !== 'approved_for_production'
        ) {
            errors.approval_status = [
                "When deployment status is Production, approval status must be 'Approved for Production'.",
            ];
        }

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

