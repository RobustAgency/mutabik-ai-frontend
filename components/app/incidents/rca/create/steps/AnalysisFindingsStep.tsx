"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IncidentRootCauseAnalysisFormData } from "@/lib/schemas/incidentRootCauseAnalysis.schema";

export const AnalysisFindingsStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentRootCauseAnalysisFormData>();

  const immediateCause = watch("immediate_cause");
  const rootCauses = watch("root_causes");
  const contributingFactors = watch("contributing_factors");

  const hasError = (
    fieldName: keyof IncidentRootCauseAnalysisFormData
  ): boolean => {
    const error = errors[fieldName];
    return !!(error && error.message);
  };
  const getError = (
    fieldName: keyof IncidentRootCauseAnalysisFormData
  ): string | undefined => {
    const error = errors[fieldName];
    return error?.message as string | undefined;
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Analysis & Findings <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Immediate Cause */}
        <div className="space-y-2">
          <Label htmlFor="immediate_cause">
            Immediate Cause <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="immediate_cause"
            value={immediateCause || ""}
            onChange={(e) =>
              setValue("immediate_cause", e.target.value, {
                shouldValidate: true,
              })
            }
            placeholder="Describe the immediate cause of the incident"
            className={`min-h-32 resize-none ${
              hasError("immediate_cause") ? "border-red-500" : ""
            }`}
          />
          {hasError("immediate_cause") && (
            <p className="text-sm text-red-500">
              {getError("immediate_cause")}
            </p>
          )}
        </div>

        {/* Root Causes */}
        <div className="space-y-2">
          <Label htmlFor="root_causes">
            Root Causes <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="root_causes"
            value={rootCauses || ""}
            onChange={(e) =>
              setValue("root_causes", e.target.value, { shouldValidate: true })
            }
            placeholder="Identify and describe the root causes of the incident"
            className={`min-h-32 resize-none ${
              hasError("root_causes") ? "border-red-500" : ""
            }`}
          />
          {hasError("root_causes") && (
            <p className="text-sm text-red-500">{getError("root_causes")}</p>
          )}
        </div>

        {/* Contributing Factors */}
        <div className="space-y-2">
          <Label htmlFor="contributing_factors">Contributing Factors</Label>
          <Textarea
            id="contributing_factors"
            value={contributingFactors || ""}
            onChange={(e) =>
              setValue("contributing_factors", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Describe any contributing factors that led to the incident"
            className={`min-h-32 resize-none ${
              hasError("contributing_factors") ? "border-red-500" : ""
            }`}
          />
          {hasError("contributing_factors") && (
            <p className="text-sm text-red-500">
              {getError("contributing_factors")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

