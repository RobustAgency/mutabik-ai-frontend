"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useGetUserFrameworksQuery } from "@/app/lib/features/frameworksApi";
import { useGetOrganizationUsersQuery } from "@/app/lib/features/usersApi";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import type {
  RegulatorySubmission,
  CreateRegulatorySubmissionRequest,
} from "@/interfaces/RegulatorySubmission";
import {
  RegulatorySubmissionTypeEnum,
  RegulatorySubmissionStatusEnum,
} from "@/interfaces/RegulatorySubmission";
import {
  regulatorySubmissionSchema,
  type RegulatorySubmissionFormData,
} from "@/lib/schemas/regulatorySubmission.schema";
import { MultiStepWizard } from "@/components/app/useCases/create/MultiStepWizard";
import { BasicInformationStep } from "../create/steps/BasicInformationStep";
import { ContentDetailsStep } from "../create/steps/ContentDetailsStep";
import { SubmissionDetailsStep } from "../create/steps/SubmissionDetailsStep";


const WIZARD_STEPS = [
  { id: 1, title: "Basic Information", description: "Framework, model, authority & submission type" },
  { id: 2, title: "Content Details", description: "Summary, commitments & tracking" },
  { id: 3, title: "Submission Details", description: "Dates, evidence & documents" },
];

const stepFields: Record<number, (keyof RegulatorySubmissionFormData)[]> = {
  1: ["framework_id", "ai_model_id", "authority", "jurisdiction", "submission_type", "status", "tracking_id"],
  2: ["content_summary", "commitments"],
  3: ["submitted_at", "submitted_by", "renewal_due_at", "evidence_bundle_ids", "documents_uri"],
};

const initialFormData: Partial<RegulatorySubmissionFormData> = {
  framework_id: null,
  ai_model_id: null,
  authority: "",
  jurisdiction: [],
  submission_type: RegulatorySubmissionTypeEnum.REGISTRATION,
  content_summary: "",
  tracking_id: "",
  commitments: [],
  status: RegulatorySubmissionStatusEnum.DRAFT,
  renewal_due_at: "",
  evidence_bundle_ids: [],
  submitted_at: "",
  submitted_by: undefined as any,
  documents_uri: "",
};

interface RegulatorySubmissionFormProps {
  mode: "create" | "edit";
  initialData?: RegulatorySubmission;
  isLoading?: boolean;
  onSubmit: (data: CreateRegulatorySubmissionRequest | Partial<CreateRegulatorySubmissionRequest>) => Promise<void>;
  onSuccess?: () => void;
  title: string;
  description: string;
}


