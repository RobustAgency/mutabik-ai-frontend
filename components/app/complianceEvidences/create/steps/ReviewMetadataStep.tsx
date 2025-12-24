"use client";

import React from "react";
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
import { ComplianceEvidenceReviewOutcomeEnum } from "@/interfaces/ComplianceEvidence";

const REVIEW_OUTCOME_OPTIONS: { value: ComplianceEvidenceReviewOutcomeEnum; label: string }[] = [
  { value: ComplianceEvidenceReviewOutcomeEnum.PASS, label: "Pass" },
  { value: ComplianceEvidenceReviewOutcomeEnum.FAIL, label: "Fail" },
  { value: ComplianceEvidenceReviewOutcomeEnum.NEEDS_FIX, label: "Needs Fix" },
];

interface ReviewMetadataStepProps {
  userOptions: { value: string; label: string }[];
  isLoading: boolean;
}

export const ReviewMetadataStep: React.FC<ReviewMetadataStepProps> = ({
  userOptions,
  isLoading,
}) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ComplianceEvidenceFormData>();
  const watchedReviewedBy = watch("reviewed_by");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="review_outcome" className="text-sm font-medium text-gray-900">
            Review Outcome
          </Label>
          <Select
            value={watch("review_outcome") || "null"}
            onValueChange={(value) =>
              setValue("review_outcome", value === "null" ? null : (value as ComplianceEvidenceReviewOutcomeEnum), { shouldValidate: true })
            }
            disabled={isLoading}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select review outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="null" value="null">None</SelectItem>
              {REVIEW_OUTCOME_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="reviewed_by" className="text-sm font-medium text-gray-900">
            Reviewed By
          </Label>
          <Select
            value={watchedReviewedBy ? String(watchedReviewedBy) : "null"}
            onValueChange={(value) =>
              setValue("reviewed_by", value === "null" ? null : Number(value), { shouldValidate: true })
            }
            disabled={isLoading}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="null" value="null">None</SelectItem>
              {userOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="reviewed_at" className="text-sm font-medium text-gray-900">
          Reviewed At
        </Label>
        <Input
          id="reviewed_at"
          type="date"
          {...register("reviewed_at")}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

