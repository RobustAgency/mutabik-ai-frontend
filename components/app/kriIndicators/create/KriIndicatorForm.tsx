"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  ActionOnBreach,
  AlertRouting,
  CollectionMethod,
  CreateKriIndicatorData,
  Directionality,
  Frequency,
  KriIndicator,
  KriStatus,
  UpdateKriIndicatorData,
} from "@/interfaces/KriIndicator";
import {
  validateTextField,
  validateNumericField,
  createValidationErrors,
} from "@/lib/utils/validation";

type FormMode = "create" | "edit";

type FormState = {
  ai_risk_register_id: string;
  name: string;
  definition: string;
  directionality: Directionality;
  unit: string;
  sample_window: string;
  threshold_warning: string;
  threshold_critical: string;
  data_source: string;
  collection_method: CollectionMethod;
  frequency: Frequency;
  alert_routing: AlertRouting;
  action_on_breach: ActionOnBreach;
  status: KriStatus;
  owner_team: string;
  notes: string;
};

const getInitialState = (initial?: KriIndicator): FormState => ({
  ai_risk_register_id: initial?.ai_risk_register_id?.toString() ?? "",
  name: initial?.name ?? "",
  definition: initial?.definition ?? "",
  directionality: initial?.directionality ?? Directionality.LOWER_IS_RISKIER,
  unit: initial?.unit ?? "",
  sample_window: initial?.sample_window ?? "",
  threshold_warning: initial?.threshold_warning?.toString() ?? "",
  threshold_critical: initial?.threshold_critical?.toString() ?? "",
  data_source: initial?.data_source ?? "",
  collection_method: initial?.collection_method ?? CollectionMethod.SCHEDULED_QUERY,
  frequency: initial?.frequency ?? Frequency.DAILY,
  alert_routing: initial?.alert_routing ?? AlertRouting.RISK_TEAM,
  action_on_breach: initial?.action_on_breach ?? ActionOnBreach.NOTIFY_ONLY,
  status: initial?.status ?? KriStatus.DRAFT,
  owner_team: initial?.owner_team ?? "",
  notes: initial?.notes ?? "",
});

interface KriIndicatorFormProps {
  mode: FormMode;
  initialData?: KriIndicator;
  serverErrors?: Record<string, string[]>;
  isSubmitting?: boolean;
  onSubmit: (
    payload: CreateKriIndicatorData | UpdateKriIndicatorData
  ) => Promise<void>;
}

