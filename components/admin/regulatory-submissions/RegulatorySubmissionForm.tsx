"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetUsersQuery } from "@/app/lib/features/usersApi";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import { useFrameworks } from "@/hooks/admin/useFrameworks";
import {
  RegulatorySubmissionTypeEnum,
  RegulatorySubmissionStatusEnum,
  CreateRegulatorySubmissionRequest,
  UpdateRegulatorySubmissionRequest,
} from "@/interfaces/RegulatorySubmission";
import { useRegulatorySubmission, useRegulatorySubmissionMutations } from "@/hooks/admin/useRegulatorySubmissions";
import { createValidationErrors, validateArrayField, validateDate, validateTextField, validateUrl } from "@/lib/utils/validation";
import FormErrorAlert from "@/components/admin/shared/FormErrorAlert";
import FormActions from "@/components/admin/shared/FormActions";
import Spinner from "@/components/ui/spinner";
import Breadcrumbs from "@/components/custom/Breadcrumbs";

interface RegulatorySubmissionFormProps {
  regulatorySubmissionId?: string;
  mode: "create" | "edit";
  serverErrors?: Record<string, string[]>;
  onSubmit?: (payload: CreateRegulatorySubmissionRequest | UpdateRegulatorySubmissionRequest) => Promise<void> | void;
}

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

const parseDateOnly = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  if (dateStr.includes("T")) return dateStr.split("T")[0];
  if (dateStr.includes(" ")) return dateStr.split(" ")[0];
  return dateStr;
};

