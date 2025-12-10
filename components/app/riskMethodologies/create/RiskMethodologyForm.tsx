"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  CreateRiskMethodologyData,
  RiskMethodology,
  UpdateRiskMethodologyData,
} from "@/interfaces/RiskMethodology";
import {
  validateTextField,
  createValidationErrors,
} from "@/lib/utils/validation";

type FormState = {
  name: string;
  likelihood_scale: string;
  impact_scale: string;
  matrix_rule: string;
  acceptance_thresholds: string;
  aggregation_logic: string;
  review_policy: string;
  effective_from: string;
  effective_to: string;
  owner_team: string;
  source_created_at: string;
};

const formatDateForInput = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const getInitialState = (initial?: RiskMethodology): FormState => {
  return (
    {
    name: initial?.name ?? "",
    likelihood_scale: typeof initial?.likelihood_scale === "string" ? initial?.likelihood_scale : Object.values(initial?.likelihood_scale ?? {})[0] ?? "",
    impact_scale: typeof initial?.impact_scale === "string" ? initial?.impact_scale : Object.values(initial?.impact_scale ?? {})[0] ?? "",
    matrix_rule: initial
      ? JSON.stringify(initial.matrix_rule, null, 2)
      : "{\n  \"L_L\": \"Low\",\n  \"M_M\": \"Medium\",\n  \"H_H\": \"High\"\n}",
    acceptance_thresholds: initial?.acceptance_thresholds ?? "",
    aggregation_logic: initial?.aggregation_logic ?? "",
    review_policy: initial?.review_policy ?? "",
    effective_from: formatDateForInput(initial?.effective_from),
    effective_to: formatDateForInput(initial?.effective_to),
    owner_team: initial?.owner_team ?? "",
    source_created_at: formatDateForInput(initial?.source_created_at),
  }
  );
};

interface RiskMethodologyFormProps {
  initialData?: RiskMethodology;
  serverErrors?: Record<string, string[]>;
  isSubmitting?: boolean;
  onSubmit: (
    payload: CreateRiskMethodologyData | UpdateRiskMethodologyData
  ) => Promise<void>;
}

