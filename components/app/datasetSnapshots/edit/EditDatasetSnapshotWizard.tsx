"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { datasetSnapshotSchema, type DatasetSnapshotFormData } from "@/lib/schemas/datasetSnapshot.schema";
import {
  useGetDatasetSnapshotQuery,
  useUpdateDatasetSnapshotMutation,
  CreateDatasetSnapshotData,
  FileFormat,
  ResidencyZone,
  EncryptionStatus,
  Status,
} from "@/app/lib/features/datasetSnapshotsApi";
import { SnapshotIdentificationStep } from "../create/steps/SnapshotIdentificationStep";
import { DataMetricsStep } from "../create/steps/DataMetricsStep";
import { PrivacyMetricsStep } from "../create/steps/PrivacyMetricsStep";
import { StorageSecurityStep } from "../create/steps/StorageSecurityStep";
import { GovernanceStep } from "../create/steps/GovernanceStep";
import { DATASET_SNAPSHOT_WIZARD_STEPS } from "../constants";

interface EditDatasetSnapshotWizardProps {
  snapshotId: number;
}

const EditDatasetSnapshotWizard: React.FC<EditDatasetSnapshotWizardProps> = ({ snapshotId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: snapshot, isLoading: isLoadingSnapshot } = useGetDatasetSnapshotQuery(snapshotId);
  const [updateSnapshot, { isLoading }] = useUpdateDatasetSnapshotMutation();

  const methods = useForm<DatasetSnapshotFormData>({
    resolver: zodResolver(datasetSnapshotSchema) as any,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = methods;

  // Populate form with existing data
  useEffect(() => {
    if (snapshot) {
      // Format dates for date inputs (YYYY-MM-DD)
      const formatDateForInput = (dateString: string | undefined | null): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      reset({
        dataset_id: snapshot.dataset_id,
        version_tag: snapshot.version_tag,
        supersedes_snapshot_id: snapshot.supersedes_snapshot_id || null,
        description: snapshot.description || null,
        time_range_start: formatDateForInput(snapshot.time_range_start),
        time_range_end: formatDateForInput(snapshot.time_range_end),
        row_count: snapshot.row_count,
        file_count: snapshot.file_count || null,
        total_size: snapshot.total_size || null,
        size_unit: snapshot.size_unit || null,
        file_format: snapshot.file_format,
        pii_element_count: snapshot.pii_element_count || null,
        consent_coverage_at_creation: snapshot.consent_coverage_at_creation || null,
        residency_zone: snapshot.residency_zone,
        storage_uri: snapshot.storage_uri,
        storage_tier: snapshot.storage_tier || null,
        compression: snapshot.compression || null,
        encryption_status: snapshot.encryption_status,
        masking_method_applied: snapshot.masking_method_applied || null,
        quality_checksums: snapshot.quality_checksums || null,
        created_by_system: snapshot.created_by_system ?? null,
        approved_by: snapshot.approved_by || null,
        expiration_date: formatDateForInput(snapshot.expiration_date),
        status: snapshot.status,
      });
    }
  }, [snapshot, reset]);

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(["dataset_id", "version_tag", "time_range_start", "time_range_end"]);
      case 2:
        return await trigger(["row_count", "file_format"]);
      case 3:
        // Privacy Metrics - no required fields
        return true;
      case 4:
        return await trigger(["residency_zone", "storage_uri", "encryption_status"]);
      case 5:
        return await trigger(["status", "created_by_system"]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, DATASET_SNAPSHOT_WIZARD_STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit(async (data: DatasetSnapshotFormData) => {
    try {
      const updateData: CreateDatasetSnapshotData = {
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
      await updateSnapshot({ id: snapshotId, data: updateData }).unwrap();
      router.push("/core-assets/data/snapshots");
    } catch (error: any) {
      console.error("Failed to update dataset snapshot:", error);
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SnapshotIdentificationStep />;
      case 2:
        return <DataMetricsStep />;
      case 3:
        return <PrivacyMetricsStep />;
      case 4:
        return <StorageSecurityStep />;
      case 5:
        return <GovernanceStep />;
      default:
        return null;
    }
  };

  if (isLoadingSnapshot) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-muted-foreground">Loading snapshot...</p>
        </Card>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-destructive">Snapshot not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Edit Dataset Snapshot
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Update dataset snapshot information
          </p>
        </div>

        <CardContent className="space-y-8 w-full p-0">
          {/* Show validation errors */}
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

          <FormProvider {...methods}>
            <MultiStepWizard
              currentStep={currentStep}
              steps={DATASET_SNAPSHOT_WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Update Snapshot"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditDatasetSnapshotWizard;

