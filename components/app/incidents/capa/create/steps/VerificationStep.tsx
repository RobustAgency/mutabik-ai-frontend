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
import type { CorrectivePreventiveActionFormData } from "@/lib/schemas/correctivePreventiveAction.schema";
import {
  VerificationResult,
  Status,
} from "@/app/lib/features/correctivePreventiveActionsApi";

const VERIFICATION_RESULT_OPTIONS = [
  { value: VerificationResult.PENDING, label: "Pending" },
  { value: VerificationResult.VERIFIED_EFFECTIVE, label: "Verified Effective" },
  { value: VerificationResult.REQUIRES_REWORK, label: "Requires Rework" },
  { value: VerificationResult.VERIFIED_INEFFECTIVE, label: "Verified Ineffective" },
];

export const VerificationStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CorrectivePreventiveActionFormData>();

  const status = watch("status");
  const successCriteria = watch("success_criteria");
  const linkedTraining = watch("linked_training");
  const estimatedCost = watch("estimated_cost");
  const verificationResult = watch("verification_result");
  const effectivenessReviewDate = watch("effectiveness_review_date");
  const evidenceLink = watch("evidence_link");

  const isClosed = status === Status.CLOSED;

  const hasError = (
    fieldName: keyof CorrectivePreventiveActionFormData
  ): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof CorrectivePreventiveActionFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  // Format date for input field
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Verification & Success
        </h2>
        <hr className="border-gray-200" />
      </div>

      {isClosed && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
          <strong>Status is Closed:</strong> Verification result is required.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Success Criteria */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="success_criteria">Success Criteria</Label>
          <Textarea
            id="success_criteria"
            value={successCriteria || ""}
            onChange={(e) =>
              setValue("success_criteria", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Define success criteria for this CAPA"
            className={`min-h-32 resize-none ${
              hasError("success_criteria") ? "border-red-500" : ""
            }`}
          />
          {hasError("success_criteria") && (
            <p className="text-sm text-red-500">
              {getError("success_criteria")}
            </p>
          )}
        </div>

        {/* Linked Training */}
        <div className="space-y-2">
          <Label htmlFor="linked_training">Linked Training</Label>
          <Input
            id="linked_training"
            value={linkedTraining || ""}
            onChange={(e) =>
              setValue("linked_training", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Training reference or link"
            className={hasError("linked_training") ? "border-red-500" : ""}
          />
          {hasError("linked_training") && (
            <p className="text-sm text-red-500">
              {getError("linked_training")}
            </p>
          )}
        </div>

        {/* Estimated Cost */}
        <div className="space-y-2">
          <Label htmlFor="estimated_cost">Estimated Cost</Label>
          <Input
            id="estimated_cost"
            type="number"
            step="0.01"
            min="0"
            value={estimatedCost || ""}
            onChange={(e) =>
              setValue(
                "estimated_cost",
                e.target.value ? Number(e.target.value) : null,
                { shouldValidate: true }
              )
            }
            placeholder="0.00"
            className={hasError("estimated_cost") ? "border-red-500" : ""}
          />
          {hasError("estimated_cost") && (
            <p className="text-sm text-red-500">
              {getError("estimated_cost")}
            </p>
          )}
        </div>

        {/* Verification Result */}
        <div className="space-y-2">
          <Label htmlFor="verification_result">
            Verification Result {isClosed && <span className="text-red-500">*</span>}
          </Label>
          <Select
            key={`verification_result-${verificationResult || "none"}`}
            value={verificationResult || undefined}
            onValueChange={(value) =>
              setValue(
                "verification_result",
                value === "__none__" ? null : (value as VerificationResult),
                { shouldValidate: true }
              )
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("verification_result")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select verification result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {VERIFICATION_RESULT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("verification_result") && (
            <p className="text-sm text-red-500">
              {getError("verification_result")}
            </p>
          )}
        </div>

        {/* Effectiveness Review Date */}
        <div className="space-y-2">
          <Label htmlFor="effectiveness_review_date">
            Effectiveness Review Date
          </Label>
          <Input
            id="effectiveness_review_date"
            type="date"
            value={formatDateForInput(effectivenessReviewDate)}
            onChange={(e) =>
              setValue("effectiveness_review_date", e.target.value || null, {
                shouldValidate: true,
              })
            }
            className={
              hasError("effectiveness_review_date") ? "border-red-500" : ""
            }
          />
          {hasError("effectiveness_review_date") && (
            <p className="text-sm text-red-500">
              {getError("effectiveness_review_date")}
            </p>
          )}
        </div>

        {/* Evidence Link */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="evidence_link">Evidence Link</Label>
          <Input
            id="evidence_link"
            type="url"
            value={evidenceLink || ""}
            onChange={(e) =>
              setValue("evidence_link", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="https://example.com/evidence"
            className={hasError("evidence_link") ? "border-red-500" : ""}
          />
          {hasError("evidence_link") && (
            <p className="text-sm text-red-500">{getError("evidence_link")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

