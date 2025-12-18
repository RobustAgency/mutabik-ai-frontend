"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PrivacyIncidentFormData } from "@/lib/schemas/privacyIncident.schema";
import { CustomMultiSelect } from "@/components/custom/CustomMultiSelect";

const incidentTypeOptions = [
  { value: "unauthorized_access", label: "Unauthorized Access" },
  { value: "data_exposure", label: "Data Exposure" },
  { value: "lost_device", label: "Lost Device" },
  { value: "stolen_device", label: "Stolen Device" },
  { value: "misdelivery", label: "Misdelivery" },
  { value: "ransomware", label: "Ransomware" },
  { value: "phishing", label: "Phishing" },
  { value: "system_breach", label: "System Breach" },
  { value: "human_error", label: "Human Error" },
  { value: "third_party", label: "Third Party" },
];

const riskLevelOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "severe", label: "Severe" },
];

const breachCriteriaOptions = [
  { value: "confidentiality", label: "Confidentiality" },
  { value: "integrity", label: "Integrity" },
  { value: "availability", label: "Availability" },
];

export const BasicInformationStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PrivacyIncidentFormData>();

  const isBreach = watch("is_breach");
  const breachCriteriaMet = watch("breach_criteria_met") || [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="incident_title">
          Incident Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="incident_title"
          {...register("incident_title")}
          className={`w-full ${errors.incident_title ? "border-red-500" : ""}`}
          placeholder="e.g., Unauthorized Access to Customer Database"
          maxLength={255}
        />
        {errors.incident_title && (
          <p className="text-sm text-red-500">{errors.incident_title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="incident_type">
            Incident Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("incident_type")}
            onValueChange={(value) => setValue("incident_type", value as any)}
          >
            <SelectTrigger
              className={`w-full ${
                errors.incident_type ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select incident type" />
            </SelectTrigger>
            <SelectContent>
              {incidentTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.incident_type && (
            <p className="text-sm text-red-500">{errors.incident_type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="risk_level">
            Risk Level <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("risk_level")}
            onValueChange={(value) => setValue("risk_level", value as any)}
          >
            <SelectTrigger
              className={`w-full ${
                errors.risk_level ? "border-red-500" : ""
              }`}
            >
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
          {errors.risk_level && (
            <p className="text-sm text-red-500">{errors.risk_level.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_breach"
            checked={isBreach}
            onCheckedChange={(checked) => {
              setValue("is_breach", checked === true);
              if (!checked) {
                setValue("breach_criteria_met", null);
              }
            }}
          />
          <Label
            htmlFor="is_breach"
            className="cursor-pointer font-normal"
            onClick={() => setValue("is_breach", !isBreach)}
          >
            This is a data breach
          </Label>
        </div>
      </div>

      {isBreach && (
        <div className="space-y-2">
          <Label>
            Breach Criteria Met{" "}
            <span className="text-red-500">*</span>
          </Label>
          <CustomMultiSelect
            options={breachCriteriaOptions}
            value={breachCriteriaMet}
            onChange={(value) => setValue("breach_criteria_met", value as any)}
            placeholder="Select breach criteria"
            className={errors.breach_criteria_met ? "border-red-500" : ""}
          />
          {errors.breach_criteria_met && (
            <p className="text-sm text-red-500">
              {errors.breach_criteria_met.message}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="detected_date">
            Detected Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="detected_date"
            type="date"
            {...register("detected_date")}
            className={`w-full ${
              errors.detected_date ? "border-red-500" : ""
            }`}
          />
          {errors.detected_date && (
            <p className="text-sm text-red-500">{errors.detected_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="occurred_date">Occurred Date</Label>
          <Input
            id="occurred_date"
            type="date"
            {...register("occurred_date")}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