export const RiskMethodologyForm: React.FC<RiskMethodologyFormProps> = ({
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
    if (initialData) {
      setFormState(getInitialState(initialData));
    }
  }, [initialData]);

  const SCALE_OPTIONS = ["rare", "unlikely", "possible", "likely", "almost_certain"];
  const IMPACT_SCALE_OPTIONS = ["insignificant", "minor", "moderate", "major", "severe"];

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      description: "Core details for the methodology",
    },
    {
      id: 2,
      title: "Scales & Matrix",
      description: "Define likelihood/impact and matrix rules",
    },
  ];

  const validateStep = (step: number): boolean => {
    const fieldErrors: Record<string, string[]> = {};

    if (step === 1) {
      const effectiveFromDate = formState.effective_from ? new Date(formState.effective_from) : null;
      const effectiveToDate = formState.effective_to ? new Date(formState.effective_to) : null;

      fieldErrors.name = validateTextField(formState.name, {
        required: true,
        maxLength: 255,
        messages: { required: "Name is required" },
      });
      fieldErrors.acceptance_thresholds = validateTextField(
        formState.acceptance_thresholds,
        { required: true, messages: { required: "Acceptance thresholds are required" } }
      );
      fieldErrors.review_policy = validateTextField(formState.review_policy, {
        required: true,
        messages: { required: "Review policy is required" },
      });
      fieldErrors.owner_team = validateTextField(formState.owner_team, {
        required: true,
        messages: { required: "Owner team is required" },
      });
      fieldErrors.source_created_at = validateTextField(formState.source_created_at, {
        required: true,
        messages: { required: "Source created date is required" },
      });

      // Cross-field validation: effective_to must be >= effective_from when both are provided
      if (effectiveFromDate && effectiveToDate && effectiveToDate < effectiveFromDate) {
        fieldErrors.effective_to = ["Effective to must be on or after effective from"];
      }
    }

    if (step === 2) {
      // No required fields beyond JSON validity; validation handled on submit
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

  const parseJsonField = (value: string, field: string) => {
    try {
      return JSON.parse(value || "{}");
    } catch {
      setValidationErrors({
        [field]: ["Invalid JSON. Please provide valid JSON structure."],
      });
      throw new Error("Invalid JSON");
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    for (let step = 1; step <= steps.length; step++) {
      if (!validateStep(step)) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const handleSubmit = async () => {
    setValidationErrors({});
    
    // Validate entire form
    if (!validateForm()) {
      // Find first step with errors
      for (let step = 1; step <= steps.length; step++) {
        if (!validateStep(step)) {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }
      return;
    }

    try {
      const payload: CreateRiskMethodologyData | UpdateRiskMethodologyData = {
        name: formState.name.trim(),
        likelihood_scale: formState.likelihood_scale || "",
        impact_scale: formState.impact_scale || "",
        matrix_rule: parseJsonField(formState.matrix_rule, "matrix_rule"),
        acceptance_thresholds: formState.acceptance_thresholds.trim(),
        aggregation_logic: formState.aggregation_logic.trim() || undefined,
        review_policy: formState.review_policy.trim(),
        effective_from: formState.effective_from.trim() || undefined,
        effective_to: formState.effective_to.trim() || undefined,
        owner_team: formState.owner_team.trim(),
        source_created_at: formState.source_created_at.trim(),
      };

      await onSubmit(payload);
    } catch {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                Basic Information
              </h3>
              <hr className="border-gray-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="ISO 31010 Risk Matrix"
                  className={`h-[44px] w-full px-4 rounded-lg border ${
                    validationErrors.name ? "border-red-500" : "border-[#D0D5DD]"
                  } focus:border-[#D0D5DD] focus:-ring-0`}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner_team">Owner Team <span className="text-red-500">*</span></Label>
                <Input
                  id="owner_team"
                  value={formState.owner_team}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, owner_team: e.target.value }))
                  }
                  placeholder="Risk Management"
                  className={`h-[44px] w-full px-4 rounded-lg border ${
                    validationErrors.owner_team ? "border-red-500" : "border-[#D0D5DD]"
                  } focus:border-[#D0D5DD] focus:-ring-0`}
                />
                {validationErrors.owner_team && (
                  <p className="text-sm text-red-500">{validationErrors.owner_team[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="acceptance_thresholds">Acceptance Thresholds <span className="text-red-500">*</span></Label>
                <Input
                  id="acceptance_thresholds"
                  value={formState.acceptance_thresholds}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      acceptance_thresholds: e.target.value,
                    }))
                  }
                  placeholder="Medium"
                  className={`h-[44px] w-full px-4 rounded-lg border ${
                    validationErrors.acceptance_thresholds ? "border-red-500" : "border-[#D0D5DD]"
                  } focus:border-[#D0D5DD] focus:-ring-0`}
                />
                {validationErrors.acceptance_thresholds && (
                  <p className="text-sm text-red-500">
                    {validationErrors.acceptance_thresholds[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="aggregation_logic">Aggregation Logic</Label>
                <Input
                  id="aggregation_logic"
                  value={formState.aggregation_logic}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      aggregation_logic: e.target.value,
                    }))
                  }
                  placeholder="Maximum inherent risk across all identified risks"
                  className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review_policy">Review Policy <span className="text-red-500">*</span></Label>
              <Textarea
                id="review_policy"
                value={formState.review_policy}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, review_policy: e.target.value }))
                }
                placeholder="Annual review with ad-hoc updates"
                rows={4}
                className={`min-h-24 resize-none ${
                  validationErrors.review_policy ? "border-red-500" : ""
                }`}
              />
              {validationErrors.review_policy && (
                <p className="text-sm text-red-500">{validationErrors.review_policy[0]}</p>
              )}
              <p className="text-xs text-gray-500">
                {formState.review_policy.length} characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="effective_from">Effective From</Label>
                <Input
                  id="effective_from"
                  type="date"
                  value={formState.effective_from}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, effective_from: e.target.value }))
                  }
                  className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effective_to">Effective To</Label>
                <Input
                  id="effective_to"
                  type="date"
                  value={formState.effective_to}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, effective_to: e.target.value }))
                  }
                  className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source_created_at">Source Created At <span className="text-red-500">*</span></Label>
                <Input
                  id="source_created_at"
                  type="date"
                  value={formState.source_created_at}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      source_created_at: e.target.value,
                    }))
                  }
                  className={`h-[44px] w-full px-4 rounded-lg border ${
                    validationErrors.source_created_at ? "border-red-500" : "border-[#D0D5DD]"
                  } focus:border-[#D0D5DD] focus:-ring-0`}
                />
                {validationErrors.source_created_at && (
                  <p className="text-sm text-red-500">
                    {validationErrors.source_created_at[0]}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                Scales & Matrix
              </h3>
              <hr className="border-gray-200" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="likelihood_scale">Likelihood Scale</Label>
              <Select
                value={formState.likelihood_scale || undefined}
                onValueChange={(value) =>
                  setFormState((prev) => ({ ...prev, likelihood_scale: value }))
                }
              >
                <SelectTrigger className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
                  <SelectValue placeholder="Select likelihood (e.g., likely)" />
                </SelectTrigger>
                <SelectContent>
                  {SCALE_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.likelihood_scale && (
                <p className="text-sm text-red-500">
                  {validationErrors.likelihood_scale[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact_scale">Impact Scale</Label>
              <Select
                value={formState.impact_scale || undefined}
                onValueChange={(value) =>
                  setFormState((prev) => ({ ...prev, impact_scale: value }))
                }
              >
                <SelectTrigger className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0">
                  <SelectValue placeholder="Select impact (e.g., high)" />
                </SelectTrigger>
                <SelectContent>
                  {IMPACT_SCALE_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.impact_scale && (
                <p className="text-sm text-red-500">{validationErrors.impact_scale[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="matrix_rule">Matrix Rule (JSON)</Label>
              <Textarea
                id="matrix_rule"
                value={formState.matrix_rule}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, matrix_rule: e.target.value }))
                }
                rows={8}
                placeholder='{\n  "L_L": "Low",\n  "M_M": "Medium",\n  "H_H": "High"\n}'
                className={`min-h-32 resize-none font-mono text-sm ${
                  validationErrors.matrix_rule ? "border-red-500" : ""
                }`}
              />
              {validationErrors.matrix_rule && (
                <p className="text-sm text-red-500">{validationErrors.matrix_rule[0]}</p>
              )}
              <p className="text-xs text-gray-500">
                {formState.matrix_rule.length} characters
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const combinedErrors = { ...validationErrors, ...(serverErrors || {}) };

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

export default RiskMethodologyForm;

