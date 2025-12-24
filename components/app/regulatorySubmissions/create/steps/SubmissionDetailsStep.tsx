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

interface SubmissionDetailsStepProps {
  userOptions: { value: string; label: string }[];
  evidenceBundleText: string;
  isLoading: boolean;
  onEvidenceBundleIdsChange: (text: string) => void;
}

export const SubmissionDetailsStep: React.FC<SubmissionDetailsStepProps> = ({
  userOptions,
  evidenceBundleText,
  isLoading,
  onEvidenceBundleIdsChange,
}) => {
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
          onChange={(e) => onEvidenceBundleIdsChange(e.target.value)}
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

