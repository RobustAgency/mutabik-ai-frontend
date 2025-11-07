"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateDatasetSnapshotMutation } from "@/app/lib/features/datasetSnapshotsApi";
import DatasetSnapshotForm from "./DatasetSnapshotForm";

const CreateDatasetSnapshot: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    dataset_id: "",
    version_tag: "",
    time_range_start: "",
    time_range_end: "",
    row_count: undefined,
    quality_checksums: "",
    pii_element_count: undefined,
    special_category_element_count: undefined,
    masking_anonymization_method: "",
    privacy_transform_evidence_ref: "",
    residency_zone: "",
    storage_uri: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const [createSnapshot, { isLoading }] = useCreateDatasetSnapshotMutation();

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    // dataset_id can be a number (when selected) or string (when empty)
    if (typeof formData.dataset_id === 'number') {
      if (formData.dataset_id <= 0) {
        errors.dataset_id = ["Dataset ID is required"];
      }
    } else {
      if (!formData.dataset_id?.trim()) {
        errors.dataset_id = ["Dataset ID is required"];
      }
    }
    if (!formData.version_tag?.trim()) errors.version_tag = ["Version tag is required"];
    if (formData.version_tag && formData.version_tag.length > 50) errors.version_tag = ["Max 50 characters"];
    
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
    if (!formData.residency_zone?.trim()) errors.residency_zone = ["Residency zone is required (AC-04)"];
    if (!formData.storage_uri?.trim()) errors.storage_uri = ["Storage URI is required (AC-04)"];
    if (formData.storage_uri && formData.storage_uri.length > 500) errors.storage_uri = ["Max 500 characters"];
    if (formData.quality_checksums && formData.quality_checksums.length > 255) errors.quality_checksums = ["Max 255 characters"];
    if (formData.masking_anonymization_method && formData.masking_anonymization_method.length > 255) errors.masking_anonymization_method = ["Max 255 characters"];
    if (formData.privacy_transform_evidence_ref && formData.privacy_transform_evidence_ref.length > 255) errors.privacy_transform_evidence_ref = ["Max 255 characters"];
    if (formData.row_count !== undefined && formData.row_count !== null && Number(formData.row_count) < 0) errors.row_count = ["Must be >= 0"];
    if (formData.pii_element_count !== undefined && formData.pii_element_count !== null && Number(formData.pii_element_count) < 0) errors.pii_element_count = ["Must be >= 0"];
    if (formData.special_category_element_count !== undefined && formData.special_category_element_count !== null && Number(formData.special_category_element_count) < 0) errors.special_category_element_count = ["Must be >= 0"];

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const payload = {
        ...formData,
        dataset_id: Number(formData.dataset_id),
      } as any;
      await createSnapshot(payload).unwrap();
      router.push("/core-assets/data/snapshots");
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={handleSubmit}>
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Create Dataset Snapshot</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Create an immutable snapshot for reproducibility (AC-04)</p>
            </div>
            <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Snapshot"}
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

            <DatasetSnapshotForm formData={formData as any} setFormData={setFormData as any} errors={validationErrors} />
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateDatasetSnapshot;

