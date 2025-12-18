"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  AiRiskTreatment,
  CreateAiRiskTreatmentData,
  UpdateAiRiskTreatmentData,
} from "@/interfaces/AiRiskTreatment";
import { validateStep } from "./validation";
import { FormState, getInitialState } from "./types";
import { useGetAiRiskRegistersQuery } from "@/app/lib/features/aiRiskRegisterApi";
import { useGetStakeholdersQuery } from "@/app/lib/features/stakeholdersApi";
import { useGetCorrectivePreventiveActionsQuery } from "@/app/lib/features/correctivePreventiveActionsApi";
import { PlanStep } from "./steps/PlanStep";
import { ExecutionStep } from "./steps/ExecutionStep";

interface AiRiskTreatmentFormProps {
  initialData?: AiRiskTreatment;
  serverErrors?: Record<string, string[]>;
  isSubmitting?: boolean;
  onSubmit: (
    payload: CreateAiRiskTreatmentData | UpdateAiRiskTreatmentData
  ) => Promise<void>;
}

export const AiRiskTreatmentForm: React.FC<AiRiskTreatmentFormProps> = ({
  initialData,
  serverErrors,
  isSubmitting = false,
  onSubmit,
}) => {
  const [formState, setFormState] = useState<FormState>(getInitialState(initialData));
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>(
    {}
  );

  // Fetch dropdown data
  const { data: aiRiskRegistersData, isLoading: isAiRiskRegistersLoading } =
    useGetAiRiskRegistersQuery({ per_page: 100 });
  const aiRiskRegisters = aiRiskRegistersData?.data ?? [];

  const { data: stakeholders = [], isLoading: isStakeholdersLoading } =
    useGetStakeholdersQuery({ per_page: 100 });

  const { data: capasData, isLoading: isCapasLoading } =
    useGetCorrectivePreventiveActionsQuery();
  const capas = capasData?.data ?? [];

  useEffect(() => {
    if (initialData) setFormState(getInitialState(initialData));
  }, [initialData]);

  const steps = [
    { id: 1, title: "Plan", description: "Core treatment details" },
    { id: 2, title: "Execution", description: "Assignments & verification" },
  ];

  const handleValidateStep = (step: number): boolean => {
    const { isValid, errors } = validateStep(step, formState);
    setValidationErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (handleValidateStep(currentStep)) {
      setValidationErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    setValidationErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setValidationErrors({});
    // Validate entire form
    let isValid = true;
    for (let step = 1; step <= steps.length; step++) {
      if (!handleValidateStep(step)) {
        isValid = false;
        setCurrentStep(step);
        break;
      }
    }
    if (!isValid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload: CreateAiRiskTreatmentData | UpdateAiRiskTreatmentData = {
      ai_risk_register_id: Number(formState.ai_risk_register_id),
      treatment_type: formState.treatment_type,
      plan_summary: formState.plan_summary.trim(),
      owner_stakeholder_id: Number(formState.owner_stakeholder_id),
      assignee: formState.assignee
        ? formState.assignee.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
      due_date: formState.due_date,
      status: formState.status,
      expected_residual_level: formState.expected_residual_level.trim() || undefined,
      result_verification: formState.result_verification || undefined,
      evidence_link: formState.evidence_link.trim() || undefined,
      linked_capa_id: formState.linked_capa_id.trim() || undefined,
      closed_at: formState.closed_at || undefined,
    };

    try {
      await onSubmit(payload);
    } catch {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const combinedErrors = { ...validationErrors, ...(serverErrors || {}) };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PlanStep
            formState={formState}
            setFormState={setFormState}
            validationErrors={validationErrors}
            aiRiskRegisters={aiRiskRegisters}
            isAiRiskRegistersLoading={isAiRiskRegistersLoading}
            stakeholders={stakeholders}
            isStakeholdersLoading={isStakeholdersLoading}
          />
        );

      case 2:
        return (
          <ExecutionStep
            formState={formState}
            setFormState={setFormState}
            validationErrors={validationErrors}
            capas={capas}
            isCapasLoading={isCapasLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 border-[#E4E7EC] shadow-none">
      <CardContent className="space-y-8 w-full p-0">
        {Object.keys(combinedErrors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(combinedErrors).map(([field, errors]) => (
                  <li key={field}>
                    {field}: {errors[0]}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <MultiStepWizard
          currentStep={currentStep}
          steps={steps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          canProceed
          submitLabel={initialData ? "Update Treatment" : "Create Treatment"}
        >
          {renderStepContent()}
        </MultiStepWizard>
      </CardContent>
    </Card>
  );
};

export default AiRiskTreatmentForm;

