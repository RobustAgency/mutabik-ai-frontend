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
import type { DPIAFormData } from "@/lib/schemas/dpia.schema";

const riskLevelOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const stageOptions = [
  { value: "screening", label: "Screening" },
  { value: "necessity", label: "Necessity" },
  { value: "risk_identification", label: "Risk Identification" },
  { value: "mitigation", label: "Mitigation" },
  { value: "dpo_consultation", label: "DPO Consultation" },
  { value: "approval", label: "Approval" },
  { value: "completed", label: "Completed" },
];

export const RiskOverviewStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DPIAFormData>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="risk_level">
            Risk Level <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`risk_level-${watch("risk_level") || "none"}`}
            value={watch("risk_level")}
            onValueChange={(value) => setValue("risk_level", value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              {riskLevelOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="risk_score">
            Risk Score (1-25) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="risk_score"
            type="number"
            min={1}
            max={25}
            {...register("risk_score", { valueAsNumber: true })}
            className={`w-full ${errors.risk_score ? "border-red-500" : ""}`}
          />
          {errors.risk_score && (
            <p className="text-sm text-red-500">
              {errors.risk_score.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="completion_percentage">
            Completion (%) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="completion_percentage"
            type="number"
            min={0}
            max={100}
            {...register("completion_percentage", { valueAsNumber: true })}
            className={`w-full ${
              errors.completion_percentage ? "border-red-500" : ""
            }`}
          />
          {errors.completion_percentage && (
            <p className="text-sm text-red-500">
              {errors.completion_percentage.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stage">
          Current Stage <span className="text-red-500">*</span>
        </Label>
        <Select
          key={`stage-${watch("stage") || "none"}`}
          value={watch("stage")}
          onValueChange={(value) => setValue("stage", value as any)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select stage" />
          </SelectTrigger>
          <SelectContent>
            {stageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};


