"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ComplianceEvidenceFormData } from "@/lib/schemas/complianceEvidence.schema";
import { ComplianceEvidenceArtifactTypeEnum } from "@/interfaces/ComplianceEvidence";

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

interface BasicInformationStepProps {
  controlOptions: { value: string; label: string }[];
  requirementOptions: { value: string; label: string }[];
  aiModelOptions: { value: string; label: string }[];
  isLoading: boolean;
  projectRequirements?: Requirement[];
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  controlOptions,
  requirementOptions,
  aiModelOptions,
  isLoading,
  projectRequirements,
}) => {
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
            key={`control_id-${watchedControlId || "none"}`}
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
            key={`requirement_id-${watchedRequirementId || "none"}`}
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
            key={`ai_model_id-${watchedAiModelId || "none"}`}
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
            key={`artifact_type-${watch("artifact_type") || "none"}`}
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

