"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRequirementControl, useRequirementControlMutations } from "@/hooks/admin/useRequirementControls";
import { useRequirements } from "@/hooks/admin/useRequirements";
import { useControls } from "@/hooks/admin/useControls";
import { useGetUsersQuery } from "@/app/lib/features/usersApi";
import { useGetAiModelsQuery } from "@/app/lib/features/aiModelsApi";
import {
  CreateRequirementControlRequest,
  UpdateRequirementControlRequest,
  RequirementControlCoverageEnum,
  RequirementControlReviewStatusEnum,
} from "@/interfaces/RequirementControl";
import { createValidationErrors, validateTextField } from "@/lib/utils/validation";
import FormErrorAlert from "@/components/admin/shared/FormErrorAlert";
import FormActions from "@/components/admin/shared/FormActions";
import Spinner from "@/components/ui/spinner";
import { formatDateForInput } from "@/lib/helpers/date";

interface RequirementControlFormProps {
  requirementControlId?: string;
  mode: "create" | "edit";
  serverErrors?: Record<string, string[]>;
  onSubmit?: (payload: CreateRequirementControlRequest | UpdateRequirementControlRequest) => Promise<void> | void;
}

const COVERAGE_OPTIONS: { value: RequirementControlCoverageEnum; label: string }[] = [
  { value: RequirementControlCoverageEnum.FULL, label: "Full" },
  { value: RequirementControlCoverageEnum.PARTIAL, label: "Partial" },
  { value: RequirementControlCoverageEnum.NOT_APPLICABLE, label: "Not Applicable" },
];

const REVIEW_STATUS_OPTIONS: { value: RequirementControlReviewStatusEnum; label: string }[] = [
  { value: RequirementControlReviewStatusEnum.DRAFT, label: "Draft" },
  { value: RequirementControlReviewStatusEnum.PEER_REVIEWED, label: "Peer Reviewed" },
  { value: RequirementControlReviewStatusEnum.APPROVED, label: "Approved" },
];

