"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetDatasetQuery, useUpdateDatasetMutation, CreateDatasetData } from "@/app/lib/features/datasetsApi";
import DatasetForm from "../create/DatasetForm";

interface EditDatasetProps {
    datasetId: string;
}

const EditDataset: React.FC<EditDatasetProps> = ({ datasetId }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateDatasetData>({
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
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const { data: dataset, isLoading: isLoadingDataset } = useGetDatasetQuery(datasetId);
    const [updateDataset, { isLoading: isUpdating }] = useUpdateDatasetMutation();

    useEffect(() => {
        if (dataset) {
            setFormData({
                name: dataset.name,
                source_ids: (dataset.source_ids || []).map(id => typeof id === 'string' ? parseInt(id, 10) : id),
                purpose: dataset.purpose,
                schema_summary: dataset.schema_summary || "",
                sensitivity: dataset.sensitivity,
                contains_pii: dataset.contains_pii,
                data_subject_categories: dataset.data_subject_categories || [],
                controller_role: dataset.controller_role,
                lawful_basis: dataset.lawful_basis || "",
                lawful_basis_detail: dataset.lawful_basis_detail || "",
                consent_required: dataset.consent_required ?? false,
                consent_coverage_pct: dataset.consent_coverage_pct ?? 0,
                consent_source_ref: dataset.consent_source_ref || "",
                licensing_basis: dataset.licensing_basis || "",
                license_type: dataset.license_type || "",
                privacy_notice_ref: dataset.privacy_notice_ref || "",
                cross_border_transfer: dataset.cross_border_transfer,
                data_structure: dataset.data_structure,
                storage_format: dataset.storage_format,
                content_types: dataset.content_types || [],
                retention_policy_ref: dataset.retention_policy_ref || "",
                dpia_ref: dataset.dpia_ref || "",
                aia_ref: dataset.aia_ref || "",
                owner_team: dataset.owner_team,
                refresh_cadence: dataset.refresh_cadence || "",
                quality_SLA: dataset.quality_SLA || "",
                catalog_asset_id: dataset.catalog_asset_id || "",
                catalog_uri: dataset.catalog_uri || "",
            });
        }
    }, [dataset]);

    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        if (!formData.name?.trim()) errors.name = ["Name is required"];
        if (!formData.purpose?.trim()) errors.purpose = ["Purpose is required"];
        if (formData.source_ids.length === 0) errors.source_ids = ["At least one data source is required"];
        if (!formData.sensitivity?.trim()) errors.sensitivity = ["Sensitivity is required"];
        if (!formData.contains_pii?.trim()) errors.contains_pii = ["Contains PII selection is required"];
        // data_subject_categories is optional (nullable) - no validation needed
        if (!formData.controller_role?.trim()) errors.controller_role = ["Controller role is required"];
        // lawful_basis is always required (not conditional on contains_pii)
        if (!formData.lawful_basis?.trim()) errors.lawful_basis = ["Lawful basis is required"];
        if (!formData.data_structure?.trim()) errors.data_structure = ["Data structure is required"];
        if (!formData.storage_format?.trim()) errors.storage_format = ["Storage format is required"];
        if (!formData.cross_border_transfer?.trim()) errors.cross_border_transfer = ["Cross-border transfer is required"];
        if (!formData.owner_team?.trim()) errors.owner_team = ["Owner team is required"];

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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

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
            await updateDataset({ id: datasetId, data: dataToSubmit }).unwrap();
            router.push("/core-assets/data/registry");
        } catch (err: any) {
            if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    if (isLoadingDataset) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <p className="text-center text-muted-foreground">Loading dataset...</p>
                </Card>
            </div>
        );
    }

    if (!dataset) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <p className="text-center text-destructive">Dataset not found</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <form onSubmit={handleUpdate}>
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
                        <div>
                            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Edit dataset</h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Update dataset registry information</p>
                        </div>
                        <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isUpdating}>
                            {isUpdating ? "Updating..." : "Update dataset"}
                        </Button>
                    </div>

                    <CardContent className="space-y-10 w-full">
                        {Object.keys(validationErrors).length > 0 && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <p className="font-semibold mb-2">Please fix the following errors:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {Object.entries(validationErrors).map(([field, errors]) => (
                                            <li key={field}>
                                                <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {errors[0]}
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <DatasetForm formData={formData} setFormData={setFormData} errors={validationErrors} />
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default EditDataset;

