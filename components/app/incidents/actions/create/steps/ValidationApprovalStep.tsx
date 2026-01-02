"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IncidentActionFormData } from "@/lib/schemas/incidentAction.schema";
import {
  ValidationResult,
  ApprovalRequired,
} from "@/app/lib/features/incidentActionsApi";

const VALIDATION_RESULT_OPTIONS = [
  { value: ValidationResult.PENDING, label: "Pending" },
  { value: ValidationResult.PARTIALLY_EFFECTIVE, label: "Partially Effective" },
  { value: ValidationResult.EFFECTIVE, label: "Effective" },
  { value: ValidationResult.INEFFECTIVE, label: "Ineffective" },
];

const APPROVAL_REQUIRED_OPTIONS = [
  { value: ApprovalRequired.NO_APPROVAL_NEEDED, label: "No Approval Needed" },
  { value: ApprovalRequired.MANAGER_APPROVAL, label: "Manager Approval" },
  { value: ApprovalRequired.EXECUTIVE_APPROVAL, label: "Executive Approval" },
  { value: ApprovalRequired.LEGAL_APPROVAL, label: "Legal Approval" },
];

export const ValidationApprovalStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentActionFormData>();

  const validationResult = watch("validation_result");
  const validationNotes = watch("validation_notes");
  const approvalRequired = watch("approval_required");

  const hasError = (fieldName: keyof IncidentActionFormData): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof IncidentActionFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Validation & Approval <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Validation Result */}
        <div className="space-y-2">
          <Label htmlFor="validation_result">
            Validation Result <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`validation_result-${validationResult || "none"}`}
            value={validationResult || ""}
            onValueChange={(value) =>
              setValue("validation_result", value as ValidationResult, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              className={`w-full ${
                hasError("validation_result")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select validation result" />
            </SelectTrigger>
            <SelectContent>
              {VALIDATION_RESULT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("validation_result") && (
            <p className="text-sm text-red-500">
              {getError("validation_result")}
            </p>
          )}
        </div>

        {/* Approval Required */}
        <div className="space-y-2">
          <Label htmlFor="approval_required">Approval Required</Label>
          <Select
            key={`approval_required-${approvalRequired || "none"}`}
            value={approvalRequired || undefined}
            onValueChange={(value) =>
              setValue(
                "approval_required",
                value === "__none__" ? null : (value as ApprovalRequired),
                { shouldValidate: true }
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select approval requirement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {APPROVAL_REQUIRED_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("approval_required") && (
            <p className="text-sm text-red-500">
              {getError("approval_required")}
            </p>
          )}
        </div>

        {/* Validation Notes */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="validation_notes">Validation Notes</Label>
          <Textarea
            id="validation_notes"
            value={validationNotes || ""}
            onChange={(e) =>
              setValue("validation_notes", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Notes about the validation process and results"
            className={`min-h-32 resize-none ${
              hasError("validation_notes") ? "border-red-500" : ""
            }`}
          />
          {hasError("validation_notes") && (
            <p className="text-sm text-red-500">
              {getError("validation_notes")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