export default function RequirementControlForm({
  requirementControlId,
  mode,
  serverErrors,
  onSubmit,
}: RequirementControlFormProps) {
  const router = useRouter();
  const { requirementControl, loading: loadingRequirementControl } = useRequirementControl(
    mode === "edit" ? requirementControlId : undefined
  );
  const { requirements } = useRequirements({ per_page: 100 });
  const { controls } = useControls({ per_page: 100 });
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery({ per_page: 100 });
  const { data: aiModels = [], isLoading: isLoadingAiModels } = useGetAiModelsQuery({ per_page: 100 });
  const { createRequirementControl, updateRequirementControl, creating, updating } =
    useRequirementControlMutations();

  const [formData, setFormData] = useState<CreateRequirementControlRequest>({
    requirement_id: 0,
    control_id: 0,
    ai_model_id: null,
    coverage: RequirementControlCoverageEnum.FULL,
    interpretation_notes: "",
    residual_gaps: "",
    review_status: null,
    reviewed_by: null,
    reviewed_at: null,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const requirementOptions = useMemo(() => {
    const base =
      requirements?.map((req) => ({
        value: req.id.toString(),
        label: `${req.reference}${req.requirement_text ? ` - ${req.requirement_text.substring(0, 50)}` : ""}`,
      })) || [];

    const rcRequirement = requirementControl?.requirement;
    // Fallback: if the requirement object isn't embedded, still show the current selection
    const rcRequirementId = requirementControl?.requirement_id;
    if (rcRequirement) {
      const exists = base.some((opt) => opt.value === rcRequirement.id.toString());
      if (!exists) {
        base.unshift({
          value: rcRequirement.id.toString(),
          label: `${rcRequirement.reference}${
            rcRequirement.requirement_text ? ` - ${rcRequirement.requirement_text.substring(0, 50)}` : ""
          }`,
        });
      }
    } else if (rcRequirementId) {
      const exists = base.some((opt) => opt.value === rcRequirementId.toString());
      if (!exists) {
        base.unshift({
          value: rcRequirementId.toString(),
          label: `Requirement #${rcRequirementId}`,
        });
      }
    }

    return base;
  }, [requirements, requirementControl]);

  const controlOptions = useMemo(() => {
    const base =
      controls?.map((ctrl) => ({
        value: ctrl.id.toString(),
        label: `${ctrl.reference} - ${ctrl.name}`,
      })) || [];

    const rcControl = requirementControl?.control;
    const rcControlId = requirementControl?.control_id;
    if (rcControl) {
      const exists = base.some((opt) => opt.value === rcControl.id.toString());
      if (!exists) {
        base.unshift({
          value: rcControl.id.toString(),
          label: `${rcControl.reference} - ${rcControl.name}`,
        });
      }
    } else if (rcControlId) {
      const exists = base.some((opt) => opt.value === rcControlId.toString());
      if (!exists) {
        base.unshift({
          value: rcControlId.toString(),
          label: `Control #${rcControlId}`,
        });
      }
    }

    return base;
  }, [controls, requirementControl]);

  const userOptions = useMemo(() => {
    const base =
      users?.map((user) => ({
        value: user.id.toString(),
        label: `${user.name} (${user.email})`,
      })) || [];

    const rcUser = requirementControl?.user;
    const rcUserId = requirementControl?.reviewed_by;
    if (rcUser) {
      const exists = base.some((opt) => opt.value === rcUser.id.toString());
      if (!exists) {
        base.unshift({
          value: rcUser.id.toString(),
          label: `${rcUser.name} (${rcUser.email})`,
        });
      }
    } else if (rcUserId) {
      const idStr = rcUserId.toString();
      const exists = base.some((opt) => opt.value === idStr);
      if (!exists) {
        base.unshift({
          value: idStr,
          label: `User #${idStr}`,
        });
      }
    }

    return base;
  }, [users, requirementControl]);

  const aiModelOptions = useMemo(() => {
    const base =
      aiModels?.map((model) => ({
        value: model.id.toString(),
        label: `${model.name}${model.display_id ? ` (${model.display_id})` : ""}`,
      })) || [];

    const rcAiModelId = requirementControl?.ai_model_id;
    if (rcAiModelId) {
      const exists = base.some((opt) => opt.value === rcAiModelId.toString());
      if (!exists) {
        base.unshift({
          value: rcAiModelId.toString(),
          label: `AI Model #${rcAiModelId}`,
        });
      }
    }

    return base;
  }, [aiModels, requirementControl]);

  useEffect(() => {
    if (mode === "edit" && requirementControl) {
      setFormData({
        requirement_id: requirementControl.requirement_id,
        control_id: requirementControl.control_id,
        ai_model_id: requirementControl.ai_model_id ?? null,
        coverage: requirementControl.coverage,
        interpretation_notes: requirementControl.interpretation_notes || "",
        residual_gaps: requirementControl.residual_gaps || "",
        review_status: requirementControl.review_status ?? null,
        reviewed_by: requirementControl.reviewed_by ?? null,
        reviewed_at: formatDateForInput(requirementControl.reviewed_at) || null,
      });
    }
  }, [mode, requirementControl]);

  const combinedErrors = useMemo(
    () => ({ ...validationErrors, ...(serverErrors || {}) }),
    [validationErrors, serverErrors]
  );

  const handleInputChange = useCallback(
    <K extends keyof CreateRequirementControlRequest>(
      field: K,
      value: CreateRequirementControlRequest[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const validateForm = (): boolean => {
    const fieldErrors: Record<string, string[]> = {
      requirement_id:
        formData.requirement_id === 0 ? ["Requirement is required"] : [],
      control_id: formData.control_id === 0 ? ["Control is required"] : [],
      coverage: validateTextField(formData.coverage, {
        required: true,
        messages: { required: "Coverage is required" },
      }),
      interpretation_notes: validateTextField(formData.interpretation_notes, {
        required: true,
        messages: { required: "Interpretation notes are required" },
      }),
      residual_gaps: validateTextField(formData.residual_gaps, {
        required: true,
        messages: { required: "Residual gaps are required" },
      }),
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

    const payload: CreateRequirementControlRequest = {
      ...formData,
      requirement_id: Number(formData.requirement_id),
      control_id: Number(formData.control_id),
      ai_model_id: formData.ai_model_id ? Number(formData.ai_model_id) : null,
      reviewed_by: formData.reviewed_by ? Number(formData.reviewed_by) : null,
      reviewed_at: formData.reviewed_at || null,
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else if (mode === "create") {
        await createRequirementControl(payload);
      } else if (mode === "edit" && requirementControlId) {
        await updateRequirementControl(requirementControlId, payload);
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        setValidationErrors(err.data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleCancel = () => {
    router.push("/admin/compliance-library/requirement-controls");
  };

  const isLoading = creating || updating || (mode === "edit" && loadingRequirementControl);

  if (mode === "edit" && loadingRequirementControl) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-2 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-[#737373]">Loading requirement control...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-6 py-6">
      <div className="mt-6 mb-8">
        <h1 className="text-3xl text-[#171717] font-bold">
          {mode === "create" ? "Create Requirement Control" : "Edit Requirement Control"}
        </h1>
      </div>

      <Card className="w-full shadow-none p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormErrorAlert errors={combinedErrors} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Requirement <span className="text-red-500">*</span>
              </Label>
              <Select
                key={`requirement-${formData.requirement_id || "none"}`}
                value={formData.requirement_id ? String(formData.requirement_id) : ""}
                onValueChange={(value) => handleInputChange("requirement_id", Number(value))}
                disabled={isLoading}
              >
                <SelectTrigger className={`mt-1 w-full ${combinedErrors.requirement_id ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select requirement" />
                </SelectTrigger>
                <SelectContent>
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
              {combinedErrors.requirement_id && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.requirement_id[0]}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">
                Control <span className="text-red-500">*</span>
              </Label>
              <Select
                key={`control-${formData.control_id || "none"}`}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">
                Coverage <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.coverage}
                onValueChange={(value) =>
                  handleInputChange("coverage", value as RequirementControlCoverageEnum)
                }
                disabled={isLoading}
              >
                <SelectTrigger className={`mt-1 w-full ${combinedErrors.coverage ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select coverage" />
                </SelectTrigger>
                <SelectContent>
                  {COVERAGE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {combinedErrors.coverage && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.coverage[0]}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">AI Model</Label>
              <Select
                value={formData.ai_model_id ? String(formData.ai_model_id) : "null"}
                onValueChange={(value) =>
                  handleInputChange("ai_model_id", value === "null" ? null : Number(value))
                }
                disabled={isLoading || isLoadingAiModels}
              >
                <SelectTrigger className={`mt-1 w-full ${combinedErrors.ai_model_id ? "border-red-500" : ""}`}>
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
              {combinedErrors.ai_model_id && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.ai_model_id[0]}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900">
              Interpretation Notes <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.interpretation_notes}
              onChange={(e) => handleInputChange("interpretation_notes", e.target.value)}
              placeholder="Enter interpretation notes"
              className={`mt-1 min-h-32 resize-none ${combinedErrors.interpretation_notes ? "border-red-500" : ""}`}
              disabled={isLoading}
              rows={3}
            />
            {combinedErrors.interpretation_notes && (
              <p className="text-sm text-red-500 mt-1">{combinedErrors.interpretation_notes[0]}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900">
              Residual Gaps <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.residual_gaps}
              onChange={(e) => handleInputChange("residual_gaps", e.target.value)}
              placeholder="Enter residual gaps"
              className={`mt-1 min-h-32 resize-none ${combinedErrors.residual_gaps ? "border-red-500" : ""}`}
              disabled={isLoading}
              rows={3}
            />
            {combinedErrors.residual_gaps && (
              <p className="text-sm text-red-500 mt-1">{combinedErrors.residual_gaps[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">Review Status</Label>
              <Select
                value={formData.review_status || "null"}
                onValueChange={(value) =>
                  handleInputChange(
                    "review_status",
                    value === "null" ? null : (value as RequirementControlReviewStatusEnum)
                  )
                }
                disabled={isLoading}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select review status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {REVIEW_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-900">Reviewed By</Label>
              <Select
                key={`reviewed-by-${formData.reviewed_by || "none"}-${userOptions.length}`}
                value={formData.reviewed_by ? String(formData.reviewed_by) : "null"}
                onValueChange={(value) =>
                  handleInputChange("reviewed_by", value === "null" ? null : Number(value))
                }
                disabled={isLoading || isLoadingUsers}
              >
                <SelectTrigger className={`mt-1 w-full ${combinedErrors.reviewed_by ? "border-red-500" : ""}`}>
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
              {combinedErrors.reviewed_by && (
                <p className="text-sm text-red-500 mt-1">{combinedErrors.reviewed_by[0]}</p>
              )}
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

