"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateDatasetMutation, CreateDatasetData } from "@/app/lib/features/datasetsApi";
import DatasetForm from "./DatasetForm";
import {
    validateTextField,
    validateArrayField,
    validateNumericField,
    createValidationErrors,
} from "@/lib/utils/validation";

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

interface DatasetModalFormProps {
    onSuccess?: (dataset: any) => void;
    onCancel?: () => void;
}

const DatasetModalForm: React.FC<DatasetModalFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState<CreateDatasetData>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [createDataset, { isLoading }] = useCreateDatasetMutation();

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
        };

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
        e.stopPropagation();
        setValidationErrors({});

        if (!validateForm()) {
            return;
        }

        // Prepare data: convert source_ids to integers
        const dataToSubmit = {
            ...formData,
            source_ids: formData.source_ids.map(id => typeof id === 'string' ? parseInt(id, 10) : id),
        };

        try {
            const result = await createDataset(dataToSubmit).unwrap();

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

            <DatasetForm
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
                    {isLoading ? "Creating..." : "Create Dataset"}
                </Button>
            </div>
        </form>
    );
};

export default DatasetModalForm;

