"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type {
  DataProtectionImpactAssessment,
  CreateDPIAData,
} from "@/interfaces/DataProtectionImpactAssessment";
import {
  dpiaSchema,
  type DPIAFormData,
} from "@/lib/schemas/dpia.schema";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { BasicInfoStep } from "../steps/BasicInfoStep";
import { RiskOverviewStep } from "../steps/RiskOverviewStep";
import { NecessityProportionalityStep } from "../steps/NecessityProportionalityStep";
import { RiskMitigationStep } from "../steps/RiskMitigationStep";
import { DPOConsultationStep } from "../steps/DPOConsultationStep";
import { ApprovalReviewStep } from "../steps/ApprovalReviewStep";

const WIZARD_STEPS = [
  { id: 1, title: "Basic Info & Links", description: "Context & linked assets" },
  { id: 2, title: "Risk Overview", description: "Risk level & score" },
  { id: 3, title: "Necessity & Proportionality", description: "Justification" },
  { id: 4, title: "Risks & Mitigation", description: "Risks & measures" },
  { id: 5, title: "DPO Consultation", description: "DPO input" },
  { id: 6, title: "Approval & Review", description: "Decision & schedule" },
];

const initialFormData: DPIAFormData = {
  dpia_name: "",
  ropa_id: 0,
  linked_ai_model_id: null,
  linked_asset_type: "ai_model",
  automated_trigger: false,
  trigger_reason: "",
  risk_level: "medium",
  risk_score: 10,
  stage: "necessity",
  completion_percentage: 0,
  necessity_justification: "",
  proportionality_assessment: "",
  alternatives_considered: "",
  identified_risks: "",
  likelihood_assessment: "",
  impact_assessment: "",
  mitigation_measures: "",
  residual_risk_level: null,
  dpo_consulted: false,
  dpo_consultation_date: null,
  dpo_advice: "",
  dpo_user_id: null,
  stakeholders_consulted: [],
  stakeholder_feedback: "",
  data_subjects_consulted: false,
  consultation_method: "",
  final_decision: null,
  approval_date: null,
  approved_by: null,
  conditions: "",
  status: "draft",
  review_frequency_months: 12,
  applicable_jurisdictions: [],
};

const stepFields: Record<number, (keyof DPIAFormData)[]> = {
  1: ["dpia_name", "ropa_id", "linked_asset_type", "automated_trigger", "trigger_reason"],
  2: ["risk_level", "risk_score", "stage", "completion_percentage"],
  3: ["necessity_justification", "proportionality_assessment", "alternatives_considered"],
  4: ["identified_risks", "likelihood_assessment", "impact_assessment", "mitigation_measures"],
  5: [],
  6: ["status", "review_frequency_months", "applicable_jurisdictions"],
};

interface DPIAFormProps {
  mode: "create" | "edit";
  initialData?: DataProtectionImpactAssessment;
  isLoading?: boolean;
  onSubmit: (data: CreateDPIAData | Partial<CreateDPIAData>) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
  hideHeader?: boolean;
}

