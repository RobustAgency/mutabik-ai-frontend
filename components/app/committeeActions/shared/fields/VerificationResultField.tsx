"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VerificationResult } from "@/interfaces/CommitteeAction";
import type { CommitteeActionFormData } from "@/lib/schemas/committeeAction.schema";

const verificationResultOptions = [
  { value: VerificationResult.PENDING, label: "Pending" },
  { value: VerificationResult.PASSED, label: "Passed" },
  { value: VerificationResult.FAILED, label: "Failed" },
  { value: VerificationResult.NOT_APPLICABLE, label: "Not Applicable" },
];

export const VerificationResultField: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CommitteeActionFormData>();

  const watchedVerificationResult = watch("verification_result");
  const hasError = !!errors.verification_result;

  return (
    <div className="space-y-2">
      <Label htmlFor="verification_result">
        Verification Result <span className="text-red-500">*</span>
      </Label>
      <Select
        key={`verification-result-select-${watchedVerificationResult}`}
        value={watchedVerificationResult || ""}
        onValueChange={(value) =>
          setValue("verification_result", value as VerificationResult, {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          className="w-full"
          aria-invalid={hasError}
        >
          <SelectValue placeholder="Select verification result" />
        </SelectTrigger>
        <SelectContent>
          {verificationResultOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-red-500 mt-1">
          {errors.verification_result?.message as string}
        </p>
      )}
    </div>
  );
};

