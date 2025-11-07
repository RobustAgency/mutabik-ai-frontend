"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateAiModelMutation } from "@/app/lib/features/aiModelsApi";
import { FormDataType } from "../types/aiModelTypes";
import BasicInfo from "./BasicInfo";
import TechnicalDetails from "./TechnicalDetails";
import OwnershipGovernance from "./OwnershipGovernance";
import { toast } from "react-toastify";

const initialFormData: FormDataType = {
    name: "",
    description: null,
    primary_category: "traditional_ml",
    type: "classification",
    creator_email: "",
    organizational_role: "developer",
    domain_specialization: "general",
    business_status: "planned",
    operational_status: "not_deployed",
    regulatory_risk_classification: "minimal_risk",
    ownership_type: "internal",
    development_source: "internal_development",
    source_org_stakeholder_id: null,
    owner_stakeholder_id: null,
    vendor_id: null,
    current_owner: null,
    current_version_id: null,
};

interface AiModelModalFormProps {
    onSuccess?: (model: any) => void;
    onCancel?: () => void;
}

const AiModelModalForm: React.FC<AiModelModalFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState<FormDataType>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [createAiModel, { isLoading }] = useCreateAiModelMutation();

    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        if (!formData.name?.trim()) {
            errors.name = ["Model name is required"];
        }

        if (!formData.primary_category) {
            errors.primary_category = ["Primary category is required"];
        }

        if (!formData.type) {
            errors.type = ["Model type is required"];
        }

        // Current version is required when operational_status is production
        if (formData.operational_status === "production" && !formData.current_version_id) {
            errors.current_version_id = ["Current version is required when operational status is production"];
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
            // Add missing required fields with placeholder/null/default value if not present
            // since formData is FormDataType but API expects CreateAiModelData
            const {
                organizational_role = "",
                source_organization = "",
                vendor = "",
                current_version_id,
                ...rest
            } = formData as any;

            const createPayload: any = {
                ...rest,
                organizational_role,
                source_organization,
                vendor,
            };

            // Only include current_version_id if it's not null
            if (current_version_id !== null && current_version_id !== undefined) {
                createPayload.current_version_id = current_version_id;
            }

            const result = await createAiModel(createPayload).unwrap();

            if (onSuccess) {
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

            <BasicInfo
                formData={formData}
                setFormData={setFormData}
                errors={validationErrors}
            />
            <TechnicalDetails
                formData={formData}
                setFormData={setFormData}
                errors={validationErrors}
            />
            <OwnershipGovernance
                formData={formData}
                setFormData={setFormData}
                errors={validationErrors}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-[#4FD58F] hover:bg-[#3fc77f]"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : "Create AI Model"}
                </Button>
            </div>
        </form>
    );
};

export default AiModelModalForm;

