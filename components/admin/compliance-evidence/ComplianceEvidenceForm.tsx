"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComplianceEvidence, useComplianceEvidenceMutations } from "@/hooks/admin/useComplianceEvidence";
import { useRequirements } from "@/hooks/admin/useRequirements";
import { useControls } from "@/hooks/admin/useControls";
import { useGetUsersQuery } from "@/app/lib/features/usersApi";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import {
  CreateComplianceEvidenceRequest,
  UpdateComplianceEvidenceRequest,
  ComplianceEvidenceArtifactTypeEnum,
  ComplianceEvidenceReviewOutcomeEnum,
} from "@/interfaces/ComplianceEvidence";
import {
  createValidationErrors,
  validateTextField,
  validateUrl,
  validateArrayField,
  validateDateRange,
} from "@/lib/utils/validation";
import FormErrorAlert from "@/components/admin/shared/FormErrorAlert";
import FormActions from "@/components/admin/shared/FormActions";
import Spinner from "@/components/ui/spinner";
import Breadcrumbs from "@/components/custom/Breadcrumbs";
import { formatDateForInput } from "@/lib/helpers/date";

interface ComplianceEvidenceFormProps {
  complianceEvidenceId?: string;
  mode: "create" | "edit";
  serverErrors?: Record<string, string[]>;
  onSubmit?: (payload: CreateComplianceEvidenceRequest | UpdateComplianceEvidenceRequest) => Promise<void> | void;
}

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

