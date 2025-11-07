"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateDatasetMutation, CreateDatasetData } from "@/app/lib/features/datasetsApi";
import DatasetForm from "./DatasetForm";
import { toast } from "react-toastify";

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
        const errors: Record<string, string[]> = {};

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

        if (!formData.controller_role?.trim()) {
            errors.controller_role = ["Controller role is required"];
        }

        // lawful_basis is always required
        if (!formData.lawful_basis?.trim()) {
            errors.lawful_basis = ["Lawful basis is required"];
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

        // If lawful basis is Consent, require consent_required field
        if (formData.lawful_basis === "Consent") {
            // consent_required is required (boolean)
            if (formData.consent_required === undefined || formData.consent_required === null) {
                errors.consent_required = ["Consent required is required when lawful basis is Consent"];
            }

            // consent_coverage_pct is optional, but if provided must be 0-100
            if (formData.consent_coverage_pct !== undefined && formData.consent_coverage_pct !== null) {
                if (formData.consent_coverage_pct < 0 || formData.consent_coverage_pct > 100) {
                    errors.consent_coverage_pct = ["Consent coverage percentage must be between 0 and 100"];
                }
            }
            // consent_source_ref is optional - no validation needed
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

