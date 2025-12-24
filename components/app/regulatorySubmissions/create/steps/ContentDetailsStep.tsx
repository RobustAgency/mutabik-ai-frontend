"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RegulatorySubmissionFormData } from "@/lib/schemas/regulatorySubmission.schema";

interface ContentDetailsStepProps {
  commitmentsText: string;
  isLoading: boolean;
  onCommitmentsChange: (text: string) => void;
}

export const ContentDetailsStep: React.FC<ContentDetailsStepProps> = ({
  commitmentsText,
  isLoading,
  onCommitmentsChange,
}) => {
  const { register, formState: { errors } } = useFormContext<RegulatorySubmissionFormData>();

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="content_summary" className="text-sm font-medium text-gray-900">
          Content Summary <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="content_summary"
          {...register("content_summary")}
          placeholder="Enter content summary"
          className={`mt-1 min-h-32 resize-none ${errors.content_summary ? "border-red-500" : ""}`}
          disabled={isLoading}
          rows={5}
        />
        {errors.content_summary && (
          <p className="text-sm text-red-500 mt-1">{errors.content_summary.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="commitments" className="text-sm font-medium text-gray-900">
          Commitments <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={commitmentsText}
          onChange={(e) => onCommitmentsChange(e.target.value)}
          placeholder="Enter commitments separated by commas"
          className={`mt-1 min-h-32 resize-none ${errors.commitments ? "border-red-500" : ""}`}
          disabled={isLoading}
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">Enter commitments separated by commas</p>
        {errors.commitments && (
          <p className="text-sm text-red-500 mt-1">{errors.commitments.message}</p>
        )}
      </div>
    </div>
  );
};

