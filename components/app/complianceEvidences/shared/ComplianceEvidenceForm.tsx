"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetControlsQuery } from "@/app/lib/features/controlsApi";
import { useGetRequirementsQuery } from "@/app/lib/features/requirementsApi";
import { useGetOrganizationUsersQuery } from "@/app/lib/features/usersApi";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import type {
  ComplianceEvidence,
  CreateComplianceEvidenceRequest,
} from "@/interfaces/ComplianceEvidence";
import {
  ComplianceEvidenceArtifactTypeEnum,
  ComplianceEvidenceReviewOutcomeEnum,
} from "@/interfaces/ComplianceEvidence";
import {
  complianceEvidenceSchema,
  type ComplianceEvidenceFormData,
} from "@/lib/schemas/complianceEvidence.schema";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { useFormContext } from "react-hook-form";

const ARTIFACT_TYPE_OPTIONS: { value: ComplianceEvidenceArtifactTypeEnum; label: string }[] = [
  { value: ComplianceEvidenceArtifactTypeEnum.DOCUMENT, label: "Document" },
  { value: ComplianceEvidenceArtifactTypeEnum.SCREENSHOT, label: "Screenshot" },
  { value: ComplianceEvidenceArtifactTypeEnum.LOG, label: "Log" },
  { value: ComplianceEvidenceArtifactTypeEnum.TEST_RESULT, label: "Test Result" },
  { value: ComplianceEvidenceArtifactTypeEnum.SAMPLE_SET, label: "Sample Set" },
  { value: ComplianceEvidenceArtifactTypeEnum.TICKET, label: "Ticket" },
  { value: ComplianceEvidenceArtifactTypeEnum.TRANSCRIPT, label: "Transcript" },
  { value: ComplianceEvidenceArtifactTypeEnum.SUBMISSION_ACK, label: "Submission Ack" },
];

const REVIEW_OUTCOME_OPTIONS: { value: ComplianceEvidenceReviewOutcomeEnum; label: string }[] = [
  { value: ComplianceEvidenceReviewOutcomeEnum.PASS, label: "Pass" },
  { value: ComplianceEvidenceReviewOutcomeEnum.FAIL, label: "Fail" },
  { value: ComplianceEvidenceReviewOutcomeEnum.NEEDS_FIX, label: "Needs Fix" },
];

const WIZARD_STEPS = [
  { id: 1, title: "Basic Information", description: "Control, requirement & artifact details" },
  { id: 2, title: "Collection Details", description: "Samples, method & collection period" },
  { id: 3, title: "Review & Metadata", description: "Review outcome & checksum" },
];

const stepFields: Record<number, (keyof ComplianceEvidenceFormData)[]> = {
  1: ["control_id", "requirement_id", "ai_model_id", "artifact_type", "artifact_uri"],
  2: ["sample_ids", "sampling_method", "collection_period_start", "collection_period_end", "collected_by", "hash_checksum"],
  3: ["review_outcome", "reviewed_by", "reviewed_at"],
};

const initialFormData: Partial<ComplianceEvidenceFormData> = {
  control_id: undefined as any,
  requirement_id: null,
  ai_model_id: null,
  artifact_type: ComplianceEvidenceArtifactTypeEnum.DOCUMENT,
  artifact_uri: "",
  sample_ids: [],
  sampling_method: "",
  collection_period_start: null,
  collection_period_end: null,
  collected_by: null,
  review_outcome: null,
  reviewed_by: null,
  reviewed_at: null,
  hash_checksum: "",
};

interface Requirement {
  id: number;
  reference?: string;
  requirement_text?: string;
  controls?: Control[];
}

interface Control {
  id: number;
  name?: string;
  reference?: string;
}

interface ComplianceEvidenceFormProps {
  mode: "create" | "edit";
  initialData?: ComplianceEvidence;
  isLoading?: boolean;
  onSubmit: (data: CreateComplianceEvidenceRequest | Partial<CreateComplianceEvidenceRequest>) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
  // Optional: Project-specific requirements and controls from framework
  projectRequirements?: Requirement[];
  projectControls?: Control[];
  // Optional: Hide the form's own header (useful when used in dialogs)
  hideHeader?: boolean;
}

