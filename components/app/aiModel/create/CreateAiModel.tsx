"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateAiModelMutation } from "@/app/lib/features/aiModelsApi";
import { FormDataType } from "../types/aiModelTypes";
import BasicInfo from "./BasicInfo";
import TechnicalDetails from "./TechnicalDetails";
import OwnershipGovernance from "./OwnershipGovernance";

const initialFormData: FormDataType = {
    name: "",
    description: null,
    primary_category: "traditional_ml",
    model_type: "classification",
    domain_specialization: "general",
    business_status: "planned",
    operational_status: "not_deployed",
    regulatory_classification: "minimal_risk",
    organizational_role: "developer",
    ownership_type: "internal",
    development_source: "internal_development",
    source_organization: null,
    model_owner: null,
    vendor_id: null,
};

const CreateAiModel: React.FC = () => {
    const [formData, setFormData] = useState<FormDataType>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [createAiModel, { isLoading }] = useCreateAiModelMutation();

    // Form validation
    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        // Required fields
        if (!formData.name?.trim()) {
            errors.name = ["Model name is required"];
        }

        if (!formData.description?.trim()) {
            errors.description = ["Description is required"];
        }

        if (!formData.primary_category) {
            errors.primary_category = ["Primary category is required"];
        }

        if (!formData.model_type) {
            errors.model_type = ["Model type is required"];
        }

        if (!formData.domain_specialization) {
            errors.domain_specialization = ["Domain specialization is required"];
        }

        if (!formData.business_status) {
            errors.business_status = ["Business status is required"];
        }

        if (!formData.operational_status) {
            errors.operational_status = ["Operational status is required"];
        }

        if (!formData.regulatory_classification) {
            errors.regulatory_classification = ["Regulatory classification is required"];
        }

        if (!formData.organizational_role) {
            errors.organizational_role = ["Organizational role is required"];
        }

        if (!formData.ownership_type) {
            errors.ownership_type = ["Ownership type is required"];
        }

        if (!formData.development_source) {
            errors.development_source = ["Development source is required"];
        }

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
            await createAiModel(formData).unwrap();

            // Reset form on success
            setFormData(initialFormData);
            setValidationErrors({});
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
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default CreateAiModel;