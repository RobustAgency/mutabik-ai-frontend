"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { modelDatasetLinkSchema, type ModelDatasetLinkFormData } from "@/lib/schemas/modelDatasetLink.schema";
import {
  useGetModelDatasetLinkQuery,
  useUpdateModelDatasetLinkMutation,
  CreateModelDatasetLinkData,
} from "@/app/lib/features/modelDatasetLinksApi";
import { MODEL_DATASET_LINK_WIZARD_STEPS } from "../constants";
import { LinkIdentificationStep } from "../create/steps/LinkIdentificationStep";
import { TrainingDetailsStep } from "../create/steps/TrainingDetailsStep";
import { ComplianceChecksStep } from "../create/steps/ComplianceChecksStep";
import { GovernanceStatusStep } from "../create/steps/GovernanceStatusStep";

interface EditModelDatasetLinkWizardProps {
  linkId: number;
}

const EditModelDatasetLinkWizard: React.FC<EditModelDatasetLinkWizardProps> = ({ linkId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: link, isLoading: isLoadingLink } = useGetModelDatasetLinkQuery(linkId);
  const [updateLink, { isLoading }] = useUpdateModelDatasetLinkMutation();

  const methods = useForm<ModelDatasetLinkFormData>({
    resolver: zodResolver(modelDatasetLinkSchema) as any,
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
    if (link) {
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
        ai_model_id: link.ai_model_id,
        ai_model_version_id: link.ai_model_version_id,
        dataset_id: link.dataset_id,
        dataset_snapshot_id: link.dataset_snapshot_id || null,
        role: link.role,
        rows_used: link.rows_used || null,
        training_start_date: formatDateForInput(link.training_start_date),
        training_end_date: formatDateForInput(link.training_end_date),
        training_duration: link.training_duration || null,
        compute_resources: link.compute_resources || null,
        cost: link.cost || null,
        consent_check_status: link.consent_check_status || null,
        cross_border_check: link.cross_border_check,
        special_category_check: link.special_category_check,
        bias_mitigation_applied: link.bias_mitigation_applied || null,
        created_by_system: link.created_by_system,
        linkage_status: link.linkage_status,
        business_justification: link.business_justification || null,
      });
    }
  }, [link, reset]);

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
      const updateData: CreateModelDatasetLinkData = {
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
      await updateLink({
        id: linkId,
        data: updateData,
      }).unwrap();
      router.push("/core-assets/data/model-links");
    } catch (error: any) {
      console.error("Failed to update model-dataset link:", error);
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

  if (isLoadingLink) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-muted-foreground">Loading model-dataset link...</p>
        </Card>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <p className="text-center text-destructive">Model-dataset link not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Edit Model-Dataset Link
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Update model-dataset link information
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
              submitLabel="Update Link"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditModelDatasetLinkWizard;

