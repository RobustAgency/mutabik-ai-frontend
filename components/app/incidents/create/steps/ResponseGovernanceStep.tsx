"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { AiIncidentFormData } from "@/lib/schemas/aiIncident.schema";
import {
  PrimaryRegulatoryFramework,
  NotificationRequirement,
  ResidencyAffected,
} from "@/app/lib/features/aiIncidentsApi";

const REGULATORY_FRAMEWORK_OPTIONS = [
  { value: PrimaryRegulatoryFramework.GDPR, label: "GDPR" },
  { value: PrimaryRegulatoryFramework.UAE_PDPL, label: "UAE PDPL" },
  { value: PrimaryRegulatoryFramework.EU_AI_ACT, label: "EU AI Act" },
  { value: PrimaryRegulatoryFramework.CCPA_CPRA, label: "CCPA/CPRA" },
  { value: PrimaryRegulatoryFramework.HIPAA, label: "HIPAA" },
  { value: PrimaryRegulatoryFramework.SOX, label: "SOX" },
  { value: PrimaryRegulatoryFramework.PCI_DSS, label: "PCI DSS" },
  { value: PrimaryRegulatoryFramework.ISO_27001, label: "ISO 27001" },
  { value: PrimaryRegulatoryFramework.MULTIPLE, label: "Multiple" },
  { value: PrimaryRegulatoryFramework.OTHER, label: "Other" },
  { value: PrimaryRegulatoryFramework.NA, label: "N/A" },
];

const NOTIFICATION_REQUIREMENT_OPTIONS = [
  { value: NotificationRequirement.DPA_WITHIN_72_HOURS, label: "DPA Within 72 Hours" },
  { value: NotificationRequirement.DPA_WITHIN_24_HOURS, label: "DPA Within 24 Hours" },
  { value: NotificationRequirement.DATA_SUBJECTS_REQUIRED, label: "Data Subjects Required" },
  { value: NotificationRequirement.INTERNAL_ONLY, label: "Internal Only" },
  { value: NotificationRequirement.NO_NOTIFICATION_REQUIRED, label: "No Notification Required" },
  { value: NotificationRequirement.UNDER_ASSESSMENT, label: "Under Assessment" },
];

const RESIDENCY_AFFECTED_OPTIONS = [
  { value: ResidencyAffected.AE, label: "AE" },
  { value: ResidencyAffected.EU, label: "EU" },
  { value: ResidencyAffected.KSA, label: "KSA" },
  { value: ResidencyAffected.US, label: "US" },
  { value: ResidencyAffected.UK, label: "UK" },
  { value: ResidencyAffected.QA, label: "QA" },
  { value: ResidencyAffected.JO, label: "JO" },
  { value: ResidencyAffected.MA, label: "MA" },
  { value: ResidencyAffected.BH, label: "BH" },
  { value: ResidencyAffected.OTHER, label: "Other" },
  { value: ResidencyAffected.MULTIPLE, label: "Multiple" },
];

export const ResponseGovernanceStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AiIncidentFormData>();

  const hasError = (fieldName: keyof AiIncidentFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof AiIncidentFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Classification & Compliance
        </h3>
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Classification determines regulatory notification requirements and escalation paths
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_regulatory_framework">
              Primary Regulatory Framework <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`primary_regulatory_framework-${watch("primary_regulatory_framework") || "none"}`}
              value={watch("primary_regulatory_framework")}
              onValueChange={(value) => setValue("primary_regulatory_framework", value as PrimaryRegulatoryFramework)}
            >
              <SelectTrigger className={`w-full ${hasError("primary_regulatory_framework") ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select regulatory framework" />
              </SelectTrigger>
              <SelectContent>
                {REGULATORY_FRAMEWORK_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("primary_regulatory_framework") && (
              <p className="text-sm text-destructive">{getError("primary_regulatory_framework")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification_requirement">
              Notification Requirement <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`notification_requirement-${watch("notification_requirement") || "none"}`}
              value={watch("notification_requirement")}
              onValueChange={(value) => setValue("notification_requirement", value as NotificationRequirement)}
            >
              <SelectTrigger className={`w-full ${hasError("notification_requirement") ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select notification requirement" />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_REQUIREMENT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("notification_requirement") && (
              <p className="text-sm text-destructive">{getError("notification_requirement")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_residency_affected">Data Residency Affected</Label>
            <Select
              key={`data_residency_affected-${watch("data_residency_affected") || "none"}`}
              value={watch("data_residency_affected") || undefined}
              onValueChange={(value) => setValue("data_residency_affected", value ? (value as ResidencyAffected) : null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select data residency" />
              </SelectTrigger>
              <SelectContent>
                {RESIDENCY_AFFECTED_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="regulatory_reference">Regulatory Reference</Label>
            <Input
              id="regulatory_reference"
              {...register("regulatory_reference")}
              placeholder="e.g., GDPR Art. 33, UAE PDPL Section X"
            />
            <p className="text-xs text-[#667085]">Specific regulation article if applicable</p>
          </div>
        </div>
      </div>
    </div>
  );
};

