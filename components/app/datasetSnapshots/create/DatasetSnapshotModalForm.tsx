"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateDatasetSnapshotMutation } from "@/app/lib/features/datasetSnapshotsApi";
import DatasetSnapshotForm from "./DatasetSnapshotForm";
import {
    validateTextField,
    validateNumericField,
    createValidationErrors,
} from "@/lib/utils/validation";

const initialFormData = {
    dataset_id: "",
    version_tag: "",
    source_created_at: "",
    time_range_start: "",
    time_range_end: "",
    row_count: undefined,
    pii_element_count: undefined,
    special_category_element_count: undefined,
    quality_checksums: "",
    residency_zone: "",
    storage_uri: "",
    masking_anonymization_method: "",
    privacy_transform_evidence_ref: "",
};

interface DatasetSnapshotModalFormProps {
    onSuccess?: (snapshot: any) => void;
    onCancel?: () => void;
}

const DatasetSnapshotModalForm: React.FC<DatasetSnapshotModalFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState<any>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [createSnapshot, { isLoading }] = useCreateDatasetSnapshotMutation();

    const validateForm = (): boolean => {
        const fieldErrors: Record<string, string[]> = {
            dataset_id: validateTextField(String(formData.dataset_id ?? ""), {
                required: true,
                messages: { required: "Dataset is required" },
            }),
            version_tag: validateTextField(formData.version_tag, {
                required: true,
                maxLength: 50,
                messages: { required: "Version tag is required", maxLength: "Max 50 characters" },
            }),
            source_created_at: validateTextField(formData.source_created_at, {
                required: true,
                messages: { required: "Created at is required" },
            }),
            time_range_start: validateTextField(formData.time_range_start, {
                required: true,
                messages: { required: "Time range start is required" },
            }),
            time_range_end: validateTextField(formData.time_range_end, {
                required: true,
                messages: { required: "Time range end is required" },
            }),
            residency_zone: validateTextField(formData.residency_zone, {
                required: true,
                messages: { required: "Residency zone is required" },
            }),
            storage_uri: validateTextField(formData.storage_uri, {
                required: true,
                maxLength: 500,
                messages: { required: "Storage URI is required", maxLength: "Max 500 characters" },
            }),
            quality_checksums: validateTextField(formData.quality_checksums, {
                maxLength: 255,
                messages: { maxLength: "Max 255 characters" },
            }),
            masking_anonymization_method: validateTextField(formData.masking_anonymization_method, {
                maxLength: 255,
                messages: { maxLength: "Max 255 characters" },
            }),
            privacy_transform_evidence_ref: validateTextField(formData.privacy_transform_evidence_ref, {
                maxLength: 255,
                messages: { maxLength: "Max 255 characters" },
            }),
        };

        if (formData.time_range_start && formData.time_range_end) {
            if (new Date(formData.time_range_end) < new Date(formData.time_range_start)) {
                fieldErrors.time_range_end = [
                    ...(fieldErrors.time_range_end ?? []),
                    "Must be after or equal to start",
                ];
            }
        }

        const numericFields: Array<[keyof typeof formData, number | undefined | null, string]> = [
            ["row_count", formData.row_count, "Must be >= 0"],
            ["pii_element_count", formData.pii_element_count, "Must be >= 0"],
            ["special_category_element_count", formData.special_category_element_count, "Must be >= 0"],
        ];
        numericFields.forEach(([field, value, message]) => {
            if (value !== undefined && value !== null) {
                const errs = validateNumericField(Number(value), {
                    min: 0,
                    messages: { min: message },
                });
                if (errs.length) {
                    const key = field as string;
                    fieldErrors[key] = errs;
                }
            }
        });

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
            const result = await createSnapshot({
                ...formData,
                dataset_id: Number(formData.dataset_id),
            } as any).unwrap();

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

            <DatasetSnapshotForm
                formData={formData as any}
                setFormData={setFormData as any}
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
                    {isLoading ? "Creating..." : "Create Snapshot"}
                </Button>
            </div>
        </form>
    );
};

export default DatasetSnapshotModalForm;

