"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useRouter } from "next/navigation";

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

const CreateAiModel: React.FC = () => {
    const [formData, setFormData] = useState<FormDataType>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [createAiModel, { isLoading }] = useCreateAiModelMutation();
    const router = useRouter();

    // Form validation
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
        setValidationErrors({});

        // Client-side validation
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
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

            await createAiModel(payload as any).unwrap();

            // Reset form on success
            setFormData(initialFormData);
            setValidationErrors({});
            router.push("/core-assets/ai-models");
        } catch (err: any) {
            // Handle backend validation errors
            if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
                window.scrollTo({ top: 0, behavior: "smooth" });
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
                                New AI Model
                            </h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                                Fill all the details below of your AI Model
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save AI Model"}
                        </Button>
                    </div>

                    <CardContent className="space-y-10 w-full">
                        {/* Show validation errors */}
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
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default CreateAiModel;