export const KriIndicatorForm: React.FC<KriIndicatorFormProps> = ({
  mode,
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

  useEffect(() => {
    if (initialData) setFormState(getInitialState(initialData));
  }, [initialData]);

  const steps = [
    { id: 1, title: "Basic Info", description: "Indicator definition" },
    { id: 2, title: "Thresholds & Alerts", description: "Monitoring configuration" },
  ];

  const validateStep = (step: number): boolean => {
    const fieldErrors: Record<string, string[]> = {};

    if (step === 1) {
      fieldErrors.ai_risk_register_id = validateNumericField(
        formState.ai_risk_register_id,
        { required: true, integer: true, messages: { required: "Risk register ID is required" } }
      );
      fieldErrors.name = validateTextField(formState.name, {
        required: true,
        messages: { required: "Name is required" },
      });
      fieldErrors.definition = validateTextField(formState.definition, {
        required: true,
        messages: { required: "Definition is required" },
      });
      fieldErrors.sample_window = validateTextField(formState.sample_window, {
        required: true,
        messages: { required: "Sample window is required" },
      });
      fieldErrors.owner_team = validateTextField(formState.owner_team, {
        required: true,
        messages: { required: "Owner team is required" },
      });
    }

    if (step === 2) {
      fieldErrors.threshold_warning = validateNumericField(formState.threshold_warning, {
        required: true,
        messages: { required: "Warning threshold is required" },
      });
      fieldErrors.threshold_critical = validateNumericField(
        formState.threshold_critical,
        {
          required: true,
          messages: { required: "Critical threshold is required" },
        }
      );
      fieldErrors.data_source = validateTextField(formState.data_source, {
        required: true,
        messages: { required: "Data source is required" },
      });
    }

    const errors = createValidationErrors(fieldErrors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
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

  const parseNumber = (value: string) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const handleSubmit = async () => {
    setValidationErrors({});
    if (!validateStep(currentStep)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    } catch (_err) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const combinedErrors = { ...validationErrors, ...(serverErrors || {}) };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ai_risk_register_id">AI Risk Register ID *</Label>
                <Input
                  id="ai_risk_register_id"
                  type="number"
                  value={formState.ai_risk_register_id}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      ai_risk_register_id: e.target.value,
                    }))
                  }
                  placeholder="1"
                />
                {validationErrors.ai_risk_register_id && (
                  <p className="text-sm text-red-500">
                    {validationErrors.ai_risk_register_id[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Model Accuracy Degradation"
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="definition">Definition *</Label>
              <Textarea
                id="definition"
                value={formState.definition}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, definition: e.target.value }))
                }
                rows={3}
                placeholder="Tracks percentage decrease in model accuracy compared to baseline"
              />
              {validationErrors.definition && (
                <p className="text-sm text-red-500">{validationErrors.definition[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="directionality">Directionality *</Label>
                <select
                  id="directionality"
                  className="w-full border rounded-md h-10 px-3"
                  value={formState.directionality}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      directionality: e.target.value as Directionality,
                    }))
                  }
                >
                  {Object.values(Directionality).map((item) => (
                    <option key={item} value={item}>
                      {item.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formState.unit}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  placeholder="%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sample_window">Sample Window *</Label>
                <Input
                  id="sample_window"
                  value={formState.sample_window}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, sample_window: e.target.value }))
                  }
                  placeholder="Monthly"
                />
                {validationErrors.sample_window && (
                  <p className="text-sm text-red-500">{validationErrors.sample_window[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="owner_team">Owner Team *</Label>
                <Input
                  id="owner_team"
                  value={formState.owner_team}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, owner_team: e.target.value }))
                  }
                  placeholder="Data Science"
                />
                {validationErrors.owner_team && (
                  <p className="text-sm text-red-500">{validationErrors.owner_team[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  className="w-full border rounded-md h-10 px-3"
                  value={formState.status}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      status: e.target.value as KriStatus,
                    }))
                  }
                >
                  {Object.values(KriStatus).map((item) => (
                    <option key={item} value={item}>
                      {item.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="threshold_warning">Threshold Warning *</Label>
                <Input
                  id="threshold_warning"
                  type="number"
                  value={formState.threshold_warning}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      threshold_warning: e.target.value,
                    }))
                  }
                  placeholder="5"
                />
                {validationErrors.threshold_warning && (
                  <p className="text-sm text-red-500">
                    {validationErrors.threshold_warning[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold_critical">Threshold Critical *</Label>
                <Input
                  id="threshold_critical"
                  type="number"
                  value={formState.threshold_critical}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      threshold_critical: e.target.value,
                    }))
                  }
                  placeholder="10"
                />
                {validationErrors.threshold_critical && (
                  <p className="text-sm text-red-500">
                    {validationErrors.threshold_critical[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="data_source">Data Source *</Label>
                <Input
                  id="data_source"
                  value={formState.data_source}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, data_source: e.target.value }))
                  }
                  placeholder="Model Performance Dashboard"
                />
                {validationErrors.data_source && (
                  <p className="text-sm text-red-500">{validationErrors.data_source[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="collection_method">Collection Method *</Label>
                <select
                  id="collection_method"
                  className="w-full border rounded-md h-10 px-3"
                  value={formState.collection_method}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      collection_method: e.target.value as CollectionMethod,
                    }))
                  }
                >
                  {Object.values(CollectionMethod).map((item) => (
                    <option key={item} value={item}>
                      {item.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <select
                  id="frequency"
                  className="w-full border rounded-md h-10 px-3"
                  value={formState.frequency}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      frequency: e.target.value as Frequency,
                    }))
                  }
                >
                  {Object.values(Frequency).map((item) => (
                    <option key={item} value={item}>
                      {item.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert_routing">Alert Routing *</Label>
                <select
                  id="alert_routing"
                  className="w-full border rounded-md h-10 px-3"
                  value={formState.alert_routing}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      alert_routing: e.target.value as AlertRouting,
                    }))
                  }
                >
                  {Object.values(AlertRouting).map((item) => (
                    <option key={item} value={item}>
                      {item.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="action_on_breach">Action on Breach *</Label>
                <select
                  id="action_on_breach"
                  className="w-full border rounded-md h-10 px-3"
                  value={formState.action_on_breach}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      action_on_breach: e.target.value as ActionOnBreach,
                    }))
                  }
                >
                  {Object.values(ActionOnBreach).map((item) => (
                    <option key={item} value={item}>
                      {item.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formState.notes}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={3}
                  placeholder="Additional context for alert handling"
                />
              </div>
            </div>
          </div>
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

