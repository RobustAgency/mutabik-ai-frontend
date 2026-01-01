"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { modelDatasetLinkSchema, type ModelDatasetLinkFormData } from "@/lib/schemas/modelDatasetLink.schema";
import {
  useCreateModelDatasetLinkMutation,
  CreateModelDatasetLinkData,
  Role,
  CrossBorderCheck,
  SpecialCategoryCheck,
  CreatedBy,
  LinkageStatus,
} from "@/app/lib/features/modelDatasetLinksApi";
import { MODEL_DATASET_LINK_WIZARD_STEPS } from "../constants";
import { LinkIdentificationStep } from "./steps/LinkIdentificationStep";
import { TrainingDetailsStep } from "./steps/TrainingDetailsStep";
import { ComplianceChecksStep } from "./steps/ComplianceChecksStep";
import { GovernanceStatusStep } from "./steps/GovernanceStatusStep";

const initialFormData: Partial<ModelDatasetLinkFormData> = {
  ai_model_id: 0 as any,
  ai_model_version_id: 0 as any,
  dataset_id: 0 as any,
  dataset_snapshot_id: null,
  role: Role.TRAIN,
  rows_used: null,
  training_start_date: null,
  training_end_date: null,
  training_duration: null,
  compute_resources: null,
  cost: null,
  consent_check_status: null,
  cross_border_check: CrossBorderCheck.NOT_APPLICABLE,
  special_category_check: SpecialCategoryCheck.NOT_APPLICABLE,
  bias_mitigation_applied: null,
  created_by_system: CreatedBy.DATA_ENGINEERING_TEAM,
  linkage_status: LinkageStatus.PENDING_APPROVAL,
  business_justification: null,
};

const CreateModelDatasetLinkWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createLink, { isLoading }] = useCreateModelDatasetLinkMutation();

  const methods = useForm<ModelDatasetLinkFormData>({
    resolver: zodResolver(modelDatasetLinkSchema) as any,
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
        return await trigger([
          "ai_model_id",
          "ai_model_version_id",
          "dataset_id",
          "dataset_snapshot_id",
          "role",
        ]);
      case 2:
        // Training details - all optional, but validate training_end_date if both dates are provided
        return await trigger(["training_end_date"]);
      case 3:
        return await trigger(["cross_border_check", "special_category_check"]);
      case 4:
        return await trigger(["created_by_system", "linkage_status"]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, MODEL_DATASET_LINK_WIZARD_STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit(async (data: ModelDatasetLinkFormData) => {
    try {
      const createData: CreateModelDatasetLinkData = {
        ai_model_id: data.ai_model_id,
        ai_model_version_id: data.ai_model_version_id,
        dataset_id: data.dataset_id,
        dataset_snapshot_id: data.dataset_snapshot_id || null,
        role: data.role,
        rows_used: data.rows_used || null,
        training_start_date: data.training_start_date || null,
        training_end_date: data.training_end_date || null,
        training_duration: data.training_duration || null,
        compute_resources: data.compute_resources || null,
        cost: data.cost || null,
        consent_check_status: data.consent_check_status || null,
        cross_border_check: data.cross_border_check,
        special_category_check: data.special_category_check,
        bias_mitigation_applied: data.bias_mitigation_applied || null,
        created_by_system: data.created_by_system,
        linkage_status: data.linkage_status,
        business_justification: data.business_justification || null,
      };
      await createLink(createData).unwrap();
      router.push("/core-assets/data/model-links");
    } catch (error: any) {
      console.error("Failed to create model-dataset link:", error);
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <LinkIdentificationStep />;
      case 2:
        return <TrainingDetailsStep />;
      case 3:
        return <ComplianceChecksStep />;
      case 4:
        return <GovernanceStatusStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Create Model-Dataset Link
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Establish traceability between AI models and data snapshots
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
              steps={MODEL_DATASET_LINK_WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Create Link"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateModelDatasetLinkWizard;

