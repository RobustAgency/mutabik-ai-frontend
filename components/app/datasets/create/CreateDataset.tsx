"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateDatasetMutation } from "@/app/lib/features/datasetsApi";
import { CreateDatasetData } from "@/app/lib/features/datasetsApi";
import {
  validateTextField,
  validateArrayField,
  validateNumericField,
  createValidationErrors,
} from "@/lib/utils/validation";
import DatasetForm from "./DatasetForm";

const initialFormData: CreateDatasetData = {
    name: "",
    source_ids: [],
    purpose: [],
    schema_summary: "",
    sensitivity: "",
    contains_pii: "No",
    data_subject_categories: [],
    controller_role: "",
    lawful_basis: "",
    lawful_basis_detail: "",
    consent_required: true,
    consent_coverage_pct: 0,
    consent_source_ref: "",
    licensing_basis: "",
    license_type: "",
    privacy_notice_ref: "",
    cross_border_transfer: "None",
    data_structure: "",
    storage_format: "",
    content_types: [],
    retention_policy_ref: "",
    dpia_ref: "",
    aia_ref: "",
    owner_team: "",
    refresh_cadence: "",
    quality_SLA: "",
    catalog_asset_id: "",
    catalog_uri: "",
};

const CreateDataset: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] =
        useState<CreateDatasetData>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<
        Record<string, string[]>
    >({});
    const [createDataset, { isLoading }] = useCreateDatasetMutation();

    // Form validation (AC-02: PII datasets require lawful basis)
    const validateForm = (): boolean => {
        const fieldErrors: Record<string, string[]> = {
            name: validateTextField(formData.name, {
                required: true,
                messages: { required: "Name is required" },
            }),
            purpose: validateArrayField(formData.purpose, {
                required: true,
                messages: { required: "At least one purpose is required" },
            }),
            source_ids: validateArrayField(formData.source_ids, {
                required: true,
                messages: { required: "At least one data source is required" },
            }),
            sensitivity: validateTextField(formData.sensitivity, {
                required: true,
                messages: { required: "Sensitivity is required" },
            }),
            contains_pii: validateTextField(formData.contains_pii, {
                required: true,
                messages: { required: "Contains PII selection is required" },
            }),
            controller_role: validateTextField(formData.controller_role, {
                required: true,
                messages: { required: "Controller role is required" },
            }),
            lawful_basis: validateTextField(formData.lawful_basis, {
                required: true,
                messages: { required: "Lawful basis is required" },
            }),
            data_structure: validateTextField(formData.data_structure, {
                required: true,
                messages: { required: "Data structure is required" },
            }),
            storage_format: validateTextField(formData.storage_format, {
                required: true,
                messages: { required: "Storage format is required" },
            }),
            cross_border_transfer: validateTextField(formData.cross_border_transfer, {
                required: true,
                messages: { required: "Cross-border transfer is required" },
            }),
            owner_team: validateTextField(formData.owner_team, {
                required: true,
                messages: { required: "Owner team is required" },
            }),
            license_type: validateTextField(formData.license_type, {
                required: true,
                messages: { required: "License type is required" },
            }),
        };

        // Consent-specific validation
        if (formData.lawful_basis === "Consent") {
            if (formData.consent_required === undefined || formData.consent_required === null) {
                fieldErrors.consent_required = [
                    "Consent required is required when lawful basis is Consent",
                ];
            }
            if (formData.consent_coverage_pct !== undefined && formData.consent_coverage_pct !== null) {
                const pctErrors = validateNumericField(formData.consent_coverage_pct, {
                    min: 0,
                    max: 100,
                    messages: {
                        min: "Consent coverage percentage must be between 0 and 100",
                        max: "Consent coverage percentage must be between 0 and 100",
                    },
                });
                if (pctErrors.length) {
                    fieldErrors.consent_coverage_pct = pctErrors;
                }
            }
        }

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

        // Prepare data: convert source_ids to integers
        const dataToSubmit = {
            ...formData,
            source_ids: formData.source_ids.map(id => typeof id === 'string' ? parseInt(id, 10) : id),
        };

        try {
            await createDataset(dataToSubmit).unwrap();
            router.push("/core-assets/data/registry");
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
                                New dataset
                            </h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                                Register dataset with privacy posture for AI eligibility assessment
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save new dataset"}
                        </Button>
                    </div>

                    <CardContent className="space-y-10 w-full">
                        {/* Show validation errors */}
                        {Object.keys(validationErrors).length > 0 && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <p className="font-semibold mb-2">
                                        Please fix the following errors:
                                    </p>
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

                        <DatasetForm
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

export default CreateDataset;

