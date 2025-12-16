"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { getInitialState } from "./types";
import {
  aiRiskRegisterSchema,
  basicInformationSchema,
  riskAssessmentSchema,
  ownershipReviewSchema,
  type AiRiskRegisterFormData,
} from "@/lib/schemas/aiRiskRegister.schema";
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
  const [currentStep, setCurrentStep] = useState(1);

  // Initialize form with React Hook Form
  const initialFormState = getInitialState(initialData);
  const methods = useForm<AiRiskRegisterFormData>({
    resolver: zodResolver(aiRiskRegisterSchema),
    defaultValues: {
      ...initialFormState,
      // Ensure numeric fields are strings for form handling
      ai_model_id: initialFormState.ai_model_id || "",
      ai_model_version_id: initialFormState.ai_model_version_id || "",
      use_case_id: initialFormState.use_case_id || "",
      risk_methodology_id: initialFormState.risk_methodology_id || "",
      risk_owner: initialFormState.risk_owner || "",
      linked_assessment_id: initialFormState.linked_assessment_id || "",
      linked_incident_id: initialFormState.linked_incident_id || "",
      linked_capa_id: initialFormState.linked_capa_id || "",
      related_controls: initialFormState.related_controls || "",
      descriptionInput: initialFormState.descriptionInput || "",
    },
    mode: "onChange",
  });

  const { watch, trigger, formState: { errors } } = methods;
  const formValues = watch();

  // Fetch data for dropdowns
  const { data: aiModels = [], isLoading: isModelsLoading } = useGetAiModelsQuery();
  const selectedModelId = formValues.ai_model_id ? Number(formValues.ai_model_id) : undefined;
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

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      const state = getInitialState(initialData);
      methods.reset({
        ...state,
        ai_model_id: state.ai_model_id || "",
        ai_model_version_id: state.ai_model_version_id || "",
        use_case_id: state.use_case_id || "",
        risk_methodology_id: state.risk_methodology_id || "",
        risk_owner: state.risk_owner || "",
        linked_assessment_id: state.linked_assessment_id || "",
        linked_incident_id: state.linked_incident_id || "",
        linked_capa_id: state.linked_capa_id || "",
        related_controls: state.related_controls || "",
        descriptionInput: state.descriptionInput || "",
      });
    }
  }, [initialData, methods]);

  const steps = [
    { id: 1, title: "Basic Information", description: "Core risk details" },
    { id: 2, title: "Risk Assessment", description: "Risk scoring & evaluation" },
    { id: 3, title: "Ownership & Review", description: "Risk ownership & review schedule" },
    { id: 4, title: "Links & Evidence", description: "Related items & evidence" },
  ];

  // Field names for each step validation
  const stepFields: Record<number, (keyof AiRiskRegisterFormData)[]> = {
    1: ["title", "description", "risk_category", "status", "ai_model_id"],
    2: ["risk_methodology_id", "likelihood_code", "impact_code", "risk_level", "decision"],
    3: ["risk_owner", "review_cadence", "next_review_due", "created_by"],
    4: [], // Step 4 has no required fields
  };

  const handleValidateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate = stepFields[step];
    if (fieldsToValidate.length === 0) return true;
    
    const isValid = await trigger(fieldsToValidate as any);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await handleValidateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    // Helper to parse optional string IDs to numbers
    const parseOptionalId = (val: string | undefined): number | undefined => {
      if (!val || val.trim() === "" || val === "0") return undefined;
      const parsed = Number(val);
      return Number.isNaN(parsed) || parsed <= 0 ? undefined : parsed;
    };

    // Transform form data to API format (convert string IDs to numbers)
    const payload: CreateAiRiskRegisterData | UpdateAiRiskRegisterData = {
      title: data.title.trim(),
      risk_category: data.risk_category,
      ai_model_id: Number(data.ai_model_id),
      ai_model_version_id: parseOptionalId(data.ai_model_version_id),
      use_case_id: parseOptionalId(data.use_case_id),
      description: data.description.trim(),
      related_controls: data.related_controls
        ? data.related_controls.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
      risk_methodology_id: Number(data.risk_methodology_id),
      likelihood_code: data.likelihood_code.trim(),
      impact_code: data.impact_code.trim(),
      inherent_score: data.inherent_score?.trim() || undefined,
      residual_score: data.residual_score?.trim() || undefined,
      risk_level: data.risk_level,
      decision: data.decision,
      risk_owner: Number(data.risk_owner),
      review_cadence: data.review_cadence,
      next_review_due: data.next_review_due,
      status: data.status,
      linked_assessment_id: parseOptionalId(data.linked_assessment_id),
      linked_incident_id: parseOptionalId(data.linked_incident_id),
      linked_capa_id: parseOptionalId(data.linked_capa_id),
      evidence_link: data.evidence_link?.trim() || undefined,
      likelihood_label_snapshot: data.likelihood_label_snapshot?.trim() || undefined,
      impact_label_snapshot: data.impact_label_snapshot?.trim() || undefined,
      method_name_snapshot: data.method_name_snapshot?.trim() || undefined,
      created_by: data.created_by.trim(),
    };

    try {
      await onSubmit(payload);
    } catch {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Convert React Hook Form errors to the format expected by components
  const validationErrors: Record<string, string[]> = {};
  Object.entries(errors).forEach(([key, error]) => {
    if (error?.message) {
      validationErrors[key] = [error.message as string];
    }
  });
  const combinedErrors = { ...validationErrors, ...(serverErrors || {}) };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformationStep
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
            riskMethodologies={riskMethodologies}
            isRiskMethodologiesLoading={isRiskMethodologiesLoading}
          />
        );
      case 3:
        return <OwnershipReviewStep />;
      case 4:
        return (
          <LinksEvidenceStep
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
    <FormProvider {...methods}>
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent className="space-y-8 w-full p-0">
          {Object.keys(combinedErrors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Please fix the following errors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(combinedErrors).map(([field, fieldErrors]) => (
                    <li key={field}>
                      {field}: {fieldErrors[0]}
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
    </FormProvider>
  );
};

export default AiRiskRegisterForm;

