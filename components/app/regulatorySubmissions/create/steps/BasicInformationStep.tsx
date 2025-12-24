"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegulatorySubmissionFormData } from "@/lib/schemas/regulatorySubmission.schema";
import {
  RegulatorySubmissionTypeEnum,
  RegulatorySubmissionStatusEnum,
} from "@/interfaces/RegulatorySubmission";

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

interface BasicInformationStepProps {
  frameworkOptions: { value: string; label: string }[];
  aiModelOptions: { value: string; label: string }[];
  jurisdictionText: string;
  isLoading: boolean;
  onJurisdictionChange: (text: string) => void;
}

export const BasicInformationStep: React.FC<BasicInformationStepProps> = ({
  frameworkOptions,
  aiModelOptions,
  jurisdictionText,
  isLoading,
  onJurisdictionChange,
}) => {
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
          onChange={(e) => onJurisdictionChange(e.target.value)}
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

