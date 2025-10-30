"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateDatasetMutation } from "@/app/lib/features/datasetsApi";
import { CreateDatasetData } from "@/app/lib/features/datasetsApi";
import DatasetForm from "./DatasetForm";

const initialFormData: CreateDatasetData = {
    name: "",
    source_ids: [],
    purpose: "",
    schema_summary: "",
    sensitivity: "",
    contains_pii: "No",
    data_subject_categories: [],
    controller_role: "",
    lawful_basis: "",
    lawful_basis_detail: "",
    consent_required: false,
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
        const errors: Record<string, string[]> = {};

        // Required fields
        if (!formData.name?.trim()) {
            errors.name = ["Name is required"];
        }

        if (!formData.purpose?.trim()) {
            errors.purpose = ["Purpose is required"];
        }

        if (formData.source_ids.length === 0) {
            errors.source_ids = ["At least one data source is required"];
        }

        if (!formData.sensitivity?.trim()) {
            errors.sensitivity = ["Sensitivity is required"];
        }

        if (!formData.contains_pii?.trim()) {
            errors.contains_pii = ["Contains PII selection is required"];
        }

        if (formData.data_subject_categories.length === 0) {
            errors.data_subject_categories = ["At least one data subject category is required"];
        }

        if (!formData.controller_role?.trim()) {
            errors.controller_role = ["Controller role is required"];
        }

        if (!formData.data_structure?.trim()) {
            errors.data_structure = ["Data structure is required"];
        }

        if (!formData.storage_format?.trim()) {
            errors.storage_format = ["Storage format is required"];
        }

        if (!formData.cross_border_transfer?.trim()) {
            errors.cross_border_transfer = ["Cross-border transfer is required"];
        }

        if (!formData.owner_team?.trim()) {
            errors.owner_team = ["Owner team is required"];
        }

        // AC-02: PII datasets must have lawful basis
        if (formData.contains_pii === "Yes") {
            if (!formData.lawful_basis?.trim()) {
                errors.lawful_basis = ["Lawful basis is required for PII datasets (AC-02)"];
            }

            // AC-02: If lawful basis is Consent, require consent artifacts
            if (formData.lawful_basis === "Consent") {
                if (!formData.consent_coverage_pct || formData.consent_coverage_pct <= 0) {
                    errors.consent_coverage_pct = ["Consent coverage percentage is required when lawful basis is Consent (AC-02)"];
                }
                if (!formData.consent_source_ref?.trim()) {
                    errors.consent_source_ref = ["Consent source reference is required when lawful basis is Consent (AC-02)"];
                }
            }
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

        // Prepare data: set consent_required based on lawful_basis
        const dataToSubmit = {
            ...formData,
            consent_required: formData.lawful_basis === "Consent",
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

