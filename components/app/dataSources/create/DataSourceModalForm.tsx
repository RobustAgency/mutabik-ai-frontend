"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateDataSourceMutation, CreateDataSourceData } from "@/app/lib/features/dataSourcesApi";
import DataSourceForm from "./DataSourceForm";
import { toast } from "react-toastify";

const initialFormData: CreateDataSourceData = {
    name: "",
    system_type: "",
    owner_team: "",
    data_domains: [],
    access_method: "",
    residency: "",
    classification: "",
    hosting_model: "",
    service_model: "",
    cloud_provider: "",
    primary_region: "",
    secondary_region: "",
    network_ref: "",
    retention_policy_ref: "",
    catalog_uri: "",
};

interface DataSourceModalFormProps {
    onSuccess?: (dataSource: any) => void;
    onCancel?: () => void;
}

const DataSourceModalForm: React.FC<DataSourceModalFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [formData, setFormData] = useState<CreateDataSourceData>(initialFormData);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [createDataSource, { isLoading }] = useCreateDataSourceMutation();

    const validateForm = (): boolean => {
        const errors: Record<string, string[]> = {};

        if (!formData.name?.trim()) {
            errors.name = ["Data source name is required"];
        }

        if (!formData.system_type?.trim()) {
            errors.system_type = ["System type is required"];
        }

        if (!formData.owner_team?.trim()) {
            errors.owner_team = ["Owner team is required"];
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
            const result = await createDataSource(formData).unwrap();

            if (onSuccess) {
                onSuccess(result);
            }
        } catch (err: any) {
            if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
            } else {
                toast.error(err?.data?.message || "Failed to create data source");
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

            <DataSourceForm
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
                    {isLoading ? "Creating..." : "Create Data Source"}
                </Button>
            </div>
        </form>
    );
};

export default DataSourceModalForm;

