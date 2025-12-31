"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { datasetSchema, type DatasetFormData } from "@/lib/schemas/dataset.schema";
import {
  useCreateDatasetMutation,
  CreateDatasetData,
  Purpose,
  OwnerTeam,
  DataSteward,
  Status,
  ContainPersonalData,
  Sensitivity,
  CrossBorderTransfer,
} from "@/app/lib/features/datasetsApi";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { DatasetMetricsStep } from "./steps/DatasetMetricsStep";
import { PrivacyPostureStep } from "./steps/PrivacyPostureStep";
import { CrossBorderStep } from "./steps/CrossBorderStep";

const WIZARD_STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Dataset name, description, purpose, ownership, data sources, and status",
  },
  {
    id: 2,
    title: "Dataset Metrics",
    description: "Estimated row count, size, retention period, and primary languages",
  },
  {
    id: 3,
    title: "Privacy Posture",
    description: "Contains personal data and sensitivity level",
  },
  {
    id: 4,
    title: "Cross-Border & Licensing",
    description: "Cross-border transfer and license type",
  },
];

const initialFormData: DatasetFormData = {
  name: "",
  description: "",
  purpose: Purpose.AI_ML_TRAINING,
  owner_team: OwnerTeam.DATA_ENGINEERING_TEAM,
  data_steward: DataSteward.DATA_ENGINEER,
  source_ids: [],
  status: Status.DRAFT,
  estimated_row_count: null,
  estimated_size: null,
  size_unit: null,
  retention_period: null,
  primary_languages: null,
  contains_personal_data: ContainPersonalData.UNKNOWN,
  sensitivity: Sensitivity.INTERNAL,
  cross_border_transfer: CrossBorderTransfer.NONE,
  license_type: null,
};

const CreateDatasetWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createDataset, { isLoading }] = useCreateDatasetMutation();

  const methods = useForm<DatasetFormData>({
    resolver: zodResolver(datasetSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(["name", "description", "purpose", "owner_team", "data_steward", "source_ids", "status"]);
      case 2:
        return await trigger(["estimated_row_count", "estimated_size", "size_unit", "retention_period", "primary_languages"]);
      case 3:
        return await trigger(["contains_personal_data", "sensitivity"]);
      case 4:
        return await trigger(["cross_border_transfer"]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit(async (data: DatasetFormData) => {
    try {
      // Convert DatasetFormData to CreateDatasetData
      const createData: CreateDatasetData = {
        name: data.name,
        description: data.description || null,
        purpose: data.purpose,
        owner_team: data.owner_team,
        data_steward: data.data_steward,
        source_ids: data.source_ids,
        status: data.status,
        estimated_row_count: data.estimated_row_count || null,
        estimated_size: data.estimated_size || null,
        size_unit: data.size_unit || null,
        retention_period: data.retention_period || null,
        primary_languages: data.primary_languages || null,
        contains_personal_data: data.contains_personal_data,
        sensitivity: data.sensitivity,
        cross_border_transfer: data.cross_border_transfer,
        license_type: data.license_type || null,
      };
      await createDataset(createData).unwrap();
      router.push("/core-assets/data/registry");
    } catch (error: any) {
      console.error("Failed to create dataset:", error);
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <DatasetMetricsStep />;
      case 3:
        return <PrivacyPostureStep />;
      case 4:
        return <CrossBorderStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Create New Dataset
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to create your dataset
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
              steps={WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Create Dataset"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDatasetWizard;