export default function ComplianceEvidenceForm({
  complianceEvidenceId,
  mode,
  serverErrors,
  onSubmit,
}: ComplianceEvidenceFormProps) {
  const router = useRouter();
  const { complianceEvidence, loading: loadingComplianceEvidence } = useComplianceEvidence(
    mode === "edit" ? complianceEvidenceId : undefined
  );
  const { requirements } = useRequirements({ per_page: 100 });
  const { controls } = useControls({ per_page: 100 });
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery({ per_page: 100 });
  const { data: aiModels = [], isLoading: isLoadingAiModels } = useGetAiModelsQuery({ per_page: 100 });
  const { createComplianceEvidence, updateComplianceEvidence, creating, updating } =
    useComplianceEvidenceMutations();

  const [formData, setFormData] = useState<CreateComplianceEvidenceRequest>({
    control_id: 0,
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
  });

  const [sampleIdsText, setSampleIdsText] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const requirementOptions = useMemo(() => {
    const base =
      requirements?.map((req) => ({
        value: req.id.toString(),
        label: `${req.reference}${req.requirement_text ? ` - ${req.requirement_text.substring(0, 50)}` : ""}`,
      })) || [];

    if (complianceEvidence?.requirement) {
      const rcRequirement = complianceEvidence.requirement;
      const exists = base.some((opt) => opt.value === rcRequirement.id.toString());
      if (!exists) {
        base.unshift({
          value: rcRequirement.id.toString(),
          label: `${rcRequirement.reference}${
            rcRequirement.requirement_text
              ? ` - ${rcRequirement.requirement_text.substring(0, 50)}`
              : ""
          }`,
        });
      }
    }

    return base;
  }, [requirements, complianceEvidence]);

  const controlOptions = useMemo(() => {
    const base =
      controls?.map((ctrl) => ({
        value: ctrl.id.toString(),
        label: `${ctrl.reference} - ${ctrl.name}`,
      })) || [];

    if (complianceEvidence?.control) {
      const rcControl = complianceEvidence.control;
      const exists = base.some((opt) => opt.value === rcControl.id.toString());
      if (!exists) {
        base.unshift({
          value: rcControl.id.toString(),
          label: `${rcControl.reference} - ${rcControl.name}`,
        });
      }
    }

    return base;
  }, [controls, complianceEvidence]);

  const userOptions = useMemo(() => {
    const base =
      users?.map((user) => ({
        value: user.id.toString(),
        label: `${user.name} (${user.email})`,
      })) || [];

    const collected = complianceEvidence?.collected_by_user || complianceEvidence?.collectedBy;
    if (collected) {
      const exists = base.some((opt) => opt.value === collected.id.toString());
      if (!exists) {
        base.unshift({
          value: collected.id.toString(),
          label: `${collected.name} (${collected.email})`,
        });
      }
    }

    const reviewed = complianceEvidence?.reviewed_by_user || complianceEvidence?.reviewedBy;
    if (reviewed) {
      const exists = base.some((opt) => opt.value === reviewed.id.toString());
      if (!exists) {
        base.unshift({
          value: reviewed.id.toString(),
          label: `${reviewed.name} (${reviewed.email})`,
        });
      }
    }

    return base;
  }, [users, complianceEvidence]);

  const aiModelOptions = useMemo(() => {
    const base =
      aiModels?.map((model) => ({
        value: model.id.toString(),
        label: `${model.name}${model.display_id ? ` (${model.display_id})` : ""}`,
      })) || [];

    if (complianceEvidence?.ai_model_id) {
      const rcAiModelId = complianceEvidence.ai_model_id;
      const exists = base.some((opt) => opt.value === rcAiModelId.toString());
      if (!exists) {
        const aiModelData = (complianceEvidence as any).ai_model || complianceEvidence.aiModel;
        base.unshift({
          value: rcAiModelId.toString(),
          label: aiModelData
            ? `${aiModelData.name}${aiModelData.display_id ? ` (${aiModelData.display_id})` : ""}`
            : `AI Model #${rcAiModelId}`,
        });
      }
    }

    return base;
  }, [aiModels, complianceEvidence]);

  useEffect(() => {
    if (mode === "edit" && complianceEvidence) {
      const sampleIds = complianceEvidence.sample_ids || [];
      setFormData({
        control_id: complianceEvidence.control_id,
        requirement_id: complianceEvidence.requirement_id ?? null,
        ai_model_id: complianceEvidence.ai_model_id ?? null,
        artifact_type: complianceEvidence.artifact_type,
        artifact_uri: complianceEvidence.artifact_uri || "",
        sample_ids: sampleIds,
        sampling_method: complianceEvidence.sampling_method || "",
        collection_period_start: formatDateForInput(complianceEvidence.collection_period_start),
        collection_period_end: formatDateForInput(complianceEvidence.collection_period_end),
        collected_by: complianceEvidence.collected_by ?? null,
        review_outcome: complianceEvidence.review_outcome ?? null,
        reviewed_by: complianceEvidence.reviewed_by ?? null,
        reviewed_at: formatDateForInput(complianceEvidence.reviewed_at),
        hash_checksum: complianceEvidence.hash_checksum || "",
      });
      setSampleIdsText(sampleIds.join(", "));
    }
  }, [mode, complianceEvidence]);

  const combinedErrors = useMemo(
    () => ({ ...validationErrors, ...(serverErrors || {}) }),
    [validationErrors, serverErrors]
  );

  const handleInputChange = useCallback(
    <K extends keyof CreateComplianceEvidenceRequest>(
      field: K,
      value: CreateComplianceEvidenceRequest[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSampleIdsChange = useCallback((text: string) => {
    setSampleIdsText(text);
    const ids = text
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
    handleInputChange("sample_ids", ids);
  }, [handleInputChange]);

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      control_id: formData.control_id === 0 ? ["Control is required"] : [],
      artifact_type: validateTextField(formData.artifact_type, {
        required: true,
        messages: { required: "Artifact type is required" },
      }),
      artifact_uri: [
        ...validateTextField(formData.artifact_uri, {
          required: true,
          maxLength: 2048,
          messages: { required: "Artifact URI is required", maxLength: "Artifact URI must be at most 2048 characters" },
        }),
        ...validateUrl(formData.artifact_uri, "Artifact URI must be a valid URL"),
      ],
      sample_ids: validateArrayField(formData.sample_ids, {
        required: true,
        messages: { required: "At least one sample ID is required" },
      }),
      sampling_method: validateTextField(formData.sampling_method, {
        required: true,
        maxLength: 255,
        messages: { required: "Sampling method is required", maxLength: "Sampling method must be at most 255 characters" },
      }),
      hash_checksum: validateTextField(formData.hash_checksum, {
        required: true,
        maxLength: 255,
        messages: { required: "Hash checksum is required", maxLength: "Hash checksum must be at most 255 characters" },
      }),
      collection_period_end: validateDateRange(
        formData.collection_period_start,
        formData.collection_period_end,
        {
          messages: {
            invalidRange: "Collection period end must be on or after collection period start",
          },
        }
      ),
    };

    const errors = createValidationErrors(fieldErrors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload: CreateComplianceEvidenceRequest | UpdateComplianceEvidenceRequest = {
      ...formData,
      control_id: Number(formData.control_id),
      requirement_id: formData.requirement_id ? Number(formData.requirement_id) : null,
      ai_model_id: formData.ai_model_id ? Number(formData.ai_model_id) : null,
      collected_by: formData.collected_by ? Number(formData.collected_by) : null,
      reviewed_by: formData.reviewed_by ? Number(formData.reviewed_by) : null,
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else if (mode === "create") {
        await createComplianceEvidence(payload as CreateComplianceEvidenceRequest);
      } else if (mode === "edit" && complianceEvidenceId) {
        await updateComplianceEvidence(complianceEvidenceId, payload as UpdateComplianceEvidenceRequest);
      }
    } catch {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCancel = () => {
    router.push("/admin/compliance-library/compliance-evidences");
  };

  const isLoading = loadingComplianceEvidence || creating || updating;

  if (mode === "edit" && loadingComplianceEvidence) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-6 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-[#737373]">Loading compliance evidence...</p>
      </div>
    );
  }

  if (mode === "edit" && !loadingComplianceEvidence && !complianceEvidence) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#171717]">Compliance Evidence not found</p>
          <p className="mt-2 text-[#737373]">The compliance evidence you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Compliance Evidence
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-6 py-6">
      <Breadcrumbs
        items={[
          { label: "Compliance Library", href: "/admin/compliance-library/frameworks" },
          { label: "Compliance Evidence", href: "/admin/compliance-library/compliance-evidences" },
          { label: mode === "create" ? "Create" : "Edit" },
        ]}
      />
      <div className="mt-6 mb-8">
        <h1 className="text-3xl text-[#171717] font-bold">
          {mode === "create" ? "Create Compliance Evidence" : "Edit Compliance Evidence"}
        </h1>
      </div>

      <Card className="w-full shadow-none p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormErrorAlert errors={combinedErrors} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Control <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.control_id ? String(formData.control_id) : ""}
                onValueChange={(value) => handleInputChange("control_id", Number(value))}
                disabled={isLoading}
              >
                <SelectTrigger className={`mt-1 w-full ${combinedErrors.control_id ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select control" />
                </SelectTrigger>
                <SelectContent>
                  {controlOptions.length > 0 ? (
                    controlOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-controls" disabled>
                      No controls found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {combinedErrors.control_id && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.control_id[0]}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">Requirement</Label>
              <Select
                value={formData.requirement_id ? String(formData.requirement_id) : "null"}
                onValueChange={(value) =>
                  handleInputChange("requirement_id", value === "null" ? null : Number(value))
                }
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select requirement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {requirementOptions.length > 0 ? (
                    requirementOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-requirements" disabled>
                      No requirements found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">AI Model</Label>
              <Select
                value={formData.ai_model_id ? String(formData.ai_model_id) : "null"}
                onValueChange={(value) =>
                  handleInputChange("ai_model_id", value === "null" ? null : Number(value))
                }
                disabled={isLoading || isLoadingAiModels}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {aiModelOptions.length > 0 ? (
                    aiModelOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-models" disabled>
                      {isLoadingAiModels ? "Loading AI models..." : "No AI models found"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">
                Artifact Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.artifact_type}
                onValueChange={(value) =>
                  handleInputChange("artifact_type", value as ComplianceEvidenceArtifactTypeEnum)
                }
                disabled={isLoading}
              >
                <SelectTrigger className={`mt-1 w-full ${combinedErrors.artifact_type ? "border-red-500" : ""}`}>
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
              {combinedErrors.artifact_type && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.artifact_type[0]}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900">
              Artifact URI <span className="text-red-500">*</span>
            </Label>
            <Input
              type="url"
              value={formData.artifact_uri}
              onChange={(e) => handleInputChange("artifact_uri", e.target.value)}
              placeholder="https://example.com/artifact"
              className={`mt-1 ${combinedErrors.artifact_uri ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {combinedErrors.artifact_uri && (
              <p className="text-sm text-red-500 mt-1">{combinedErrors.artifact_uri[0]}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900">
              Sample IDs <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={sampleIdsText}
              onChange={(e) => handleSampleIdsChange(e.target.value)}
              placeholder="Enter sample IDs separated by commas (e.g., SAMPLE_001, SAMPLE_002)"
              className={`mt-1 min-h-32 resize-none ${combinedErrors.sample_ids ? "border-red-500" : ""}`}
              disabled={isLoading}
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">Enter sample IDs separated by commas</p>
            {combinedErrors.sample_ids && (
              <p className="text-sm text-red-500 mt-1">{combinedErrors.sample_ids[0]}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900">
              Sampling Method <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={formData.sampling_method}
              onChange={(e) => handleInputChange("sampling_method", e.target.value)}
              placeholder="Enter sampling method"
              className={`mt-1 ${combinedErrors.sampling_method ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {combinedErrors.sampling_method && (
              <p className="text-sm text-red-500 mt-1">{combinedErrors.sampling_method[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">Collection Period Start</Label>
              <Input
                type="date"
                value={formData.collection_period_start || ""}
                onChange={(e) => handleInputChange("collection_period_start", e.target.value || null)}
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">Collection Period End</Label>
              <Input
                type="date"
                value={formData.collection_period_end || ""}
                onChange={(e) => handleInputChange("collection_period_end", e.target.value || null)}
                className={`mt-1 ${combinedErrors.collection_period_end ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              {combinedErrors.collection_period_end && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.collection_period_end[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">Collected By</Label>
              <Select
                value={formData.collected_by ? String(formData.collected_by) : "null"}
                onValueChange={(value) =>
                  handleInputChange("collected_by", value === "null" ? null : Number(value))
                }
                disabled={isLoading || isLoadingUsers}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {userOptions.length > 0 ? (
                    userOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users" disabled>
                      {isLoadingUsers ? "Loading users..." : "No users found"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">Review Outcome</Label>
              <Select
                value={formData.review_outcome || "null"}
                onValueChange={(value) =>
                  handleInputChange(
                    "review_outcome",
                    value === "null" ? null : (value as ComplianceEvidenceReviewOutcomeEnum)
                  )
                }
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select review outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {REVIEW_OUTCOME_OPTIONS.map((opt) => (
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
              <Label className="text-sm font-medium text-gray-900">Reviewed By</Label>
              <Select
                value={formData.reviewed_by ? String(formData.reviewed_by) : "null"}
                onValueChange={(value) =>
                  handleInputChange("reviewed_by", value === "null" ? null : Number(value))
                }
                disabled={isLoading || isLoadingUsers}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {userOptions.length > 0 ? (
                    userOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users" disabled>
                      {isLoadingUsers ? "Loading users..." : "No users found"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">Reviewed At</Label>
              <Input
                type="date"
                value={formData.reviewed_at || ""}
                onChange={(e) => handleInputChange("reviewed_at", e.target.value || null)}
                className="mt-1"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900">
              Hash Checksum <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={formData.hash_checksum}
              onChange={(e) => handleInputChange("hash_checksum", e.target.value)}
              placeholder="Enter hash checksum"
              className={`mt-1 ${combinedErrors.hash_checksum ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {combinedErrors.hash_checksum && (
              <p className="text-sm text-red-500 mt-1">{combinedErrors.hash_checksum[0]}</p>
            )}
          </div>

          <FormActions
            isLoading={isLoading}
            isEditing={mode === "edit"}
            onCancel={handleCancel}
            submitLabel={
              isLoading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create"
                : "Update"
            }
            submitClassName="bg-primary text-white px-6 h-10 rounded-lg font-medium"
            cancelClassName="px-6 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          />
        </form>
      </Card>
    </div>
  );
}

