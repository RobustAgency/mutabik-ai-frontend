"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { RecordOfProcessingActivityFormData } from "@/lib/schemas/recordOfProcessingActivity.schema";

export const RetentionSecurityStep: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<RecordOfProcessingActivityFormData>();

  const retentionJustification = watch("retention_justification");
  const securityMeasures = watch("security_measures");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="retention_period">
          Retention Period <span className="text-red-500">*</span>
        </Label>
        <Input
          id="retention_period"
          {...register("retention_period")}
          className={`w-full ${errors.retention_period ? "border-red-500" : ""}`}
          placeholder="e.g., 7 years"
        />
        {errors.retention_period && (
          <p className="text-sm text-red-500">{errors.retention_period.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="retention_justification">
          Retention Justification <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="retention_justification"
          {...register("retention_justification")}
          className={`w-full min-h-[100px] resize-none ${
            errors.retention_justification ? "border-red-500" : ""
          }`}
          placeholder="Justify the retention period"
          rows={4}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.retention_justification?.message}</span>
          <span>{retentionJustification?.length || 0} characters</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="security_measures">
          Security Measures <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="security_measures"
          {...register("security_measures")}
          className={`w-full min-h-[120px] resize-none ${
            errors.security_measures ? "border-red-500" : ""
          }`}
          placeholder="Describe security measures implemented"
          rows={5}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.security_measures?.message}</span>
          <span>{securityMeasures?.length || 0} characters</span>
        </div>
      </div>
    </div>
  );
};

