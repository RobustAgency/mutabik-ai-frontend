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
  incidentActionSchema,
  type IncidentActionFormData,
} from "@/lib/schemas/incidentAction.schema";
import {
  useGetIncidentActionQuery,
  useUpdateIncidentActionMutation,
  CreateIncidentActionData,
} from "@/app/lib/features/incidentActionsApi";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { ExecutionDetailsStep } from "../create/steps/ExecutionDetailsStep";
import { ValidationApprovalStep } from "../create/steps/ValidationApprovalStep";
import { AdditionalInfoStep } from "../create/steps/AdditionalInfoStep";
import { INCIDENT_ACTION_WIZARD_STEPS } from "../constants";

interface EditIncidentActionWizardProps {
  actionId: number;
}

const EditIncidentActionWizard: React.FC<EditIncidentActionWizardProps> = ({
  actionId,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { data: action, isLoading: isLoadingAction } =
    useGetIncidentActionQuery(actionId);
  const [updateAction, { isLoading }] = useUpdateIncidentActionMutation();

  const methods = useForm<IncidentActionFormData>({
    resolver: zodResolver(incidentActionSchema) as any,
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
    if (action) {
      // Format datetime for input fields
      const formatDateTimeForInput = (
        dateString: string | null | undefined
      ): string => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch {
          return "";
        }
      };

      reset({
        ai_incident_id: action.ai_incident_id,
        action_type: action.action_type,
        execution_status: action.execution_status,
        description: action.description,
        performed_by: action.performed_by,
        individual_name: action.individual_name || null,
        depends_on: action.depends_on || null,
        approval_required: action.approval_required || null,
        estimated_duration: action.estimated_duration || null,
        actual_duration: action.actual_duration || null,
        started_at: formatDateTimeForInput(action.started_at),
        completed_at: formatDateTimeForInput(action.completed_at),
        validation_result: action.validation_result,
        validation_notes: action.validation_notes || null,
        linked_release_id: action.linked_release_id || null,
        evidence_link: action.evidence_link || null,
      });
    }
  }, [action, reset]);

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
      const updateData: CreateIncidentActionData = {
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
      await updateAction({
        id: actionId,
        data: updateData,
      }).unwrap();
      router.push("/governance/incidents/actions");
    } catch (error: any) {
      console.error("Failed to update incident action:", error);
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

  if (isLoadingAction) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <div className="text-center py-12">
            <p className="text-[#667085]">Loading action data...</p>
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
            Edit Incident Action
          </h1>
          <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
            Update the incident action information
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
              submitLabel="Update Action"
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditIncidentActionWizard;

