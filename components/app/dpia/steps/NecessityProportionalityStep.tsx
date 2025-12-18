"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DPIAFormData } from "@/lib/schemas/dpia.schema";

export const NecessityProportionalityStep: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<DPIAFormData>();

  const necessity = watch("necessity_justification");
  const proportionality = watch("proportionality_assessment");
  const alternatives = watch("alternatives_considered");
  const stage = watch("stage");
  const isNecessityStage = stage === "necessity";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="necessity_justification">
          Necessity Justification{" "}
          {isNecessityStage && <span className="text-red-500">*</span>}
        </Label>
        <Textarea
          id="necessity_justification"
          {...register("necessity_justification")}
          className={`w-full min-h-[120px] resize-none ${
            errors.necessity_justification ? "border-red-500" : ""
          }`}
          placeholder="Explain why this processing is necessary"
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.necessity_justification?.message}</span>
          <span>{necessity?.length || 0} characters</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="proportionality_assessment">
          Proportionality Assessment{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="proportionality_assessment"
          {...register("proportionality_assessment")}
          className={`w-full min-h-[120px] resize-none ${
            errors.proportionality_assessment ? "border-red-500" : ""
          }`}
          placeholder="Describe why the processing is proportionate to the purpose"
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.proportionality_assessment?.message}</span>
          <span>{proportionality?.length || 0} characters</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alternatives_considered">
          Alternatives Considered{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="alternatives_considered"
          {...register("alternatives_considered")}
          className={`w-full min-h-[120px] resize-none ${
            errors.alternatives_considered ? "border-red-500" : ""
          }`}
          placeholder="Describe alternative approaches that were considered"
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.alternatives_considered?.message}</span>
          <span>{alternatives?.length || 0} characters</span>
        </div>
      </div>
    </div>
  );
};


