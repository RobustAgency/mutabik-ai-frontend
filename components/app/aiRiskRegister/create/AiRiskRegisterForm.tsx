"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import {
  AiRiskRegister,
  CreateAiRiskRegisterData,
  RiskCategory,
  RiskDecision,
  RiskLevel,
  RiskStatus,
  ReviewCadence,
  UpdateAiRiskRegisterData,
} from "@/interfaces/AiRiskRegister";
import {
  validateTextField,
  validateNumericField,
  createValidationErrors,
} from "@/lib/utils/validation";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import { useGetAiModelVersionsQuery } from "@/app/lib/features/aiModelVersionsApi";
import { useGetUseCasesQuery } from "@/app/lib/features/useCasesApi";
import { useGetCorrectivePreventiveActionsQuery } from "@/app/lib/features/correctivePreventiveActionsApi";
import SelectWithInlineCreate from "@/components/custom/SelectWithInlineCreate";
import AiModelModalForm from "@/components/app/aiModel/create/AiModelModalForm";
import AiModelVersionModalForm from "@/components/app/aiModel/versions/AiModelVersionModalForm";
import UseCaseModalForm from "@/components/app/useCases/create/UseCaseModalForm";
import CAPAForm from "@/components/app/incidents/capa/create/CAPAForm";
import StakeholderSelectorWithInline from "@/components/app/useCases/create/StakeholderSelectorWithInline";
import { useCreateCorrectivePreventiveActionMutation, CreateCorrectivePreventiveActionData } from "@/app/lib/features/correctivePreventiveActionsApi";
import { formatRiskCategory, formatRiskStatus, formatRiskLevel, formatRiskDecision, formatReviewCadence } from "@/utils/riskUtils";

