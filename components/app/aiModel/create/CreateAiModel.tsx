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
import { useRouter } from "next/navigation";

const initialFormData: FormDataType = {
    name: "",
    description: null,
    primary_category: "traditional_ml",
    type: "classification",
    current_version_id: null,
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
    creator_email: "",
    organizational_role: "developer",
};

const CreateAiModel: React.FC = () => {
    const [formData, setFormData] = useState<FormDataType>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [createAiModel, { isLoading }] = useCreateAiModelMutation();
    const router = useRouter();

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

        if (!formData.type) {
            errors.type = ["Model type is required"];
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

        if (!formData.development_source) {
            errors.development_source = ["Development source is required"];
        }

        if (!formData.creator_email?.trim()) {
            errors.creator_email = ["Creator email is required"];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.creator_email)) {
            errors.creator_email = ["Please enter a valid email address"];
        }

        if (!formData.organizational_role) {
            errors.organizational_role = ["Organizational role is required"];
        }

        // Source organization/stakeholder validation - always required (form shows asterisk)
        if (!formData.source_org_stakeholder_id) {
            errors.source_org_stakeholder_id = ["Source organization/stakeholder is required"];
        }

        // Model owner/custodian validation - always required
        if (!formData.owner_stakeholder_id) {
            errors.owner_stakeholder_id = ["Model owner/custodian is required"];
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
            const payload = {
                name: formData.name,
                description: formData.description,
                primary_category: formData.primary_category,
                type: formData.type,
                domain_specialization: formData.domain_specialization,
                ownership_type: formData.ownership_type,
                development_source: formData.development_source,
                business_status: formData.business_status,
                operational_status: formData.operational_status,
                regulatory_risk_classification: formData.regulatory_risk_classification,
                // Map IDs to API fields that expect strings
                source_org_stakeholder_id: formData.source_org_stakeholder_id,
                current_owner: formData.current_owner,
                owner_stakeholder_id: formData.owner_stakeholder_id,
                vendor: formData.vendor_id,
                creator_email: formData.creator_email,
                organizational_role: formData.organizational_role,
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