"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateAiModelMutation } from "@/app/lib/features/aiModelsApi";
import { FormDataType } from "../types/aiModelTypes";
import BasicInfo from "./BasicInfo";
import GovernanceRegulatorySection from "./GovernanceRegulatorySection";
import OwnershipGovernance from "./OwnershipGovernance";
import TechnicalDetails from "./TechnicalDetails";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";

const initialFormData: FormDataType = {
    name: "",
    model_category: "traditional_ml",
    type: "classification",
    technical_domain: "nlp",
    model_purpose: null,
    criticality_level: null,
    regulatory_risk_tier: null,
    eu_ai_category: null,
    ownership_category: "internal",
    responsible_org_role: "developer",
    business_owner_id: null,
    steward_custodian_id: null,
    business_adoption_status: null,
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
        const fieldErrors: Record<string, string[]> = {
            name: validateTextField(formData.name, {
                required: true,
                messages: { required: "Model name is required" },
            }),
            model_category: validateTextField(formData.model_category, {
                required: true,
                messages: { required: "Model category is required" },
            }),
            type: validateTextField(formData.type, {
                required: true,
                messages: { required: "Model type is required" },
            }),
            ownership_category: validateTextField(formData.ownership_category, {
                required: true,
                messages: { required: "Ownership category is required" },
            }),
            responsible_org_role: validateTextField(formData.responsible_org_role, {
                required: true,
                messages: { required: "Responsible organization role is required" },
            }),
        };

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
            // Map form data to API payload according to backend expectations
            const payload = {
                name: formData.name,
                category: formData.model_category, // Maps to model_category in DB
                type: formData.type,
                technical_domain: formData.technical_domain || null,
                purpose: formData.model_purpose || null, // Maps to model_purpose in DB
                criticality_level: formData.criticality_level,
                regulatory_risk_tier: formData.regulatory_risk_tier,
                eu_ai_category: formData.eu_ai_category,
                ownership_category: formData.ownership_category,
                responsible_org_role: formData.responsible_org_role,
                business_owner_id: formData.business_owner_id,
                custodian_id: formData.steward_custodian_id, // Maps to steward_custodian_id in DB
                business_adoption_status: formData.business_adoption_status || null,
            };

            const result = await createAiModel(payload as any).unwrap();

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
            <GovernanceRegulatorySection
                formData={formData}
                setFormData={setFormData}
                errors={validationErrors}
            />
            <OwnershipGovernance
                formData={formData}
                setFormData={setFormData}
                errors={validationErrors}
            />
            <TechnicalDetails
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