export default function RegulatorySubmissionForm({
  regulatorySubmissionId,
  mode,
  serverErrors,
  onSubmit,
}: RegulatorySubmissionFormProps) {
  const router = useRouter();
  const { regulatorySubmission, loading: loadingSubmission } = useRegulatorySubmission(
    mode === "edit" ? regulatorySubmissionId : undefined
  );
  const { frameworks } = useFrameworks({ per_page: 100 });
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery({ per_page: 100 });
  const { data: aiModels = [], isLoading: isLoadingAiModels } = useGetAiModelsQuery({ per_page: 100 });
  const { createRegulatorySubmission, updateRegulatorySubmission, creating, updating } =
    useRegulatorySubmissionMutations();

  const [formData, setFormData] = useState<CreateRegulatorySubmissionRequest>({
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
    submitted_by: 0,
    documents_uri: "",
  });

  const [jurisdictionText, setJurisdictionText] = useState("");
  const [commitmentsText, setCommitmentsText] = useState("");
  const [evidenceBundleText, setEvidenceBundleText] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const frameworkOptions = useMemo(() => {
    const list = frameworks || [];
    const base = list.map((fw) => ({
      value: fw.id.toString(),
      label: `${fw.name}${fw.version ? ` - ${fw.version}` : ""}`,
    }));

    if (regulatorySubmission?.framework) {
      const fw = regulatorySubmission.framework;
      const exists = base.some((opt) => opt.value === fw.id.toString());
      if (!exists) {
        base.unshift({
          value: fw.id.toString(),
          label: `${fw.name}${fw.version ? ` - ${fw.version}` : ""}`,
        });
      }
    } else if (regulatorySubmission?.framework_id) {
      const idStr = regulatorySubmission.framework_id.toString();
      const exists = base.some((opt) => opt.value === idStr);
      if (!exists) {
        base.unshift({
          value: idStr,
          label: `Framework #${idStr}`,
        });
      }
    }

    return base;
  }, [frameworks, regulatorySubmission]);

  const aiModelOptions = useMemo(() => {
    const base =
      aiModels?.map((model) => ({
        value: model.id.toString(),
        label: `${model.name}${model.display_id ? ` (${model.display_id})` : ""}`,
      })) || [];

    if (regulatorySubmission) {
      const rcAiModelId = regulatorySubmission.ai_model_id;
      if (rcAiModelId != null) {
        const exists = base.some((opt) => opt.value === rcAiModelId.toString());
        if (!exists) {
          const aiModelData = regulatorySubmission.ai_model || regulatorySubmission.aiModel;
          base.unshift({
            value: rcAiModelId.toString(),
            label: aiModelData
              ? `${aiModelData.name}${aiModelData.display_id ? ` (${aiModelData.display_id})` : ""}`
              : `AI Model #${rcAiModelId}`,
          });
        }
      }
    }

    return base;
  }, [aiModels, regulatorySubmission]);

  const userOptions = useMemo(() => {
    const base =
      users?.map((user) => ({
        value: user.id.toString(),
        label: `${user.name} (${user.email})`,
      })) || [];

    const submitted = regulatorySubmission?.submitted_by_user || regulatorySubmission?.submittedBy;
    if (submitted) {
      const exists = base.some((opt) => opt.value === submitted.id.toString());
      if (!exists) {
        base.unshift({
          value: submitted.id.toString(),
          label: `${submitted.name} (${submitted.email})`,
        });
      }
    }

    return base;
  }, [users, regulatorySubmission]);

  useEffect(() => {
    if (mode === "edit" && regulatorySubmission) {
      const juris = regulatorySubmission.jurisdiction || [];
      const commits = regulatorySubmission.commitments || [];
      const evidenceIds = regulatorySubmission.evidence_bundle_ids || [];
      setFormData({
        framework_id: regulatorySubmission.framework_id != null ? regulatorySubmission.framework_id : null,
        ai_model_id: regulatorySubmission.ai_model_id != null ? regulatorySubmission.ai_model_id : null,
        authority: regulatorySubmission.authority || "",
        jurisdiction: juris,
        submission_type: (regulatorySubmission.submission_type as RegulatorySubmissionTypeEnum) || RegulatorySubmissionTypeEnum.REGISTRATION,
        content_summary: regulatorySubmission.content_summary || "",
        tracking_id: regulatorySubmission.tracking_id || "",
        commitments: commits,
        status: (regulatorySubmission.status as RegulatorySubmissionStatusEnum) || RegulatorySubmissionStatusEnum.DRAFT,
        renewal_due_at: regulatorySubmission.renewal_due_at
          ? parseDateOnly(regulatorySubmission.renewal_due_at) || ""
          : "",
        evidence_bundle_ids: evidenceIds,
        submitted_at: regulatorySubmission.submitted_at
          ? parseDateOnly(regulatorySubmission.submitted_at) || ""
          : "",
        submitted_by: regulatorySubmission.submitted_by || 0,
        documents_uri: regulatorySubmission.documents_uri || "",
      });
      setJurisdictionText(juris.join(", "));
      setCommitmentsText(commits.join(", "));
      setEvidenceBundleText(evidenceIds.join(", "));
    }
  }, [mode, regulatorySubmission]);

  const combinedErrors = useMemo(
    () => ({ ...validationErrors, ...(serverErrors || {}) }),
    [validationErrors, serverErrors]
  );

  const handleInputChange = useCallback(
    <K extends keyof CreateRegulatorySubmissionRequest>(
      field: K,
      value: CreateRegulatorySubmissionRequest[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleArrayTextChange = useCallback(
    (text: string, target: "jurisdiction" | "commitments" | "evidence_bundle_ids") => {
      const parts = text
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      if (target === "jurisdiction") {
        setJurisdictionText(text);
        handleInputChange("jurisdiction", parts);
      } else if (target === "commitments") {
        setCommitmentsText(text);
        handleInputChange("commitments", parts);
      } else {
        setEvidenceBundleText(text);
        const nums = parts.map((p) => Number(p)).filter((n) => !Number.isNaN(n));
        handleInputChange("evidence_bundle_ids", nums);
      }
    },
    [handleInputChange]
  );

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      authority: validateTextField(formData.authority, {
        required: true,
        maxLength: 255,
        messages: { required: "Authority is required", maxLength: "Authority must be at most 255 characters" },
      }),
      jurisdiction: validateArrayField(formData.jurisdiction, {
        required: true,
        minLength: 1,
        messages: { required: "At least one jurisdiction is required", minLength: "At least one jurisdiction is required" },
      }),
      submission_type: validateTextField(formData.submission_type, {
        required: true,
        messages: { required: "Submission type is required" },
      }),
      content_summary: validateTextField(formData.content_summary, {
        required: true,
        maxLength: 5000,
        messages: { required: "Content summary is required", maxLength: "Content summary must be at most 5000 characters" },
      }),
      tracking_id: validateTextField(formData.tracking_id, {
        required: true,
        maxLength: 255,
        messages: { required: "Tracking ID is required", maxLength: "Tracking ID must be at most 255 characters" },
      }),
      commitments: validateArrayField(formData.commitments, {
        required: true,
        messages: { required: "At least one commitment is required" },
      }),
      status: validateTextField(formData.status, {
        required: true,
        messages: { required: "Status is required" },
      }),
      renewal_due_at: validateDate(formData.renewal_due_at, {
        messages: { invalid: "Renewal due date is invalid" },
      }),
      evidence_bundle_ids: validateArrayField(formData.evidence_bundle_ids, {
        required: true,
        messages: { required: "At least one evidence bundle ID is required" },
      }),
      submitted_at: validateDate(formData.submitted_at, {
        messages: { invalid: "Submitted at must be a valid date" },
      }),
      submitted_by:
        formData.submitted_by && formData.submitted_by > 0 ? [] : ["Submitted By is required"],
      documents_uri: [
        ...validateTextField(formData.documents_uri, {
          required: true,
          maxLength: 2048,
          messages: { required: "Documents URI is required", maxLength: "Documents URI must be at most 2048 characters" },
        }),
        ...validateUrl(formData.documents_uri, "Documents URI must be a valid URL"),
      ],
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

    const payload: CreateRegulatorySubmissionRequest | UpdateRegulatorySubmissionRequest = {
      ...formData,
      framework_id: formData.framework_id ? Number(formData.framework_id) : null,
      ai_model_id: formData.ai_model_id ? Number(formData.ai_model_id) : null,
      submitted_by: Number(formData.submitted_by),
      renewal_due_at: formData.renewal_due_at || "",
      submitted_at: formData.submitted_at || "",
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else if (mode === "create") {
        await createRegulatorySubmission(payload as CreateRegulatorySubmissionRequest);
      } else if (mode === "edit" && regulatorySubmissionId) {
        await updateRegulatorySubmission(regulatorySubmissionId, payload as UpdateRegulatorySubmissionRequest);
      }
    } catch {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCancel = () => {
    router.push("/admin/compliance-library/regulatory-submissions");
  };

  const isLoading = loadingSubmission || creating || updating;

  if (mode === "edit" && loadingSubmission) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-6 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-[#737373]">Loading regulatory submission...</p>
      </div>
    );
  }

  if (mode === "edit" && !loadingSubmission && !regulatorySubmission) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#171717]">Regulatory Submission not found</p>
          <p className="mt-2 text-[#737373]">The regulatory submission you're looking for doesn't exist.</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Regulatory Submissions
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
          { label: "Regulatory Submissions", href: "/admin/compliance-library/regulatory-submissions" },
          { label: mode === "create" ? "Create" : "Edit" },
        ]}
      />
      <div className="mt-6 mb-8">
        <h1 className="text-3xl text-[#171717] font-bold">
          {mode === "create" ? "Create Regulatory Submission" : "Edit Regulatory Submission"}
        </h1>
      </div>

      <Card className="w-full shadow-none p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormErrorAlert errors={combinedErrors} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">Framework</Label>
              <Select
                key={`framework-${formData.framework_id ?? "null"}-${frameworkOptions.length}`}
                value={formData.framework_id != null ? String(formData.framework_id) : "null"}
                onValueChange={(value) => handleInputChange("framework_id", value === "null" ? null : Number(value))}
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {frameworkOptions.length > 0 ? (
                    frameworkOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-frameworks" disabled>
                      No frameworks found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">AI Model</Label>
              <Select
                key={`ai-model-${formData.ai_model_id ?? "null"}-${aiModelOptions.length}`}
                value={formData.ai_model_id != null ? String(formData.ai_model_id) : "null"}
                onValueChange={(value) => handleInputChange("ai_model_id", value === "null" ? null : Number(value))}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Authority <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={formData.authority}
                onChange={(e) => handleInputChange("authority", e.target.value)}
                placeholder="Enter authority"
                className={`mt-1 ${combinedErrors.authority ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              {combinedErrors.authority && <p className="text-sm text-red-500 mt-1">{combinedErrors.authority[0]}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">
                Submission Type <span className="text-red-500">*</span>
              </Label>
              <Select
                key={`submission-type-${formData.submission_type}`}
                value={formData.submission_type || ""}
                onValueChange={(value) => handleInputChange("submission_type", value as RegulatorySubmissionTypeEnum)}
                disabled={isLoading}
              >
                <SelectTrigger className={`mt-1 w-full ${combinedErrors.submission_type ? "border-red-500" : ""}`}>
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
              {combinedErrors.submission_type && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.submission_type[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Jurisdiction <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={jurisdictionText}
                onChange={(e) => handleArrayTextChange(e.target.value, "jurisdiction")}
                placeholder="Enter jurisdictions separated by commas"
                className={`mt-1 min-h-24 resize-none ${combinedErrors.jurisdiction ? "border-red-500" : ""}`}
                disabled={isLoading}
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple jurisdictions with commas.</p>
              {combinedErrors.jurisdiction && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.jurisdiction[0]}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">
                Commitments <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={commitmentsText}
                onChange={(e) => handleArrayTextChange(e.target.value, "commitments")}
                placeholder="Enter commitments separated by commas"
                className={`mt-1 min-h-24 resize-none ${combinedErrors.commitments ? "border-red-500" : ""}`}
                disabled={isLoading}
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple commitments with commas.</p>
              {combinedErrors.commitments && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.commitments[0]}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900">
              Content Summary <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.content_summary}
              onChange={(e) => handleInputChange("content_summary", e.target.value)}
              placeholder="Enter content summary"
              className={`mt-1 min-h-32 resize-none ${combinedErrors.content_summary ? "border-red-500" : ""}`}
              disabled={isLoading}
              rows={4}
            />
            {combinedErrors.content_summary && (
              <p className="text-sm text-red-500 mt-1">{combinedErrors.content_summary[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Tracking ID <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={formData.tracking_id}
                onChange={(e) => handleInputChange("tracking_id", e.target.value)}
                placeholder="Enter tracking ID"
                className={`mt-1 ${combinedErrors.tracking_id ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              {combinedErrors.tracking_id && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.tracking_id[0]}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                key={`status-${formData.status}`}
                value={formData.status || ""}
                onValueChange={(value) => handleInputChange("status", value as RegulatorySubmissionStatusEnum)}
                disabled={isLoading}
              >
                <SelectTrigger className={`mt-1 w-full ${combinedErrors.status ? "border-red-500" : ""}`}>
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
              {combinedErrors.status && <p className="text-sm text-red-500 mt-1">{combinedErrors.status[0]}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Renewal Due At <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.renewal_due_at || ""}
                onChange={(e) => handleInputChange("renewal_due_at", e.target.value || "")}
                className={`mt-1 ${combinedErrors.renewal_due_at ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              {combinedErrors.renewal_due_at && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.renewal_due_at[0]}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">
                Submitted At <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.submitted_at || ""}
                onChange={(e) => handleInputChange("submitted_at", e.target.value || "")}
                className={`mt-1 ${combinedErrors.submitted_at ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              {combinedErrors.submitted_at && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.submitted_at[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Submitted By <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.submitted_by ? String(formData.submitted_by) : ""}
                onValueChange={(value) => handleInputChange("submitted_by", Number(value))}
                disabled={isLoading || isLoadingUsers}
              >
                <SelectTrigger className={`mt-1 w-full ${combinedErrors.submitted_by ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
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
              {combinedErrors.submitted_by && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.submitted_by[0]}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">
                Documents URI <span className="text-red-500">*</span>
              </Label>
              <Input
                type="url"
                value={formData.documents_uri}
                onChange={(e) => handleInputChange("documents_uri", e.target.value)}
                placeholder="https://example.com/documents"
                className={`mt-1 ${combinedErrors.documents_uri ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              {combinedErrors.documents_uri && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.documents_uri[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Evidence Bundle IDs <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={evidenceBundleText}
                onChange={(e) => handleArrayTextChange(e.target.value, "evidence_bundle_ids")}
                placeholder="Enter bundle IDs separated by commas (numbers)"
                className={`mt-1 min-h-24 resize-none ${combinedErrors.evidence_bundle_ids ? "border-red-500" : ""}`}
                disabled={isLoading}
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">Separate IDs with commas (numbers only).</p>
              {combinedErrors.evidence_bundle_ids && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.evidence_bundle_ids[0]}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">
                Jurisdiction & Commitments Summary
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Jurisdiction and commitments are comma-separated. Ensure at least one entry in each.
              </p>
            </div>
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

