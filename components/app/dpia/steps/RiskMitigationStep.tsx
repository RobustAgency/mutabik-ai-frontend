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
import type { DPIAFormData } from "@/lib/schemas/dpia.schema";

const residualRiskOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const RiskMitigationStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DPIAFormData>();

  const identifiedRisks = watch("identified_risks");
  const likelihood = watch("likelihood_assessment");
  const impact = watch("impact_assessment");
  const mitigation = watch("mitigation_measures");
  const stage = watch("stage");

  const isRiskIdentificationStage = stage === "risk_identification";
  const isMitigationStage = stage === "mitigation";
  const isResidualRequired =
    stage === "dpo_consultation" ||
    stage === "approval" ||
    stage === "completed";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="identified_risks">
          Identified Risks{" "}
          {isRiskIdentificationStage && (
            <span className="text-red-500">*</span>
          )}
        </Label>
        <Textarea
          id="identified_risks"
          {...register("identified_risks")}
          className={`w-full min-h-[120px] resize-none ${
            errors.identified_risks ? "border-red-500" : ""
          }`}
          placeholder="Describe identified risks"
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.identified_risks?.message}</span>
          <span>{identifiedRisks?.length || 0} characters</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="likelihood_assessment">
            Likelihood Assessment <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="likelihood_assessment"
            {...register("likelihood_assessment")}
            className={`w-full min-h-[120px] resize-none ${
              errors.likelihood_assessment ? "border-red-500" : ""
            }`}
            placeholder="Assess likelihood of risks"
          />
          <div className="flex justify-between text-xs text-[#667085]">
            <span>{errors.likelihood_assessment?.message}</span>
            <span>{likelihood?.length || 0} characters</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="impact_assessment">
            Impact Assessment <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="impact_assessment"
            {...register("impact_assessment")}
            className={`w-full min-h-[120px] resize-none ${
              errors.impact_assessment ? "border-red-500" : ""
            }`}
            placeholder="Assess impact on data subjects"
          />
          <div className="flex justify-between text-xs text-[#667085]">
            <span>{errors.impact_assessment?.message}</span>
            <span>{impact?.length || 0} characters</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mitigation_measures">
            Mitigation Measures{" "}
            {isMitigationStage && <span className="text-red-500">*</span>}
          </Label>
          <Textarea
            id="mitigation_measures"
            {...register("mitigation_measures")}
            className={`w-full min-h-[120px] resize-none ${
              errors.mitigation_measures ? "border-red-500" : ""
            }`}
            placeholder="Describe mitigation measures"
          />
          <div className="flex justify-between text-xs text-[#667085]">
            <span>{errors.mitigation_measures?.message}</span>
            <span>{mitigation?.length || 0} characters</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="residual_risk_level">
            Residual Risk Level{" "}
            {isResidualRequired && <span className="text-red-500">*</span>}
          </Label>
          <Select
            value={watch("residual_risk_level") || ""}
            onValueChange={(value) =>
              setValue("residual_risk_level", (value || null) as any)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select residual risk level" />
            </SelectTrigger>
            <SelectContent>
              {residualRiskOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.residual_risk_level && (
            <p className="text-sm text-red-500">
              {errors.residual_risk_level.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


