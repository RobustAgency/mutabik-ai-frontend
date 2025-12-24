"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetFrameworksQuery } from "@/app/lib/features/frameworksApi";
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
import { useFormContext } from "react-hook-form";

const SUBMISSION_TYPE_OPTIONS: { value: RegulatorySubmissionTypeEnum; label: string }[] = [
  { value: RegulatorySubmissionTypeEnum.REGISTRATION, label: "Registration" },
  { value: RegulatorySubmissionTypeEnum.NOTIFICATION, label: "Notification" },
  { value: RegulatorySubmissionTypeEnum.CONFORMITY_ASSESSMENT, label: "Conformity Assessment" },
  { value: RegulatorySubmissionTypeEnum.INCIDENT_REPORT, label: "Incident Report" },
  { value: RegulatorySubmissionTypeEnum.DPIA_FILING, label: "DPIA Filing" },
  { value: RegulatorySubmissionTypeEnum.RENEWAL, label: "Renewal" },
  { value: RegulatorySubmissionTypeEnum.AUDIT_RESPONSE, label: "Audit Response" },
];

const STATUS_OPTIONS: { value: RegulatorySubmissionStatusEnum; label: string }[] = [
  { value: RegulatorySubmissionStatusEnum.DRAFT, label: "Draft" },
  { value: RegulatorySubmissionStatusEnum.SUBMITTED, label: "Submitted" },
  { value: RegulatorySubmissionStatusEnum.ACKNOWLEDGED, label: "Acknowledged" },
  { value: RegulatorySubmissionStatusEnum.APPROVED, label: "Approved" },
  { value: RegulatorySubmissionStatusEnum.REJECTED, label: "Rejected" },
  { value: RegulatorySubmissionStatusEnum.CLOSED, label: "Closed" },
];

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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [jurisdictionText, setJurisdictionText] = useState("");
  const [commitmentsText, setCommitmentsText] = useState("");
  const [evidenceBundleText, setEvidenceBundleText] = useState("");

  // Fetch data for dropdowns
  const { data: frameworksData } = useGetFrameworksQuery({ per_page: 100 });
  const frameworks = frameworksData?.data ?? [];
  const { data: users = [] } = useGetOrganizationUsersQuery({ per_page: 100 });
  const { data: aiModels = [] } = useGetAiModelsQuery({ per_page: 100 });

  const methods = useForm<RegulatorySubmissionFormData>({
    resolver: zodResolver(regulatorySubmissionSchema) as any,
    defaultValues: initialFormData as RegulatorySubmissionFormData,
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

  const watchedFrameworkId = watch("framework_id");
  const watchedAiModelId = watch("ai_model_id");
  const watchedSubmittedBy = watch("submitted_by");
  const watchedJurisdiction = watch("jurisdiction");
  const watchedCommitments = watch("commitments");
  const watchedEvidenceBundleIds = watch("evidence_bundle_ids");

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
        renewal_due_at: initialData.renewal_due_at ? initialData.renewal_due_at.split("T")[0] : "",
        evidence_bundle_ids: evidenceIds,
        submitted_at: initialData.submitted_at ? initialData.submitted_at.split("T")[0] : "",
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

  useEffect(() => {
    if (watchedEvidenceBundleIds) {
      setEvidenceBundleText(watchedEvidenceBundleIds.join(", "));
    }
  }, [watchedEvidenceBundleIds]);

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

  const handleJurisdictionChange = (text: string) => {
    setJurisdictionText(text);
    const parts = text
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    setValue("jurisdiction", parts, { shouldValidate: true });
  };

  const handleCommitmentsChange = (text: string) => {
    setCommitmentsText(text);
    const parts = text
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    setValue("commitments", parts, { shouldValidate: true });
  };

  const handleEvidenceBundleIdsChange = (text: string) => {
    setEvidenceBundleText(text);
    const parts = text
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const nums = parts.map((p) => Number(p)).filter((n) => !Number.isNaN(n));
    setValue("evidence_bundle_ids", nums, { shouldValidate: true });
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

  // Step components (using useFormContext - defined inside to access closure variables)
  const BasicInformationStep = () => {
    const { register, setValue, watch, formState: { errors } } = useFormContext<RegulatorySubmissionFormData>();
    const watchedFrameworkId = watch("framework_id");
    const watchedAiModelId = watch("ai_model_id");

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="framework_id" className="text-sm font-medium text-gray-900">
              Framework
            </Label>
            <Select
              value={watchedFrameworkId ? String(watchedFrameworkId) : "null"}
              onValueChange={(value) =>
                setValue("framework_id", value === "null" ? null : Number(value), { shouldValidate: true })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="null" value="null">None</SelectItem>
                {frameworkOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
        </div>

        <div>
          <Label htmlFor="authority" className="text-sm font-medium text-gray-900">
            Authority <span className="text-red-500">*</span>
          </Label>
          <Input
            id="authority"
            type="text"
            {...register("authority")}
            placeholder="Enter authority"
            className={`mt-1 ${errors.authority ? "border-red-500" : ""}`}
            disabled={isLoading}
          />
          {errors.authority && (
            <p className="text-sm text-red-500 mt-1">{errors.authority.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="jurisdiction" className="text-sm font-medium text-gray-900">
            Jurisdiction <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={jurisdictionText}
            onChange={(e) => handleJurisdictionChange(e.target.value)}
            placeholder="Enter jurisdictions separated by commas (e.g., US, EU, UK)"
            className={`mt-1 min-h-24 resize-none ${errors.jurisdiction ? "border-red-500" : ""}`}
            disabled={isLoading}
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">Enter jurisdictions separated by commas</p>
          {errors.jurisdiction && (
            <p className="text-sm text-red-500 mt-1">{errors.jurisdiction.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="submission_type" className="text-sm font-medium text-gray-900">
              Submission Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("submission_type")}
              onValueChange={(value) =>
                setValue("submission_type", value as RegulatorySubmissionTypeEnum, { shouldValidate: true })
              }
              disabled={isLoading}
            >
              <SelectTrigger className={`w-full mt-1 ${errors.submission_type ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select submission type" />
              </SelectTrigger>
              <SelectContent>
                {SUBMISSION_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.submission_type && (
              <p className="text-sm text-red-500 mt-1">{errors.submission_type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium text-gray-900">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("status")}
              onValueChange={(value) =>
                setValue("status", value as RegulatorySubmissionStatusEnum, { shouldValidate: true })
              }
              disabled={isLoading}
            >
              <SelectTrigger className={`w-full mt-1 ${errors.status ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="tracking_id" className="text-sm font-medium text-gray-900">
            Tracking ID <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tracking_id"
            type="text"
            {...register("tracking_id")}
            placeholder="Enter tracking ID"
            className={`mt-1 ${errors.tracking_id ? "border-red-500" : ""}`}
            disabled={isLoading}
          />
          {errors.tracking_id && (
            <p className="text-sm text-red-500 mt-1">{errors.tracking_id.message}</p>
          )}
        </div>
      </div>
    );
  };

  const ContentDetailsStep = () => {
    const { register, formState: { errors } } = useFormContext<RegulatorySubmissionFormData>();

    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor="content_summary" className="text-sm font-medium text-gray-900">
            Content Summary <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="content_summary"
            {...register("content_summary")}
            placeholder="Enter content summary"
            className={`mt-1 min-h-32 resize-none ${errors.content_summary ? "border-red-500" : ""}`}
            disabled={isLoading}
            rows={5}
          />
          {errors.content_summary && (
            <p className="text-sm text-red-500 mt-1">{errors.content_summary.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="commitments" className="text-sm font-medium text-gray-900">
            Commitments <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={commitmentsText}
            onChange={(e) => handleCommitmentsChange(e.target.value)}
            placeholder="Enter commitments separated by commas"
            className={`mt-1 min-h-32 resize-none ${errors.commitments ? "border-red-500" : ""}`}
            disabled={isLoading}
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">Enter commitments separated by commas</p>
          {errors.commitments && (
            <p className="text-sm text-red-500 mt-1">{errors.commitments.message}</p>
          )}
        </div>
      </div>
    );
  };

  const SubmissionDetailsStep = () => {
    const { register, setValue, watch, formState: { errors } } = useFormContext<RegulatorySubmissionFormData>();
    const watchedSubmittedBy = watch("submitted_by");

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="submitted_at" className="text-sm font-medium text-gray-900">
              Submitted At <span className="text-red-500">*</span>
            </Label>
            <Input
              id="submitted_at"
              type="date"
              {...register("submitted_at")}
              className={`mt-1 ${errors.submitted_at ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {errors.submitted_at && (
              <p className="text-sm text-red-500 mt-1">{errors.submitted_at.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="renewal_due_at" className="text-sm font-medium text-gray-900">
              Renewal Due At <span className="text-red-500">*</span>
            </Label>
            <Input
              id="renewal_due_at"
              type="date"
              {...register("renewal_due_at")}
              className={`mt-1 ${errors.renewal_due_at ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {errors.renewal_due_at && (
              <p className="text-sm text-red-500 mt-1">{errors.renewal_due_at.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="submitted_by" className="text-sm font-medium text-gray-900">
            Submitted By <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watchedSubmittedBy ? String(watchedSubmittedBy) : ""}
            onValueChange={(value) => {
              if (value) {
                setValue("submitted_by", Number(value), { shouldValidate: true });
              }
            }}
            disabled={isLoading}
          >
            <SelectTrigger className={`w-full mt-1 ${errors.submitted_by ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {userOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.submitted_by && (
            <p className="text-sm text-red-500 mt-1">{errors.submitted_by.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="evidence_bundle_ids" className="text-sm font-medium text-gray-900">
            Evidence Bundle IDs <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={evidenceBundleText}
            onChange={(e) => handleEvidenceBundleIdsChange(e.target.value)}
            placeholder="Enter evidence bundle IDs separated by commas (e.g., 1, 2, 3)"
            className={`mt-1 min-h-24 resize-none ${errors.evidence_bundle_ids ? "border-red-500" : ""}`}
            disabled={isLoading}
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">Enter evidence bundle IDs separated by commas</p>
          {errors.evidence_bundle_ids && (
            <p className="text-sm text-red-500 mt-1">{errors.evidence_bundle_ids.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="documents_uri" className="text-sm font-medium text-gray-900">
            Documents URI <span className="text-red-500">*</span>
          </Label>
          <Input
            id="documents_uri"
            type="url"
            {...register("documents_uri")}
            placeholder="https://example.com/documents"
            className={`mt-1 ${errors.documents_uri ? "border-red-500" : ""}`}
            disabled={isLoading}
          />
          {errors.documents_uri && (
            <p className="text-sm text-red-500 mt-1">{errors.documents_uri.message}</p>
          )}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep />;
      case 2:
        return <ContentDetailsStep />;
      case 3:
        return <SubmissionDetailsStep />;
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

