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
  AiRiskTreatment,
  CreateAiRiskTreatmentData,
  ResultVerification,
  TreatmentStatus,
  TreatmentType,
  UpdateAiRiskTreatmentData,
} from "@/interfaces/AiRiskTreatment";
import {
  validateTextField,
  validateNumericField,
  createValidationErrors,
} from "@/lib/utils/validation";

type FormMode = "create" | "edit";

type FormState = {
  ai_risk_register_id: string;
  treatment_type: TreatmentType;
  plan_summary: string;
  owner_stakeholder_id: string;
  assignee: string;
  due_date: string;
  status: TreatmentStatus;
  expected_residual_level: string;
  result_verification: ResultVerification | "";
  evidence_link: string;
  linked_capa_id: string;
  closed_at: string;
};

const getInitialState = (initial?: AiRiskTreatment): FormState => ({
  ai_risk_register_id: initial?.ai_risk_register_id?.toString() ?? "",
  treatment_type: initial?.treatment_type ?? TreatmentType.CORRECTIVE,
  plan_summary: initial?.plan_summary ?? "",
  owner_stakeholder_id: initial?.owner_stakeholder_id?.toString() ?? "",
  assignee: initial?.assignee?.join(", ") ?? "",
  due_date: initial?.due_date ?? "",
  status: initial?.status ?? TreatmentStatus.NEW,
  expected_residual_level: initial?.expected_residual_level ?? "",
  result_verification: initial?.result_verification ?? "",
  evidence_link: initial?.evidence_link ?? "",
  linked_capa_id: initial?.linked_capa_id ?? "",
  closed_at: initial?.closed_at ?? "",
});

interface AiRiskTreatmentFormProps {
  mode: FormMode;
  initialData?: AiRiskTreatment;
  serverErrors?: Record<string, string[]>;
  isSubmitting?: boolean;
  onSubmit: (
    payload: CreateAiRiskTreatmentData | UpdateAiRiskTreatmentData
  ) => Promise<void>;
}

export const AiRiskTreatmentForm: React.FC<AiRiskTreatmentFormProps> = ({
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
    { id: 1, title: "Plan", description: "Core treatment details" },
    { id: 2, title: "Execution", description: "Assignments & verification" },
  ];

  const validateStep = (step: number): boolean => {
    const fieldErrors: Record<string, string[]> = {};

    if (step === 1) {
      fieldErrors.ai_risk_register_id = validateNumericField(
        formState.ai_risk_register_id,
        { required: true, integer: true, messages: { required: "Risk register ID is required" } }
      );
      fieldErrors.plan_summary = validateTextField(formState.plan_summary, {
        required: true,
        messages: { required: "Plan summary is required" },
      });
      fieldErrors.owner_stakeholder_id = validateNumericField(
        formState.owner_stakeholder_id,
        { required: true, integer: true, messages: { required: "Owner stakeholder is required" } }
      );
      fieldErrors.due_date = validateTextField(formState.due_date, {
        required: true,
        messages: { required: "Due date is required" },
      });
    }

    if (step === 2) {
      fieldErrors.status = validateTextField(formState.status, { required: true });
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
                <Label htmlFor="treatment_type">Treatment Type *</Label>
                <select
                  id="treatment_type"
                  className="w-full border rounded-md h-10 px-3"
                  value={formState.treatment_type}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      treatment_type: e.target.value as TreatmentType,
                    }))
                  }
                >
                  {Object.values(TreatmentType).map((item) => (
                    <option key={item} value={item}>
                      {item.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan_summary">Plan Summary *</Label>
              <Textarea
                id="plan_summary"
                value={formState.plan_summary}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, plan_summary: e.target.value }))
                }
                rows={3}
                placeholder="Implement fairness checks in model training"
              />
              {validationErrors.plan_summary && (
                <p className="text-sm text-red-500">{validationErrors.plan_summary[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="owner_stakeholder_id">Owner Stakeholder ID *</Label>
                <Input
                  id="owner_stakeholder_id"
                  type="number"
                  value={formState.owner_stakeholder_id}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      owner_stakeholder_id: e.target.value,
                    }))
                  }
                  placeholder="2"
                />
                {validationErrors.owner_stakeholder_id && (
                  <p className="text-sm text-red-500">
                    {validationErrors.owner_stakeholder_id[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date *</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formState.due_date}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, due_date: e.target.value }))
                  }
                />
                {validationErrors.due_date && (
                  <p className="text-sm text-red-500">{validationErrors.due_date[0]}</p>
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
                      status: e.target.value as TreatmentStatus,
                    }))
                  }
                >
                  {Object.values(TreatmentStatus).map((item) => (
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
                <Label htmlFor="assignee">Assignee (emails, comma separated)</Label>
                <Input
                  id="assignee"
                  value={formState.assignee}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, assignee: e.target.value }))
                  }
                  placeholder="john@example.com, jane@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_residual_level">Expected Residual Level</Label>
                <Input
                  id="expected_residual_level"
                  value={formState.expected_residual_level}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      expected_residual_level: e.target.value,
                    }))
                  }
                  placeholder="medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="result_verification">Result Verification</Label>
                <select
                  id="result_verification"
                  className="w-full border rounded-md h-10 px-3"
                  value={formState.result_verification}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      result_verification: e.target.value as ResultVerification | "",
                    }))
                  }
                >
                  <option value="">Select</option>
                  {Object.values(ResultVerification).map((item) => (
                    <option key={item} value={item}>
                      {item.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidence_link">Evidence Link</Label>
                <Input
                  id="evidence_link"
                  value={formState.evidence_link}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, evidence_link: e.target.value }))
                  }
                  placeholder="https://example.com/evidence"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="linked_capa_id">Linked CAPA ID</Label>
                <Input
                  id="linked_capa_id"
                  value={formState.linked_capa_id}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, linked_capa_id: e.target.value }))
                  }
                  placeholder="CAPA-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closed_at">Closed At</Label>
                <Input
                  id="closed_at"
                  type="date"
                  value={formState.closed_at}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, closed_at: e.target.value }))
                  }
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

export default AiRiskTreatmentForm;

