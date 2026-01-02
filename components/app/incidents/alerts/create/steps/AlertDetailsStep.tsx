"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IncidentAlertFormData } from "@/lib/schemas/incidentAlert.schema";
import { AlertSeverity } from "@/app/lib/features/incidentAlertsApi";

const ALERT_SEVERITY_OPTIONS = [
  { value: AlertSeverity.LOW, label: "Low" },
  { value: AlertSeverity.MEDIUM, label: "Medium" },
  { value: AlertSeverity.HIGH, label: "High" },
  { value: AlertSeverity.CRITICAL, label: "Critical" },
];

export const AlertDetailsStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IncidentAlertFormData>();

  const alertSensitivity = watch("alert_sensitivity");
  const sourceRef = watch("source_ref");
  const context = watch("context");

  const hasError = (fieldName: keyof IncidentAlertFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof IncidentAlertFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Alert Details <span className="text-red-500">*</span>
        </h2>
        <hr className="border-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alert Sensitivity */}
        <div className="space-y-2">
          <Label htmlFor="alert_sensitivity">
            Alert Sensitivity <span className="text-red-500">*</span>
          </Label>
          <Select
            key={`alert_sensitivity-${alertSensitivity || "none"}`}
            value={alertSensitivity || ""}
            onValueChange={(value) =>
              setValue("alert_sensitivity", value as AlertSeverity, { shouldValidate: true })
            }
          >
            <SelectTrigger
              className={`w-full ${hasError("alert_sensitivity") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              {ALERT_SEVERITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError("alert_sensitivity") && (
            <p className="text-sm text-red-500">{getError("alert_sensitivity")}</p>
          )}
        </div>

        {/* Source Reference */}
        <div className="space-y-2">
          <Label htmlFor="source_ref">Source Reference</Label>
          <Input
            id="source_ref"
            value={sourceRef || ""}
            onChange={(e) =>
              setValue("source_ref", e.target.value || null, { shouldValidate: true })
            }
            placeholder="ID/name of rule or KRI"
            className={hasError("source_ref") ? "border-red-500" : ""}
          />
          {hasError("source_ref") && (
            <p className="text-sm text-red-500">{getError("source_ref")}</p>
          )}
        </div>

        {/* Context */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="context">
            Context <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="context"
            value={context || ""}
            onChange={(e) => setValue("context", e.target.value, { shouldValidate: true })}
            placeholder="Brief payload/context (sanitized)"
            className={`min-h-32 resize-none ${hasError("context") ? "border-red-500" : ""}`}
          />
          <p className="text-xs text-[#667085]">Ensure sensitive data is sanitized before logging</p>
          {hasError("context") && (
            <p className="text-sm text-red-500">{getError("context")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

