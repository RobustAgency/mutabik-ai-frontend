"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IncidentRootCauseAnalysisFormData } from "@/lib/schemas/incidentRootCauseAnalysis.schema";

export const ControlFailuresRecommendationsStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentRootCauseAnalysisFormData>();

  const controlFailures = watch("control_failures");
  const recommendations = watch("recommendations");

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
          Control Failures & Recommendations <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Control Failures */}
        <div className="space-y-2">
          <Label htmlFor="control_failures">Control Failures</Label>
          <Textarea
            id="control_failures"
            value={controlFailures || ""}
            onChange={(e) =>
              setValue("control_failures", e.target.value || null, {
                shouldValidate: true,
              })
            }
            placeholder="Describe any control failures that contributed to the incident"
            className={`min-h-32 resize-none ${
              hasError("control_failures") ? "border-red-500" : ""
            }`}
          />
          {hasError("control_failures") && (
            <p className="text-sm text-red-500">
              {getError("control_failures")}
            </p>
          )}
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <Label htmlFor="recommendations">
            Recommendations <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="recommendations"
            value={recommendations || ""}
            onChange={(e) =>
              setValue("recommendations", e.target.value, {
                shouldValidate: true,
              })
            }
            placeholder="Provide recommendations to prevent similar incidents"
            className={`min-h-32 resize-none ${
              hasError("recommendations") ? "border-red-500" : ""
            }`}
          />
          {hasError("recommendations") && (
            <p className="text-sm text-red-500">
              {getError("recommendations")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

