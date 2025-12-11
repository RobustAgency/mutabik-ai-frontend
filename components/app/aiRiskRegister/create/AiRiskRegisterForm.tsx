"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  AiRiskRegister,
  CreateAiRiskRegisterData,
  UpdateAiRiskRegisterData,
} from "@/interfaces/AiRiskRegister";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import { useGetAiModelVersionsQuery } from "@/app/lib/features/aiModelVersionsApi";
import { useGetUseCasesQuery } from "@/app/lib/features/useCasesApi";
import { useGetCorrectivePreventiveActionsQuery } from "@/app/lib/features/correctivePreventiveActionsApi";
import { useGetRiskMethodologiesQuery } from "@/app/lib/features/riskMethodologyApi";
import { useGetAiIncidentsQuery } from "@/app/lib/features/aiIncidentsApi";
import { FormState, getInitialState } from "./types";
import { validateStep, parseNumber } from "./validation";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { RiskAssessmentStep } from "./steps/RiskAssessmentStep";
import { OwnershipReviewStep } from "./steps/OwnershipReviewStep";
import { LinksEvidenceStep } from "./steps/LinksEvidenceStep";

interface AiRiskRegisterFormProps {
  initialData?: AiRiskRegister;
  serverErrors?: Record<string, string[]>;
  isSubmitting?: boolean;
  onSubmit: (
    payload: CreateAiRiskRegisterData | UpdateAiRiskRegisterData
  ) => Promise<void>;
}

export const AiRiskRegisterForm: React.FC<AiRiskRegisterFormProps> = ({
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

  // Fetch data for dropdowns
  const { data: aiModels = [], isLoading: isModelsLoading } = useGetAiModelsQuery();
  const selectedModelId = formState.ai_model_id ? Number(formState.ai_model_id) : undefined;
  const { data: modelVersionsData = [], isLoading: isVersionsLoading } = useGetAiModelVersionsQuery(
    selectedModelId ? { ai_model_id: selectedModelId } : undefined,
    { skip: !selectedModelId }
  );
  const { data: useCases = [], isLoading: isUseCasesLoading } = useGetUseCasesQuery();
  const { data: capasData, isLoading: isCapasLoading } = useGetCorrectivePreventiveActionsQuery();
  const capas = capasData?.data ?? [];
  const { data: incidentsData, isLoading: isIncidentsLoading } = useGetAiIncidentsQuery();
  const incidents = incidentsData?.data ?? [];
  const { data: riskMethodologiesData, isLoading: isRiskMethodologiesLoading } = useGetRiskMethodologiesQuery();
  const riskMethodologies = riskMethodologiesData?.data ?? [];

  // Filter model versions based on selected model
  const filteredVersions = useMemo(() => {
    if (!selectedModelId) return [];
    return modelVersionsData.filter((version: any) => 
      String(version.ai_model_id) === String(selectedModelId)
    );
  }, [modelVersionsData, selectedModelId]);

  useEffect(() => {
    if (initialData) {
      setFormState(getInitialState(initialData));
    }
  }, [initialData]);

  const steps = [
    { id: 1, title: "Basic Information", description: "Core risk details" },
    { id: 2, title: "Risk Assessment", description: "Risk scoring & evaluation" },
    { id: 3, title: "Ownership & Review", description: "Risk ownership & review schedule" },
    { id: 4, title: "Links & Evidence", description: "Related items & evidence" },
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

  const validateForm = (): boolean => {
    let isValid = true;
    for (let step = 1; step <= steps.length; step++) {
      if (!handleValidateStep(step)) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const handlePrevious = () => {
    setValidationErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleSubmit = async () => {
    setValidationErrors({});
    
    // Validate entire form
    if (!validateForm()) {
      // Find first step with errors
      for (let step = 1; step <= steps.length; step++) {
        if (!handleValidateStep(step)) {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }
      return;
    }

    const payload: CreateAiRiskRegisterData | UpdateAiRiskRegisterData = {
      title: formState.title.trim(),
      risk_category: formState.risk_category,
      ai_model_id: formState.ai_model_id ? Number(formState.ai_model_id) : 0,
      ai_model_version_id: formState.ai_model_version_id ? parseNumber(formState.ai_model_version_id) : undefined,
      use_case_id: formState.use_case_id ? parseNumber(formState.use_case_id) : undefined,
      description: formState.description.trim(),
      related_controls: formState.related_controls
        ? formState.related_controls.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
      risk_methodology_id: Number(formState.risk_methodology_id),
      likelihood_code: formState.likelihood_code.trim(),
      impact_code: formState.impact_code.trim(),
      inherent_score: formState.inherent_score.trim() || undefined,
      residual_score: formState.residual_score.trim() || undefined,
      risk_level: formState.risk_level,
      decision: formState.decision,
      risk_owner: Number(formState.risk_owner),
      review_cadence: formState.review_cadence,
      next_review_due: formState.next_review_due,
      status: formState.status,
      linked_assessment_id: formState.linked_assessment_id ? parseNumber(formState.linked_assessment_id) : undefined,
      linked_incident_id: formState.linked_incident_id ? parseNumber(formState.linked_incident_id) : undefined,
      linked_capa_id: formState.linked_capa_id ? parseNumber(formState.linked_capa_id) : undefined,
      evidence_link: formState.evidence_link.trim() || undefined,
      likelihood_label_snapshot: formState.likelihood_label_snapshot.trim() || undefined,
      impact_label_snapshot: formState.impact_label_snapshot.trim() || undefined,
      method_name_snapshot: formState.method_name_snapshot.trim() || undefined,
      created_by: formState.created_by.trim(),
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
          <BasicInformationStep
            formState={formState}
            setFormState={setFormState}
            validationErrors={validationErrors}
            aiModels={aiModels}
            isModelsLoading={isModelsLoading}
            filteredVersions={filteredVersions}
            isVersionsLoading={isVersionsLoading}
            useCases={useCases}
            isUseCasesLoading={isUseCasesLoading}
          />
        );
      case 2:
        return (
          <RiskAssessmentStep
            formState={formState}
            setFormState={setFormState}
            validationErrors={validationErrors}
            riskMethodologies={riskMethodologies}
            isRiskMethodologiesLoading={isRiskMethodologiesLoading}
          />
        );
      case 3:
        return (
          <OwnershipReviewStep
            formState={formState}
            setFormState={setFormState}
            validationErrors={validationErrors}
          />
        );
      case 4:
        return (
          <LinksEvidenceStep
            formState={formState}
            setFormState={setFormState}
            validationErrors={validationErrors}
            incidents={incidents}
            isIncidentsLoading={isIncidentsLoading}
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
        >
          {renderStepContent()}
        </MultiStepWizard>
      </CardContent>
    </Card>
  );
};

export default AiRiskRegisterForm;

