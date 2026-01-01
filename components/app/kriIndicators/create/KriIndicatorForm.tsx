"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  CreateKriIndicatorData,
  KriIndicator,
  UpdateKriIndicatorData,
} from "@/interfaces/KriIndicator";
import { useGetAiRiskRegistersQuery } from "@/app/lib/features/aiRiskRegisterApi";
import { useGetDataSourcesQuery } from "@/app/lib/features/dataSourcesApi";
import { FormState, getInitialState } from "./types";
import { validateStep } from "./validation";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { ThresholdsAlertsStep } from "./steps/ThresholdsAlertsStep";

interface KriIndicatorFormProps {
  initialData?: KriIndicator;
  serverErrors?: Record<string, string[]>;
  isSubmitting?: boolean;
  onSubmit: (
    payload: CreateKriIndicatorData | UpdateKriIndicatorData
  ) => Promise<void>;
}

export const KriIndicatorForm: React.FC<KriIndicatorFormProps> = ({
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
  const { data: aiRiskRegistersData, isLoading: isAiRiskRegistersLoading } =
    useGetAiRiskRegistersQuery({ per_page: 100 });
  const aiRiskRegisters = aiRiskRegistersData?.data ?? [];
  const { data: dataSourcesData, isLoading: isDataSourcesLoading } =
    useGetDataSourcesQuery({});
  const dataSources = dataSourcesData?.data || [];

  useEffect(() => {
    if (initialData) {
      setFormState(getInitialState(initialData));
    }
  }, [initialData]);

  // Sync data_source_id when data sources are loaded and we have initial data
  useEffect(() => {
    if (initialData?.data_source && dataSources.length > 0) {
      const matchingSource =
        dataSources.find(
          (source: any) => source.name === initialData.data_source
        ) ||
        dataSources.find(
          (source: any) => String(source.id) === String(initialData.data_source)
        );

      if (matchingSource && !formState.data_source_id) {
        setFormState((prev) => ({
          ...prev,
          data_source_id: String(matchingSource.id),
          data_source: matchingSource.name ?? prev.data_source,
        }));
      }
    }
  }, [dataSources, initialData, formState.data_source_id, formState.data_source]);

  const steps = [
    { id: 1, title: "Basic Info", description: "Indicator definition" },
    { id: 2, title: "Thresholds & Alerts", description: "Monitoring configuration" },
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

    const payload: CreateKriIndicatorData | UpdateKriIndicatorData = {
      ai_risk_register_id: Number(formState.ai_risk_register_id),
      name: formState.name.trim(),
      definition: formState.definition.trim(),
      directionality: formState.directionality,
      unit: formState.unit.trim() || undefined,
      sample_window: formState.sample_window.trim(),
      threshold_warning: Number(formState.threshold_warning),
      threshold_critical: Number(formState.threshold_critical),
      data_source: formState.data_source.trim(),
      collection_method: formState.collection_method,
      frequency: formState.frequency,
      alert_routing: formState.alert_routing,
      action_on_breach: formState.action_on_breach,
      status: formState.status,
      owner_team: formState.owner_team.trim(),
      notes: formState.notes.trim() || undefined,
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
          <BasicInfoStep
            formState={formState}
            setFormState={setFormState}
            validationErrors={validationErrors}
            aiRiskRegisters={aiRiskRegisters}
            isAiRiskRegistersLoading={isAiRiskRegistersLoading}
          />
        );
      case 2:
        return (
          <ThresholdsAlertsStep
            formState={formState}
            setFormState={setFormState}
            validationErrors={validationErrors}
            dataSources={dataSources}
            isDataSourcesLoading={isDataSourcesLoading}
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

export default KriIndicatorForm;