export const ComplianceEvidenceForm: React.FC<ComplianceEvidenceFormProps> = ({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onSuccess,
  title,
  description,
  projectRequirements,
  projectControls,
  hideHeader = false,
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [sampleIdsText, setSampleIdsText] = useState("");

  // Fetch data for dropdowns - use project data if provided, otherwise fetch from API
  const { data: controlsData } = useGetControlsQuery(
    { per_page: 100 },
    { skip: !!projectControls }
  );
  const controls = projectControls ?? controlsData?.data ?? [];
  
  const { data: requirementsData } = useGetRequirementsQuery(
    { per_page: 100 },
    { skip: !!projectRequirements }
  );
  const requirements = projectRequirements ?? requirementsData?.data ?? [];
  
  const { data: users = [] } = useGetOrganizationUsersQuery({ per_page: 100 });
  const { data: aiModels = [] } = useGetAiModelsQuery({ per_page: 100 });

  const methods = useForm<ComplianceEvidenceFormData>({
    resolver: zodResolver(complianceEvidenceSchema) as any,
    defaultValues: initialFormData as ComplianceEvidenceFormData,
    mode: "onBlur", // Changed from "onChange" to prevent focus loss on every keystroke
  });

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = methods;

  const watchedControlId = watch("control_id");
  const watchedRequirementId = watch("requirement_id");
  const watchedAiModelId = watch("ai_model_id");
  const watchedCollectedBy = watch("collected_by");
  const watchedReviewedBy = watch("reviewed_by");
  const watchedSampleIds = watch("sample_ids");

  useEffect(() => {
    if (initialData) {
      const sampleIds = initialData.sample_ids || [];
      const resetData: Partial<ComplianceEvidenceFormData> = {
        ...initialFormData,
        control_id: initialData.control_id ?? undefined,
        requirement_id: initialData.requirement_id ?? null,
        ai_model_id: initialData.ai_model_id ?? null,
        artifact_type: initialData.artifact_type ?? initialFormData.artifact_type,
        artifact_uri: initialData.artifact_uri || "",
        sample_ids: sampleIds,
        sampling_method: initialData.sampling_method || "",
        collection_period_start: initialData.collection_period_start
          ? initialData.collection_period_start.split("T")[0]
          : null,
        collection_period_end: initialData.collection_period_end
          ? initialData.collection_period_end.split("T")[0]
          : null,
        collected_by: initialData.collected_by ?? null,
        review_outcome: initialData.review_outcome ?? null,
        reviewed_by: initialData.reviewed_by ?? null,
        reviewed_at: initialData.reviewed_at
          ? initialData.reviewed_at.split("T")[0]
          : null,
        hash_checksum: initialData.hash_checksum || "",
      };
      
      if (mode === "edit") {
        reset(resetData as ComplianceEvidenceFormData);
        setSampleIdsText(sampleIds.join(", "));
      } else if (mode === "create") {
        // In create mode, only set fields that are provided in initialData
        reset({
          ...initialFormData,
          ...(initialData.control_id && { control_id: initialData.control_id }),
          ...(initialData.requirement_id !== undefined && { requirement_id: initialData.requirement_id }),
          ...(initialData.ai_model_id !== undefined && { ai_model_id: initialData.ai_model_id }),
          ...(initialData.artifact_type && { artifact_type: initialData.artifact_type }),
        } as ComplianceEvidenceFormData);
      }
    }
  }, [mode, initialData, reset]);

  useEffect(() => {
    if (watchedSampleIds) {
      setSampleIdsText(watchedSampleIds.join(", "));
    }
  }, [watchedSampleIds]);

  // Filter controls based on selected requirement when using project data
  const filteredControls = useMemo(() => {
    if (!projectRequirements || !watchedRequirementId) {
      return controls;
    }
    
    // Find the selected requirement
    const selectedReq = projectRequirements.find(
      (req) => req.id === watchedRequirementId
    );
    
    // If requirement is selected and has controls, return only those controls
    if (selectedReq?.controls && Array.isArray(selectedReq.controls)) {
      return selectedReq.controls;
    }
    
    // Otherwise return all controls from the project
    return controls;
  }, [controls, projectRequirements, watchedRequirementId]);

  const controlOptions = useMemo(() => {
    const base = filteredControls.map((ctrl) => ({
      value: ctrl.id.toString(),
      label: `${ctrl.reference || ""}${ctrl.reference && ctrl.name ? " - " : ""}${ctrl.name || `Control ${ctrl.id}`}`,
    }));
    return base;
  }, [filteredControls]);

  const requirementOptions = useMemo(() => {
    const base = requirements.map((req) => ({
      value: req.id.toString(),
      label: `${req.reference || ""}${req.reference && req.requirement_text ? " - " : ""}${req.requirement_text ? req.requirement_text.substring(0, 50) : `Requirement ${req.id}`}`,
    }));
    return base;
  }, [requirements]);

  const userOptions = useMemo(() => {
    return users.map((user) => ({
      value: user.id.toString(),
      label: `${user.name} (${user.email})`,
    }));
  }, [users]);

  const aiModelOptions = useMemo(() => {
    return aiModels.map((model) => ({
      value: model.id.toString(),
      label: `${model.name}${model.display_id ? ` (${model.display_id})` : ""}`,
    }));
  }, [aiModels]);

  const handleSampleIdsChange = React.useCallback((text: string) => {
    setSampleIdsText(text);
    const ids = text
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
    setValue("sample_ids", ids, { shouldValidate: true });
  }, [setValue]);

  const handleValidateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate = stepFields[step];
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

  const handleFormSubmit = handleSubmit(async (data: ComplianceEvidenceFormData) => {
    const payload: CreateComplianceEvidenceRequest = {
      control_id: data.control_id,
      requirement_id: data.requirement_id ?? null,
      ai_model_id: data.ai_model_id ?? null,
      artifact_type: data.artifact_type,
      artifact_uri: data.artifact_uri,
      sample_ids: data.sample_ids,
      sampling_method: data.sampling_method,
      collection_period_start: data.collection_period_start || null,
      collection_period_end: data.collection_period_end || null,
      collected_by: data.collected_by ?? null,
      review_outcome: data.review_outcome ?? null,
      reviewed_by: data.reviewed_by ?? null,
      reviewed_at: data.reviewed_at || null,
      hash_checksum: data.hash_checksum,
    };
    await onSubmit(payload);
    onSuccess?.();
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <CollectionDetailsStep />;
      case 3:
        return <ReviewMetadataStep />;
      default:
        return null;
    }
  };

  // Step components (using useFormContext - defined inside to access closure variables)
  const BasicInformationStep = () => {
    const { register, setValue, watch, formState: { errors } } = useFormContext<ComplianceEvidenceFormData>();
    const watchedControlId = watch("control_id");
    const watchedRequirementId = watch("requirement_id");
    const watchedAiModelId = watch("ai_model_id");

    // Clear control selection if it's not in the filtered list when requirement changes
    useEffect(() => {
      if (projectRequirements && watchedRequirementId && watchedControlId) {
        const selectedReq = projectRequirements.find(
          (req) => req.id === watchedRequirementId
        );
        const controlIds = selectedReq?.controls?.map((c) => c.id) || [];
        if (controlIds.length > 0 && !controlIds.includes(watchedControlId)) {
          setValue("control_id", undefined as any, { shouldValidate: true });
        }
      }
    }, [watchedRequirementId, watchedControlId, projectRequirements, setValue]);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="control_id" className="text-sm font-medium text-gray-900">
              Control <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watchedControlId ? String(watchedControlId) : ""}
              onValueChange={(value) => {
                if (value) {
                  setValue("control_id", Number(value), { shouldValidate: true });
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger className={`w-full mt-1 ${errors.control_id ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select control" />
              </SelectTrigger>
              <SelectContent>
                {controlOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.control_id && (
              <p className="text-sm text-red-500 mt-1">{errors.control_id.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="requirement_id" className="text-sm font-medium text-gray-900">
              Requirement
            </Label>
            <Select
              value={watchedRequirementId ? String(watchedRequirementId) : "null"}
              onValueChange={(value) =>
                setValue("requirement_id", value === "null" ? null : Number(value), { shouldValidate: true })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select requirement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="null" value="null">None</SelectItem>
                {requirementOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ai_model_id" className="text-sm font-medium text-gray-900">
              AI Model
            </Label>
            <Select
              value={watchedAiModelId ? String(watchedAiModelId) : "null"}
              onValueChange={(value) =>
                setValue("ai_model_id", value === "null" ? null : Number(value), { shouldValidate: true })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="null" value="null">None</SelectItem>
                {aiModelOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="artifact_type" className="text-sm font-medium text-gray-900">
              Artifact Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("artifact_type")}
              onValueChange={(value) =>
                setValue("artifact_type", value as ComplianceEvidenceArtifactTypeEnum, { shouldValidate: true })
              }
              disabled={isLoading}
            >
              <SelectTrigger className={`w-full mt-1 ${errors.artifact_type ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select artifact type" />
              </SelectTrigger>
              <SelectContent>
                {ARTIFACT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.artifact_type && (
              <p className="text-sm text-red-500 mt-1">{errors.artifact_type.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="artifact_uri" className="text-sm font-medium text-gray-900">
            Artifact URI <span className="text-red-500">*</span>
          </Label>
          <Input
            key="artifact_uri_input"
            id="artifact_uri"
            type="url"
            {...register("artifact_uri")}
            placeholder="https://example.com/artifact"
            className={`mt-1 ${errors.artifact_uri ? "border-red-500" : ""}`}
            disabled={isLoading}
          />
          {errors.artifact_uri && (
            <p className="text-sm text-red-500 mt-1">{errors.artifact_uri.message}</p>
          )}
        </div>
      </div>
    );
  };

  const CollectionDetailsStep = () => {
    const { register, setValue, watch, formState: { errors } } = useFormContext<ComplianceEvidenceFormData>();
    const watchedCollectedBy = watch("collected_by");

    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor="sample_ids" className="text-sm font-medium text-gray-900">
            Sample IDs <span className="text-red-500">*</span>
          </Label>
          <Textarea
            key="sample_ids_textarea"
            value={sampleIdsText}
            onChange={(e) => handleSampleIdsChange(e.target.value)}
            placeholder="Enter sample IDs separated by commas (e.g., SAMPLE_001, SAMPLE_002)"
            className={`mt-1 min-h-32 resize-none ${errors.sample_ids ? "border-red-500" : ""}`}
            disabled={isLoading}
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">Enter sample IDs separated by commas</p>
          {errors.sample_ids && (
            <p className="text-sm text-red-500 mt-1">{errors.sample_ids.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="sampling_method" className="text-sm font-medium text-gray-900">
            Sampling Method <span className="text-red-500">*</span>
          </Label>
          <Input
            key="sampling_method_input"
            id="sampling_method"
            type="text"
            {...register("sampling_method")}
            placeholder="Enter sampling method"
            className={`mt-1 ${errors.sampling_method ? "border-red-500" : ""}`}
            disabled={isLoading}
          />
          {errors.sampling_method && (
            <p className="text-sm text-red-500 mt-1">{errors.sampling_method.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="collection_period_start" className="text-sm font-medium text-gray-900">
              Collection Period Start
            </Label>
            <Input
              key="collection_period_start_input"
              id="collection_period_start"
              type="date"
              {...register("collection_period_start")}
              className="mt-1"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="collection_period_end" className="text-sm font-medium text-gray-900">
              Collection Period End
            </Label>
            <Input
              key="collection_period_end_input"
              id="collection_period_end"
              type="date"
              {...register("collection_period_end")}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="collected_by" className="text-sm font-medium text-gray-900">
            Collected By
          </Label>
          <Select
            value={watchedCollectedBy ? String(watchedCollectedBy) : "null"}
            onValueChange={(value) =>
              setValue("collected_by", value === "null" ? null : Number(value), { shouldValidate: true })
            }
            disabled={isLoading}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="null" value="null">None</SelectItem>
              {userOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="hash_checksum" className="text-sm font-medium text-gray-900">
            Hash Checksum <span className="text-red-500">*</span>
          </Label>
          <Input
            key="hash_checksum_input"
            id="hash_checksum"
            type="text"
            {...register("hash_checksum")}
            placeholder="Enter hash checksum"
            className={`mt-1 ${errors.hash_checksum ? "border-red-500" : ""}`}
            disabled={isLoading}
          />
          {errors.hash_checksum && (
            <p className="text-sm text-red-500 mt-1">{errors.hash_checksum.message}</p>
          )}
        </div>
      </div>
    );
  };

  const ReviewMetadataStep = () => {
    const { register, setValue, watch, formState: { errors } } = useFormContext<ComplianceEvidenceFormData>();
    const watchedReviewedBy = watch("reviewed_by");

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="review_outcome" className="text-sm font-medium text-gray-900">
              Review Outcome
            </Label>
            <Select
              value={watch("review_outcome") || "null"}
              onValueChange={(value) =>
                setValue("review_outcome", value === "null" ? null : (value as ComplianceEvidenceReviewOutcomeEnum), { shouldValidate: true })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select review outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="null" value="null">None</SelectItem>
                {REVIEW_OUTCOME_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reviewed_by" className="text-sm font-medium text-gray-900">
              Reviewed By
            </Label>
            <Select
              value={watchedReviewedBy ? String(watchedReviewedBy) : "null"}
              onValueChange={(value) =>
                setValue("reviewed_by", value === "null" ? null : Number(value), { shouldValidate: true })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="null" value="null">None</SelectItem>
                {userOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="reviewed_at" className="text-sm font-medium text-gray-900">
            Reviewed At
          </Label>
          <Input
            key="reviewed_at_input"
            id="reviewed_at"
            type="date"
            {...register("reviewed_at")}
            className="mt-1"
            disabled={isLoading}
          />
        </div>
      </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 border-[#E4E7EC] shadow-none">
          <CardContent className="space-y-6 p-0">
            {!hideHeader && (
              <div>
                <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                  {title}
                </h1>
                <p className="font-sans text-sm text-[#667085] mt-1">{description}</p>
              </div>
            )}

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the errors in the form before submitting.
                </AlertDescription>
              </Alert>
            )}

            <MultiStepWizard
              steps={WIZARD_STEPS}
              currentStep={currentStep}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              submitLabel={mode === "create" ? "Create Evidence" : "Update Evidence"}
            >
              {renderStepContent()}
            </MultiStepWizard>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};

