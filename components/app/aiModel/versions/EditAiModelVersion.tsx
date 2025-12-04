"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAiModelVersion } from '@/hooks/app/useAiModelVersions';
import { CreateAiModelVersionData } from '@/service/app/aiModelVersions';
import VersionBasicInfo from './sections/VersionBasicInfo';
import VersionTechnical from './sections/VersionTechnical';
import VersionDeployment from './sections/VersionDeployment';

interface EditAiModelVersionProps {
    versionId: number;
}

const EditAiModelVersion: React.FC<EditAiModelVersionProps> = ({ versionId }) => {
    const router = useRouter();
    const { aiModelVersion, loading: versionLoading, updateAiModelVersion } = useAiModelVersion(versionId);

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

        // Flags
        has_performance_data: false,

        // Audit fields
        created_by: '',
        updated_by: null,
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (aiModelVersion) {
            setFormData({
                // Core identifiers
                version_number: aiModelVersion.version_number,
                version: aiModelVersion.version || aiModelVersion.version_number,
                version_type: aiModelVersion.version_type,
                ai_model_id: aiModelVersion.ai_model_id,
                description: aiModelVersion.description || '',
                release_date: aiModelVersion.release_date,
                release_notes: aiModelVersion.release_notes || '',

                // Version metadata
                version_role: aiModelVersion.version_role,
                version_source: aiModelVersion.version_source,
                our_involvement: aiModelVersion.our_involvement,

                // Technical characteristics
                architecture_type: aiModelVersion.architecture_type,
                model_file_size_gb: aiModelVersion.model_file_size_gb ?? null,
                training_duration_hours: aiModelVersion.training_duration_hours,
                complexity_level: aiModelVersion.complexity_level,
                parameter_count: aiModelVersion.parameter_count,

                // Modalities
                input_modalities: aiModelVersion.input_modalities,
                output_modalities: aiModelVersion.output_modalities,

                // Deployment / lifecycle / compliance
                deployment_status: aiModelVersion.deployment_status,
                lifecycle_stage: aiModelVersion.lifecycle_stage,
                deployment_environments: aiModelVersion.deployment_environments,
                customizations_applied: [],
                approval_status: aiModelVersion.approval_status || null,

                // Flags
                has_performance_data: aiModelVersion.has_performance_data,
            });
        }
    }, [aiModelVersion]);

    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        // Core identifiers validation
        if (!formData.ai_model_id) {
            errors.ai_model_id = ["Parent model is required"];
        }
        if (!formData.version_number?.trim()) {
            errors.version_number = ["Version number is required"];
        }
        if (!formData.version_type) {
            errors.version_type = ["Version type is required"];
        }

        // Technical characteristics validation
        if (!formData.architecture_type?.trim()) {
            if (!formData.architecture_type || !formData.architecture_type.trim()) {
                errors.architecture_type = ["Architecture type is required"];
            }
            if (
                formData.model_file_size_gb === undefined ||
                formData.model_file_size_gb === null ||
                formData.model_file_size_gb < 0
            ) {
                errors.model_file_size_gb = ["Model file size is required and must be >= 0"];
            }
            if (!formData.complexity_level) {
                errors.complexity_level = ["Complexity level is required"];
            }
        }

        // Deployment / lifecycle / compliance validation
        if (!formData.deployment_status) {
            errors.deployment_status = ["Deployment status is required"];
        }
        if (!formData.lifecycle_stage) {
            errors.lifecycle_stage = ["Lifecycle stage is required"];
        }

        // Approval status validation - required unless deployment_status is "production"
        if (formData.deployment_status !== 'production' && (!formData.approval_status || !formData.approval_status.trim())) {
            errors.approval_status = ["The approval status field is required unless deployment status is in production."];
        }

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

        setSaving(true);
        try {
            await updateAiModelVersion(formData);
            router.push(`/core-assets/ai-models/versions/${versionId}`);
        } catch (error: any) {
            // Handle backend validation errors
            if (error?.data?.errors) {
                const mappedErrors = mapServerErrorsToFormFields(error.data.errors);
                setValidationErrors(mappedErrors);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } finally {
            setSaving(false);
        }
    };

    if (versionLoading && !aiModelVersion) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSave}>
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
                        <div>
                            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                                Edit Model Version
                            </h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                                Update the details below and save changes
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
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

export default EditAiModelVersion;
