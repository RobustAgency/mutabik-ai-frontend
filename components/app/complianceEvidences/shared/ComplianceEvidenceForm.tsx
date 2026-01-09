"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useGetControlsQuery } from "@/app/lib/features/controlsApi";
import { useGetRequirementsQuery } from "@/app/lib/features/requirementsApi";
import { useGetOrganizationUsersQuery } from "@/app/lib/features/usersApi";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import type {
  ComplianceEvidence,
  CreateComplianceEvidenceRequest,
} from "@/interfaces/ComplianceEvidence";
import { ComplianceEvidenceArtifactTypeEnum } from "@/interfaces/ComplianceEvidence";
import {
  complianceEvidenceSchema,
  type ComplianceEvidenceFormData,
} from "@/lib/schemas/complianceEvidence.schema";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { CollectionDetailsStep } from "../create/steps/CollectionDetailsStep";
import { ReviewMetadataStep } from "../create/steps/ReviewMetadataStep";


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
  
  const { data: usersResponse } = useGetOrganizationUsersQuery({ per_page: 100 });
  const users = usersResponse?.data ?? [];
  const { data: aiModels = [] } = useGetAiModelsQuery({ per_page: 100 });

  const methods = useForm<ComplianceEvidenceFormData>({
    resolver: zodResolver(complianceEvidenceSchema) as any,
    defaultValues: initialFormData as ComplianceEvidenceFormData,
    mode: "onChange",
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

  const watchedRequirementId = watch("requirement_id");

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

  const handleSampleIdsChange = useCallback((text: string) => {
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
        return (
          <BasicInformationStep
            controlOptions={controlOptions}
            requirementOptions={requirementOptions}
            aiModelOptions={aiModelOptions}
            isLoading={isLoading}
            projectRequirements={projectRequirements}
          />
        );
      case 2:
        return (
          <CollectionDetailsStep
            sampleIdsText={sampleIdsText}
            userOptions={userOptions}
            isLoading={isLoading}
            onSampleIdsChange={handleSampleIdsChange}
          />
        );
      case 3:
        return (
          <ReviewMetadataStep
            userOptions={userOptions}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
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

