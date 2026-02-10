"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  incidentActionSchema,
  type IncidentActionFormData,
} from "@/lib/schemas/incidentAction.schema";
import {
  useCreateIncidentActionMutation,
  CreateIncidentActionData,
  ActionType,
  ExecutionStatus,
  ValidationResult,
} from "@/app/lib/features/incidentActionsApi";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { ExecutionDetailsStep } from "./steps/ExecutionDetailsStep";
import { ValidationApprovalStep } from "./steps/ValidationApprovalStep";
import { AdditionalInfoStep } from "./steps/AdditionalInfoStep";
import { INCIDENT_ACTION_WIZARD_STEPS } from "../constants";

const initialFormData: IncidentActionFormData = {
  ai_incident_id: 0,
  action_type: ActionType.KILL_SWITCH,
  execution_status: ExecutionStatus.PLANNED,
  description: "",
  performed_by: 0,
  individual_name: null,
  depends_on: null,
  approval_required: null,
  estimated_duration: null,
  actual_duration: null,
  started_at: "",
  completed_at: null,
  validation_result: ValidationResult.PENDING,
  validation_notes: null,
  linked_release_id: null,
  evidence_link: null,
};

const CreateIncidentActionWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createAction, { isLoading }] = useCreateIncidentActionMutation();

  const methods = useForm<IncidentActionFormData>({
    resolver: zodResolver(incidentActionSchema) as any,
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
        return await trigger(["ai_incident_id", "action_type", "description"]);
      case 2:
        return await trigger([
          "execution_status",
          "performed_by",
          "started_at",
          "completed_at",
        ]);
      case 3:
        return await trigger(["validation_result"]);
      case 4:
        return true; // Additional info step doesn't need validation
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) =>
        Math.min(prev + 1, INCIDENT_ACTION_WIZARD_STEPS.length)
      );
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = handleSubmit(async (data: IncidentActionFormData) => {
    try {
      // Convert IncidentActionFormData to CreateIncidentActionData
      const createData: CreateIncidentActionData = {
        ai_incident_id: data.ai_incident_id,
        action_type: data.action_type,
        execution_status: data.execution_status,
        description: data.description,
        performed_by: data.performed_by,
        individual_name: data.individual_name || null,
        depends_on: data.depends_on || null,
        approval_required: data.approval_required || null,
        estimated_duration: data.estimated_duration || null,
        actual_duration: data.actual_duration || null,
        started_at: data.started_at,
        completed_at: data.completed_at || null,
        validation_result: data.validation_result,
        validation_notes: data.validation_notes || null,
        linked_release_id: data.linked_release_id || null,
        evidence_link: data.evidence_link || null,
      };
      await createAction(createData).unwrap();
      router.push("/governance/incidents/actions");
    } catch (error: any) {
      console.error("Failed to create incident action:", error);
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <ExecutionDetailsStep />;
      case 3:
        return <ValidationApprovalStep />;
      case 4:
        return <AdditionalInfoStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
            Create New Incident Action
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Complete all steps to create your incident action
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
              steps={INCIDENT_ACTION_WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
              submitLabel="Create Action"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateIncidentActionWizard;

