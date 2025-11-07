"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateDatasetSnapshotMutation } from "@/app/lib/features/datasetSnapshotsApi";
import DatasetSnapshotForm from "./DatasetSnapshotForm";
import { toast } from "react-toastify";

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
        const errors: Record<string, string[]> = {};

        if (!formData.dataset_id) {
            errors.dataset_id = ["Dataset is required"];
        }

        if (!formData.version_tag?.trim()) {
            errors.version_tag = ["Version tag is required"];
        }

        if (!formData.source_created_at?.trim()) {
            errors.source_created_at = ["Created at is required"];
        }

        if (!formData.time_range_start?.trim()) {
            errors.time_range_start = ["Time range start is required"];
        }
        if (!formData.time_range_end?.trim()) {
            errors.time_range_end = ["Time range end is required"];
        }
        // If both provided, enforce ordering
        if (formData.time_range_start && formData.time_range_end) {
            if (new Date(formData.time_range_end) < new Date(formData.time_range_start)) {
                errors.time_range_end = ["Must be after or equal to start"];
            }
        }

        if (!formData.residency_zone) {
            errors.residency_zone = ["Residency zone is required"];
        }

        if (!formData.storage_uri?.trim()) {
            errors.storage_uri = ["Storage URI is required"];
        }
        if (formData.version_tag && formData.version_tag.length > 50) {
            errors.version_tag = ["Max 50 characters"];
        }
        if (formData.storage_uri && formData.storage_uri.length > 500) {
            errors.storage_uri = ["Max 500 characters"];
        }
        if (formData.quality_checksums && formData.quality_checksums.length > 255) {
            errors.quality_checksums = ["Max 255 characters"];
        }
        if (formData.masking_anonymization_method && formData.masking_anonymization_method.length > 255) {
            errors.masking_anonymization_method = ["Max 255 characters"];
        }
        if (formData.privacy_transform_evidence_ref && formData.privacy_transform_evidence_ref.length > 255) {
            errors.privacy_transform_evidence_ref = ["Max 255 characters"];
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
            } else {
                toast.error(err?.data?.message || "Failed to create snapshot");
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

