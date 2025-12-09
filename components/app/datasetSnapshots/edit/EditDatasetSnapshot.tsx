"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetDatasetSnapshotQuery, useUpdateDatasetSnapshotMutation } from "@/app/lib/features/datasetSnapshotsApi";
import DatasetSnapshotForm from "../create/DatasetSnapshotForm";
import {
  validateTextField,
  validateNumericField,
  createValidationErrors,
} from "@/lib/utils/validation";

interface EditDatasetSnapshotProps {
  snapshotId: string;
}

const EditDatasetSnapshot: React.FC<EditDatasetSnapshotProps> = ({ snapshotId }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    dataset_id: "",
    version_tag: "",
    source_created_at: "",
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

  const { data: snapshot, isLoading: isLoadingSnapshot } = useGetDatasetSnapshotQuery(snapshotId);
  const [updateSnapshot, { isLoading: isUpdating }] = useUpdateDatasetSnapshotMutation();

  useEffect(() => {
    if (snapshot) {
      setFormData({
        dataset_id: snapshot.dataset_id,
        version_tag: snapshot.version_tag,
        source_created_at: snapshot.source_created_at,
        time_range_start: snapshot.time_range_start,
        time_range_end: snapshot.time_range_end,
        row_count: snapshot.row_count ?? undefined,
        quality_checksums: snapshot.quality_checksums ?? "",
        pii_element_count: snapshot.pii_element_count ?? undefined,
        special_category_element_count: snapshot.special_category_element_count ?? undefined,
        masking_anonymization_method: snapshot.masking_anonymization_method ?? "",
        privacy_transform_evidence_ref: snapshot.privacy_transform_evidence_ref ?? "",
        residency_zone: snapshot.residency_zone,
        storage_uri: snapshot.storage_uri,
      });
    }
  }, [snapshot]);

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      dataset_id: validateTextField(String((formData as any).dataset_id ?? ""), {
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
        messages: { required: "Residency zone is required (AC-04)" },
      }),
      storage_uri: validateTextField(formData.storage_uri, {
        required: true,
        maxLength: 500,
        messages: {
          required: "Storage URI is required (AC-04)",
          maxLength: "Max 500 characters",
        },
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const payload = {
        ...formData,
        dataset_id: Number((formData as any).dataset_id),
      } as any;
      await updateSnapshot({ id: snapshotId, data: payload }).unwrap();
      router.push("/core-assets/data/snapshots");
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (isLoadingSnapshot) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-muted-foreground">Loading snapshot...</p>
        </Card>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-destructive">Snapshot not found</p>
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
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">Edit Snapshot</h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">Update dataset snapshot</p>
            </div>
            <Button type="submit" className="flex gap-2 px-4 py-6 rounded-full border bg-[#4FD58F] opacity-100" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Snapshot"}
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

            {/* Metadata */}
            {snapshot && (
              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="created_at">Created At</Label>
                    <Input
                      id="created_at"
                      value={snapshot.created_at ? new Date(snapshot.created_at).toLocaleString() : ""}
                      readOnly
                      disabled
                      className="bg-[#F9FAFB]"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditDatasetSnapshot;


