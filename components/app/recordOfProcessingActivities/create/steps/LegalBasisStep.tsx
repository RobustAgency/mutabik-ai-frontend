"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RecordOfProcessingActivityFormData } from "@/lib/schemas/recordOfProcessingActivity.schema";

const lawfulBasisOptions = [
  { value: "consent", label: "Consent" },
  { value: "contract", label: "Contract" },
  { value: "legitimate_interest", label: "Legitimate Interest" },
  { value: "legal_obligation", label: "Legal Obligation" },
  { value: "public_task", label: "Public Task" },
  { value: "vital_interest", label: "Vital Interest" },
];

export const LegalBasisStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RecordOfProcessingActivityFormData>();

  const consentRequired = watch("consent_required");
  const lawfulBasis = watch("lawful_basis");
  const legitimateInterestAssessment = watch("legitimate_interest_assessment");
  const consentCoveragePercent = watch("consent_coverage_percent");

  const handleConsentRequiredChange = (checked: boolean) => {
    setValue("consent_required", checked);
    if (!checked) {
      // Clear consent coverage when consent is not required
      setValue("consent_coverage_percent", null);
    }
  };

  const handleConsentCoverageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || value === null || value === undefined) {
      setValue("consent_coverage_percent", null);
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
        setValue("consent_coverage_percent", numValue);
      } else {
        setValue("consent_coverage_percent", null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="lawful_basis">
          Lawful Basis <span className="text-red-500">*</span>
        </Label>
        <Select
          key={`lawful_basis-${watch("lawful_basis") || "none"}`}
          value={watch("lawful_basis")}
          onValueChange={(value) => setValue("lawful_basis", value as any)}
        >
          <SelectTrigger
            className={`w-full ${errors.lawful_basis ? "border-red-500" : ""}`}
          >
            <SelectValue placeholder="Select lawful basis" />
          </SelectTrigger>
          <SelectContent>
            {lawfulBasisOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.lawful_basis && (
          <p className="text-sm text-red-500">{errors.lawful_basis.message}</p>
        )}
      </div>

      <div className="space-y-2 flex items-center gap-2">
        <Checkbox
          id="consent_required"
          checked={consentRequired || false}
          onCheckedChange={handleConsentRequiredChange}
        />
        <Label 
          htmlFor="consent_required" 
          className="cursor-pointer"
          onClick={() => handleConsentRequiredChange(!consentRequired)}
        >
          Consent Required
        </Label>
      </div>

      {consentRequired && (
        <div className="space-y-2">
          <Label htmlFor="consent_coverage_percent">Consent Coverage (%)</Label>
          <Input
            id="consent_coverage_percent"
            type="number"
            min="0"
            max="100"
            value={consentCoveragePercent || ""}
            onChange={handleConsentCoverageChange}
            className={`w-full ${errors.consent_coverage_percent ? "border-red-500" : ""}`}
            placeholder="0-100"
          />
          {errors.consent_coverage_percent && (
            <p className="text-sm text-red-500">
              {errors.consent_coverage_percent.message}
            </p>
          )}
        </div>
      )}

      {lawfulBasis === "legitimate_interest" && (
        <div className="space-y-2">
          <Label htmlFor="legitimate_interest_assessment">
            Legitimate Interest Assessment
          </Label>
          <Textarea
            id="legitimate_interest_assessment"
            {...register("legitimate_interest_assessment")}
            className="w-full min-h-[120px] resize-none"
            placeholder="Describe the legitimate interest assessment"
            rows={5}
          />
          <div className="flex justify-end text-xs text-[#667085]">
            <span>{legitimateInterestAssessment?.length || 0} characters</span>
          </div>
        </div>
      )}
    </div>
  );
};

