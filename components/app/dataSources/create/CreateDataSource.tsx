"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateDataSourceMutation } from "@/app/lib/features/dataSourcesApi";
import { CreateDataSourceData } from "@/app/lib/features/dataSourcesApi";
import DataSourceForm from "./DataSourceForm";

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

const CreateDataSource: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] =
    useState<CreateDataSourceData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [createDataSource, { isLoading }] = useCreateDataSourceMutation();

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    // Required fields (AC-01: enforce residency/classification + hosting/cloud fields)
    if (!formData.name?.trim()) {
      errors.name = ["Name is required"];
    }

    if (!formData.system_type?.trim()) {
      errors.system_type = ["System type is required"];
    }

    if (!formData.owner_team?.trim()) {
      errors.owner_team = ["Owner team is required"];
    }

    if (!formData.access_method?.trim()) {
      errors.access_method = ["Access method is required"];
    }

    if (!formData.residency?.trim()) {
      errors.residency = ["Residency is required (AC-01)"];
    }

    if (!formData.classification?.trim()) {
      errors.classification = ["Classification is required (AC-01)"];
    }

    if (!formData.hosting_model?.trim()) {
      errors.hosting_model = ["Hosting model is required (AC-01)"];
    }

    if (!formData.service_model?.trim()) {
      errors.service_model = ["Service model is required (AC-01)"];
    }

    if (!formData.cloud_provider?.trim()) {
      errors.cloud_provider = ["Cloud provider is required (AC-01)"];
    }

    if (!formData.data_domains || formData.data_domains.length === 0) {
      errors.data_domains = ["At least one data domain is required"];
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
      await createDataSource(formData).unwrap();
      router.push("/core-assets/data/sources");
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
                New data source
              </h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Register a system of record for dataset lineage and hosting guardrails
              </p>
            </div>
            <Button
              type="submit"
              className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save new data source"}
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

export default CreateDataSource;

