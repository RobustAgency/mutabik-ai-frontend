"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  correctivePreventiveActionSchema,
  type CorrectivePreventiveActionFormData,
} from "@/lib/schemas/correctivePreventiveAction.schema";
import {
  useGetCorrectivePreventiveActionQuery,
  useUpdateCorrectivePreventiveActionMutation,
  CreateCorrectivePreventiveActionData,
  Status,
} from "@/app/lib/features/correctivePreventiveActionsApi";
import { SourceInfoStep } from "../create/steps/SourceInfoStep";
import { CAPADetailsStep } from "../create/steps/CAPADetailsStep";
import { AssignmentStep } from "../create/steps/AssignmentStep";
import { VerificationStep } from "../create/steps/VerificationStep";
import { CAPA_WIZARD_STEPS } from "../constants";

interface EditCAPAWizardProps {
  capaId: number;
}

const EditCAPAWizard: React.FC<EditCAPAWizardProps> = ({ capaId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: capa, isLoading: isLoadingCAPA } =
    useGetCorrectivePreventiveActionQuery(capaId);
  const [updateCAPA, { isLoading }] = useUpdateCorrectivePreventiveActionMutation();

  const methods = useForm<CorrectivePreventiveActionFormData>({
    resolver: zodResolver(correctivePreventiveActionSchema) as any,
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
    if (capa) {
      // Format date for input field
      const formatDateForInput = (
        dateString: string | null | undefined
      ): string => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        } catch {
          return "";
        }
      };

      reset({
        source_type: capa.source_type,
        source_reference: capa.source_reference,
        ai_model_id: capa.ai_model_id || null,
        dataset_id: capa.dataset_id || null,
        title: capa.title,
        capa_type: capa.capa_type,
        priority: capa.priority,
        root_cause: capa.root_cause || null,
        actions: capa.actions,
        owner_team: capa.owner_team,
        assignee: capa.assignee || null,
        due_date: formatDateForInput(capa.due_date),
        status: capa.status,
        success_criteria: capa.success_criteria || null,
        linked_training: capa.linked_training || null,
        estimated_cost: capa.estimated_cost ? Number(capa.estimated_cost) : null,
        verification_result: capa.verification_result || null,
        effectiveness_review_date: formatDateForInput(capa.effectiveness_review_date),
        evidence_link: capa.evidence_link || null,
      });
    }
  }, [capa, reset]);

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(["source_type", "source_reference"]);
      case 2:
        return await trigger(["title", "capa_type", "priority", "actions"]);
      case 3:
        return await trigger(["owner_team", "due_date", "status"]);
      case 4:
        // Check if status is CLOSED, then verification_result is required
        const status = methods.getValues("status");
        if (status === Status.CLOSED) {
          return await trigger(["verification_result"]);
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, CAPA_WIZARD_STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit(
    async (data: CorrectivePreventiveActionFormData) => {
      try {
        // Convert CorrectivePreventiveActionFormData to CreateCorrectivePreventiveActionData
        const updateData: CreateCorrectivePreventiveActionData = {
          source_type: data.source_type,
          source_reference: data.source_reference,
          ai_model_id: data.ai_model_id || null,
          dataset_id: data.dataset_id || null,
          title: data.title,
          capa_type: data.capa_type,
          priority: data.priority,
          root_cause: data.root_cause || null,
          actions: data.actions,
          owner_team: data.owner_team,
          assignee: data.assignee || null,
          due_date: data.due_date,
          status: data.status,
          success_criteria: data.success_criteria || null,
          linked_training: data.linked_training || null,
          estimated_cost: data.estimated_cost || null,
          verification_result: data.verification_result || null,
          effectiveness_review_date: data.effectiveness_review_date || null,
          evidence_link: data.evidence_link || null,
        };
        await updateCAPA({
          id: capaId,
          data: updateData,
        }).unwrap();
        router.push("/governance/incidents/capa");
      } catch (error: any) {
        console.error("Failed to update CAPA:", error);
      }
    }
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SourceInfoStep />;
      case 2:
        return <CAPADetailsStep />;
      case 3:
        return <AssignmentStep />;
      case 4:
        return <VerificationStep />;
      default:
        return null;
    }
  };

  if (isLoadingCAPA) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="text-center py-12">
            <p className="text-[#667085]">Loading CAPA data...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Edit Corrective/Preventive Action
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Update the CAPA information
          </p>
        </div>

        <CardContent className="space-y-8 w-full p-0">
          {/* Show validation errors */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">
                  Please fix the following errors:
                </p>
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
              steps={CAPA_WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Update CAPA"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCAPAWizard;

