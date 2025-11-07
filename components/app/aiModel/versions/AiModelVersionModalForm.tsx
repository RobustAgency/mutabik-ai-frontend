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
import { toast } from "react-toastify";

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
        version_number: '',
        version_type: 'minor',
        ai_model_id: 0,
        description: '',
        release_date: null,
        release_notes: '',
        version_role: 'original_development',
        version_source: 'internal_development',
        our_involvement: 'full_development',
        architecture_type: 'transformer',
        model_file_size_gb: null,
        training_duration_hours: null,
        complexity_level: 'moderate',
        parameter_count: null,
        input_modalities: [],
        output_modalities: [],
        deployment_status: 'not_deployed',
        lifecycle_stage: 'development',
        deployment_environments: [],
        customizations_applied: [],
        has_performance_data: false,
        created_by: '',
        updated_by: null,
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        if (!formData.ai_model_id) {
            errors.ai_model_id = ['Parent model is required'];
        }

        if (!formData.version_number?.trim()) {
            errors.version_number = ['Version number is required'];
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

