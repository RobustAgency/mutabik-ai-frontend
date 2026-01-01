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
import type { PrivacyIncidentFormData } from "@/lib/schemas/privacyIncident.schema";

const statusOptions = [
  { value: "detected", label: "Detected" },
  { value: "under_investigation", label: "Under Investigation" },
  { value: "contained", label: "Contained" },
  { value: "notified", label: "Notified" },
  { value: "remediation", label: "Remediation" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export const ResponseResolutionStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PrivacyIncidentFormData>();

  const status = watch("status");
  const immediateActions = watch("immediate_actions");
  const mitigationMeasures = watch("mitigation_measures");
  const preventiveMeasures = watch("preventive_measures");
  const rootCauseAnalysis = watch("root_cause_analysis");
  const lessonsLearned = watch("lessons_learned");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="immediate_actions">
          Immediate Actions <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="immediate_actions"
          {...register("immediate_actions")}
          className={`w-full min-h-[100px] resize-none ${
            errors.immediate_actions ? "border-red-500" : ""
          }`}
          placeholder="Describe immediate actions taken"
          rows={4}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.immediate_actions?.message}</span>
          <span>{immediateActions?.length || 0} characters</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mitigation_measures">
          Mitigation Measures <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="mitigation_measures"
          {...register("mitigation_measures")}
          className={`w-full min-h-[100px] resize-none ${
            errors.mitigation_measures ? "border-red-500" : ""
          }`}
          placeholder="Describe mitigation measures implemented"
          rows={4}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.mitigation_measures?.message}</span>
          <span>{mitigationMeasures?.length || 0} characters</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preventive_measures">
          Preventive Measures <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="preventive_measures"
          {...register("preventive_measures")}
          className={`w-full min-h-[100px] resize-none ${
            errors.preventive_measures ? "border-red-500" : ""
          }`}
          placeholder="Describe preventive measures to avoid recurrence"
          rows={4}
        />
        <div className="flex justify-between text-xs text-[#667085]">
          <span>{errors.preventive_measures?.message}</span>
          <span>{preventiveMeasures?.length || 0} characters</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsible_party">Responsible Party</Label>
        <Input
          id="responsible_party"
          {...register("responsible_party")}
          className="w-full"
          placeholder="e.g., Third-party vendor, Internal team"
          maxLength={255}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">
          Status <span className="text-red-500">*</span>
        </Label>
        <Select
          key={`status-${watch("status") || "none"}`}
          value={watch("status")}
          onValueChange={(value) => setValue("status", value as any)}
        >
          <SelectTrigger
            className={`w-full ${errors.status ? "border-red-500" : ""}`}
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      {status === "resolved" && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium text-sm text-[#475467]">
            Resolution Details <span className="text-red-500">*</span>
          </h3>

          <div className="space-y-2">
            <Label htmlFor="root_cause_analysis">
              Root Cause Analysis <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="root_cause_analysis"
              {...register("root_cause_analysis")}
              className={`w-full min-h-[100px] resize-none ${
                errors.root_cause_analysis ? "border-red-500" : ""
              }`}
              placeholder="Analyze the root cause of the incident"
              rows={4}
            />
            <div className="flex justify-between text-xs text-[#667085]">
              <span>{errors.root_cause_analysis?.message}</span>
              <span>{rootCauseAnalysis?.length || 0} characters</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lessons_learned">
              Lessons Learned <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="lessons_learned"
              {...register("lessons_learned")}
              className={`w-full min-h-[100px] resize-none ${
                errors.lessons_learned ? "border-red-500" : ""
              }`}
              placeholder="Document lessons learned from this incident"
              rows={4}
            />
            <div className="flex justify-between text-xs text-[#667085]">
              <span>{errors.lessons_learned?.message}</span>
              <span>{lessonsLearned?.length || 0} characters</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolution_date">
              Resolution Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="resolution_date"
              type="date"
              {...register("resolution_date")}
              className={`w-full ${
                errors.resolution_date ? "border-red-500" : ""
              }`}
            />
            {errors.resolution_date && (
              <p className="text-sm text-red-500">
                {errors.resolution_date.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