export const RegulatorySubmissionForm: React.FC<RegulatorySubmissionFormProps> = ({
  mode,
  initialData,
  isLoading = false,
  onSubmit,
  onSuccess,
  title,
  description,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [jurisdictionText, setJurisdictionText] = useState("");
  const [commitmentsText, setCommitmentsText] = useState("");
  const [evidenceBundleText, setEvidenceBundleText] = useState("");

  // Fetch data for dropdowns
  const { data: frameworksData } = useGetUserFrameworksQuery({ per_page: 100 });
  const frameworks = frameworksData?.data ?? [];
  const { data: usersResponse } = useGetOrganizationUsersQuery({ per_page: 100 });
  const users = usersResponse?.data ?? [];
  const { data: aiModels = [] } = useGetAiModelsQuery({ per_page: 100 });

  const methods = useForm<RegulatorySubmissionFormData>({
    resolver: zodResolver(regulatorySubmissionSchema) as any,
    defaultValues: initialFormData as RegulatorySubmissionFormData,
    mode: "onChange",
  });

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = methods;

  const watchedJurisdiction = watch("jurisdiction");
  const watchedCommitments = watch("commitments");

  // Helper function to parse date strings to YYYY-MM-DD format for HTML date inputs
  const parseDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    // Handle both ISO format (2025-12-25T00:00:00) and space format (2025-12-25 00:00:00)
    const datePart = dateString.split(/[T ]/)[0];
    return datePart || "";
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const juris = initialData.jurisdiction || [];
      const commits = initialData.commitments || [];
      const evidenceIds = initialData.evidence_bundle_ids || [];
      reset({
        framework_id: initialData.framework_id ?? null,
        ai_model_id: initialData.ai_model_id ?? null,
        authority: initialData.authority || "",
        jurisdiction: juris,
        submission_type: initialData.submission_type,
        content_summary: initialData.content_summary || "",
        tracking_id: initialData.tracking_id || "",
        commitments: commits,
        status: initialData.status,
        renewal_due_at: parseDateForInput(initialData.renewal_due_at),
        evidence_bundle_ids: evidenceIds,
        submitted_at: parseDateForInput(initialData.submitted_at),
        submitted_by: initialData.submitted_by || 0,
        documents_uri: initialData.documents_uri || "",
      });
      setJurisdictionText(juris.join(", "));
      setCommitmentsText(commits.join(", "));
      setEvidenceBundleText(evidenceIds.join(", "));
    }
  }, [mode, initialData, reset]);

  useEffect(() => {
    if (watchedJurisdiction) {
      setJurisdictionText(watchedJurisdiction.join(", "));
    }
  }, [watchedJurisdiction]);

  useEffect(() => {
    if (watchedCommitments) {
      setCommitmentsText(watchedCommitments.join(", "));
    }
  }, [watchedCommitments]);


  const frameworkOptions = useMemo(() => {
    return frameworks.map((fw) => ({
      value: fw.id.toString(),
      label: `${fw.name}${fw.version ? ` - ${fw.version}` : ""}`,
    }));
  }, [frameworks]);

  const aiModelOptions = useMemo(() => {
    return aiModels.map((model) => ({
      value: model.id.toString(),
      label: `${model.name}${model.display_id ? ` (${model.display_id})` : ""}`,
    }));
  }, [aiModels]);

  const userOptions = useMemo(() => {
    return users.map((user) => ({
      value: user.id.toString(),
      label: `${user.name} (${user.email})`,
    }));
  }, [users]);

  const handleJurisdictionChange = useCallback((text: string) => {
    setJurisdictionText(text);
    const parts = text
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    setValue("jurisdiction", parts, { shouldValidate: true });
  }, [setValue]);

  const handleCommitmentsChange = useCallback((text: string) => {
    setCommitmentsText(text);
    const parts = text
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    setValue("commitments", parts, { shouldValidate: true });
  }, [setValue]);

  const handleEvidenceBundleIdsChange = useCallback((text: string) => {
    setEvidenceBundleText(text);
    const parts = text
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const nums = parts.map((p) => Number(p)).filter((n) => !Number.isNaN(n));
    setValue("evidence_bundle_ids", nums, { shouldValidate: true });
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

  const handleFormSubmit = handleSubmit(async (data: RegulatorySubmissionFormData) => {
    const payload: CreateRegulatorySubmissionRequest = {
      framework_id: data.framework_id ?? null,
      ai_model_id: data.ai_model_id ?? null,
      authority: data.authority,
      jurisdiction: data.jurisdiction,
      submission_type: data.submission_type,
      content_summary: data.content_summary,
      tracking_id: data.tracking_id,
      commitments: data.commitments,
      status: data.status,
      renewal_due_at: data.renewal_due_at,
      evidence_bundle_ids: data.evidence_bundle_ids,
      submitted_at: data.submitted_at,
      submitted_by: data.submitted_by,
      documents_uri: data.documents_uri,
    };
    await onSubmit(payload);
    onSuccess?.();
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformationStep
            frameworkOptions={frameworkOptions}
            aiModelOptions={aiModelOptions}
            jurisdictionText={jurisdictionText}
            isLoading={isLoading}
            onJurisdictionChange={handleJurisdictionChange}
          />
        );
      case 2:
        return (
          <ContentDetailsStep
            commitmentsText={commitmentsText}
            isLoading={isLoading}
            onCommitmentsChange={handleCommitmentsChange}
          />
        );
      case 3:
        return (
          <SubmissionDetailsStep
            userOptions={userOptions}
            evidenceBundleText={evidenceBundleText}
            isLoading={isLoading}
            onEvidenceBundleIdsChange={handleEvidenceBundleIdsChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 border-[#E4E7EC] shadow-none">
        <CardContent className="space-y-6 p-0">
          <div>
            <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
              {title}
            </h1>
            <p className="font-sans text-sm text-[#667085] mt-1">{description}</p>
          </div>

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the errors in the form before submitting.
                </AlertDescription>
              </Alert>
            )}

          <FormProvider {...methods}>
            <MultiStepWizard
              steps={WIZARD_STEPS}
              currentStep={currentStep}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              submitLabel={mode === "create" ? "Create Submission" : "Update Submission"}
            >
              {renderStepContent()}
            </MultiStepWizard>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

