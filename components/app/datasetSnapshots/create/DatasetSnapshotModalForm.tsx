"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { 
  useCreateDatasetSnapshotMutation,
  CreateDatasetSnapshotData,
  FileFormat,
  ResidencyZone,
  EncryptionStatus,
  Status,
} from "@/app/lib/features/datasetSnapshotsApi";
import { datasetSnapshotSchema, type DatasetSnapshotFormData } from "@/lib/schemas/datasetSnapshot.schema";
import { SnapshotIdentificationStep } from "./steps/SnapshotIdentificationStep";
import { DataMetricsStep } from "./steps/DataMetricsStep";
import { StorageSecurityStep } from "./steps/StorageSecurityStep";

const initialFormData: Partial<DatasetSnapshotFormData> = {
  dataset_id: 0,
  version_tag: "",
  supersedes_snapshot_id: null,
  description: null,
  time_range_start: "",
  time_range_end: "",
  row_count: 0,
  file_count: null,
  total_size: null,
  size_unit: null,
  file_format: FileFormat.PARQUET,
  pii_element_count: null,
  consent_coverage_at_creation: null,
  residency_zone: ResidencyZone.US,
  storage_uri: "",
  storage_tier: null,
  compression: null,
  encryption_status: EncryptionStatus.NONE,
  masking_method_applied: null,
  quality_checksums: null,
  created_by_system: null,
  approved_by: null,
  expiration_date: null,
  status: Status.ACTIVE,
};

interface DatasetSnapshotModalFormProps {
  onSuccess?: (snapshot: any) => void;
  onCancel?: () => void;
}

const DatasetSnapshotModalForm: React.FC<DatasetSnapshotModalFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [createSnapshot, { isLoading }] = useCreateDatasetSnapshotMutation();

  const methods = useForm<DatasetSnapshotFormData>({
    resolver: zodResolver(datasetSnapshotSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleSave = handleSubmit(async (data: DatasetSnapshotFormData) => {
    try {
      const createData: CreateDatasetSnapshotData = {
        dataset_id: data.dataset_id,
        version_tag: data.version_tag,
        supersedes_snapshot_id: data.supersedes_snapshot_id || null,
        description: data.description || null,
        time_range_start: data.time_range_start,
        time_range_end: data.time_range_end,
        row_count: data.row_count,
        file_count: data.file_count || null,
        total_size: data.total_size || null,
        size_unit: data.size_unit || null,
        file_format: data.file_format,
        pii_element_count: data.pii_element_count || null,
        consent_coverage_at_creation: data.consent_coverage_at_creation || null,
        residency_zone: data.residency_zone,
        storage_uri: data.storage_uri,
        storage_tier: data.storage_tier || null,
        compression: data.compression || null,
        encryption_status: data.encryption_status,
        masking_method_applied: data.masking_method_applied || null,
        quality_checksums: data.quality_checksums || null,
        created_by_system: data.created_by_system || null,
        approved_by: data.approved_by || null,
        expiration_date: data.expiration_date || null,
        status: data.status,
      };

      const result = await createSnapshot(createData).unwrap();

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: any) {
      // Errors are handled by react-hook-form through zod validation
      console.error("Failed to create snapshot:", err);
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSave} className="space-y-6">
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(errors).map(([field, error]) => {
                  const errorMessage = error?.message as string;
                  if (!errorMessage) return null;
                  return (
                    <li key={field}>
                      <span className="font-medium capitalize">
                        {field.replace(/_/g, " ")}:
                      </span>{" "}
                      {errorMessage}
                    </li>
                  );
                })}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Reuse step components for consistent UI */}
        <SnapshotIdentificationStep />
        <DataMetricsStep />
        <StorageSecurityStep />

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
    </FormProvider>
  );
};

export default DatasetSnapshotModalForm;