// CAPA Modal Form Adapter for SelectWithInlineCreate
const CAPAModalFormAdapter: React.FC<{ onSuccess: (item: any) => void; onCancel: () => void }> = ({ onSuccess, onCancel }) => {
  const [createCAPA, { isLoading }] = useCreateCorrectivePreventiveActionMutation();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState<CreateCorrectivePreventiveActionData>({
    source_type: "risk",
    source_id: "",
    model_id: null,
    title: "",
    capa_type: "corrective",
    priority: "medium",
    owner_team: "product_ops",
    assignee: null,
    root_cause: null,
    actions: null,
    due_date: "",
    status: "new",
    verification_result: "pending",
    evidence_link: null,
  });

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      source_type: validateTextField(formData.source_type, { required: true, messages: { required: "Source type is required" } }),
      source_id: validateTextField(formData.source_id, { required: true, messages: { required: "Source ID is required" } }),
      title: validateTextField(formData.title, { required: true, messages: { required: "Title is required" } }),
      capa_type: validateTextField(formData.capa_type, { required: true, messages: { required: "CAPA type is required" } }),
      priority: validateTextField(formData.priority, { required: true, messages: { required: "Priority is required" } }),
      owner_team: validateTextField(formData.owner_team, { required: true, messages: { required: "Owner team is required" } }),
      due_date: validateTextField(formData.due_date, { required: true, messages: { required: "Due date is required" } }),
      status: validateTextField(formData.status, { required: true, messages: { required: "Status is required" } }),
      verification_result: validateTextField(formData.verification_result, { required: true, messages: { required: "Verification result is required" } }),
    };

    const validationErrors = createValidationErrors(fieldErrors);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const result = await createCAPA(formData).unwrap();
      onSuccess(result);
    } catch (error: any) {
      if (error?.data?.errors) setErrors(error.data.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([field, fieldErrors]) => (
                <li key={field}>
                  <span className="font-medium capitalize">{field.replace(/_/g, " ")}:</span> {fieldErrors[0]}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      <CAPAForm formData={formData} setFormData={setFormData} errors={errors} />
      <div className="flex gap-3 mt-6">
        <Button type="submit" disabled={isLoading} className="bg-[#4FD58F] text-white">
          {isLoading ? "Creating..." : "Create CAPA"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

type FormMode = "create" | "edit";

type FormState = {
  title: string;
  risk_category: RiskCategory;
  ai_model_id: string;
  ai_model_version_id: string;
  use_case_id: string;
  description: string;
  related_controls: string;
  likelihood_code: string;
  impact_code: string;
  inherent_score: string;
  residual_score: string;
  risk_level: RiskLevel;
  decision: RiskDecision;
  risk_owner: string;
  review_cadence: ReviewCadence;
  next_review_due: string;
  status: RiskStatus;
  linked_assessment_id: string;
  linked_incident_id: string;
  linked_capa_id: string;
  evidence_link: string;
  likelihood_label_snapshot: string;
  impact_label_snapshot: string;
  method_name_snapshot: string;
  created_by: string;
  descriptionInput: string; // For controlled input with character count
};

const getInitialState = (initial?: AiRiskRegister): FormState => ({
  title: initial?.title ?? "",
  risk_category: initial?.risk_category ?? RiskCategory.SAFETY,
  ai_model_id: initial?.ai_model_id?.toString() ?? "",
  ai_model_version_id: initial?.ai_model_version_id?.toString() ?? "",
  use_case_id: initial?.use_case_id?.toString() ?? "",
  description: initial?.description ?? "",
  descriptionInput: initial?.description ?? "",
  related_controls: initial?.related_controls?.join(", ") ?? "",
  likelihood_code: initial?.likelihood_code ?? "",
  impact_code: initial?.impact_code ?? "",
  inherent_score: initial?.inherent_score ?? "",
  residual_score: initial?.residual_score ?? "",
  risk_level: initial?.risk_level ?? RiskLevel.MEDIUM,
  decision: initial?.decision ?? RiskDecision.TREAT,
  risk_owner: initial?.risk_owner?.toString() ?? "",
  review_cadence: initial?.review_cadence ?? ReviewCadence.QUARTERLY,
  next_review_due: initial?.next_review_due ?? "",
  status: initial?.status ?? RiskStatus.IDENTIFIED,
  linked_assessment_id: initial?.linked_assessment_id?.toString() ?? "",
  linked_incident_id: initial?.linked_incident_id?.toString() ?? "",
  linked_capa_id: initial?.linked_capa_id?.toString() ?? "",
  evidence_link: initial?.evidence_link ?? "",
  likelihood_label_snapshot: initial?.likelihood_label_snapshot ?? "",
  impact_label_snapshot: initial?.impact_label_snapshot ?? "",
  method_name_snapshot: initial?.method_name_snapshot ?? "",
  created_by: initial?.created_by ?? "",
});

interface AiRiskRegisterFormProps {
  mode: FormMode;
  initialData?: AiRiskRegister;
  serverErrors?: Record<string, string[]>;
  isSubmitting?: boolean;
  onSubmit: (
    payload: CreateAiRiskRegisterData | UpdateAiRiskRegisterData
  ) => Promise<void>;
}

export const AiRiskRegisterForm: React.FC<AiRiskRegisterFormProps> = ({
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

  const validateStep = (step: number): boolean => {
    const fieldErrors: Record<string, string[]> = {};

    if (step === 1) {
      // Basic Information
      fieldErrors.title = validateTextField(formState.title, {
        required: true,
        messages: { required: "Title is required" },
      });
      fieldErrors.description = validateTextField(formState.description, {
        required: true,
        messages: { required: "Description is required" },
      });
      fieldErrors.risk_category = validateTextField(formState.risk_category, {
        required: true,
      });
      fieldErrors.status = validateTextField(formState.status, { required: true });
      fieldErrors.ai_model_id = validateTextField(formState.ai_model_id, {
        required: true,
        messages: { required: "AI Model is required" },
      });
    }

    if (step === 2) {
      // Risk Assessment
      fieldErrors.likelihood_code = validateTextField(formState.likelihood_code, {
        required: true,
        messages: { required: "Likelihood code is required" },
      });
      fieldErrors.impact_code = validateTextField(formState.impact_code, {
        required: true,
        messages: { required: "Impact code is required" },
      });
      fieldErrors.risk_level = validateTextField(formState.risk_level, {
        required: true,
      });
      fieldErrors.decision = validateTextField(formState.decision, {
        required: true,
      });
    }

    if (step === 3) {
      // Ownership & Review
      const riskOwnerNum = formState.risk_owner ? Number(formState.risk_owner) : undefined;
      fieldErrors.risk_owner = validateNumericField(riskOwnerNum, {
        required: true,
        integer: true,
        messages: { required: "Risk owner is required" },
      });
      fieldErrors.review_cadence = validateTextField(formState.review_cadence, {
        required: true,
      });
      fieldErrors.next_review_due = validateTextField(formState.next_review_due, {
        required: true,
        messages: { required: "Next review date is required" },
      });
      fieldErrors.created_by = validateTextField(formState.created_by, {
        required: true,
        messages: { required: "Created by (email) is required" },
      });
    }

    // Step 4 (Links & Evidence) - all fields are optional, no validation needed

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

  const handlePrevious = () => {
    setValidationErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const parseNumber = (value: string) => {
    if (!value || value.trim() === "" || value === "0") return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) || parsed <= 0 ? undefined : parsed;
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
    } catch (_err) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const combinedErrors = { ...validationErrors, ...(serverErrors || {}) };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // Basic Information
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                Basic Information
              </h3>
              <hr className="border-gray-200" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                value={formState.title}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Model Bias Risk"
                className={`h-[44px] w-full px-4 rounded-lg border ${
                  validationErrors.title ? "border-red-500" : "border-[#D0D5DD]"
                } focus:border-[#D0D5DD] focus:-ring-0`}
              />
              {validationErrors.title && (
                <p className="text-sm text-red-500">{validationErrors.title[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                value={formState.descriptionInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormState((prev) => ({ 
                    ...prev, 
                    descriptionInput: value,
                    description: value 
                  }));
                }}
                onBlur={() => {
                  setFormState((prev) => ({ 
                    ...prev, 
                    description: prev.descriptionInput 
                  }));
                }}
                rows={4}
                placeholder="Describe the risk in detail (required)..."
                className={`min-h-24 resize-none ${
                  validationErrors.description ? "border-red-500" : ""
                }`}
              />
              {validationErrors.description && (
                <p className="text-sm text-red-500">{validationErrors.description[0]}</p>
              )}
              <p className="text-xs text-gray-500">
                {formState.descriptionInput.length} characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="risk_category">Risk Category <span className="text-red-500">*</span></Label>
                <Select
                  value={formState.risk_category}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      risk_category: value as RiskCategory,
                    }))
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      validationErrors.risk_category ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select risk category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RiskCategory).map((item) => (
                      <SelectItem key={item} value={item}>
                        {formatRiskCategory(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.risk_category && (
                  <p className="text-sm text-red-500">{validationErrors.risk_category[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      status: value as RiskStatus,
                    }))
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      validationErrors.status ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RiskStatus).map((item) => (
                      <SelectItem key={item} value={item}>
                        {formatRiskStatus(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.status && (
                  <p className="text-sm text-red-500">{validationErrors.status[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ai_model_id">AI Model <span className="text-red-500">*</span></Label>
                <SelectWithInlineCreate
                  key={`ai_model_id-${formState.ai_model_id ?? 'none'}`}
                  value={formState.ai_model_id || undefined}
                  onValueChange={(value) => {
                    setFormState((prev) => ({ 
                      ...prev, 
                      ai_model_id: value || "",
                      // Reset version when model changes
                      ai_model_version_id: value !== prev.ai_model_id ? "" : prev.ai_model_version_id
                    }));
                  }}
                  options={aiModels.map((model: any) => ({
                    id: model.id,
                    label: model.name,
                    value: String(model.id),
                  }))}
                  isLoading={isModelsLoading}
                  isEmpty={!isModelsLoading && aiModels.length === 0}
                  entityName="AI Model"
                  modalForm={AiModelModalForm}
                  placeholder="Select AI Model"
                  error={!!validationErrors.ai_model_id}
                />
                {validationErrors.ai_model_id && (
                  <p className="text-sm text-red-500">{validationErrors.ai_model_id[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai_model_version_id">AI Model Version</Label>
                <SelectWithInlineCreate
                  key={`ai_model_version_id-${formState.ai_model_version_id ?? 'none'}`}
                  value={formState.ai_model_version_id || undefined}
                  onValueChange={(value) => {
                    setFormState((prev) => ({ 
                      ...prev, 
                      ai_model_version_id: value || ""
                    }));
                  }}
                  options={filteredVersions.map((version: any) => ({
                    id: version.id,
                    label: version.version_number || version.version || `Version ${version.id}`,
                    value: String(version.id),
                  }))}
                  isLoading={isVersionsLoading}
                  isEmpty={!isVersionsLoading && !!formState.ai_model_id && filteredVersions.length === 0}
                  entityName="Model Version"
                  modalForm={AiModelVersionModalForm}
                  placeholder={!formState.ai_model_id ? "Select AI model first" : "Select model version (optional)"}
                  disabled={!formState.ai_model_id}
                  error={!!validationErrors.ai_model_version_id}
                />
                {validationErrors.ai_model_version_id && (
                  <p className="text-sm text-red-500">{validationErrors.ai_model_version_id[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="use_case_id">Use Case</Label>
                <SelectWithInlineCreate
                  key={`use_case_id-${formState.use_case_id ?? 'none'}`}
                  value={formState.use_case_id || undefined}
                  onValueChange={(value) => {
                    setFormState((prev) => ({ 
                      ...prev, 
                      use_case_id: value || ""
                    }));
                  }}
                  options={useCases.map((useCase: any) => ({
                    id: useCase.id,
                    label: useCase.name || useCase.use_case_title || useCase.title || `Use Case ${useCase.id}`,
                    value: String(useCase.id),
                  }))}
                  isLoading={isUseCasesLoading}
                  isEmpty={!isUseCasesLoading && useCases.length === 0}
                  entityName="Use Case"
                  modalForm={UseCaseModalForm}
                  placeholder="Select use case (optional)"
                  error={!!validationErrors.use_case_id}
                />
                {validationErrors.use_case_id && (
                  <p className="text-sm text-red-500">{validationErrors.use_case_id[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="related_controls">Related Controls (comma separated)</Label>
              <Input
                id="related_controls"
                value={formState.related_controls}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    related_controls: e.target.value,
                  }))
                }
                placeholder="control_1, control_2"
              />
            </div>
          </div>
        );

      case 2:
        // Risk Assessment
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                Risk Assessment
              </h3>
              <hr className="border-gray-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="likelihood_code">Likelihood Code <span className="text-red-500">*</span></Label>
                <Input
                  id="likelihood_code"
                  value={formState.likelihood_code}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      likelihood_code: e.target.value,
                    }))
                  }
                  placeholder="M"
                  className={`h-[44px] w-full px-4 rounded-lg border ${
                    validationErrors.likelihood_code ? "border-red-500" : "border-[#D0D5DD]"
                  } focus:border-[#D0D5DD] focus:-ring-0`}
                />
                {validationErrors.likelihood_code && (
                  <p className="text-sm text-red-500">
                    {validationErrors.likelihood_code[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="impact_code">Impact Code <span className="text-red-500">*</span></Label>
                <Input
                  id="impact_code"
                  value={formState.impact_code}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, impact_code: e.target.value }))
                  }
                  placeholder="H"
                  className={`h-[44px] w-full px-4 rounded-lg border ${
                    validationErrors.impact_code ? "border-red-500" : "border-[#D0D5DD]"
                  } focus:border-[#D0D5DD] focus:-ring-0`}
                />
                {validationErrors.impact_code && (
                  <p className="text-sm text-red-500">{validationErrors.impact_code[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="inherent_score">Inherent Score</Label>
                <Input
                  id="inherent_score"
                  value={formState.inherent_score}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, inherent_score: e.target.value }))
                  }
                  placeholder="7"
                  className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="residual_score">Residual Score</Label>
                <Input
                  id="residual_score"
                  value={formState.residual_score}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, residual_score: e.target.value }))
                  }
                  placeholder="3"
                  className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="risk_level">Risk Level <span className="text-red-500">*</span></Label>
                <Select
                  value={formState.risk_level}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      risk_level: value as RiskLevel,
                    }))
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      validationErrors.risk_level ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RiskLevel).map((item) => (
                      <SelectItem key={item} value={item}>
                        {formatRiskLevel(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.risk_level && (
                  <p className="text-sm text-red-500">{validationErrors.risk_level[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="decision">Decision <span className="text-red-500">*</span></Label>
                <Select
                  value={formState.decision}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      decision: value as RiskDecision,
                    }))
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      validationErrors.decision ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RiskDecision).map((item) => (
                      <SelectItem key={item} value={item}>
                        {formatRiskDecision(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.decision && (
                  <p className="text-sm text-red-500">{validationErrors.decision[0]}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        // Ownership & Review
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                Ownership & Review
              </h3>
              <hr className="border-gray-200" />
            </div>

            <div className="space-y-2">
              <StakeholderSelectorWithInline
                label="Risk Owner"
                required
                value={formState.risk_owner ? Number(formState.risk_owner) : null}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    risk_owner: value ? String(value) : "",
                  }))
                }
                placeholder="Select risk owner"
                filterType="all"
                error={validationErrors.risk_owner?.[0]}
              />
              {validationErrors.risk_owner && (
                <p className="text-sm text-red-500">{validationErrors.risk_owner[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="review_cadence">Review Cadence <span className="text-red-500">*</span></Label>
                <Select
                  value={formState.review_cadence}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      review_cadence: value as ReviewCadence,
                    }))
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      validationErrors.review_cadence ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select review cadence" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ReviewCadence).map((item) => (
                      <SelectItem key={item} value={item}>
                        {formatReviewCadence(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.review_cadence && (
                  <p className="text-sm text-red-500">{validationErrors.review_cadence[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="next_review_due">Next Review Due <span className="text-red-500">*</span></Label>
                <Input
                  id="next_review_due"
                  type="date"
                  value={formState.next_review_due}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      next_review_due: e.target.value,
                    }))
                  }
                  className={`h-[44px] w-full px-4 rounded-lg border ${
                    validationErrors.next_review_due ? "border-red-500" : "border-[#D0D5DD]"
                  } focus:border-[#D0D5DD] focus:-ring-0`}
                />
                {validationErrors.next_review_due && (
                  <p className="text-sm text-red-500">
                    {validationErrors.next_review_due[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="created_by">Created By (email) <span className="text-red-500">*</span></Label>
              <Input
                id="created_by"
                value={formState.created_by}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, created_by: e.target.value }))
                }
                placeholder="user@example.com"
                className={`h-[44px] w-full px-4 rounded-lg border ${
                  validationErrors.created_by ? "border-red-500" : "border-[#D0D5DD]"
                } focus:border-[#D0D5DD] focus:-ring-0`}
              />
              {validationErrors.created_by && (
                <p className="text-sm text-red-500">{validationErrors.created_by[0]}</p>
              )}
            </div>
          </div>
        );

      case 4:
        // Links & Evidence
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
                Links & Evidence
              </h3>
              <hr className="border-gray-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="linked_assessment_id">Linked Assessment ID</Label>
                <Input
                  id="linked_assessment_id"
                  type="number"
                  value={formState.linked_assessment_id}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      linked_assessment_id: e.target.value,
                    }))
                  }
                  placeholder="Assessment ID"
                  className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linked_incident_id">Linked Incident ID</Label>
                <Input
                  id="linked_incident_id"
                  type="number"
                  value={formState.linked_incident_id}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      linked_incident_id: e.target.value,
                    }))
                  }
                  placeholder="Incident ID"
                  className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linked_capa_id">Linked CAPA ID</Label>
                <SelectWithInlineCreate
                  key={`linked_capa_id-${formState.linked_capa_id ?? 'none'}`}
                  value={formState.linked_capa_id || undefined}
                  onValueChange={(value) => {
                    setFormState((prev) => ({ 
                      ...prev, 
                      linked_capa_id: value || ""
                    }));
                  }}
                  options={capas.map((capa: any) => ({
                    id: capa.id,
                    label: capa.title || `CAPA ${capa.id}`,
                    value: String(capa.id),
                  }))}
                  isLoading={isCapasLoading}
                  isEmpty={!isCapasLoading && capas.length === 0}
                  entityName="CAPA"
                  modalForm={CAPAModalFormAdapter}
                  placeholder="Select CAPA (optional)"
                  error={!!validationErrors.linked_capa_id}
                />
                {validationErrors.linked_capa_id && (
                  <p className="text-sm text-red-500">{validationErrors.linked_capa_id[0]}</p>
                )}
              </div>
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
                className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="likelihood_label_snapshot">Likelihood Label Snapshot</Label>
                <Input
                  id="likelihood_label_snapshot"
                  value={formState.likelihood_label_snapshot}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      likelihood_label_snapshot: e.target.value,
                    }))
                  }
                  placeholder="Medium"
                  className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="impact_label_snapshot">Impact Label Snapshot</Label>
                <Input
                  id="impact_label_snapshot"
                  value={formState.impact_label_snapshot}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      impact_label_snapshot: e.target.value,
                    }))
                  }
                  placeholder="High"
                  className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method_name_snapshot">Method Name Snapshot</Label>
                <Input
                  id="method_name_snapshot"
                  value={formState.method_name_snapshot}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      method_name_snapshot: e.target.value,
                    }))
                  }
                  placeholder="Risk Matrix v1"
                  className="h-[44px] w-full px-4 rounded-lg border border-[#D0D5DD] focus:border-[#D0D5DD] focus:-ring-0"
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

export default AiRiskRegisterForm;

