"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DataSourceFormData } from "@/lib/schemas/dataSource.schema";
import {
  DataResidency,
  CriticalityLevel,
  HostingModel,
} from "@/app/lib/features/dataSourcesApi";

const DATA_RESIDENCY_OPTIONS = [
  { value: DataResidency.AE, label: "United Arab Emirates (AE)" },
  { value: DataResidency.EU, label: "European Union (EU)" },
  { value: DataResidency.KSA, label: "Kingdom of Saudi Arabia (KSA)" },
  { value: DataResidency.US, label: "United States (US)" },
  { value: DataResidency.UK, label: "United Kingdom (UK)" },
  { value: DataResidency.QA, label: "Qatar (QA)" },
  { value: DataResidency.JO, label: "Jordan (JO)" },
  { value: DataResidency.MA, label: "Morocco (MA)" },
  { value: DataResidency.BH, label: "Bahrain (BH)" },
  { value: DataResidency.OTHER, label: "Other" },
];

const CRITICALITY_LEVEL_OPTIONS = [
  { value: CriticalityLevel.LOW, label: "Low" },
  { value: CriticalityLevel.MEDIUM, label: "Medium" },
  { value: CriticalityLevel.HIGH, label: "High" },
  { value: CriticalityLevel.CRITICAL, label: "Critical" },
];

const HOSTING_MODEL_OPTIONS = [
  { value: HostingModel.ON_PREM, label: "On-Premises" },
  { value: HostingModel.CLOUD, label: "Cloud" },
  { value: HostingModel.HYBRID, label: "Hybrid" },
];

export const ClassificationStep: React.FC = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DataSourceFormData>();

  const residency = watch("residency");
  const criticalityLevel = watch("criticality_level");
  const hostingModel = watch("hosting_model");

  const hasError = (fieldName: keyof DataSourceFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DataSourceFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      {/* Location & Classification Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
            Location & Classification <span className="text-red-500">*</span>
          </h2>
          <hr className="border-gray-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Residency */}
          <div className="space-y-2">
            <Label htmlFor="residency">
              Data Residency <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`residency-${residency || "none"}`}
              value={residency || ""}
              onValueChange={(value) => setValue("residency", value as DataResidency, { shouldValidate: true })}
            >
              <SelectTrigger
                className={`w-full ${hasError("residency") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {DATA_RESIDENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Primary geographic location of data</p>
            {hasError("residency") && (
              <p className="text-sm text-red-500">{getError("residency")}</p>
            )}
          </div>

          {/* Criticality Level */}
          <div className="space-y-2">
            <Label htmlFor="criticality_level">Criticality Level</Label>
            <Select
              key={`criticality_level-${criticalityLevel || "none"}`}
              value={criticalityLevel || "null"}
              onValueChange={(value) => {
                if (value === "null") {
                  setValue("criticality_level", null, { shouldValidate: true });
                } else {
                  setValue("criticality_level", value as CriticalityLevel, { shouldValidate: true });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {CRITICALITY_LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Business impact if unavailable</p>
            {hasError("criticality_level") && (
              <p className="text-sm text-red-500">{getError("criticality_level")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Infrastructure Details Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
            Infrastructure Details <span className="text-red-500">*</span>
          </h2>
          <hr className="border-gray-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hosting Model */}
          <div className="space-y-2">
            <Label htmlFor="hosting_model">
              Hosting Model <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`hosting_model-${hostingModel || "none"}`}
              value={hostingModel || ""}
              onValueChange={(value) => setValue("hosting_model", value as HostingModel, { shouldValidate: true })}
            >
              <SelectTrigger
                className={`w-full ${hasError("hosting_model") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {HOSTING_MODEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("hosting_model") && (
              <p className="text-sm text-red-500">{getError("hosting_model")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