export const DPIAForm: React.FC<DPIAFormProps> = ({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onSuccess,
  title,
  description,
  hideHeader = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm<DPIAFormData>({
    resolver: zodResolver(dpiaSchema) as any,
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        dpia_name: initialData.dpia_name,
        ropa_id: initialData.ropa_id,
        linked_ai_model_id: initialData.linked_ai_model_id,
        linked_asset_type: initialData.linked_asset_type,
        automated_trigger: initialData.automated_trigger,
        trigger_reason: initialData.trigger_reason,
        risk_level: initialData.risk_level,
        risk_score: initialData.risk_score,
        stage: initialData.stage,
        completion_percentage: initialData.completion_percentage,
        necessity_justification: initialData.necessity_justification || "",
        proportionality_assessment: initialData.proportionality_assessment,
        alternatives_considered: initialData.alternatives_considered,
        identified_risks: initialData.identified_risks || "",
        likelihood_assessment: initialData.likelihood_assessment,
        impact_assessment: initialData.impact_assessment,
        mitigation_measures: initialData.mitigation_measures || "",
        residual_risk_level: initialData.residual_risk_level,
        dpo_consulted: initialData.dpo_consulted ?? false,
        dpo_consultation_date: initialData.dpo_consultation_date
          ? initialData.dpo_consultation_date.split("T")[0]
          : null,
        dpo_advice: initialData.dpo_advice || "",
        dpo_user_id: initialData.dpo_user_id,
        stakeholders_consulted: initialData.stakeholders_consulted || [],
        stakeholder_feedback: initialData.stakeholder_feedback || "",
        data_subjects_consulted: initialData.data_subjects_consulted,
        consultation_method: initialData.consultation_method || "",
        final_decision: initialData.final_decision,
        approval_date: initialData.approval_date
          ? initialData.approval_date.split("T")[0]
          : null,
        approved_by: initialData.approved_by,
        conditions: initialData.conditions || "",
        status: initialData.status,
        review_frequency_months: initialData.review_frequency_months,
        applicable_jurisdictions: initialData.applicable_jurisdictions as any,
      });
    }
  }, [mode, initialData, reset]);

  const handleValidateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate = stepFields[step];
    
    // Special handling for step 5 (DPO Consultation)
    if (step === 5) {
      const dpoConsulted = methods.getValues("dpo_consulted");
      if (dpoConsulted) {
        // If DPO is consulted, validate all DPO fields
        const dpoFields: (keyof DPIAFormData)[] = [
          "dpo_user_id",
          "dpo_consultation_date",
          "consultation_method",
          "dpo_advice",
        ];
        const isValid = await trigger(dpoFields as any);
        return isValid;
      }
      // If DPO is not consulted, step is valid
      return true;
    }
    
    if (fieldsToValidate.length === 0) return true;

    const isValid = await trigger(fieldsToValidate as any);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await handleValidateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    const payload: CreateDPIAData | Partial<CreateDPIAData> = {
      dpia_name: data.dpia_name.trim(),
      ropa_id: data.ropa_id,
      linked_ai_model_id: data.linked_ai_model_id || null,
      linked_asset_type: data.linked_asset_type,
      automated_trigger: data.automated_trigger,
      trigger_reason: data.trigger_reason.trim(),
      risk_level: data.risk_level,
      risk_score: data.risk_score,
      stage: data.stage,
      completion_percentage: data.completion_percentage,
      necessity_justification: data.necessity_justification?.trim() || null,
      proportionality_assessment: data.proportionality_assessment.trim(),
      alternatives_considered: data.alternatives_considered.trim(),
      identified_risks: data.identified_risks?.trim() || null,
      likelihood_assessment: data.likelihood_assessment.trim(),
      impact_assessment: data.impact_assessment.trim(),
      mitigation_measures: data.mitigation_measures?.trim() || null,
      residual_risk_level: data.residual_risk_level || null,
      dpo_consulted: data.dpo_consulted ?? null,
      dpo_consultation_date: data.dpo_consultation_date || null,
      dpo_advice: data.dpo_advice?.trim() || null,
      dpo_user_id: data.dpo_user_id || null,
      stakeholders_consulted: data.stakeholders_consulted || [],
      stakeholder_feedback: data.stakeholder_feedback?.trim() || null,
      data_subjects_consulted: data.data_subjects_consulted,
      consultation_method: data.consultation_method?.trim() || null,
      final_decision: data.final_decision || null,
      approval_date: data.approval_date || null,
      approved_by: data.approved_by || null,
      conditions: data.conditions?.trim() || null,
      status: data.status,
      review_frequency_months: data.review_frequency_months,
      applicable_jurisdictions: data.applicable_jurisdictions,
    };

    try {
      await onSubmit(payload);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        Object.entries(err.data.errors).forEach(
          ([field, fieldErrors]: [string, any]) => {
            methods.setError(field as any, {
              type: "server",
              message: Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors,
            });
          }
        );

        for (let step = 1; step <= WIZARD_STEPS.length; step++) {
          const stepFieldsToCheck = stepFields[step];
          const hasError = stepFieldsToCheck.some((field) => errors[field]);
          if (hasError) {
            setCurrentStep(step);
            break;
          }
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  });

  const validationErrors: Record<string, string[]> = {};
  Object.entries(errors).forEach(([key, error]) => {
    if (error?.message) {
      validationErrors[key] = [error.message as string];
    }
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <RiskOverviewStep />;
      case 3:
        return <NecessityProportionalityStep />;
      case 4:
        return <RiskMitigationStep />;
      case 5:
        return <DPOConsultationStep />;
      case 6:
        return <ApprovalReviewStep />;
      default:
        return null;
    }
  };

  const containerClass = hideHeader
    ? "w-full"
    : "max-w-7xl mx-auto px-4 py-6";

  const cardClass = hideHeader
    ? "border-0 shadow-none p-0"
    : "p-6 border-[#E4E7EC] shadow-none";

  const contentClass = hideHeader
    ? "space-y-4 w-full p-0"
    : "space-y-8 w-full p-0";

  return (
    <div className={containerClass}>
      <FormProvider {...methods}>
        <Card className={cardClass}>
          {!hideHeader && (
            <div className="mb-6">
              <h1 className="font-sans font-semibold text-2xl tracking-normal text-[#1D2939]">
                {title}
              </h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085] mt-1">
                {description}
              </p>
            </div>
          )}

          <CardContent className={contentClass}>
            {Object.keys(validationErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">
                    Please fix the following errors:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(validationErrors).map(
                      ([field, fieldErrors]) => (
                        <li key={field}>
                          <span className="font-medium capitalize">
                            {field.replace(/_/g, " ")}:
                          </span>{" "}
                          {fieldErrors[0]}
                        </li>
                      )
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <MultiStepWizard
              currentStep={currentStep}
              steps={WIZARD_STEPS}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              canProceed={true}
            >
              {renderStepContent()}
            </MultiStepWizard>
          </CardContent>
        </Card>
      </FormProvider>
    </div>
  );
};


