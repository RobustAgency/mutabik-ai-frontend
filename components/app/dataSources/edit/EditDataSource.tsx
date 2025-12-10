"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetDataSourceQuery, useUpdateDataSourceMutation, CreateDataSourceData } from "@/app/lib/features/dataSourcesApi";
import DataSourceForm from "../create/DataSourceForm";
import {
    validateTextField,
    validateArrayField,
    createValidationErrors,
} from "@/lib/utils/validation";

interface EditDataSourceProps {
    dataSourceId: string;
}

const EditDataSource: React.FC<EditDataSourceProps> = ({
    dataSourceId,
}) => {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateDataSourceData>({
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
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const { data: dataSource, isLoading: isLoadingDataSource } = useGetDataSourceQuery(dataSourceId);
    const [updateDataSource, { isLoading: isUpdating }] = useUpdateDataSourceMutation();

    // Populate form with existing data
    useEffect(() => {
        if (dataSource) {
            setFormData({
                name: dataSource.name,
                system_type: dataSource.system_type,
                owner_team: dataSource.owner_team,
                data_domains: dataSource.data_domains || [],
                access_method: dataSource.access_method,
                residency: dataSource.residency,
                classification: dataSource.classification,
                hosting_model: dataSource.hosting_model,
                service_model: dataSource.service_model,
                cloud_provider: dataSource.cloud_provider,
                primary_region: dataSource.primary_region || "",
                secondary_region: dataSource.secondary_region || "",
                network_ref: dataSource.network_ref || "",
                retention_policy_ref: dataSource.retention_policy_ref || "",
                catalog_uri: dataSource.catalog_uri || "",
            });
        }
    }, [dataSource]);

    // Form validation using shared utilities
    const validateForm = (): boolean => {
        const fieldErrors: Record<string, string[]> = {
            name: validateTextField(formData.name, {
                required: true,
                messages: { required: "Name is required" },
            }),
            system_type: validateTextField(formData.system_type, {
                required: true,
                messages: { required: "System type is required" },
            }),
            owner_team: validateTextField(formData.owner_team, {
                required: true,
                messages: { required: "Owner team is required" },
            }),
            access_method: validateTextField(formData.access_method, {
                required: true,
                messages: { required: "Access method is required" },
            }),
            residency: validateTextField(formData.residency, {
                required: true,
                messages: { required: "Residency is required (AC-01)" },
            }),
            classification: validateTextField(formData.classification, {
                required: true,
                messages: { required: "Classification is required (AC-01)" },
            }),
            hosting_model: validateTextField(formData.hosting_model, {
                required: true,
                messages: { required: "Hosting model is required (AC-01)" },
            }),
            service_model: validateTextField(formData.service_model, {
                required: true,
                messages: { required: "Service model is required (AC-01)" },
            }),
            cloud_provider: validateTextField(formData.cloud_provider, {
                required: true,
                messages: { required: "Cloud provider is required (AC-01)" },
            }),
            data_domains: validateArrayField(formData.data_domains, {
                required: true,
                messages: { required: "At least one data domain is required" },
            }),
        };

        const errors = createValidationErrors(fieldErrors);
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        // Client-side validation
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            await updateDataSource({
                id: dataSourceId,
                data: formData,
            }).unwrap();
            router.push("/core-assets/data/sources");
        } catch (err: any) {
            // Handle backend validation errors
            if (err?.data?.errors) {
                setValidationErrors(err.data.errors);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    };

    if (isLoadingDataSource) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <p className="text-center text-muted-foreground">Loading data source...</p>
                </Card>
            </div>
        );
    }

    if (!dataSource) {
        return (
            <div className="max-w-7xl mx-auto">
                <Card className="p-6 border-[#E4E7EC] shadow-none">
                    <p className="text-center text-destructive">Data source not found</p>
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
                            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                                Edit data source
                            </h1>
                            <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                                Update data source registry information
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Updating..." : "Update data source"}
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

                        <DataSourceForm
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

export default EditDataSource;

